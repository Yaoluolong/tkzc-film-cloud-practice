<template>
    <div class="app-container">
    	<el-card  style="margin-bottom:20px;">
         	<div slot="header">
              <p>
                <span>销售订单号:{{$route.query.orderNo}}</span>
                <span>销售时间：{{params.saleTime}}</span>
                <span>业务人员：{{params.operator}}</span>
                <span>客户名称：{{params.customerName}}</span>
              </p>
              <p>
                <span>使用率：{{params.usePercet}}</span>
                <span>兑付率：{{params.exchangePercet}}</span>
              </p>
        	</div>
        </el-card>
		  <el-form>
        <page-table ref="table" index :query="query" :fetch="queryTable">
          <el-table-column min-width="180"  label="电影卡批次号" align="center" prop="batchNo" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="120"  label="电影卡号" align="center" prop="cardCode" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="100"  label="电影卡种类" align="center" prop="typeName"></el-table-column>
          <el-table-column min-width="100"  label="电影卡类型" align="center" prop="styleName"></el-table-column>
          <el-table-column min-width="110"  label="卡内总点数" align="center" prop="oldPoint"></el-table-column>
          <el-table-column min-width="110"  label="卡内剩余点数" align="center" prop="point"></el-table-column>
          <el-table-column min-width="110"  label="抵扣票务总额" align="center" prop="useCardPrice"></el-table-column>
          <el-table-column min-width="110"  label="抵扣增值费总额" align="center" prop="cardServicePrice"></el-table-column>
          <el-table-column min-width="110"  label="激活状态" align="center" prop="isActive"></el-table-column>
          <el-table-column min-width="110"  label="冻结状态" align="center" prop="isFrozen"></el-table-column>
          <el-table-column min-width="110"  label="作废状态" align="center" prop="isVoid"></el-table-column>
          <el-table-column min-width="110"  label="绑定状态" align="center" prop="bindStatus"></el-table-column>
        </page-table>             
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="closeTab">关  闭</el-button> -->
      </div>
    </div>
</template>
<script>
import { getCardOrderInfo, getCardOrderDetailList } from '@/api/financeCenter'
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
      getCardOrderInfo(query).then((res) => {
        this.params = res
      })

      return getCardOrderDetailList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
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