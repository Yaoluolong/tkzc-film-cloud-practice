<template>
    <div class="app-container">
        <el-card>
            <div slot="header">
                <span>业务人员：{{params.couponInfo.operator}}</span>
            </div>
            <el-form label-width="140px" label-position="left" style="width:1000px;" :model="params" ref="formCard">
                <el-form-item label="营销客户:" prop="customer">
                    <span>{{params.couponInfo.customerName}}</span>
                </el-form-item>
                <el-form-item label="电影券种类" prop="type">
                  <span>{{params.couponInfo.typeName}}</span>
                </el-form-item>
                <el-form-item label="电影券类型" prop="style">
                  <span>{{params.couponInfo.styleName}}</span>
                </el-form-item>
                <el-form-item label="电影券号">
                  <div v-for="item in params.couponInfo.codeIdDetail">
                    <span>{{item.left}}</span>
                    <span> －－ </span>
                    <span>{{item.right}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="销售数量:" prop="num">
                    <span>{{params.couponInfo.num}}</span>
                     张  
                    <!-- <span style="margin-left:20px;color:red">系统已根据您所填写的号码段自动统计出销售数量!</span> -->
                </el-form-item>
                <el-form-item label="销售总额:" prop="amount">
                    <span>{{params.couponInfo.amount}}</span> 元
                    <!-- <span style="margin-left:20px;color:gray">只能是数值，且必须大于0</span>  -->
                </el-form-item>
                <el-form-item label="销售单价:" prop="unitPrice">
                    <span>{{params.couponInfo.unitPrice||'--'}}</span> 元 
                    <!-- <span style="margin-left:20px;color:gray">只能是数值，0.01-10000，限2位小数</span> -->
                </el-form-item>                    
                <el-form-item label="电影券有效期:">
                    {{params.couponInfo.startTime}} 至 {{params.couponInfo.endTime}}
                </el-form-item>
                <el-form-item label="可兑换影片售价区间:" label-width="160px;" v-if="params.couponInfo.type===1">
                  <span>{{params.couponInfo.priceRuleStr}}</span>
                </el-form-item>

                <el-form-item label="可优惠电影售价:" prop="canFreePrice" label-width="150px;" v-if="params.couponInfo.type===2">
                  <span>{{params.couponInfo.canFreePrice||'--'}}</span>
                    元
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top:10px">
            <div slot="header">
                <span>发票与支付</span>
            </div>
            <el-form label-width="140px" label-position="left" style="width:1000px;" :model="params.invoiceInfo" ref="formInvoiceInfo">
                <el-form-item label="发票类型:" prop="invoiceType">
                    <span>{{params.invoiceInfo.invoiceTypeName}}</span>
                </el-form-item>
                <template v-if="params.invoiceInfo.invoiceType && params.invoiceInfo.invoiceType !== '1'">
                    <el-form-item label="发票抬头:" prop="title">
                        <span>{{params.invoiceInfo.title}}</span> 
                    </el-form-item>
                    <!-- 企业相关START -->
                    <el-form-item label="税号:" prop="taxNo" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '6' || params.invoiceInfo.invoiceType === '5'">
                        <span>{{params.invoiceInfo.taxNo}}</span> 
                    </el-form-item>
                    <el-form-item label="企业地址:" prop="companyAddress" v-if="params.invoiceInfo.invoiceType === '6'">
                        <span>{{params.invoiceInfo.companyAddress}}</span> 
                    </el-form-item>
                    <el-form-item label="电话号码:" prop="companyMobile" v-if="params.invoiceInfo.invoiceType === '6'">
                        <span>{{params.invoiceInfo.companyMobile}}</span> 
                    </el-form-item>
                    <el-form-item label="开户银行:" prop="bank" v-if="params.invoiceInfo.invoiceType === '6'">
                        <span>{{params.invoiceInfo.bank}}</span>
                    </el-form-item>
                    <el-form-item label="银行账号:" prop="bankNo" v-if="params.invoiceInfo.invoiceType === '6'">
                        <span>{{params.invoiceInfo.bankNo}}</span>
                    </el-form-item>
                    <!-- 企业相关END -->
                    <!-- 个人相关START -->
                    <el-form-item label="身份证号:" prop="idNumber" v-if="params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '3'">
                        <span>{{params.invoiceInfo.idNumber}}</span> 
                    </el-form-item>                   
                    <!-- 个人相关END -->
                    <el-form-item label="电子邮箱:" prop="receiveEmail" v-if="params.invoiceInfo.invoiceType === '3' || params.invoiceInfo.invoiceType === '5'">
                        <span>{{params.invoiceInfo.receiveEmail}}</span> 
                    </el-form-item>
                    <el-form-item label="发票领取:" prop="receiveType" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '6'">
                        <span>{{params.invoiceInfo.receiveTypeName}}</span>
                    </el-form-item>

                    <el-form-item label="收件人:" prop="receiveName" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '6'">
                        <span>{{params.invoiceInfo.receiveName}}</span>
                    </el-form-item>
                    <el-form-item label="联系电话:" prop="receiveMobile" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '6'">
                        <span>{{params.invoiceInfo.receiveMobile}}</span> 
                    </el-form-item>
                    <el-form-item label="收件地址:" prop="receiveAddress" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '6'">
                        <span>{{params.invoiceInfo.receiveAddress}}</span> 
                    </el-form-item>
                    
                </template>
                <!-- 付款方式 -->
                <el-form-item label="付款方式:" prop="payType">
                    <el-radio-group v-model="params.invoiceInfo.payType">
                        <el-radio label="1" disabled>银行收账</el-radio>
                        <el-radio label="2" disabled>现金付款</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="销售备注:" prop="remark">
                    <el-input v-model.trim="params.invoiceInfo.remark" type="textarea" :rows="5" disabled></el-input>
                </el-form-item>
            </el-form>
        </el-card>
        <el-button style="margin-top:20px;" type="primary" @click="save">提交审核</el-button>
        <el-button @click="cancel" >取消</el-button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInvoiceTypeList, getCouponOrderInfo, CouponCodeSubmitCheck } from '@/api/operationCenter'
