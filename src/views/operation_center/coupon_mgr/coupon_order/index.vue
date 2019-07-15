<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="销售订单号">
              <el-input v-model="query.orderNo" clearable placeholder="请输入销售订单号" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="销售时间">
              <el-date-picker v-model="query.time" style="width:230px;"  type="daterange" value-format="yyyy-MM-dd"  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="业务人员">
              <operator-id-selector selectStyle="width:210px" :accessType="couponLimit" v-model="query.operatorId" placeholder="请输入业务人员名称"></operator-id-selector>
            </el-form-item>
            <el-form-item label="营销客户">
              <customer-selector :accessType="couponLimit" v-model="query.customer" :isAddNew="false" ></customer-selector>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="success" icon="el-icon-tickets" @click="$router.push({path:'/operation_center/coupon_mgr/coupon_order/create_coupon_order'})">生成订单</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="180"  label="销售订单号" align="center" prop="orderNo" ></el-table-column>
            <el-table-column min-width="120"  label="业务人员" align="center" prop="operator" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100"  label="营销客户" align="center" prop="customer"></el-table-column>
            <el-table-column min-width="180"  label="销售时间" align="center" prop="saleTime"></el-table-column>
            <el-table-column min-width="110"  label="销售状态" align="center" prop="saleStatusName"></el-table-column>
            <el-table-column min-width="180"  label="销售总额(元)" align="center" prop="amount"></el-table-column>
            <el-table-column min-width="110"  label="到款状态" align="center" prop="isReceiveMoneyName"></el-table-column>
            <el-table-column min-width="110"  label="开票状态" align="center" prop="isDrawInvoiceName"></el-table-column>
            <el-table-column min-width="110"  label="激活状态" align="center" prop="isActiveName"></el-table-column>
            <el-table-column min-width="250"  label="操作" align="center" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" v-if="row.saleStatus !== 2" @click="$router.push({path:'/operation_center/coupon_mgr/sell_register',query:{orderNo:row.orderNo}})">销售登记</el-button>
                <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/sell_detail',query:{orderNo:row.orderNo}})">销售明细</el-button>
                <el-button type="text" v-if="row.isReceiveMoney=== '0' && row.isActive === '0'  && row.saleStatus !== 2" @click="cancelCouponOrder(row.orderNo)">撤销销售</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
import { realDeepClone } from '@/utils'
import CustomerSelector from '@/components/CustomerSelector'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getCouponOrderPageList, cancelCouponOrder } from '@/api/operationCenter'
export default {
  components: { CustomerSelector, OperatorIdSelector },
  name: 'coupon_order',
  data() {
    return {
      couponLimit: 'couponLimit',
      query: {
        time: []
      }
    }
  },
  methods: {
    cancelCouponOrder(orderNo) {
      this.$confirm('撤销销售将对电影券销售订单进行撤单操作，并将销售订单中系统已生成的电影券进行作废操作，是否开始执行？', '撤销提示', { type: 'warning' }).then(() => {
        cancelCouponOrder(orderNo).then(e => {
          this.$message.success('撤销成功')
          this.refreshTable()
        })
      })
    },
    queryTable(query) {
      const req = realDeepClone(query)
      if (query.time && query.time.length === 2) {
        req.saleTimeS = query.time[0]
        req.saleTimeE = query.time[1]
      }
      delete req.time
      return getCouponOrderPageList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>
