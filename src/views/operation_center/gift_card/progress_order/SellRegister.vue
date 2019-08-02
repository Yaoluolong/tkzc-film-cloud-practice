<template>
    <div class="app-container">
         <el-card style="margin-bottom:20px">
            <div slot="header">
              <p class="headerContainer"> 
                <span>销售订单号:{{$route.query.orderNo}}</span>
                <span>销售时间：{{cardInfo.saleTime}}</span>
                <span>业务人员：{{cardInfo.operator}}</span>
                <span>客户名称：{{cardInfo.customerName}}</span>
              </p>
              <p class="headerContainer">
                <span>销售数量（张）：{{cardInfo.num}}</span>
                <span>销售单价（元）：{{cardInfo.unitPrice}}</span>
                <span>销售总额：{{cardInfo.amount}}</span>
              </p>
              <p class="headerContainer">
                <span>初审人员：{{cardInfo.checkInfo?cardInfo.checkInfo.checkName:'--'}}</span>
                  <span>初审时间：{{cardInfo.checkInfo?cardInfo.checkInfo.createTime:'--'}}</span>
                <span v-if="$route.query.isReceiveMoney">开票状态：{{invoiceInfo.invoiceType === '1'?'无需发票': (invoiceInfo.isDrawInvoice === '1'? '已开票' : '未开票')}}</span>
                <span v-if="$route.query.invoiceType || $route.query.isActive">收款状态：{{invoiceInfo.isReceiveMoney === '1'?'已收款':'未收款'}}</span>
                <span>激活状态：{{cardInfo.isActive === '1'?'已激活':'未激活'}}</span>
              </p>
            </div>    
            <el-table ref="table" index :data="data">         
              <el-table-column label="电影卡批次号" align="center" prop="batchNo"></el-table-column>
              <el-table-column label="电影卡种类" align="center" prop="typeName"></el-table-column>
              <el-table-column label="电影卡类型" align="center" prop="styleName"></el-table-column>
              <el-table-column label="销售卡区间号" align="center" prop="codeIdDetail"></el-table-column>
              <el-table-column label="卡内金额(元)" align="center" prop="money"></el-table-column>
              <el-table-column label="卡内点数" align="center" prop="point"></el-table-column>                
            </el-table>
          </el-card>
            <el-card style="margin-bottom:20px" v-if="cardInfo.checkInfo">
              <!-- <span style="font-size:14px;line-height:1;vertical-align:top;">审核意见：</span>
              <span style="font-size:14px;line-height:1;vertical-align:top;">{{suggestion?suggestion:'无审核意见'}}</span> -->
              <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
                <el-form label-width="160px" label-position="right" style="width:1000px;">
                  <el-form-item label="审核意见：">
                    {{suggestion?suggestion:'无审核意见'}}
                  </el-form-item>
                  <el-form-item label="审核状态：">
                    {{cardInfo.checkInfo.isAgree==='1'?'通过':'退回'}}
                  </el-form-item>
                  <el-form-item label="审核人：">
                    {{cardInfo.checkInfo?cardInfo.checkInfo.checkName:'--'}}
                  </el-form-item>
                  <el-form-item label="审核时间：">
                    {{cardInfo.checkInfo.createTime?cardInfo.checkInfo.createTime:'--'}}
                  </el-form-item>
                </el-form>
              </el-card>
            </el-card>
            <el-card style="margin-bottom:20px" v-if="$route.query.invoiceType || cardInfo.isDrawInvoice!=='0'">
              <span v-if="cardInfo.invoiceType==='1'">是否提供发票：无需开票</span>
              <invoice-detail v-else type="card" :outData="invoiceInfo" @refresh="queryInitTable"></invoice-detail>
               <!-- v-if="$route.query.invoiceType && $route.query.invoiceType!=='1' " -->
            </el-card>
            <el-card style="margin-bottom:20px" v-if="$route.query.isReceiveMoney || cardInfo.isReceiveMoney ==='1'" >
              <receipt-detail type="card" :outData="payInfo" @refresh="queryInitTable"></receipt-detail>
            </el-card>
            
            <!-- <div style="margin:20px 0;" v-if="$route.query.isActive">
              <span style="font-size:14px;line-height:1;vertical-align:top;">激活说明：</span>
              <span v-if="cardInfo.isActive==='1'">{{cardInfo.setActiveExplain}}</span>
              <el-input clearable v-else v-model.trim="cardInfo.setActiveExplain" type="textarea" :rows="5" :disabled="cardInfo.isActive !== '0'" placeholder="请输入您对此销售单的审核意见" style="display:inline-block;width:600px;"></el-input>
            </div>
            <div style="margin:20px 0;" v-if="$route.query.isActive && cardInfo.isActive === '1'">
              <span style="font-size:14px;vertical-align:top;">激活人：{{cardInfo.setActivePeople}}</span>
            </div>
            
            <el-button size="small" v-if="$route.query.isActive && cardInfo.isActive === '0'" @click="setActive(cardInfo)" type="primary">激活销售单</el-button> -->
            <el-card style="margin-bottom:20px" v-if="$route.query.isActive || cardInfo.isActive === '1'">
              <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
                <el-form label-width="160px" label-position="right" style="width:1000px;">                  
                  <el-form-item label="激活说明：" v-if="$route.query.isActive && cardInfo.isActive === '0'">
                    <el-input clearable v-model.trim="cardInfo.setActiveExplain" type="textarea" :rows="5" :disabled="cardInfo.isActive !== '0'" placeholder="请输入您对此销售单的审核意见" style="display:inline-block;width:600px;"></el-input>
                  </el-form-item>
                  <el-form-item label="激活说明：" v-if="cardInfo.isActive === '1'">
                    <span v-if="cardInfo.isActive==='1'">{{cardInfo.setActiveExplain}}</span>
                  </el-form-item>
                  <el-form-item label="激活状态：" v-if="cardInfo.isActive === '1'">
                    {{cardInfo.activeName}}
                  </el-form-item>
                  <el-form-item label="激活人：" v-if="cardInfo.isActive === '1'">
                    {{cardInfo.setActivePeople}}
                  </el-form-item>
                  <el-form-item label="激活时间：" v-if="cardInfo.isActive === '1'">
                    {{cardInfo.setActiveTime}}
                  </el-form-item>
                  <!-- <el-button size="small" v-if="$route.query.isActive && cardInfo.isActive === '0'" @click="setActive(cardInfo)" type="primary">激活销售单</el-button> -->
                </el-form>
                <el-button size="small" v-if="$route.query.isActive && cardInfo.isActive === '0'" @click="setActive(cardInfo)" type="primary">激活销售单</el-button>
              </el-card>
          </el-card>         
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCardOrderInfo, setCardOrderActive } from '@/api/operationCenter'
import InvoiceDetail from '../../InvoiceDetail'
import ReceiptDetail from '../../ReceiptDetail'
export default {
  name: 'card_progress_sell_register',
  components: { InvoiceDetail, ReceiptDetail },
  data() {
    return {
      data: [],
      cardInfo: {
        checkInfo: {}
      },
      invoiceInfo: {},
      payInfo: {},
      query: {},
      suggestion: ''
    }
  },
  methods: {
    async queryInitTable() {
      const temp = await getCardOrderInfo(this.$route.query.orderNo)
      this.cardInfo = temp.cardInfo
      this.invoiceInfo = temp.invoiceInfo
      this.payInfo = temp.payInfo.length !== 0 ? temp.payInfo : {}
      this.data = temp.list

      if (temp.cardInfo.checkInfo && temp.cardInfo.checkInfo.suggestion !== 'null') {
        this.suggestion = temp.cardInfo.checkInfo.suggestion
      } else {
        this.suggestion = ''
      }
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    setActive(row) {
      if (row.isReceiveMoney === '0') {
        this.$confirm('激活销售订单中的电影卡建议销售订单的销售款已收回后再进行操作，是否立即执行激活电影卡操作？', '温馨提示', { type: 'warning' }).then(() => {
          {
            const isActive = row.isActive === '1' ? '0' : '1'
            const param = { orderNo: row.orderNo, isActive, setActiveExplain: row.setActiveExplain }
            setCardOrderActive(param).then(res => {
              this.$message.success('激活成功')
              row.setActivePeople = res
              row.isActive = isActive
              this.$nextTick(() => {
                this.queryInitTable()
              })
            })
          }
        })
      } else {
        const isActive = row.isActive === '1' ? '0' : '1'
        const param = { orderNo: row.orderNo, isActive, setActiveExplain: row.setActiveExplain }
        setCardOrderActive(param).then(res => {
          this.$message.success('激活成功')
          row.setActivePeople = res
          row.isActive = isActive
          this.$nextTick(() => {
            this.queryInitTable()
          })
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
  .headerContainer{
    font-size: 18px;
    font-weight: bold;
  }
  .headerContainer span {
    display: inline-block;
    width: 350px;
  }
</style>
