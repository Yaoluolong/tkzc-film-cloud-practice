<template>
  <div class="app-container">
    <el-form inline label-width="80px">
      <el-form-item label="公司名称">
        <el-input v-model="query.name" clearable placeholder="请输入公司名称" class="w230"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button type="danger" icon="el-icon-plus" @click="onOperateClick('create')">新增</el-button>
      </el-form-item>
    </el-form>
    <zm-table ref="multipleTable" :columns="columns" :fetch="loadList" :table-params="tableParams"></zm-table>
    <create 
      :id="editId"
      v-model="newPanelShow"
      v-if="newPanelShow"
      :new-params="newParams"
      @cancel="closePanel"
      @save-after="saveAfter"
    ></create>
  </div>
</template>
<script>
import { getCompanyPageList, deleteCompany } from '@/api/systemSetting'
import zmTable from '@/components/isNeedComponents/zmTable'
import tableMixin from '@/mixins/zmTableMixin'
import create from './create'
import { listColumns } from './const'
export default {
  name: 'company_mgr_list',
  components: { zmTable, create },
  mixins: [tableMixin],
  computed: {
    columns() {
      return listColumns(this)
    }
  },
  data() {
    return {
      query: {},
      editId: '',
      newPanelShow: false,
      newParams: {}
    }
  },
  methods: {
    async loadList() {
      const res = await getCompanyPageList(this.assignQuery(this.query))
      this.initialTableData(res.data, res.count)
    },
    async onOperateClick(type, row) {
      switch (type) {
        case 'create':
          this.newPanelShow = true
          break
        case 'edit':
          this.editId = row.id
          this.newParams = { name: row.name }
          this.newPanelShow = true
          break
        case 'del':
          await this.$confirm('确定要删除吗？', '温馨提示')
          await deleteCompany({ id: row.id })
          this.$message.success('删除成功')
          this.loadList()
          break
      }
    },
    closePanel() {
      this.editId = ''
      this.newPanelShow = false
    },
    saveAfter() {
      this.closePanel()
      this.onSearch()
    }
  }
}
</script>
