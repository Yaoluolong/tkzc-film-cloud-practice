<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="角色名称">
              <el-input v-model="query.roleName" clearable placeholder="请输入角色名称" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/system_setting/platform_setting/role_mgr/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column width="120"  label="角色名称" align="center" prop="roleName" ></el-table-column>
            <el-table-column min-width="160" label="职能描述" align="center" prop="roleDesc" show-overflow-tooltip></el-table-column>
            <el-table-column width="80"  label="用户数量" align="center" prop="num"></el-table-column>
            <el-table-column width="160"  label="添加时间" align="center" prop="createTime"></el-table-column>
            <el-table-column width="80"  label="是否启用" align="center" prop="status">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" confirm-text="停用角色将同时关闭角色下的用户,是否要执行此操作" :id="row.id" action="/systemApi/systemAccountRole/setStatus"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column min-width="180"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/system_setting/platform_setting/role_mgr/permission_setting',query:{id:row.id}})">权限设置</el-button>
                <el-button type="text" @click="$router.push({path:'/system_setting/platform_setting/role_mgr/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteRole(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getRolePageList, deleteRole } from '@/api/systemSetting'
    export default {
      name: 'role_mgr',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          return getRolePageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteRole(row) {
          this.$confirm(`是否删除【${row.roleName}】,删除角色将同时关闭角色下的用户？`, '删除提示', { type: 'warning' }).then(async() => {
            await deleteRole(row.id)
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
