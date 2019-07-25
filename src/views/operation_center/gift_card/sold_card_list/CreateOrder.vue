<template>
  <div class="app-container">
    <div v-for="(element , index) in list" :key="element.id">
      <el-card>
        <div slot="header">
          <span>业务人员：{{element.cardInfo.operator}}</span>
        </div>
        <el-form
          label-width="140px"
          label-position="left"
          style="width:1000px;"
          :model="element.cardInfo"
          :rules="rules"
          :ref="'formCard_'+element.id"
        >
          <el-form-item label="客户名称:" prop="customer">
            <customer-selector v-model="element.cardInfo.customer"></customer-selector>
          </el-form-item>
          <el-form-item label="电影卡种类" prop="type">
            <remote-select
              v-model="element.cardInfo.type"
              clearable
              placeholder="请选择电影卡种类"
              action="/systemApi/dict/getList"
              :query="{type:'cardType'}"
              style="width:230px;"
            ></remote-select>
          </el-form-item>
          <el-form-item label="电影卡类型" prop="style">
            <remote-select
              v-model="element.cardInfo.style"
              clearable
              placeholder="请选择电影卡类型"
              action="/systemApi/dict/getList"
              :query="{type:'cardStyle'}"
              style="width:230px;"
            ></remote-select>
          </el-form-item>
          <el-form-item label="电影卡号" prop="codeIdDetail">
            <coupon-code-area
              :outCheckId="doGet"
              v-model="element.cardInfo.codeIdDetail"
              :couponType="element.cardInfo.type"
              :couponStyle="element.cardInfo.style"
            ></coupon-code-area>
          </el-form-item>
          <el-form-item label="销售数量:" prop="num">
            <el-input
              v-model.trim="element.cardInfo.num"
              placeholder="0"
              style="width:100px;"
              disabled
            ></el-input>张
            <span style="margin-left:20px;color:red">系统已根据您所填写的号码段自动统计出销售数量!</span>
          </el-form-item>
          <el-form-item label="销售总额:" prop="amount">
            <el-input
              v-model.trim="element.cardInfo.amount"
              placeholder="0.00"
              style="width:100px;"
            ></el-input>元
            <span style="margin-left:20px;color:gray">只能是数值，且必须大于0</span>
          </el-form-item>
          <div>
            <el-form-item label="销售比例:" prop="scalePoint" style="display:inline-block">
              <el-input
                type="text"
                v-model="element.cardInfo.scalePrice"
                placeholder="票面金额单位元"
                style="width:100px;"
              ></el-input>
            </el-form-item>:
            <el-form-item prop="scalePoint" label-width="0px" style="display:inline-block">
              <el-input
                type="text"
                v-model="element.cardInfo.scalePoint"
                placeholder="卡内金额单位点"
                style="width:100px;"
              ></el-input>
            </el-form-item>
            <p style="margin-left:140px;margin-top:0;color:gray">销售的时候卡面金额与卡内点数的比例，默认1:10建议不修改！</p>
          </div>
          <el-form-item label="卡内金额" prop="unitPrice" style="display:inline-block">
            <el-input
              type="text"
              v-model="element.cardInfo.unitPrice"
              placeholder="0"
              style="width:100px;"
            ></el-input>元，折合卡内点数:
            <el-input
              type="text"
              disabled
              :value="element.cardInfo.unitPrice * element.cardInfo.scalePoint /element.cardInfo.scalePrice"
              placeholder="0"
              style="width:100px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="电影卡有效期:" prop="time">
            <el-date-picker
              unlink-panels
              v-model="element.cardInfo.time"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:320px;"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="margin-top:10px">
        <div slot="header">
          <span>发票与支付</span>
        </div>
        <el-form
          label-width="140px"
          label-position="left"
          style="width:1000px;"
          :model="element.invoiceInfo"
          :rules="rules"
          :ref="'formInvoiceInfo_'+element.id"
        >
          <el-form-item label="发票类型:" prop="invoiceType">
            <el-select v-model="element.invoiceInfo.invoiceType">
              <el-option
                v-for="invoiceType in allInvoiceTypes"
                :key="invoiceType.value"
                :value="invoiceType.value"
                :label="invoiceType.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <template
            v-if="element.invoiceInfo.invoiceType && element.invoiceInfo.invoiceType !== '1'"
          >
            <el-form-item label="发票抬头:" prop="title">
              <el-input
                v-model.trim="element.invoiceInfo.title"
                placeholder="输入发票抬头的信息"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <!-- 企业相关START -->
            <el-form-item
              label="税号:"
              prop="taxNo"
              v-if="element.invoiceInfo.invoiceType === '4' || element.invoiceInfo.invoiceType === '6' || element.invoiceInfo.invoiceType === '5'"
            >
              <el-input
                v-model.trim="element.invoiceInfo.taxNo"
                placeholder="请输入内容"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="企业地址:"
              prop="companyAddress"
              v-if="element.invoiceInfo.invoiceType === '6'"
            >
              <el-input
                v-model.trim="element.invoiceInfo.companyAddress"
                placeholder="请输入内容"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="电话号码:"
              prop="companyMobile"
              v-if="element.invoiceInfo.invoiceType === '6'"
            >
              <el-input
                v-model.trim="element.invoiceInfo.companyMobile"
                placeholder="请输入内容"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="开户银行:" prop="bank" v-if="element.invoiceInfo.invoiceType === '6'">
              <el-input
                v-model.trim="element.invoiceInfo.bank"
                placeholder="请输入内容"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="银行账号:"
              prop="bankNo"
              v-if="element.invoiceInfo.invoiceType === '6'"
            >
              <el-input
                v-model.trim="element.invoiceInfo.bankNo"
                placeholder="请输入内容"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <!-- 企业相关END -->
            <!-- 个人相关START -->
            <el-form-item
              label="身份证号:"
              prop="idNumber"
              v-if="element.invoiceInfo.invoiceType === '2' || element.invoiceInfo.invoiceType === '3'"
            >
              <el-input
                v-model.trim="element.invoiceInfo.idNumber"
                placeholder="输入索要发票人身份证号码"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <!-- 个人相关END -->
            <el-form-item
              label="电子邮箱:"
              prop="receiveEmail"
              v-if="element.invoiceInfo.invoiceType === '3' || element.invoiceInfo.invoiceType === '5'"
            >
              <el-input
                v-model.trim="element.invoiceInfo.receiveEmail"
                placeholder="输入索要发票人电子邮箱"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="发票领取:"
              prop="receiveType"
              v-if="element.invoiceInfo.invoiceType === '4' || element.invoiceInfo.invoiceType === '2' || element.invoiceInfo.invoiceType === '6'"
            >
              <el-select v-model="element.invoiceInfo.receiveType">
                <el-option value="1" label="邮寄包邮"></el-option>
                <el-option value="2" label="邮寄到付"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="收件人:"
              prop="receiveName"
              v-if="element.invoiceInfo.invoiceType === '4' || element.invoiceInfo.invoiceType === '2' || element.invoiceInfo.invoiceType === '6'"
            >
              <el-input
                v-model.trim="element.invoiceInfo.receiveName"
                placeholder="输入快递收件人姓名"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="联系电话:"
              prop="receiveMobile"
              v-if="element.invoiceInfo.invoiceType === '4' || element.invoiceInfo.invoiceType === '2' || element.invoiceInfo.invoiceType === '6'"
            >
              <el-input
                v-model.trim="element.invoiceInfo.receiveMobile"
                placeholder="输入快递收件人联系电话"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="收件地址:"
              prop="receiveAddress"
              v-if="element.invoiceInfo.invoiceType === '4' || element.invoiceInfo.invoiceType === '2' || element.invoiceInfo.invoiceType === '6'"
            >
              <el-input
                v-model.trim="element.invoiceInfo.receiveAddress"
                placeholder="输入快递收件人收件地址"
                style="width:200px;"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 付款方式 -->
          <el-form-item label="付款方式:" prop="payType">
            <el-radio-group v-model="element.invoiceInfo.payType">
              <el-radio label="1">银行收账</el-radio>
              <el-radio label="2">现金付款</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="销售备注:" prop="remark">
            <el-input v-model.trim="element.invoiceInfo.remark" type="textarea" :rows="5"></el-input>
          </el-form-item>
          <!-- <el-form-item v-if="index === list.length - 1" style="text-align:center;margin-top:20px">
                        <el-button type="primary" @click="addNew">继续添加销售</el-button>
                        <el-button v-if="index !== 0" type="primary" @click="del(index)" >删除此销售</el-button>
          </el-form-item>-->
        </el-form>
      </el-card>
    </div>
    <el-button style="margin-top:20px;" type="primary" @click="save" v-if="!look">保存</el-button>
    <el-button @click="closeTab">取消</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInvoiceTypeList, createCardOrder } from '@/api/operationCenter'
