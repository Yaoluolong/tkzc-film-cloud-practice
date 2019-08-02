<template>
  <div class="app-container">
    <el-form inline label-width="120px">
      <el-form-item label="销售订单号">
        <el-input v-model="query.orderNo" clearable placeholder="输入销售订单号" style="width:230px;"></el-input>
      </el-form-item>
      <el-form-item label="销售时间">
        <el-date-picker
        clearable 
          unlink-panels
          v-model="query.time"
          style="width:230px;"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="业务人员">
        <operator-id-selector
          selectStyle="width:210px"
          :accessType="couponLimit"
          v-model="query.operatorId"
          placeholder="请输入业务人员名称"
        ></operator-id-selector>
      </el-form-item>
      <el-form-item label="客户名称">
        <customer-selector :accessType="couponLimit" v-model="query.customer" :isAddNew="false"></customer-selector>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshTable">查询</el-button>
      </el-form-item>
    </el-form>
    <page-table ref="table" index :query="query" :fetch="queryTable">
      <el-table-column
        min-width="180"
        label="销售订单号"
        align="center"
        prop="orderNo"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="120"
        label="业务人员"
        align="center"
        prop="operator"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="100" label="客户名称" align="center" prop="customerName"></el-table-column>
      <el-table-column
        min-width="180"
        label="销售时间"
        align="center"
        prop="saleTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="180" label="销售总数" align="center" prop="num"></el-table-column>
      <el-table-column min-width="180" label="销售总额(元)" align="center" prop="amount"></el-table-column>
      <el-table-column
        min-width="110"
        label="初审状态"
        align="center"
        prop="checkStatusName"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="isPass('1',row.orderNo,{orderNo: row.orderNo, checkStatus: row.checkStatus},'progress_order_submit')"
          >{{row.checkStatusName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        min-width="110"
        label="到款状态"
        align="center"
        prop="isReceiveMoneyName"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="isPass('2',row.orderNo,{orderNo:row.orderNo,isReceiveMoney:row.isReceiveMoney,title:'销售单收款'},'progress_sell_register')"
          >{{row.isReceiveMoneyName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        min-width="110"
        label="开票状态"
        align="center"
        prop="isDrawInvoice"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="isPass('3',row.orderNo,{orderNo:row.orderNo,invoiceType:row.invoiceType,title:'销售单开票'},'progress_sell_register')"
            :disabled="row.isDrawInvoice==='无需发票'"
          >{{row.isDrawInvoice}}</el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="110" label="激活状态" align="center" prop="isActive" fixed="right">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="isPass('4',row.orderNo,{orderNo:row.orderNo,isActive:row.isActive,title:'销售单激活'},'progress_sell_register')"
          >{{row.isActive}}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="250"  label="操作" align="center" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/progress_order_submit',query:{orderNo:row.orderNo,checkStatus:row.checkStatus}})">部门初审</el-button>
                <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/progress_sell_register',query:{orderNo:row.orderNo}})">财务复审</el-button>            
              </template>
      </el-table-column>-->
    </page-table>
  </div>
</template>

<script>
import { realDeepClone } from '@/utils'
import CustomerSelector from '@/components/CustomerSelector'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getCouponCheckPageList, checkAuthority } from '@/api/operationCenter'
export default {
  components: { CustomerSelector, OperatorIdSelector },
  name: 'sold_coupon_list',
  data() {
    return {
      couponLimit: 'couponLimit',
      query: {
        time: [],
        status: '1'
      }
    }
  },
  methods: {
    queryTable(query) {
      const req = realDeepClone(query)
      if (query.time && query.time.length === 2) {
        req.saleTimeS = query.time[0]
        req.saleTimeE = query.time[1]
      }
      delete req.time
      return getCouponCheckPageList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    isPass(type, orderNo, query, tableName) {
      checkAuthority({ type: type, orderNo: orderNo })
        .then(res => {
          this.$router.push({
            path: '/operation_center/coupon_mgr/' + tableName,
            query: query
          })
        })
        .catch(e => {
          this.$message.warning('无权访问')
        })
    }
  }
}
</script>

<style scoped>
</style>
