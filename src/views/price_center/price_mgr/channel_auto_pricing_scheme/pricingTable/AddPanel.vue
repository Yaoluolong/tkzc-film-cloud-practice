<template>
  <zm-panel title="添加方案" :visible.sync="visible" @change="closePanel">
    <el-form inline label-width="120px" class="mt20">
      <el-form-item label="方案名称">
        <el-input placeholder="输入关键字" v-model="params.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tr mb10">
      已选择（<span class="danger">{{selectedLength}}</span>）
    </div>
    <zm-table
      :columns="columns"
      :fetch="loadList"
      :table-params="tableParams"
      :options="{mutilpleSelect:true}"
      @select="onSelectTable"
      @select-all="onSelectTable"
    ></zm-table>
    <div slot="footer" class="dialog-footer tr">
      <el-button type="primary" @click="onSubmit">确 定</el-button>
      <el-button @click="closePanel">取 消</el-button>
    </div>
  </zm-panel>
</template>
<script>
import zmTableMixin from '@/mixins/zmTableMixin'
import zmTable from '@/components/isNeedComponents/zmTable'
import zmPanel from '@/components/isNeedComponents/zmPanel'
import { getAutoPricePageList, addChannelProgram } from '@/api/priceCenter'
import { chooseAutoSchemeColumns } from '../constant'
export default {
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    zmPanel,
    zmTable
  },
  mixins: [zmTableMixin],
  data() {
    return {
      visible: true,
      params: {
        name: '',
        type: '2',
        channelId: this.id
      },
      columns: chooseAutoSchemeColumns(this),
      selections: [],
      sortable: null
    }
  },
  computed: {
    selectedLength() {
      return this.selections.length
    }
  },
  methods: {
    closePanel() {
      this.$emit('cancel')
    },
    async loadList() {
      const res = await getAutoPricePageList(this.assignQuery(this.params))
      this.initialTableData(res.data, res.count)
    },
    onSelectTable(selections) {
      this.selections = selections
    },
    async onSubmit() {
      if (!this.selections || !this.selections.length) {
        return this.$message.warning('未选择任何方案，不可添加')
      }
      const selections = this.selections.map(v => v.id)
      const params = {
        programIds: selections.join(','),
        channelId: this.id
      }
      await addChannelProgram(params)
      this.$message.success('添加成功')
      this.closePanel()
      this.$emit('after-save')
    }
  }
}
</script>

