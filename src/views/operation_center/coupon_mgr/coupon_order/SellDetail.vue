<template>
    <div class="app-container">
        <el-card>
             <div slot="header">
                <span> <h3> 销售订单号:{{$route.query.orderNo}}   &nbsp;&nbsp;&nbsp;&nbsp;业务人员：{{name}}</h3></span>
            </div>            
            <el-table ref="table" index :data="data">         
                <el-table-column label="营销客户" align="center" prop="customer"></el-table-column>
                <el-table-column label="电影券品类" align="center" prop="couponName"></el-table-column>
                <el-table-column label="销售时间" align="center" prop="saleTime"></el-table-column>
                <el-table-column label="销售数量(张)" align="center" prop="num"></el-table-column>
                <el-table-column label="销售单价(元)" align="center" prop="unitPrice"></el-table-column>
                <el-table-column label="销售总额(元)" align="center" prop="amount"></el-table-column>
                <el-table-column label="激活电影券" align="center" prop="oper">
                    <template slot-scope="{row}">
                        <span v-if="row.isActive === '0'">未激活</span>
                        <span size="small" v-if="row.isActive === '1'">已激活</span>
                    </template>
                </el-table-column>  
                <el-table-column label="制券" align="center" prop="oper">
                    <template slot-scope="{row}">
                       <el-button type="text" @click="exportData(row)">导出</el-button>
                    </template>
                </el-table-column>                   
            </el-table>
        </el-card>
        <el-card>
            <page-table ref="table2" index :query="query" :fetch="getSaleDetailData">         
                <el-table-column label="电影券批次号" align="center" prop="batchNo"></el-table-column>
                <el-table-column label="电影券ID号" align="center" prop="couponId"></el-table-column>
                <el-table-column label="电影券号码" align="center" prop="couponCode"></el-table-column>
                <el-table-column label="电影券类型" align="center" prop="type"></el-table-column>
                <el-table-column label="消费对象" align="center" prop="consumeTarget"></el-table-column>
                <el-table-column label="电影券名称" align="center" prop="couponName"></el-table-column>                
                
                <el-table-column label="冻结状态" align="center" prop="isFrozen"></el-table-column>
                <el-table-column label="作废状态" align="center" prop="isVoid"></el-table-column>
                <el-table-column label="绑定状态" align="center" prop="bindStatus"></el-table-column>
                <el-table-column label="使用状态" align="center" prop="isUse"></el-table-column>
                                   
            </page-table>
        </el-card>         
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCouponOrderInfo, couponOrdersaleDetail, exportCouponSaleDetail } from '@/api/operationCenter'
import { exportData } from '@/utils'
import InvoiceDetail from '../../InvoiceDetail'
import ReceiptDetail from '../../ReceiptDetail'
export default {
  name: 'coupon_sell_detail',
  components: { InvoiceDetail, ReceiptDetail },
  data() {
    return {
      data: [],
      saleDetailData: [],
      query: {
      }
    }
  },
  methods: {
    exportData(row) {
      const query = {}
      query.batchNo = row.batchNo
      query.orderNo = row.orderNo
      exportData(exportCouponSaleDetail, query)
    },
    getSaleDetailData(query) {
      query.orderNo = this.$route.query.orderNo
      return couponOrdersaleDetail(query)
    },
    async queryInitTable() {
      this.data = await getCouponOrderInfo(this.$route.query.orderNo)
      // this.saleDetailData = await
    },
    refreshTable() {
      this.$refs.table.refresh()
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  async created() {
    this.queryInitTable()
  }

}
</script>

<style scoped>

</style>