import CustomerSelector from '@/components/CustomerSelector'
import CouponTypeIdSelector from './CouponTypeIdSelector'
import PriceArea from './PriceArea'
import CouponCodeArea from './CouponCodeArea'
export default {
  name: 'gift_card_create_sold_card_order',
  components: {
    CustomerSelector,
    CouponTypeIdSelector,
    PriceArea,
    CouponCodeArea
  },
  data() {
    const checkTime = (rule, value, cb) => {
      if (!value || !value[0] || !value[1]) {
        cb(new Error('请选择电影卡有效时间'))
      }
      cb()
    }
    const checkArea = (rule, value, cb) => {
      value.map(e => {
        if (!e.left || !e.right) {
          cb(new Error('请填写完整电影券号区间'))
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
      //   allCardVariety: [], // 所有卡种
      allInvoiceTypes: [], // 所有发票类型
      channelList: [],
      time: [],
      query: {},
      list: [],
      percentage: 0, // 进度条进度
      params: {},
      listId: 0,
      rules: {
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
          {
            validator: betweenInt(1, 0),
            message: '卡内金额须大于0',
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
      scalePointLeft: 1,
      scalePointRight: 1
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    doGet(res) {
      this.list[0].cardInfo.num = res

      console.log(this.list[0].cardInfo.num)
      this.$forceUpdate()
      // this.list
    },
    del(index) {
      this.list.splice(index, 1)
    },
    save() {
      const promises = []
      for (let i = 0; i < this.list.length; i++) {
        const elementId = this.list[i].id
        const temp1 = this.$refs['formCard_' + elementId][0]
        const temp2 = this.$refs['formInvoiceInfo_' + elementId][0]
        promises.push(temp1.validate())
        promises.push(temp2.validate())
      }

      Promise.all(promises).then(valid => {
        if (valid) {
          this.list.forEach(e => {
            e.cardInfo.startTime = e.cardInfo.time[0]
            e.cardInfo.endTime = e.cardInfo.time[1]
            // delete e.id
            // delete e.time
          })
          this.list[0].cardInfo.num = this.list[0].cardInfo.num.toString()
          createCardOrder(this.list[0]).then(res => {
            this.$message.success('保存成功')
            this.closeTab(true)
            this.$router.push('/operation_center/gift_card/sold_card_list')
          })
        }
      })
    },
    addNew() {
      if (this.list.length === 3) {
        this.$message.warning(
          '本销售订单最多只能执行添加销售3次，也就是三个批次的电影卡，请先执行销售后再创建新的订单进行出售！'
        )
        return
      }
      const element = {}
      element.id = this.listId
      element.cardInfo = {}
      element.invoiceInfo = {}
      element.cardInfo.scalePrice = '1'
      element.cardInfo.scalePoint = '10'
      element.cardInfo.unitPrice = 0
      this.listId++
      this.list.push(element)
    }
  },
  async created() {
    // this.allCardVariety = await getVarietyTypeList()
    this.allInvoiceTypes = await getInvoiceTypeList()
    this.addNew()
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
