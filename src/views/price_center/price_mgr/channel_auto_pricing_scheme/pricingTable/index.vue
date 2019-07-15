<template>
  <div class="app-container mall-auto-prcie df">
    <el-form inline label-width="120px">
      <el-form-item label="方案名称">
        <el-input placeholder="输入关键字" v-model="params.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
        <el-button type="danger" icon="el-icon-plus" @click="startDragSort">编辑排序</el-button>
      </el-form-item>
    </el-form>
    <zm-table :columns="columns" :fetch="loadList" :table-params="tableParams"></zm-table>
  </div>
</template>
<script>
import zmTable from '@/components/isNeedComponents/zmTable/index'
import zmTableMixin from '@/mixins/zmTableMixin'
import { autoSchemeColumns } from '../constant'
import { getAutoPricePageList, setAutoPriceStatus } from '@/api/priceCenter'
export default {
  mixins: [zmTableMixin],
  components: {
    zmTable
  },
  data() {
    return {
      params: {
        name: null
      },
      columns: autoSchemeColumns(this)
    }
  },
  methods: {
    async loadList() {
      const res = await getAutoPricePageList(this.assignQuery(this.params))
      this.initialTableData(res.data, res.count)
    },
    async switchOpenStatus(row, rowIndex) {
      // this.$set(this.tableParams.data[rowIndex], 'status', !row.status)
      await this.$confirm(
        `确定要${+row.status === 1 ? '关闭' : '开启'}改方案？`,
        '提示',
        { type: 'warning' }
      )
      await setAutoPriceStatus({
        id: row.id,
        status: +row.status === 1 ? 2 : 1
      })
      this.loadList()
    },
    openDetail(row) {},
    async confirmDelete(row) {
      await this.$confirm('确定删除关联的方案？', '删除方案')
    }
  }
}
</script>

