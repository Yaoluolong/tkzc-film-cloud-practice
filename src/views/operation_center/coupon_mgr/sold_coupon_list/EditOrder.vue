<template>
  <div class="app-container">
    <el-card v-if="ok">
      <div slot="header">
        <span>业务人员：{{name}}</span>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        :model="couponInfo"
        :rules="rules"
        ref="formCard"
      >
        <el-form-item label="营销客户:" prop="customer">
          <customer-selector v-model="couponInfo.customer"></customer-selector>
        </el-form-item>
        <el-form-item label="电影券种类" prop="type">
          <remote-select
            v-model="couponInfo.type"
            clearable
            placeholder="请选择电影券种类"
            action="/systemApi/dict/getList"
            :query="{type:'couponType'}"
            style="width:230px;"
          ></remote-select>
        </el-form-item>
        <el-form-item label="电影券类型" prop="style">
          <remote-select
            v-model="couponInfo.style"
            clearable
            placeholder="请选择电影券类型"
            action="/systemApi/dict/getList"
            :query="{type:'couponStyle'}"
            style="width:230px;"
          ></remote-select>
        </el-form-item>
        <el-form-item label="电影券号" prop="codeIdDetail">
          <coupon-code-area
            :outCheckId="doGet"
            v-model="couponInfo.codeIdDetail"
            :couponType="couponInfo.type"
            :couponStyle="couponInfo.style"
            :orderNo="$route.query.orderNo"
          ></coupon-code-area>
        </el-form-item>
        <el-form-item label="销售数量:" prop="num">
          <el-input v-model.trim="couponInfo.num" placeholder="0" style="width:100px;" disabled></el-input>张
          <span style="margin-left:20px;color:red">系统已根据您所填写的号码段自动统计出销售数量!</span>
        </el-form-item>
        <el-form-item label="销售总额:" prop="amount">
          <el-input v-model.trim="couponInfo.amount" placeholder="0.00" style="width:100px;"></el-input>元
          <span style="margin-left:20px;color:gray">只能是数值，且必须大于0</span>
        </el-form-item>
        <el-form-item label="销售单价:">
          <el-input v-model.trim="couponInfo.unitPrice" placeholder="0.00" style="width:100px;"></el-input>元
          <span style="margin-left:20px;color:gray">只能是数值，限2位小数</span>
        </el-form-item>
        <el-form-item label="电影券有效期:" prop="time">
          <el-date-picker
            unlink-panels
            v-model="couponInfo.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:320px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="可兑换影片售价区间:"
          label-width="160px;"
          v-if="couponInfo.type==1"
          prop="priceRule"
        >
          <price-area v-model="couponInfo.priceRule"></price-area>
        </el-form-item>

        <el-form-item
          label="可优惠电影售价:"
          prop="canFreePrice"
          label-width="150px;"
          v-if="couponInfo.type==2"
        >
          <el-input v-model.trim="couponInfo.canFreePrice" placeholder="0.00" style="width:100px;"></el-input>元
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px" v-if="ok && ok1">
      <div slot="header">
        <span>发票与支付</span>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        :model="invoiceInfo"
        :rules="rules"
        ref="formInvoiceInfo"
      >
        <el-form-item label="发票类型:" prop="invoiceType">
          <el-select v-model="invoiceInfo.invoiceType">
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
          <el-form-item
            label="发票领取:"
            prop="receiveType"
            v-if="invoiceInfo.invoiceType === '4' || invoiceInfo.invoiceType === '2' || invoiceInfo.invoiceType === '6'"
          >
            <el-select v-model="invoiceInfo.receiveType">
              <el-option value="1" label="邮寄包邮"></el-option>
              <el-option value="2" label="邮寄到付"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="收件人:"
            prop="receiveName"
            v-if="invoiceInfo.invoiceType === '4' || invoiceInfo.invoiceType === '2' || invoiceInfo.invoiceType === '6'"
          >
            <el-input
              v-model.trim="invoiceInfo.receiveName"
              placeholder="输入快递收件人姓名"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系电话:"
            prop="receiveMobile"
            v-if="invoiceInfo.invoiceType === '4' || invoiceInfo.invoiceType === '2' || invoiceInfo.invoiceType === '6'"
          >
            <el-input
              v-model.trim="invoiceInfo.receiveMobile"
              placeholder="输入快递收件人联系电话"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="收件地址:"
            prop="receiveAddress"
            v-if="invoiceInfo.invoiceType === '4' || invoiceInfo.invoiceType === '2' || invoiceInfo.invoiceType === '6'"
          >
            <el-input
              v-model.trim="invoiceInfo.receiveAddress"
              placeholder="输入快递收件人收件地址"
              style="width:200px;"
            ></el-input>
          </el-form-item>
        </template>
        <!-- 付款方式 -->
        <el-form-item label="付款方式:" prop="payType">
          <el-radio-group v-model="invoiceInfo.payType">
            <el-radio label="1">银行收账</el-radio>
            <el-radio label="2">现金付款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="销售备注:" prop="remark">
          <el-input v-model.trim="invoiceInfo.remark" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-button style="margin-top:20px;" type="primary" @click="save">保存</el-button>
    <el-button @click="closeTab">取消</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getInvoiceTypeList,
  getCouponOrderInfo,
  updateCouponOrder
} from '@/api/operationCenter'
import CustomerSelector from '@/components/CustomerSelector'
import PriceArea from './PriceArea'
import CouponCodeArea from './CouponCodeArea'
export default {
  name: 'edit_order',
  components: { CustomerSelector, PriceArea, CouponCodeArea },
  data() {
    const checkTime = (rule, value, cb) => {
      if (!value || !value[0] || !value[1]) {
        cb(new Error('请选择电影券有效时间'))
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
    const checkArea = (rule, value, cb) => {
      value.map(e => {
        if (!e.left || !e.right) {
          cb(new Error('请填写完整电影券号区间'))
        }
      })
      cb()
    }
    const checkPriceArea = (rule, value, cb) => {
      Object.keys(value).forEach(function(key) {
        const isInt = /^[0-9]+$/.test(value[key])
        if (!value[key] || !isInt) {
          cb(new Error('请填写完整可兑换影片售价区间'))
        }
      })
      cb()
    }
    return {
      allInvoiceTypes: [], // 所有发票类型
      time: [],
      // params: {},
      couponInfo: {},
      invoiceInfo: {},
      rules: {
        customer: {
          required: true,
          message: '请输入营销客户',
          trigger: 'change'
        },
        type: {
          required: true,
          message: '请选择电影券种类',
          trigger: 'change'
        },
        style: {
          required: true,
          message: '请选择电影券类型',
          trigger: 'change'
        },
        // cardTypeId: { required: true, message: '请选择卡名称', trigger: 'change' },
        num: [
          { required: true, message: '请输入销售数量', trigger: 'blur' },
          {
            validator: betweenInt(1, 0),
            message: '销售数量须大于0',
            trigger: 'blur'
          }
        ],
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
        priceRule: [
          {
            required: true,
            message: '请填写完整可兑换影片售价区间',
            trigger: 'blur'
          },
          {
            validator: checkPriceArea,
            message: '请填写可兑换影片售价区间',
            trigger: 'blur'
          }
        ],
        canFreePrice: [
          {
            required: true,
            message: '请输入可优惠电影电影售价',
            trigger: 'blur'
          },
          {
            validator: betweenInt(1, 0),
            message: '须是大于0的数值',
            trigger: 'blur'
          }
        ],
        amount: [
          { required: true, message: '请输入销售总额', trigger: 'blur' },
          {
            validator: betweenInt(2, 0, 100000000),
            message: '销售总额须大于0',
            trigger: 'blur'
          }
        ],
        time: { required: true, validator: checkTime, trigger: 'blur' },

        invoiceType: {
          required: true,
          message: '请选择发票类型',
          trigger: 'change'
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
        bankNo: { required: true, message: '请输入银行账号', trigger: 'blur' },
        idNumber: {
          required: true,
          message: '请输入身份证号',
          trigger: 'blur'
        },
        receiveEmail: {
          required: true,
          message: '请输入电子邮箱',
          trigger: 'blur'
        },
        receiveType: {
          required: true,
          message: '请选择发票领取',
          trigger: 'change'
        },
        receiveName: {
          required: true,
          message: '请输入收件人',
          trigger: 'blur'
        },
        receiveMobile: {
          required: true,
          message: '请输入联系电话',
          trigger: 'blur'
        },
        receiveAddress: {
          required: true,
          message: '请输入收件地址',
          trigger: 'blur'
        },
        payType: {
          required: true,
          message: '请选择付款方式',
          trigger: 'change'
        },
        remark: { required: true, message: '请输入销售备注', trigger: 'blur' }
      },
      ok: false,
      ok1: false
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  // watch: {
  //   'couponInfo.customer'(val, oldval) {
  //     this.$nextTick(() => {
  //       this.$set(this.couponInfo, 'customer', val)
  //     })
  //   }
  // },
  methods: {
    doGet(res) {
      this.couponInfo.num = res
      this.$forceUpdate()
    },
    del(index) {
      this.list.splice(index, 1)
    },
    save() {
      const temp1 = this.$refs['formCard']
      const temp2 = this.$refs['formInvoiceInfo']
      const promises = []
      promises.push(temp1.validate())
      promises.push(temp2.validate())

      Promise.all(promises).then(valid => {
        if (valid) {
          this.couponInfo.startTime = this.couponInfo.time[0]
          this.couponInfo.endTime = this.couponInfo.time[1]
          this.couponInfo.num = this.couponInfo.num.toString()
          const temp = {}
          temp.couponInfo = this.couponInfo
          temp.invoiceInfo = this.invoiceInfo

          if (this.$route.query.orderNo) {
            temp.orderNo = this.$route.query.orderNo
            updateCouponOrder(temp).then(res => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.closeTab(true)
              this.$router.push('/operation_center/coupon_mgr/sold_coupon_list')
            })
          }
        }
      })
    }
  },
  async created() {
    if (this.$route.query.orderNo) {
      const _this = this
      getCouponOrderInfo(this.$route.query.orderNo).then(res => {
        _this.$set(_this, 'couponInfo', res.couponInfo)
        _this.$set(_this, 'invoiceInfo', res.invoiceInfo)
        _this.$set(_this.couponInfo, 'time', [])
        // _this.$set(_this, 'customer', _this.couponInfo.customer)
        _this.couponInfo.time.push(res.couponInfo.startTime)
        _this.couponInfo.time.push(res.couponInfo.endTime)
        if (_this.couponInfo.canFreePrice) {
          _this.couponInfo.priceRule = { gt: '0', lt: '0' }
        }
        console.log(_this.couponInfo, 8)
        _this.ok = true
      })
    }
    this.allInvoiceTypes = await getInvoiceTypeList()
    this.ok1 = true
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