import CustomerSelector from '@/components/CustomerSelector'
import PriceArea from './PriceArea'
import CouponCodeArea from './CouponCodeArea'
export default {
  name: 'sold_coupon_detail',
  components: { CustomerSelector, PriceArea, CouponCodeArea },
  data() {
    return {
      allInvoiceTypes: [], // 所有发票类型
      time: [],
      params: {
        couponInfo: {
          amount: '',
          codeIdDetail: {},
          customerName: '',
          endTime: '',
          num: '',
          operator: '',
          orderNo: '',
          priceRuleStr: '',
          saleTime: '',
          startTime: '',
          styleName: '',
          typeName: '',
          unitPrice: ''
        },
        invoiceInfo: {
          bank: '',
          bankNo: '',
          collectAccount: '',
          collectPeople: '',
          companyAddress: '',
          companyMobile: '',
          id: '',
          idNumber: '',
          invocieMoney: '',
          invoiceNo: '',
          invoiceType: '',
          invoiceTypeName: '',
          orderNo: '',
          payType: '',
          payTypeName: '',
          receiveAddress: '',
          receiveEmail: '',
          receiveMobile: '',
          receiveName: '',
          receiveType: '',
          receiveTypeName: '',
          remark: '',
          taxNo: '',
          title: '',
          transferBank: '',
          transferMoney: '',
          transferPeople: '',
          transferTime: '',
          transportName: '',
          transportNo: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {

  },
  methods: {
    doGet(res) {
      this.params.couponInfo.num = res
      this.$forceUpdate()
    },
    del(index) {
      this.list.splice(index, 1)
    },
    save() {
      this.params.couponInfo.startTime = this.params.couponInfo.time[0]
      this.params.couponInfo.endTime = this.params.couponInfo.time[1]
      const _this = this
      this.params.couponInfo.num = this.params.couponInfo.num.toString()
      if (this.$route.query.orderNo) {
        this.params.orderNo = this.$route.query.orderNo
        CouponCodeSubmitCheck({ orderNo: this.params.orderNo }).then((res) => {
          _this.$message.success('提交审核成功')
          _this.closeTab()
          this.$router.push('/operation_center/coupon_mgr/sold_coupon_list')
        })
      }
    },
    cancel() {
      this.closeTab()
      this.$router.push('/operation_center/coupon_mgr/sold_coupon_list')
    }
  },
  async created() {
    this.params.couponInfo = {}
    this.params.invoiceInfo = {}

    if (this.$route.query.orderNo) {
      const _this = this
      getCouponOrderInfo(this.$route.query.orderNo).then((res) => {
        _this.params = res
        _this.$forceUpdate()
        _this.params.couponInfo.time = []
        _this.params.couponInfo.time.push(res.couponInfo.startTime)
        _this.params.couponInfo.time.push(res.couponInfo.endTime)
      })
    }
    this.allInvoiceTypes = await getInvoiceTypeList()
  }
}
</script>

<style scoped>
.el-dialog-title{
    text-align:center;
    font-size:15px;
    /* background-color:gray; */
    padding-top:10px
    }
    .el-dialog-footer{
        font-size:15px;
        color:orangered;
    }
    .el-dialog__header{
        padding: 0px;
    }
    .el-dialog__body{
        background-color: gray;
    }
    .el-dialog__footer{
        background-color: gray;
    }
</style>
