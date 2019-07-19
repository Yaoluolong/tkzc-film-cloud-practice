<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="refreshTable">
      <el-tab-pane label="平台用户管理" name="1"></el-tab-pane>
      <el-tab-pane label="加盟商用户管理" name="2"></el-tab-pane>
    </el-tabs>
    <el-form inline label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="query.userName" clearable placeholder="请输入用户名" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="角色类型">
        <remote-select
          v-model="query.roleId"
          clearable
          placeholder="请选择角色类型"
          action="/systemApi/systemAccountRole/getList"
          style="width:200px;"
        ></remote-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshTable">查询</el-button>
        <el-button
          type="danger"
          icon="el-icon-plus"
          @click="$router.push('/system_setting/platform_setting/user_mgr/create')"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <page-table ref="table" index :query="query" :fetch="queryTable">
      <el-table-column min-width="100" label="用户名" align="center" prop="userName" show-overflow-tooltip></el-table-column>
      <el-table-column min-width="100" label="姓名" align="center" prop="realName"></el-table-column>
      <el-table-column min-width="140" label="邮箱地址" align="center" prop="email" show-overflow-tooltip></el-table-column>
      <el-table-column min-width="120" label="所属角色" align="center" prop="roleName"></el-table-column>
      <el-table-column min-width="160" label="添加时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column min-width="160" label="最后登录" align="center" prop="loginTime"></el-table-column>
      <el-table-column width="80" label="是否启用" align="center" prop="status" fixed="right">
        <template slot-scope="{row}">
          <switch-confirm
            v-model="row.status"
            confirm-text="停用用户后用户将无法登陆平台,是否要执行此操作"
            :id="row.id"
            action="/systemApi/systemAccount/setStatus"
          ></switch-confirm>
        </template>
      </el-table-column>
      <el-table-column min-width="280" label="操作" align="center" prop="oper" fixed="right">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="$router.push({path:'/system_setting/platform_setting/user_mgr/permission_setting',query:{id:row.id,type:row.type}})"
          >功能权限</el-button>
          <el-button
            type="text"
            @click="$router.push({path:'/system_setting/platform_setting/edit_data_access',query:{id:row.id}})"
          >数据权限</el-button>
          <el-button
            type="text"
            @click="$router.push({path:'/system_setting/platform_setting/user_mgr/edit',query:{id:row.id}})"
          >编辑</el-button>
          <el-button type="text" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </page-table>
  </div>
</template>

<script>
import { getUserPageList, deleteUser } from '@/api/systemSetting'
export default {
  name: 'user_mgr',
  data() {
    return {
      activeTab: '1',
      query: {}
    }
  },
  methods: {
    queryTable(query) {
      query.type = this.activeTab
      return getUserPageList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    deleteUser(row) {
      this.$confirm(
        `是否删除【${row.userName}】,删除用户后仅同时删除用户所有操作记录？`,
        '删除提示',
        { type: 'warning' }
      ).then(async() => {
        await deleteUser(row.id)
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
