<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="会员ID">
              <el-input v-model="query.id" clearable placeholder="会员ID" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="会员昵称">
              <el-input v-model="query.userName" clearable placeholder="请输入会员昵称" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="会员来源">
              <remote-select showAllOption v-model="query.source"  placeholder="请选择会员来源" action="systemApi/order/getDictList" :query="{ type: 'memberSource' }" style="width:200px;"></remote-select>
            </el-form-item>
            <el-form-item label="注册时间">
              <el-date-picker v-model="query.time"  type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="会员手机号">
              <el-input v-model="query.bindingMobile" clearable placeholder="会员绑定手机号" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="success" icon="el-icon-upload2"  @click="exportData">导出数据</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" :query="query" :fetch="queryTable">
            <el-table-column width="70"  label="会员ID" align="center" prop="id" ></el-table-column>
            <el-table-column min-width="120"  label="会员手机号" align="center" prop="bindingMobile" show-overflow-tooltip></el-table-column>
            <el-table-column width="150"  label="会员昵称" align="center" prop="userName"></el-table-column>            
            <el-table-column width="80"  label="会员来源" align="center" prop="source"></el-table-column>
            <el-table-column width="160"  label="注册时间" align="center" prop="createTime"></el-table-column>
            <el-table-column width="160"  label="最近登录" align="center" prop="lastTime"></el-table-column>
            <el-table-column width="100"  label="订单成交数" align="center" prop="orderNum"></el-table-column>
            <el-table-column width="100"  label="消费成交额" align="center" prop="consumeMoney"></el-table-column>
            <el-table-column width="110"  label="账户启用状态" align="center" prop="status">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" :id="row.id" action="/systemApi/member/update"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column min-width="120"  label="操作" align="center" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/user_mgr/member_list/detail',query:{id:row.id}})">查看</el-button>
                <el-button type="text" @click="$router.push({path:'/operation_center/user_mgr/member_list/edit',query:{id:row.id}})">编辑</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getMemberPageList } from '@/api/operationCenter'
    import { exportData } from '@/utils'
    export default {
      name: 'member_list',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          query.requestType = 'getList'
          if (query.time) {
            query.startTime = query.time[0]
            query.endTime = query.time[1]
            delete query['time']
          } else {
            delete query['time']
            delete query['startTime']
            delete query['endTime']
          }
          return getMemberPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        noDataFormatter(row, column, cellValue, index) {
          return cellValue || '--'
        },
        async exportData() {
          if (this.query.time) {
            this.query.startTime = this.query.time[0]
            this.query.endTime = this.query.time[1]
            delete this.query['time']
          } else {
            delete this.query['time']
            delete this.query['startTime']
            delete this.query['endTime']
          }
          exportData(getMemberPageList, this.query)
        }
      }
    }
</script>

<style scoped>

</style>
