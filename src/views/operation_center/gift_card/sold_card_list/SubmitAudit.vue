<template>
    <div class="app-container">
        <el-card v-if="ok">
            <div slot="header">
                <span>业务人员：{{params.cardInfo.operator}}</span>
            </div>
            <el-form label-width="140px" label-position="left" style="width:1000px;" :model="params" :rules="rules" ref="formCard">
                <el-form-item label="营销客户:" prop="customer">
                    <!-- <customer-selector v-model="params.cardInfo.customer"></customer-selector> -->
                    <span>{{params.cardInfo.customerName}}</span>
                </el-form-item>
                <el-form-item label="电影卡种类" prop="type">
                  <!-- <remote-select v-model="params.cardInfo.type" clearable placeholder="请选择电影卡种类" action="/systemApi/dict/getList" :query="{type:'couponType'}" style="width:230px;"></remote-select> -->
                  <span>{{params.cardInfo.typeName}}</span>
                </el-form-item>
                <el-form-item label="电影卡类型" prop="style">
                  <!-- <remote-select v-model="params.cardInfo.style" clearable placeholder="请选择电影卡类型" action="/systemApi/dict/getList" :query="{type:'couponStyle'}" style="width:230px;"></remote-select> -->
                  <span>{{params.cardInfo.styleName}}</span>
                </el-form-item>
                <el-form-item label="电影卡号">
                  <!-- <coupon-code-area :outCheckId="doGet" v-model="params.cardInfo.codeIdDetail" :couponType="params.cardInfo.type" :couponStyle="params.cardInfo.style"></coupon-code-area> -->
                  <div v-for="(item,index) in params.cardInfo.codeIdDetail" :key="index">
                    <span>{{item.left}}</span>
                    <span> －－ </span>
                    <span>{{item.right}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="销售数量:" prop="num">
                    <!-- <el-input clearable  v-model.trim="params.cardInfo.num" placeholder="0" style="width:100px;" disabled></el-input> -->
                    <span>{{params.cardInfo.num}}</span>
                     张
                    <!-- <span style="margin-left:20px;color:red">系统已根据您所填写的号码段自动统计出销售数量!</span> -->
                </el-form-item>
                <el-form-item label="销售总额:" prop="amount">
                    <!-- <el-input clearable  v-model.trim="params.cardInfo.amount" placeholder="0.00" style="width:100px;" ></el-input> -->
                    <span>{{params.cardInfo.amount}}</span> 元
                    <!-- <span style="margin-left:20px;color:gray">只能是数值，且必须大于0</span> -->
                </el-form-item>
                <el-form-item label="销售比例">
                  <span>{{params.cardInfo.scalePrice}}:{{params.cardInfo.scalePoint}}</span>
                  <!-- <span style="margin-left:30px;color:gray">销售的时候卡面金额与卡内点数的比例，默认1:10建议不修改！</span> -->
                </el-form-item>
                <el-form-item label="卡内金额" prop="unitPrice" style="display:inline-block">
                  {{params.cardInfo.unitPrice}} 元，折合卡内点数: {{ params.cardInfo.unitPrice * params.cardInfo.scalePoint /params.cardInfo.scalePrice}}
                </el-form-item>
                <el-form-item label="电影卡有效期:" prop="time" >
                    <!-- <el-date-picker unlink-panels v-model="params.cardInfo.time" type="daterange"  value-format="yyyy-MM-dd"
                            start-placeholder="开始日期" end-placeholder="结束日期"  style="width:320px;"></el-date-picker> -->
                    {{params.cardInfo.time[0]}} 至 {{params.cardInfo.time[1]}}
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top:10px" v-if="ok && ok1">
            <div slot="header">
                <span>发票与支付</span>
            </div>
            <el-form label-width="140px" label-position="left" style="width:1000px;" :model="params.invoiceInfo" :rules="rules" ref="formInvoiceInfo">
                <el-form-item label="发票类型:" prop="invoiceType">
                    <!-- <el-select clearable  v-model="params.invoiceInfo.invoiceType">
                        <el-option v-for="invoiceType in allInvoiceTypes" :key="invoiceType.value" :value="invoiceType.value" :label="invoiceType.name"></el-option>
                    </el-select> -->
                    <span>{{params.invoiceInfo.invoiceTypeName}}</span>
                </el-form-item>
                <template v-if="params.invoiceInfo.invoiceType && params.invoiceInfo.invoiceType !== '1'">
                    <el-form-item label="发票抬头:" prop="title">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.title" placeholder="输入发票抬头的信息" style="width:200px;" ></el-input> -->
                        <span>{{params.invoiceInfo.title}}</span>
                    </el-form-item>
                    <!-- 企业相关START -->
                    <el-form-item label="税号:" prop="taxNo" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '6' || params.invoiceInfo.invoiceType === '5'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.taxNo" placeholder="请输入内容" style="width:200px;" ></el-input>  -->
                        <span>{{params.invoiceInfo.taxNo}}</span>
                    </el-form-item>
                    <el-form-item label="企业地址:" prop="companyAddress" v-if="params.invoiceInfo.invoiceType === '6'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.companyAddress" placeholder="请输入内容" style="width:200px;" ></el-input> -->
                        <span>{{params.invoiceInfo.companyAddress}}</span>
                    </el-form-item>
                    <el-form-item label="电话号码:" prop="companyMobile" v-if="params.invoiceInfo.invoiceType === '6'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.companyMobile" placeholder="请输入内容" style="width:200px;" ></el-input>  -->
                        <span>{{params.invoiceInfo.companyMobile}}</span>
                    </el-form-item>
                    <el-form-item label="开户银行:" prop="bank" v-if="params.invoiceInfo.invoiceType === '6'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.bank" placeholder="请输入内容" style="width:200px;" ></el-input>  -->
                        <span>{{params.invoiceInfo.bank}}</span>
                    </el-form-item>
                    <el-form-item label="银行账号:" prop="bankNo" v-if="params.invoiceInfo.invoiceType === '6'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.bankNo" placeholder="请输入内容" style="width:200px;" ></el-input>  -->
                        <span>{{params.invoiceInfo.bankNo}}</span>
                    </el-form-item>
                    <!-- 企业相关END -->
                    <!-- 个人相关START -->
                    <el-form-item label="身份证号:" prop="idNumber" v-if="params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '3'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.idNumber" placeholder="输入索要发票人身份证号码" style="width:200px;" ></el-input> -->
                        <span>{{params.invoiceInfo.idNumber}}</span>
                    </el-form-item>
                    <!-- 个人相关END -->
                    <el-form-item label="电子邮箱:" prop="receiveEmail" v-if="params.invoiceInfo.invoiceType === '3' || params.invoiceInfo.invoiceType === '5'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.receiveEmail" placeholder="输入索要发票人电子邮箱" style="width:200px;" ></el-input> -->
                        <span>{{params.invoiceInfo.receiveEmail}}</span>
                    </el-form-item>
                    <el-form-item label="发票领取:" prop="receiveType" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '6'">
                        <!-- <el-select clearable v-model="params.invoiceInfo.receiveType">
                            <el-option value="1" label="邮寄包邮"></el-option>
                            <el-option value="2" label="邮寄到付"></el-option>
                        </el-select> -->
                        <span>{{params.invoiceInfo.receiveTypeName}}</span>
                    </el-form-item>

                    <el-form-item label="收件人:" prop="receiveName" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '6'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.receiveName" placeholder="输入快递收件人姓名" style="width:200px;" ></el-input> -->
                        <span>{{params.invoiceInfo.receiveName}}</span>
                    </el-form-item>
                    <el-form-item label="联系电话:" prop="receiveMobile" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '6'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.receiveMobile" placeholder="输入快递收件人联系电话" style="width:200px;" ></el-input> -->
                        <span>{{params.invoiceInfo.receiveMobile}}</span>
                    </el-form-item>
                    <el-form-item label="收件地址:" prop="receiveAddress" v-if="params.invoiceInfo.invoiceType === '4' || params.invoiceInfo.invoiceType === '2' || params.invoiceInfo.invoiceType === '6'">
                        <!-- <el-input clearable  v-model.trim="params.invoiceInfo.receiveAddress" placeholder="输入快递收件人收件地址" style="width:200px;" ></el-input> -->
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
                    <el-input clearable  v-model.trim="params.invoiceInfo.remark" type="textarea" :rows="5" disabled></el-input>
                </el-form-item>
            </el-form>
        </el-card>
        <el-button style="margin-top:20px;" type="primary" @click="save">提交审核</el-button>
        <el-button @click="cancel" >取消</el-button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInvoiceTypeList, getCardOrderInfo, CardCodeSubmitCheck } from '@/api/operationCenter'
