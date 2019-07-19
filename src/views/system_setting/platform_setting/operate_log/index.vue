<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="操作人">
              <el-input v-model="query.userName" clearable placeholder="请输入用户名" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column width="120"  label="用户名" align="center" prop="userName" ></el-table-column>
            <el-table-column width="160"  label="操作日期" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column width="140"  label="IP地址" align="center" show-overflow-tooltip prop="ip"></el-table-column>
            <el-table-column min-width="300"  label="操作记录" align="center" prop="remark" show-overflow-tooltip></el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getOperateLogPageList } from '@/api/systemSetting'
    export default {
      name: 'operate_log',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          return getOperateLogPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        }
      }
    }
</script>

<style scoped>

</style>
