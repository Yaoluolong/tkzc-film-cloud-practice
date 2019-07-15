<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="销售日期">
              <el-date-picker v-model="query.time" style="width:230px;"  type="daterange" value-format="yyyy-MM-dd"  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="销售单号">
              <el-input v-model="query.orderNo" clearable placeholder="请输入销售订单号" style="width:230px;"></el-input>
            </el-form-item>
            
            <el-form-item label="业务人员">
              <operator-id-selector selectStyle="width:210px" :accessType="cardOrderLimit" v-model="query.operatorId" placeholder="请输入业务人员名称"></operator-id-selector>
            </el-form-item>
            <el-form-item label="客户名称">
              <customer-selector :accessType="cardOrderLimit" v-model="query.customer" :isAddNew="false" ></customer-selector>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="success" icon="el-icon-upload2" @click="exportData">导出汇总</el-button>
              <el-button type="success" icon="el-icon-upload2" @click="exportDetail">导出明细</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" :query="query" :fetch="queryTable">
            <!-- <el-table-column min-width="120"  label="业务人员" align="center" prop="operator" show-overflow-tooltip></el-table-column> -->
            <el-table-column min-width="100"  label="客户名称" align="center" prop="customerName"></el-table-column>            
            <el-table-column min-width="110"  label="销售总额" align="center" prop="amount"></el-table-column>
            <el-table-column min-width="110"  label="卡内总点数" align="center" prop="point"></el-table-column>
            <el-table-column min-width="110"  label="消费总点数" align="center" prop="useTotalPoint"></el-table-column>
            <el-table-column min-width="110"  label="剩余总点数" align="center" prop="surplusPoint"></el-table-column>            
            <el-table-column min-width="110"  label="抵扣票务总额" align="center" prop="useCardPrice"></el-table-column>
            <el-table-column min-width="110"  label="抵扣增值费总额" align="center" prop="cardServicePrice"></el-table-column>
            <el-table-column min-width="100"  label="使用率(%)" align="center" prop="usePercet"></el-table-column>
            <el-table-column min-width="100"  label="兑付率(%)" align="center" prop="exchangePercet"></el-table-column>


            <el-table-column min-width="100"  label="激活数" align="center" prop="activeNum"></el-table-column>
            <el-table-column min-width="100"  label="冻结数" align="center" prop="frozenNum"></el-table-column>
            <el-table-column min-width="100"  label="作废数" align="center" prop="voidNum"></el-table-column>
            <el-table-column min-width="100"  label="过期数" align="center" prop="overNum"></el-table-column>
            
            <!-- <el-table-column min-width="100"  label="销售总数" align="center" prop="num"></el-table-column>
            <el-table-column min-width="100"  label="订单状态" align="center" prop="orderStatusName"></el-table-column> -->
            <el-table-column min-width="100"  label="操作" align="center" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/finace_center/finance_report/card_sales_order/order_detail', query:{orderNo:row.orderNo}})">查看</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
import { realDeepClone, exportData } from '@/utils'
import CustomerSelector from '@/components/CustomerSelector'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getCardOrderPageList, exportCardOrder, exportCardOrderDetail } from '@/api/financeCenter'
export default {
  components: { CustomerSelector, OperatorIdSelector },
  name: 'card_sales_order',
  data() {
    return {
      cardOrderLimit: 'cardOrderLimit',
      query: {
        time: []
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
      return getCardOrderPageList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    exportData() {
      exportData(exportCardOrder, realDeepClone(this.query))
    },
    exportDetail() {
      exportData(exportCardOrderDetail, realDeepClone(this.query))
    }
  }
}
</script>

<style scoped>

</style>
