<template>
  <div class="app-container">
    <el-form inline label-width="80px">
      <el-form-item label="影院分组">
        <el-input v-model.trim="query.name" clearable placeholder="输入影城分组名称模糊查询" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="影院名称">
        <el-input v-model.trim="query.cinemaName" clearable placeholder="输入影城名称模糊查询" class="w200"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshTable">查询</el-button>
        <el-button
          type="danger"
          icon="el-icon-plus"
          @click="$router.push('/mall_center/cinema_mgr/cinema_group/create')"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <page-table ref="table" index :query="query" :fetch="queryTable">
      <el-table-column min-width="150" label="分组名称" align="center" prop="name"></el-table-column>
      <el-table-column width="100" label="影院数" align="center" prop="cinemaNum">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="$router.push({path:'/mall_center/cinema_mgr/cinema_group/edit',query:{id:row.id}})"
          >{{row.cinemaNum}}</el-button>
        </template>
      </el-table-column>
      <el-table-column width="180" label="添加时间" align="center" prop="createTime"></el-table-column>
      <el-table-column min-width="120" label="操作员" align="center" prop="operator"></el-table-column>
      <el-table-column min-width="180" label="操作" align="center" prop="oper" fixed="right">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="$router.push({path:'/mall_center/cinema_mgr/cinema_group/edit',query:{id:row.id}})"
          >编辑</el-button>
          <el-button type="text" @click="delteCinemaGroup(row)">删除</el-button>
        </template>
      </el-table-column>
    </page-table>
  </div>
</template>

<script>
import { cinemaGroupGetList, deleteCinemaGroup } from '@/api/mallCenter'
export default {
  name: 'cinema_group',
  data() {
    return {
      query: {}
    }
  },
  methods: {
    queryTable(query) {
      return cinemaGroupGetList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    delteCinemaGroup(row) {
      this.$confirm(
        `该影院分组与电影券使用规则有关联，删除后将导致电影券无法使用，是否执行删除？`,
        { type: 'warning' }
      ).then(async() => {
        await deleteCinemaGroup({ id: row.id })
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
