<template>
    <div class="app-container">
         <el-card>
             <div slot="header">
                <span> <h3> 销售订单号:{{$route.query.orderNo}}   &nbsp;&nbsp;&nbsp;&nbsp;业务人员：{{name}}</h3></span>
            </div>    
            <div v-for="(el , index) in data" :key="index">               
                <el-table ref="table" index :data="el">         
                    <el-table-column label="营销客户" align="center" prop="customer"></el-table-column>
                    <el-table-column label="电影券品类" align="center" prop="couponName"></el-table-column>
                    <el-table-column label="销售时间" align="center" prop="saleTime"></el-table-column>
                    <el-table-column label="销售数量(张)" align="center" prop="num"></el-table-column>
                    <el-table-column label="销售单价(元)" align="center" prop="unitPrice"></el-table-column>
                    <el-table-column label="销售总额(元)" align="center" prop="amount"></el-table-column>
                    <el-table-column label="激活电影券" align="center" prop="oper">
                        <template slot-scope="{row}">
                            <el-button size="small" v-if="row.isActive === '0'" @click="setActive(row)" type="primary">激活</el-button>
                            <el-button size="small" v-if="row.isActive === '1'" type="text">已激活</el-button>
                        </template>
                    </el-table-column>                    
                </el-table>
                <invoice-detail type="coupon" :outData="el[0]"></invoice-detail>
                <receipt-detail type="coupon" :outData="el[0]"></receipt-detail>
            </div>
         </el-card>         
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCouponOrderInfo, setCouponOrderActive } from '@/api/operationCenter'
import InvoiceDetail from '../../InvoiceDetail'
import ReceiptDetail from '../../ReceiptDetail'
export default {
  name: 'coupon_sell_register',
  components: { InvoiceDetail, ReceiptDetail },
  data() {
    return {
      data: [],
      query: {}
    }
  },
  methods: {
    async queryInitTable() {
      const temp = await getCouponOrderInfo(this.$route.query.orderNo)
      temp.forEach(e => {
        const array = []
        array.push(e)
        this.data.push(array)
      })
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    setActive(row) {
      if (row.isReceiveMoney === '0') {
        this.$confirm('激活销售订单中的电影券建议销售订单的销售款已收回后再进行操作，是否立即执行激活电影券操作？', '温馨提示', { type: 'warning' }).then(() => {
          {
            const isActive = row.isActive === '1' ? '0' : '1'
            const param = { couponOrderDetailId: row.couponOrderDetailId, isActive }
            setCouponOrderActive(param).then(() => {
              row.isActive = isActive
            })
          }
        })
      } else {
        const isActive = row.isActive === '1' ? '0' : '1'
        const param = { couponOrderDetailId: row.couponOrderDetailId, isActive }
        setCouponOrderActive(param).then(() => {
          row.isActive = isActive
        })
      }
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
