<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="起始日期">
              <el-date-picker v-model="query.startTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="100"  label="用户名" align="center" prop="userName" ></el-table-column>
            <el-table-column min-width="120"  label="登录日期" align="center" prop="loginTime"></el-table-column>
            <el-table-column min-width="120"  label="IP地址" align="center" show-overflow-tooltip prop="ip"></el-table-column>
            <el-table-column min-width="120"  label="地区" align="center" prop="area"></el-table-column>
            <el-table-column min-width="120"  label="浏览器" align="center" prop="broswer"></el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getLoginLogPageList } from '@/api/systemSetting'
    export default {
      name: 'login_log',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          return getLoginLogPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        }
      }
    }
</script>

<style scoped>

</style>