import CustomerSelector from '@/components/CustomerSelector'
import PriceArea from './PriceArea'
import CouponCodeArea from './CouponCodeArea'
export default {
  name: 'submit_audit',
  components: { CustomerSelector, PriceArea, CouponCodeArea },
  data() {
    const checkTime = (rule, value, cb) => {
      if (!value || !value[0] || !value[1]) {
        cb(new Error('请选择电影卡有效时间'))
      }
      cb()
    }
    const betweenInt = (type, min, max) => (rule, v, cb) => {
      let isBetween = false
      let isInt = false
      if (type === 1) {
        isBetween = v > min
        isInt = /^[0-9]+$/.test(v)
      } else if (type === 2) {
        isBetween = v >= min && v <= max
        isInt = true
      }
      if (isBetween && isInt) return cb()
      return cb(new Error())
    }
    return {
      allInvoiceTypes: [], // 所有发票类型
      time: [],
      params: {
        cardInfo: {
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
      },
      rules: {
        customer: { required: true, message: '请输入营销客户', trigger: 'change' },
        type: { required: true, message: '请选择电影卡种类', trigger: 'change' },
        style: { required: true, message: '请选择电影卡类型', trigger: 'change' },
        // cardTypeId: { required: true, message: '请选择卡名称', trigger: 'change' },
        num: [
          { required: true, message: '请输入销售数量', trigger: 'blur' },
          { validator: betweenInt(1, 0), message: '销售数量须大于0', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '请输入销售单价', trigger: 'blur' },
          { validator: betweenInt(2, 0.01, 10000), message: '须在0.01-10000之间', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入销售总额', trigger: 'blur' },
          { validator: betweenInt(2, 0, 100000000), message: '销售总额须大于0', trigger: 'blur' }
        ],
        time: { required: true, validator: checkTime, trigger: 'blur' },

        invoiceType: { required: true, message: '请选择发票类型', trigger: 'change' },
        title: { required: true, message: '请输入发票抬头', trigger: 'blur' },
        taxNo: { required: true, message: '请输入税号', trigger: 'blur' },
        companyAddress: { required: true, message: '请输入企业地址', trigger: 'blur' },
        companyMobile: { required: true, message: '请输入电话号码', trigger: 'blur' },
        bank: { required: true, message: '请输入开户银行', trigger: 'blur' },
        bankNo: { required: true, message: '请输入银行账号', trigger: 'blur' },
        idNumber: { required: true, message: '请输入身份证号', trigger: 'blur' },
        receiveEmail: { required: true, message: '请输入电子邮箱', trigger: 'blur' },
        receiveType: { required: true, message: '请选择发票领取', trigger: 'change' },
        receiveName: { required: true, message: '请输入收件人', trigger: 'blur' },
        receiveMobile: { required: true, message: '请输入联系电话', trigger: 'blur' },
        receiveAddress: { required: true, message: '请输入收件地址', trigger: 'blur' },
        payType: { required: true, message: '请选择付款方式', trigger: 'change' },
        remark: { required: true, message: '请输入销售备注', trigger: 'blur' }
      },
      ok: false,
      ok1: false
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
      this.params.cardInfo.num = res
      this.$forceUpdate()
    },
    del(index) {
      this.list.splice(index, 1)
    },
    save() {
      this.params.cardInfo.startTime = this.params.cardInfo.time[0]
      this.params.cardInfo.endTime = this.params.cardInfo.time[1]
      const _this = this
      this.params.cardInfo.num = this.params.cardInfo.num.toString()
      if (this.$route.query.orderNo) {
        this.params.orderNo = this.$route.query.orderNo
        CardCodeSubmitCheck({ orderNo: this.params.orderNo }).then((res) => {
          _this.$message.success('提交审核成功')
          _this.closeTab()
          this.$router.push('/operation_center/gift_card/sold_card_list')
        })
      }
    },
    cancel() {
      this.closeTab()
      this.$router.push('/operation_center/gift_card/sold_card_list')
    }
  },
  async created() {
    this.params.cardInfo = {}
    this.params.invoiceInfo = {}

    if (this.$route.query.orderNo) {
      const _this = this
      getCardOrderInfo(this.$route.query.orderNo).then((res) => {
        _this.params = res
        _this.$forceUpdate()
        _this.params.cardInfo.time = []
        _this.params.cardInfo.time.push(res.cardInfo.startTime)
        _this.params.cardInfo.time.push(res.cardInfo.endTime)
        this.ok = true
      })
    }
    this.allInvoiceTypes = await getInvoiceTypeList()
    this.ok1 = true
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
