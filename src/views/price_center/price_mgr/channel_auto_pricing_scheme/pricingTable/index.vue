<template>
  <div class="pd15">
    <el-form inline label-width="120px">
      <el-form-item label="方案名称">
        <el-input placeholder="输入关键字" v-model="params.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
        <el-button type="danger" icon="el-icon-plus" @click="openAddPanel">添加</el-button>
        <!-- <el-button @click="startDragSort">{{dragSortStatus?'完成排序':'编辑排序'}}</el-button> -->
      </el-form-item>
    </el-form>
    <zm-table :columns="columns" :fetch="loadList" :table-params="tableParams"></zm-table>
    <pricing-detail v-if="detailPanel.visible" :id="detailPanel.id" @cancel="closeDetailPanel"></pricing-detail>
    <add-panel v-if="addPanelVisible" :id="id" @cancel="colseAddPanel" @after-save="loadList"></add-panel>
  </div>
</template>
<script>
import { getChannelProgramList, delChannelProgram, setSort } from '@/api/priceCenter'
import PricingDetail from '@/views/price_center/price_mgr/auto_pricing_scheme/PricingDetail'
import zmTableMixin from '@/mixins/zmTableMixin'
import zmTable from '@/components/isNeedComponents/zmTable/index'
import { autoSchemeColumns } from '../constant'
import AddPanel from './AddPanel'
import Sortable from 'sortablejs'
export default {
  props: {
    id: {
      type: [Number, String],
      default: null
    }
  },
  mixins: [zmTableMixin],
  components: {
    // ScrollTable,
    PricingDetail,
    zmTable,
    AddPanel
  },
  data() {
    return {
      dragSortStatus: false,
      params: {
        name: null,
        channelId: null
      },
      detailPanel: {
        visible: false,
        id: null
      },
      addPanelVisible: false,
      columns: autoSchemeColumns(this)
    }
  },
  watch: {
    id(val) {
      this.params.channelId = val
      this.onSearch()
    }
  },
  created() {
    this.params.channelId = this.id
  },
  mounted() {
    this.setSort()
  },
  methods: {
    async loadList() {
      const res = await getChannelProgramList(this.assignQuery(this.params))
      this.initialTableData(res.data, res.count)
    },
    openAddPanel() {
      this.addPanelVisible = true
    },
    colseAddPanel() {
      this.addPanelVisible = false
    },
    openDetail(row) {
      this.detailPanel = {
        visible: true,
        id: row.programId
      }
    },
    closeDetailPanel() {
      this.detailPanel = {
        visible: false,
        id: null
      }
    },
    async confirmDelete(row) {
      await this.$confirm('确定删除关联的方案？', '删除方案')
      await delChannelProgram({
        relationId: row.relationId
      })
      this.$message.success('删除成功')
      this.loadList()
    },
    startDragSort() {
      this.dragSortStatus = !this.dragSortStatus
    },
    setSort() {
      if (this.sortable) return
      this.$nextTick(() => {
        const el = document.querySelectorAll(
          '.el-table__body-wrapper > table > tbody'
        )[0]
        console.log(el)
        const that = this
        this.sortable = Sortable.create(el, {
          draggable: '.el-table__row',
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          // dragClass: 'el-table__row',
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          },
          onEnd: async evt => {
            const nIndex = evt.newIndex
            const oIndex = evt.oldIndex
            console.log(oIndex, nIndex)
            if (nIndex === oIndex) return
            const $li = el.children[nIndex]
            const $oldLi = el.children[oIndex]
            // VUE2.0之后，根本原因是Virtual DOM和真实DOM之间出现了不一致，导致拖拽有问题，最直接的方法设置v-for的key
            // 先删除移动的节点
            el.removeChild($li)
            // 再插入移动的节点到原有节点，还原了移动的操作
            if (nIndex > oIndex) {
              el.insertBefore($li, $oldLi)
            } else {
              el.insertBefore($li, $oldLi.nextSibling)
            }
            const oldList = that.tableParams.data
            const fromId = oldList[oIndex].relationId
            const toId = oldList[nIndex].relationId
            // const listTemp = oldList.slice(0)
            // const itemTemp = oldList[oIndex]
            // listTemp.splice(oIndex, 1)
            // listTemp.splice(nIndex, 0, itemTemp)
            // that.tableParams.data = listTemp
            const listTemp = oldList.slice(0)
            const targetRow = listTemp.splice(oIndex, 1)[0]
            listTemp.splice(nIndex, 0, targetRow)
            that.$set(that.tableParams, 'data', listTemp)
            // this.$forceUpdate()
            that.submitSort(listTemp, fromId, toId, nIndex, oIndex)
          }
        })
      })
    },
    async submitSort(sortList, fromId, toId, nIndex, oIndex) {
      const { page, pageSize } = this.tableParams
      await setSort({
        type: nIndex < oIndex ? '1' : '2',
        relationId: fromId,
        changeRelationId: toId,
        page,
        pageSize
      })
      this.loadList()
    }
  }
}
</script>
<style lang="scss">
.sortable-ghost {
  color: #fff;
  background: #409eff;
}
</style>
