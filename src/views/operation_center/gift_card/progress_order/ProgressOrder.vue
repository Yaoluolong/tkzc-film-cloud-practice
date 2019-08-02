<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <span>销售电影卡基础信息，销售员：{{name}}</span>
      </div>
      <el-form
        label-width="160px"
        label-position="right"
        style="width:1000px;"
        :model="cardInfo"
        :rules="rules"
        ref="formCard"
      >
        <el-form-item label="客户名称:" prop="customer">
          <span>{{cardInfo.customerName}}</span>
        </el-form-item>
        <el-form-item label="电影卡种类" prop="type">
          <span>{{cardInfo.typeName}}</span>
        </el-form-item>
        <el-form-item label="电影卡类型" prop="style">
          <span>{{cardInfo.styleName}}</span>
        </el-form-item>
        <el-form-item label="电影卡号" v-if="cardInfo.style==='Z'">
          <div v-for="(item,index) in cardInfo.codeIdDetail" :key="index">
            <span>{{item.left}}</span>
            <span>－－</span>
            <span>{{item.right}}</span>
          </div>
        </el-form-item>
        <el-form-item label="销售数量:" prop="num">
          <span>{{cardInfo.num}}</span>
          张
          <!-- <span style="margin-left:20px;color:red">系统已根据您所填写的号码段自动统计出销售数量!</span> -->
        </el-form-item>
        <el-form-item label="销售总额:" prop="amount">
          <span>{{cardInfo.amount}}</span> 元
          <!-- <span style="margin-left:20px;color:gray">只能是数值，且必须大于0</span> -->
        </el-form-item>
        <el-form-item label="销售比例">
          <span>{{cardInfo.scalePrice}}:{{cardInfo.scalePoint}}</span>
          <!-- <span style="margin-left:30px;color:gray">销售的时候卡面金额与卡内点数的比例，默认1:10建议不修改！</span> -->
        </el-form-item>
        <el-form-item
          label="卡内金额"
          prop="unitPrice"
          style="display:inline-block"
        >{{cardInfo.unitPrice}} 元，折合卡内点数: {{ cardInfo.unitPrice * cardInfo.scalePoint / cardInfo.scalePrice}}</el-form-item>
        <el-form-item label="电影卡有效期:" prop="time">{{cardInfo.startTime}} 至 {{cardInfo.endTime}}</el-form-item>
        <el-form-item label="销售备注:">
          <!-- <el-input clearable type="textarea" :row="5" v-model="cardInfo.remark" disabled></el-input> -->
          <span>{{cardInfo.remark}}</span>
        </el-form-item>
        <el-form-item label="使用说明:">
          <!-- <el-input clearable type="textarea" :row="5" v-model="cardInfo.useExplain" disabled></el-input> -->
          <span>{{cardInfo.useExplain}}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px;">
      <!-- <el-form  label-width="140px" label-position="left" style="width:1000px;">
            <el-form-item label="审核意见:" prop="suggestion">
                <el-input clearable v-model.trim="suggestion" type="textarea" :rows="5" placeholder="请输入审核意见" :disabled="checkStatus!=='1'"  v-show="checkStatus=='1'"></el-input>
                <span  v-show="checkStatus!=='1'">{{suggestion}}</span>
            </el-form-item>
      </el-form>-->
      <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
        <el-form
          label-width="140px"
          label-position="right"
          style="width:1000px;"
          v-show="checkStatus==='1'"
        >
          <el-form-item label="审核意见:" prop="suggestion">
            <el-input
              clearable
              v-model.trim="suggestion"
              type="textarea"
              :rows="5"
              placeholder="请输入审核意见"
              :disabled="$route.query.checkStatus!='1'"
            ></el-input>
            <!-- <span v-show="$route.query.checkStatus!=='1'">{{suggestion}}</span> -->
          </el-form-item>
        </el-form>
        <el-form
          label-width="140px"
          label-position="right"
          style="width:1000px;"
          v-show="checkStatus!=='1'"
        >
          <el-form-item label="审核意见：">{{suggestion?suggestion:'无审核意见'}}</el-form-item>
          <el-form-item label="审核状态：">{{isAgree==='1'?'通过':'退回'}}</el-form-item>
          <el-form-item label="审核人：">{{checkName}}</el-form-item>
          <el-form-item label="审核时间：">{{createTime?createTime:'无'}}</el-form-item>
        </el-form>
      </el-card>
    </el-card>
    <el-button
      style="margin-top:20px;"
      type="primary"
      @click="checkOrder"
      v-show="checkStatus=='1'"
    >同意</el-button>
    <el-button type="primary" @click="refund" v-show="checkStatus=='1'">退回</el-button>
    <el-button @click="closeTab" v-show="checkStatus=='1'">取消</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getInvoiceTypeList,
  getCardOrderInfo,
  cardcheckOrder
} from '@/api/operationCenter'
// import CustomerSelector from '@/components/CustomerSelector'
// import PriceArea from './PriceArea'
// import CouponCodeArea from './CouponCodeArea'
export default {
  name: 'card_progress_order_submit',
  // components: { CustomerSelector, PriceArea, CouponCodeArea },
  data() {
    return {
      allInvoiceTypes: [], // 所有发票类型
      cardInfo: {
        checkStatus: '',
        amount: '',
        codeIdDetail: {},
        customerName: '',
        time: [],
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
      },
      suggestion: '',
      isAgree: '',
      checkName: '',
      createTime: '',
      rules: {},
      checkStatus: '1'
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {},
  methods: {
    doGet(res) {
      this.params.cardInfo.num = res
      this.$forceUpdate()
    },
    del(index) {
      this.list.splice(index, 1)
    },
    checkOrder() {
      const _this = this
      if (this.$route.query.orderNo) {
        cardcheckOrder({
          orderNo: this.$route.query.orderNo,
          agree: '1',
          suggestion: this.suggestion
        }).then(res => {
          _this.$message.success('审核成功')
          _this.closeTab(true)
          this.$router.push('/operation_center/gift_card/progress_order')
        })
      }
    },
    refund() {
      const _this = this
      if (this.$route.query.orderNo) {
        cardcheckOrder({
          orderNo: this.$route.query.orderNo,
          agree: '2',
          suggestion: this.suggestion
        }).then(res => {
          _this.$message.success('退回成功')
          _this.closeTab(true)
          this.$router.push('/operation_center/gift_card/progress_order')
        })
      }
    }
  },
  async created() {
    if (this.$route.query.orderNo) {
      const _this = this
      getCardOrderInfo(this.$route.query.orderNo).then(res => {
        // _this = res
        this.cardInfo = res.cardInfo
        this.invoiceInfo = res.invoiceInfo
        this.payInfo = res.payInfo
        _this.cardInfo.time = []
        _this.cardInfo.time.push(res.cardInfo.startTime)
        _this.cardInfo.time.push(res.cardInfo.endTime)
        // _this.checkStatus = res.cardInfo.checkStatus

        if (
          res.cardInfo.checkInfo &&
          res.cardInfo.checkInfo.suggestion !== 'null'
        ) {
          _this.suggestion = res.cardInfo.checkInfo.suggestion
          _this.isAgree = res.cardInfo.checkInfo.isAgree
          _this.checkName = res.cardInfo.checkInfo.checkName
          _this.createTime = res.cardInfo.checkInfo.createTime
        } else {
          _this.suggestion = ''
          _this.isAgree = ''
          _this.checkName = ''
          _this.createTime = ''
        }
        this.checkStatus = res.cardInfo.checkStatus
      })
    }
    this.allInvoiceTypes = await getInvoiceTypeList()
  }
}
</script>

<style scoped>
.el-dialog-title {
  text-align: center;
  font-size: 15px;
  /* background-color:gray; */
  padding-top: 10px;
}
.el-dialog-footer {
  font-size: 15px;
  color: orangered;
}
.el-dialog__header {
  padding: 0px;
}
.el-dialog__body {
  background-color: gray;
}
.el-dialog__footer {
  background-color: gray;
}
</style>
