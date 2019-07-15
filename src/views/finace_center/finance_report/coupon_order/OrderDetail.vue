<template>
    <div class="app-container">
    	<el-card style="margin-bottom:20px;">
       	<div slot="header">          	
            <p>
              <span>销售订单号:{{$route.query.orderNo}}</span>
              <span>销售时间：{{params.saleTime}}</span>
              <span>业务人员：{{params.operator}}</span>
              <span>客户名称：{{params.customerName}}</span>
            </p>
            <p>              
              <span>实际兑换/优惠面值：{{params.priceRule}}</span>
              <span>使用率：{{params.usePercet}}</span>
              <span>兑付率：{{params.exchangePercet}}</span>
              <span><el-button type="success" icon="el-icon-upload2" @click="exportData">导出明细</el-button></span>
            </p>
      	</div>
      </el-card>
		  <el-form>
        <page-table ref="table" index :query="query" :fetch="queryTable">
          <el-table-column min-width="160"  label="电影券批次号" align="center" prop="batchNo" ></el-table-column>
          <el-table-column min-width="140"  label="电影券号" align="center" prop="couponCode"></el-table-column>
          <el-table-column min-width="100"  label="电影券种类" align="center" prop="typeName"></el-table-column>
          <el-table-column min-width="100"  label="电影券类型" align="center" prop="styleName"></el-table-column>
          <el-table-column min-width="110"  label="激活状态" align="center" prop="isActive"></el-table-column>
          <el-table-column min-width="110"  label="冻结状态" align="center" prop="isFrozen"></el-table-column>
          <el-table-column min-width="110"  label="作废状态" align="center" prop="isVoid"></el-table-column>
          <el-table-column min-width="110"  label="绑定状态" align="center" prop="bindStatus"></el-table-column>
          <el-table-column min-width="110"  label="使用状态" align="center" prop="isUse"></el-table-column>
          <el-table-column min-width="110"  label="使用时间" align="center" prop="useTime"></el-table-column>
          <el-table-column min-width="110"  label="实际兑换/优惠面值" align="center" prop="exchangeMoney"></el-table-column>
        </page-table>             
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="closeTab">关  闭</el-button> -->
      </div>
    </div>
</template>
<script>
import { realDeepClone, exportData } from '@/utils'
import { getCouponOrderInfo, getCouponOrderDetailList, exportCouponOrderDetail } from '@/api/financeCenter'
export default {
  name: 'order_detail',
  data() {
    return {
      query: {
        orderNo: this.$route.query.orderNo
      },
      params: {

      }
    }
  },
  methods: {
    queryTable(query) {
      getCouponOrderInfo(query).then((res) => {
        this.params = res
      })

      return getCouponOrderDetailList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    exportData() {
      exportData(exportCouponOrderDetail, realDeepClone(this.query))
    }
  }
}
</script>

<style scoped>
  .el-card__header p{
    margin-bottom: 20px;
  }
  .el-card__header p span{
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    width: 20%
  }
</style>