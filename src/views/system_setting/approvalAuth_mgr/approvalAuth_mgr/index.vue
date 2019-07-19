<template>
    <div class="app-container">
         <el-form inline label-width="120px">
           <el-form-item label="适用职员">
             <el-input v-model="query.salesman"  style="width:300px;" placeholder="输入职员名称或账号模糊查询"></el-input>
            </el-form-item>             
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/system_setting/approvalAuth_mgr/approvalAuth_mgr/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="120"  label="审批类型" align="center" prop="typeName" show-overflow-tooltip></el-table-column>
            <el-table-column width="400" label="审批流级" align="center" prop="processName" show-overflow-tooltip></el-table-column>
            <el-table-column width="200" label="审批流名称" align="center" prop="name" show-overflow-tooltip></el-table-column>           
           <el-table-column width="80"  label="是否启用" align="center" prop="status" fixed="right">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" confirm-text="是否进行此操作" :id="row.id" action="/systemApi/approval/setStatus"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column width="160"  label="添加人员" align="center" prop="operator"></el-table-column>
            <el-table-column width="160"  label="添加时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="180"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
              	<el-button type="text" @click="$router.push({path:'/system_setting/approvalAuth_mgr/view_approval_auth',query:{id:row.id}})">查看</el-button>
                <el-button type="text" @click="editSystemer(row)">编辑</el-button>
                <el-button type="text" @click="deleteSystemer(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getApprovalPageList, delApprovalInfo } from '@/api/systemSetting'
    export default {
      name: 'approvalAuth_mgr',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          return getApprovalPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        editSystemer(row) {
          this.$confirm(`编辑之后，正在进行中的审批继续使用原设置，新发起的审批将使用新的审批设置。`, '编辑提示', {
            type: 'warning'
          }).then(() => {
            this.$router.push({ path: '/system_setting/approvalAuth_mgr/approvalAuth_mgr/edit', query: { id: row.id }})
          }).catch(() => {

          })
        },
        deleteSystemer(row) {
          this.$confirm(`删除之后，正在进行中的审批继续使用原设置，新的业务将无法使用该审批设置。`, '删除提示', { type: 'warning' }).then(async() => {
            await delApprovalInfo({ id: row.id })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.refreshTable()
          })
        }
      }
    }
</script>

<style scoped>

</style>
