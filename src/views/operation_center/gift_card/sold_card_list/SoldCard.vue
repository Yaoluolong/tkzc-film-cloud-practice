<template>
  <div class="app-container">
    <el-steps
      :active="step"
      finish-status="success"
      process-status="wait"
      align-center
      style="margin-bottom:40px;"
    >
      <el-step title="销售基础信息" @click.native="stepButton(1)"></el-step>
      <el-step title="销售发票信息" @click.native="stepButton(2)"></el-step>
      <el-step title="销售付款方式" @click.native="stepButton(3)"></el-step>
    </el-steps>
    <!-- 销售电影基础设置 -->
    <el-card v-show="step===1" v-if="cardInfoLoaded || !$route.query.orderNo">
      <div slot="header">
        <span>销售电影卡基础信息，销售员：{{cardInfo.operator||name}}</span>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        :model="cardInfo"
        :rules="cardInfoRules"
        ref="cardInfoForm"
      >
        <el-form-item label="客户名称:" prop="customer">
          <customer-selector v-model="cardInfo.customer"></customer-selector>
        </el-form-item>
        <el-form-item label="电影卡种类" prop="type" style="display:inline-block;width: 450px;">
          <remote-select
            v-model="cardInfo.type"
            clearable
            placeholder="请选择电影卡种类"
            action="/systemApi/dict/getList"
            :query="{type:'cardType'}"
            style="width:230px;"
            @change="codeChangeFun"
          ></remote-select>
        </el-form-item>
        <el-form-item label="电影卡类型" prop="style" style="display:inline-block;width: 450px;">
          <remote-select
            v-model="cardInfo.style"
            clearable
            placeholder="请选择电影卡类型"
            action="/systemApi/dict/getList"
            :query="{type:'cardStyle'}"
            style="width:230px;"
            @change="codeChangeFun"
          ></remote-select>
        </el-form-item>
        <el-form-item label="电影卡号" prop="codeIdDetail" v-if="cardInfo.style==='Z'">
          <coupon-code-area
            :outCheckId="doGet"
            v-model="cardInfo.codeIdDetail"
            :orderNo="$route.query.orderNo"
            :couponType="cardInfo.type"
            :couponStyle="cardInfo.style"
          ></coupon-code-area>
        </el-form-item>
        <el-form-item label="销售数量:" prop="num">
          <el-input
            v-model.trim="cardInfo.num"
            placeholder="0"
            style="width:100px;"
            :disabled="cardInfo.style==='Z'||!cardInfo.style"
          ></el-input>张
          <span
            style="margin-left:20px;color:red"
            v-show="cardInfo.style==='Z'"
          >系统已根据您所填写的号码段自动统计出销售数量!</span>
        </el-form-item>
        <el-form-item label="销售总额:" prop="amount">
          <el-input v-model.trim="cardInfo.amount" placeholder="0.00" style="width:100px;"></el-input>元
          <span style="margin-left:20px;color:gray">只能是数值，且必须大于0</span>
        </el-form-item>
        <div>
          <el-form-item label="销售比例:" prop="scalePoint" style="display:inline-block">
            <el-input
              type="text"
              v-model="cardInfo.scalePrice"
              placeholder="票面金额单位元"
              style="width:100px;"
            ></el-input>
          </el-form-item>:
          <el-form-item prop="scalePoint" label-width="0px" style="display:inline-block">
            <el-input
              type="text"
              v-model="cardInfo.scalePoint"
              placeholder="卡内金额单位点"
              style="width:100px;"
            ></el-input>
          </el-form-item>
          <p style="margin-left:140px;margin-top:0;color:gray">销售的时候卡面金额与卡内点数的比例，默认1:10建议不修改！</p>
        </div>
        <el-form-item label="卡内金额" prop="unitPrice" style="display:inline-block">
          <el-input type="text" v-model="cardInfo.unitPrice" placeholder="0" style="width:100px;"></el-input>元，折合卡内点数:
          <el-input
            type="text"
            disabled
            :value="cardInfo.unitPrice * cardInfo.scalePoint /cardInfo.scalePrice || '0'"
            placeholder="0"
            style="width:100px;"
          ></el-input>点
        </el-form-item>
        <el-form-item label="电影卡有效期:" prop="time">
          <el-date-picker
            unlink-panels
            v-model="cardInfo.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:320px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="销售备注:">
          <el-input
            type="textarea"
            :row="5"
            v-model="cardInfo.remark"
            placeholder="请输入该销售单的销售备注信息,便于部门主管或者财务查看"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用说明:">
          <el-input
            type="textarea"
            :row="5"
            v-model="cardInfo.useExplain"
            placeholder="请输入该销售单内的电影券在使用的时候注意事项等信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button style="margin-top:20px;" type="primary" @click="cardInfoSave" v-if="!look">保存</el-button>
      <el-button style="margin-top:20px;" type="primary" @click="cardInfoNextStep" v-if="!look">下一步</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-card>
    <!-- 销售发票信息 -->
    <el-card v-show="step===2">
      <div slot="header">
        <span>销售发票信息</span>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        :model="invoiceInfo"
        :rules="invoiceInfoRules"
        ref="invoiceInfoForm"
      >
        <el-form-item label="发票类型:" prop="invoiceType">
          <el-select v-model="invoiceInfo.invoiceType" style="width:400px;">
            <el-option
              v-for="invoiceType in allInvoiceTypes"
              :key="invoiceType.value"
              :value="invoiceType.value"
              :label="invoiceType.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="invoiceInfo.invoiceType && invoiceInfo.invoiceType !== '1'">
          <el-form-item label="发票抬头:" prop="title">
            <el-input v-model.trim="invoiceInfo.title" placeholder="输入发票抬头的信息" style="width:200px;"></el-input>
          </el-form-item>
          <!-- 企业相关START -->
          <el-form-item
            label="税号:"
            prop="taxNo"
            v-if="invoiceInfo.invoiceType === '4' || invoiceInfo.invoiceType === '6' || invoiceInfo.invoiceType === '5'"
          >
            <el-input v-model.trim="invoiceInfo.taxNo" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="企业地址:" prop="companyAddress" v-if="invoiceInfo.invoiceType === '6'">
            <el-input
              v-model.trim="invoiceInfo.companyAddress"
              placeholder="请输入内容"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话号码:" prop="companyMobile" v-if="invoiceInfo.invoiceType === '6'">
            <el-input
              v-model.trim="invoiceInfo.companyMobile"
              placeholder="请输入内容"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户银行:" prop="bank" v-if="invoiceInfo.invoiceType === '6'">
            <el-input v-model.trim="invoiceInfo.bank" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="银行账号:" prop="bankNo" v-if="invoiceInfo.invoiceType === '6'">
            <el-input v-model.trim="invoiceInfo.bankNo" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <!-- 企业相关END -->
          <!-- 个人相关START -->
          <el-form-item
            label="身份证号:"
            prop="idNumber"
            v-if="invoiceInfo.invoiceType === '2' || invoiceInfo.invoiceType === '3'"
          >
            <el-input
              v-model.trim="invoiceInfo.idNumber"
              placeholder="输入索要发票人身份证号码"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <!-- 个人相关END -->
          <el-form-item
            label="电子邮箱:"
            prop="receiveEmail"
            v-if="invoiceInfo.invoiceType === '3' || invoiceInfo.invoiceType === '5'"
          >
            <el-input
              v-model.trim="invoiceInfo.receiveEmail"
              placeholder="输入索要发票人电子邮箱"
              style="width:200px;"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <el-button
        style="margin-top:20px;"
        type="primary"
        @click="invoiceInfoPrevStep"
        v-if="!look"
      >上一步</el-button>
      <el-button style="margin-top:20px;" type="primary" @click="invoiceInfoSave" v-if="!look">保存</el-button>
      <el-button
        style="margin-top:20px;"
        type="primary"
        @click="invoiceInfoNextStep"
        v-if="!look"
      >下一步</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-card>
    <!-- 销售付款方式 -->
    <el-card v-show="step===3">
      <div slot="header">
        <span>销售付款方式</span>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        :model="payInfo"
        :rules="payInfoRules"
        ref="payInfoForm"
      >
        <!-- 付款方式 -->
        <el-form-item label="付款方式:" prop="payType">
          <el-radio-group v-model="payInfo.payType">
            <el-radio label="1">银行收账</el-radio>
            <el-radio label="2">现金付款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转账银行:" prop="transferBank" v-if="payInfo.payType === '1'">
          <el-input
            v-model.trim="payInfo.transferBank"
            placeholder="请输入银行名称或账户"
            style="width:300px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="payInfo.payType==='1'?'转账金额:':'付款金额:'"
          prop="transferMoney"
          v-if="payInfo.payType"
        >
          <el-input v-model.trim="payInfo.transferMoney" placeholder="0.00" style="width:100px;"></el-input>元
        </el-form-item>
        <el-form-item
          :label="payInfo.payType==='1'?'转账人:':'付款人:'"
          prop="transferPeople"
          v-if="payInfo.payType"
        >
          <el-input
            v-model.trim="payInfo.transferPeople"
            placeholder="请输入转账人姓名"
            style="width:200px;"
          ></el-input>
        </el-form-item>
        <el-button style="margin-top:20px;" type="primary" @click="payInfoPrevStep" v-if="!look">上一步</el-button>
        <el-button style="margin-top:20px;" type="primary" @click="payInfoSave" v-if="!look">保存</el-button>
        <el-button style="margin-top:20px;" type="primary" @click="submitAudit" v-if="!look">提交审核</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getInvoiceTypeList,
  getCardOrderInfo,
  createCardOrder,
  updateCardOrder
} from '@/api/operationCenter'
import CustomerSelector from '@/components/CustomerSelector'
import CouponTypeIdSelector from './CouponTypeIdSelector'
import PriceArea from './PriceArea'
import CouponCodeArea from './CouponCodeArea'
import { isPositive } from '@/utils/validate'
export default {
  name: 'sold_card',
  components: {
    CustomerSelector,
    CouponTypeIdSelector,
    PriceArea,
    CouponCodeArea
  },
  data() {
    const checkNum = (rule, value, cb) => {
      if (!isPositive(value)) {
        cb(new Error('请填写正确数值'))
      }
      cb()
    }
    const checkTime = (rule, value, cb) => {
      if (!value || !value[0] || !value[1]) {
        cb(new Error('请选择电影卡有效时间'))
      }
      cb()
    }
    const checkArea = (rule, value, cb) => {
      value.map(e => {
        if (!e.left || !e.right) {
          cb(new Error('请填写完整电影卡号区间'))
        }
      })
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
      step: 1,
      stepOfEdit: 0,
      orderNo: '',
      allInvoiceTypes: [], // 所有发票类型
      time: [],
      percentage: 0, // 进度条进度
      listId: 0,
      cardInfo: {
        type: '1',
        scalePrice: 1,
        scalePoint: 10
      },
      invoiceInfo: {},
      payInfo: {},
      cardInfoRules: {
        customer: {
          required: true,
          message: '请输入营销客户',
          trigger: 'change'
        },
        type: {
          required: true,
          message: '请选择电影卡种类',
          trigger: 'change'
        },
        style: {
          required: true,
          message: '请选择电影卡类型',
          trigger: 'change'
        },
        num: { required: true, message: '请输入销售数量', trigger: 'blur' },
        codeIdDetail: [
          {
            required: true,
            message: '请填写完整电影券号区间',
            trigger: 'blur'
          },
          {
            validator: checkArea,
            message: '请填写完整电影券号区间',
            trigger: 'blur'
          }
        ],
        unitPrice: [
          { required: true, message: '请输入卡内金额', trigger: 'blur' },
          { validator: checkNum, message: '卡内金额须大于0', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入销售总额', trigger: 'blur' },
          {
            validator: betweenInt(2, 0, 100000000),
            message: '销售总额须大于0',
            trigger: 'blur'
          }
        ],
        time: { required: true, validator: checkTime, trigger: 'blur' }
      },
      invoiceInfoRules: {
        invoiceType: {
          required: true,
          message: '请输入发票类型',
          trigger: 'blur'
        },
        title: { required: true, message: '请输入发票抬头', trigger: 'blur' },
        taxNo: { required: true, message: '请输入税号', trigger: 'blur' },
        companyAddress: {
          required: true,
          message: '请输入企业地址',
          trigger: 'blur'
        },
        companyMobile: {
          required: true,
          message: '请输入电话号码',
          trigger: 'blur'
        },
        bank: { required: true, message: '请输入开户银行', trigger: 'blur' },
        bankNo: { required: true, message: '请输入银行账好', trigger: 'blur' }
      },
      payInfoRules: {
        payType: {
          required: true,
          message: '请选择付款方式种类',
          trigger: 'blur'
        }
      },
      scalePointLeft: 1,
      scalePointRight: 1,
      cardInfoLoaded: false
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    codeChangeFun() {
      this.$set(this.cardInfo, 'codeIdDetail', [{ left: '', right: '' }])
    },
    stepButton(thisStep) {
      if (this.$route.query.orderNo && thisStep <= this.stepOfEdit) {
        this.$set(this, 'step', thisStep)
      }
    },
    doGet(res) {
      this.cardInfo.num = res
      this.$forceUpdate()
    },
    stepApi(bool, step) {
      // 新增编辑接口
      const apiTemp = this.$route.query.orderNo
        ? updateCardOrder
        : createCardOrder
      let apiParamsTemp = {}
      switch (step) {
        case 1:
          apiParamsTemp = this.$route.query.orderNo
            ? {
              step: 1,
              cardInfo: this.cardInfo,
              orderNo: this.$route.query.orderNo
            }
            : { step: 1, cardInfo: this.cardInfo, orderNo: this.orderNo }
          break
        case 2:
          apiParamsTemp = this.$route.query.orderNo
            ? {
              step: 2,
              invoiceInfo: this.invoiceInfo,
              orderNo: this.$route.query.orderNo
            }
            : { step: 2, invoiceInfo: this.invoiceInfo, orderNo: this.orderNo }
          break
        case 3:
          apiParamsTemp = this.$route.query.orderNo
            ? {
              step: 3,
              payInfo: this.payInfo,
              orderNo: this.$route.query.orderNo
            }
            : { step: 3, payInfo: this.payInfo, orderNo: this.orderNo }
          break
      }

      apiTemp(apiParamsTemp)
        .then(res => {
          if (step === 1) {
            this.orderNo = res
          }
          this.successBackTip(bool)
        })
        .catch(e => {})
    },
    successBackTip(bool) {
      // 保存和下一步 成功后输出的内容
      if (bool) {
        this.$message.success('保存成功')
      } else {
        this.step++
      }
    },
    cardInfoSave() {
      this.$refs['cardInfoForm'].validate(valid => {
        if (valid) {
          this.$set(this.cardInfo, 'startTime', this.cardInfo.time[0])
          this.$set(this.cardInfo, 'endTime', this.cardInfo.time[1])

          if (this.cardInfo.num) {
            this.cardInfo.num = this.cardInfo.num.toString()
          }
          this.cardInfo.scalePoint = this.cardInfo.scalePoint.toString()
          this.cardInfo.scalePrice = this.cardInfo.scalePrice.toString()
          this.stepApi(true, 1)
        }
      })
    },
    cardInfoNextStep() {
      this.$refs['cardInfoForm'].validate(valid => {
        if (valid) {
          this.$set(this.cardInfo, 'startTime', this.cardInfo.time[0])
          this.$set(this.cardInfo, 'endTime', this.cardInfo.time[1])

          if (this.cardInfo.num) {
            this.cardInfo.num = this.cardInfo.num.toString()
          }
          this.cardInfo.scalePoint = this.cardInfo.scalePoint.toString()
          this.cardInfo.scalePrice = this.cardInfo.scalePrice.toString()
          this.stepApi(false, 1)
        }
      })
    },
    invoiceInfoPrevStep() {
      this.$set(this, 'step', 1)
    },
    invoiceInfoSave() {
      this.$refs.invoiceInfoForm.validate(valid => {
        if (valid) {
          this.stepApi(true, 2)
        }
      })
    },
    invoiceInfoNextStep() {
      this.$refs.invoiceInfoForm.validate(valid => {
        if (valid) {
          this.stepApi(false, 2)
        }
      })
    },
    payInfoPrevStep() {
      this.$set(this, 'step', 2)
    },
    payInfoSave() {
      this.$refs.payInfoForm.validate(valid => {
        if (valid) {
          this.stepApi(true, 3)
        }
      })
    },
    submitAudit() {
      const orderNo = this.orderNo ? this.orderNo : this.$route.query.orderNo
      updateCardOrder({
        step: 3,
        payInfo: this.payInfo,
        orderNo: orderNo,
        checkStatus: '1'
      }).then(res => {
        this.$message.success('提交审核成功')
        this.closeTab(true)
        // this.$router.push('/operation_center/gift_card/sold_card_list')
      })
    },
    cancel() {
      this.closeTab(true)
      // this.$router.push('/operation_center/gift_card/sold_card_list')
    }
  },
  async created() {
    if (this.$route.query.orderNo) {
      const _this = this
      getCardOrderInfo(this.$route.query.orderNo).then(res => {
        _this.step = parseInt(res.cardInfo.step)
        _this.stepOfEdit = parseInt(res.cardInfo.step)
        _this.$set(_this, 'cardInfo', res.cardInfo)

        _this.$set(_this.cardInfo, 'time', [])
        _this.cardInfo.time.push(res.cardInfo.startTime)
        _this.cardInfo.time.push(res.cardInfo.endTime)

        !res.invoiceInfo || _this.$set(_this, 'invoiceInfo', res.invoiceInfo)
        res.payInfo.length === 0
          ? _this.$set(_this, 'payInfo', {})
          : _this.$set(_this, 'payInfo', res.payInfo)

        this.cardInfoLoaded = true
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