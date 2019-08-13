<template>
  <div class="app-container">
    <el-card style="margin-bottom:20px">
      <div slot="header">
        <span>销售电影券基础信息，销售员：{{couponInfo.operator}}</span>
      </div>
      <el-form
        label-width="160px"
        label-position="right"
        style="width:1000px;"
        :model="couponInfo"
        :rules="rules"
        ref="formCard"
      >
        <el-form-item label="客户名称:" prop="customer">
          <span>{{couponInfo.customerName}}</span>
        </el-form-item>
        <div>
          <el-form-item label="电影券种类" prop="type" style="display:inline-block;width: 450px;">
            <span>{{couponInfo.typeName}}</span>
          </el-form-item>
          <el-form-item label="电影券类型" prop="style" style="display:inline-block;width: 450px;">
            <span>{{couponInfo.styleName}}</span>
          </el-form-item>
        </div>
        <el-form-item label="电影券号" v-if="couponInfo.style==='Z'">
          <div v-for="(item,index) in couponInfo.codeIdDetail" :key="index">
            <span>{{item.left}}</span>
            <span>－－</span>
            <span>{{item.right}}</span>
          </div>
        </el-form-item>
        <el-form-item label="销售数量:" prop="num">
          <span>{{couponInfo.num}}</span>
          张
          <!-- <span style="margin-left:20px;color:red">系统已根据您所填写的号码段自动统计出销售数量!</span> -->
        </el-form-item>
        <el-form-item label="销售总额:" prop="amount">
          <span>{{couponInfo.amount}}</span> 元
          <!-- <span style="margin-left:20px;color:gray">只能是数值，且必须大于0</span>  -->
        </el-form-item>
        <el-form-item label="销售单价:" prop="unitPrice">
          <span>{{couponInfo.unitPrice|| '--'}}</span> 元
        </el-form-item>
        <el-form-item label="电影券有效期:" prop="time">{{couponInfo.startTime}} 至 {{couponInfo.endTime}}</el-form-item>
        <el-form-item label="兑换面值:" v-if="couponInfo.type==='1' || couponInfo.type==='3'">
          <span>{{couponInfo.priceRuleStr}}</span>
        </el-form-item>
        <el-form-item label="优惠方式:" prop="discountType" v-if="couponInfo.type==='2'">
          <!-- <el-radio-group v-model="couponInfo.discountType">
                      <el-radio label="1" disabled>不限额优惠</el-radio>
                      <el-radio label="2" disabled>满减优惠</el-radio>
          </el-radio-group>-->
          <span v-if="couponInfo.discountType==='1'">不限额优惠</span>
          <span v-else>满减优惠</span>
        </el-form-item>
        <el-form-item
          label="优惠影片面值:"
          prop="canFreePrice"
          v-if="couponInfo.type=='2' && couponInfo.discountType=='1'"
        >
          <span>{{couponInfo.canFreePrice}}</span>元
        </el-form-item>
        <el-form-item label="销售备注:">
          <!-- <el-input clearable type="textarea" :row="5" v-model="couponInfo.remark" disabled></el-input> -->
          <span>{{couponInfo.remark}}</span>
        </el-form-item>
        <el-form-item label="使用说明:">
          <!-- <el-input clearable type="textarea" :row="5" v-model="couponInfo.useExplain" disabled></el-input> -->
          <span>{{couponInfo.useExplain}}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-bottom:20px">
      <div slot="header">
        <span>使用规则</span>
      </div>
      <el-form
        label-width="160px"
        label-position="right"
        style="width:1000px;"
        :model="programInfo"
      >
        <el-form-item label="规则名称:">
          <span>{{programInfo.name}}</span>
        </el-form-item>
        <el-form-item label="不可用场次时段:">
          <span>{{programInfo.dateLimitType==='1'?'不限制':'指定时间'}}</span>
        </el-form-item>
        <el-form-item label="不可用场次时段区间:" v-if="programInfo.dateLimitType==='2'">
          <span>{{programInfo.startTime}} -- {{programInfo.endTime}}</span>&emsp;
          <span v-if="programInfo.timeType==='day'">每天</span>
          <span v-else-if="programInfo.timeType==='week'">每周</span>
          <span v-else>不限制</span>
          <span v-if="programInfo.timeType==='week'">{{week}}</span>&emsp;
          <span>{{programInfo.stime}} -- {{programInfo.etime}}</span>
        </el-form-item>
        <el-form-item label="可用商家:">
          <div v-for="(channel,index) in programInfo.channelList" :key="index">
            <div>{{channel.name}}</div>
          </div>
        </el-form-item>
        <el-form-item label="可用影院:" prop="cinemaGroupId">
          <div>{{programInfo.cinemaGroupName}}</div>
        </el-form-item>
        <div v-for="(rule,index) in programInfo.ruleList" :key="rule.key">
          <el-form-item label="兑换方式：" :prop="'ruleList.'+index+'.settlementType'">
            <span v-if="rule.settlementType==='1'">根据影厅</span>
            <span v-else-if="rule.settlementType==='2'">根据制式</span>
            <span v-else-if="rule.settlementType==='3'">根据影片</span>
          </el-form-item>
          <el-form-item
            label="选择影厅："
            :prop="'ruleList.'+index+'.hallType'"
            v-if="programInfo.cinemaGroupId && rule.settlementType === '1'"
            style="width:300px;"
          >
            <span>{{rule.hallTypeName}}</span>
          </el-form-item>
          <el-form-item
            label="选择制式："
            :prop="'ruleList.'+index+'.standard'"
            v-if="programInfo.cinemaGroupId && rule.settlementType === '2'"
          >
            <span>{{rule.standard}}</span>
          </el-form-item>
          <el-form-item
            label="选择影片："
            :prop="'ruleList.'+index+'.filmId'"
            v-if="rule.settlementType === '3'"
          >
            <el-radio v-model="rule.filmType" label="-1" disabled>全部影片</el-radio>
            <el-radio v-model="rule.filmType" label="1" disabled>指定影片</el-radio>
            <div
              style="border:1px solid #ebeef5;width:800px;padding: 10px 20px;"
              v-if="rule.filmType === '1'"
            >
              <div v-for="(v,i) in rule.filmList" :key="i">
                影片名称：
                <span>{{v.name}}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="补差类型："
            v-if="couponInfo.type === '3'"
          >{{rule.diffType==='1'?'差额补差':'固定补差'}}</el-form-item>
          <!-- <el-form-item label="设定补差：" v-if="rule.diffType==='1'">
                影票价格{{couponInfo.priceRuleStr}}元时，需补差价=影票价格-{{couponInfo.priceRuleMoney}}元
          </el-form-item>-->
          <!-- 根据影厅 补差类型:固定补差 -->
          <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '1'">
            <div
              v-for="(item,value) in diffRuleArr"
              :key="value"
            >影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元</div>
          </el-form-item>
          <!-- 根据制式 补差类型:固定补差 -->
          <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '2'">
            <div v-for="(item,value) in diffRuleArr" :key="value">
              <div>{{item.name}}影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元</div>
            </div>
          </el-form-item>
          <!-- 根据影片 补差类型:固定补差 -->
          <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '3'">
            <div v-for="(item,value) in diffRuleArr" :key="value">
              <div>
                {{item.name}}
                <span v-if="item.name">&emsp;&emsp;</span>
                影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-card style="margin-bottom:20px">
      <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
        <el-form
          label-width="140px"
          label-position="right"
          style="width:1000px;"
          v-show="$route.query.checkStatus=='1'"
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
          v-show="$route.query.checkStatus!=='1'"
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
      v-show="$route.query.checkStatus=='1'"
    >同意</el-button>
    <el-button type="primary" @click="refund" v-show="$route.query.checkStatus=='1'">退回</el-button>
    <el-button @click="closeTab" v-show="$route.query.checkStatus=='1'">取消</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import StandardSelector from '@/views/operation_center/coupon_mgr/sold_coupon_list/StandardSelector'
import FilmSelector from '@/components/FilmSelector'
import { getCouponOrderInfo, couponcheckOrder } from '@/api/operationCenter'
export default {
  name: 'sold_coupon_detail',
  components: { StandardSelector, FilmSelector },
  data() {
    return {
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
        unitPrice: '',
        remark: '',
        useExplain: ''
      },
      programInfo: {},
      week: '',
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
      invoiceType: '',
      diffRuleArr: [],
      rules: {
        remark: { required: true, message: '请输入销售备注', trigger: 'blur' }
      }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {},
  methods: {
    checkOrder() {
      const _this = this
      if (this.$route.query.orderNo) {
        couponcheckOrder({
          orderNo: this.$route.query.orderNo,
          agree: '1',
          suggestion: this.suggestion
        }).then(res => {
          _this.$message.success('审核成功')
          _this.closeTab()
          this.$router.push('/operation_center/coupon_mgr/progress_order')
        })
      }
    },
    refund() {
      const _this = this
      if (this.$route.query.orderNo) {
        couponcheckOrder({
          orderNo: this.$route.query.orderNo,
          agree: '2',
          suggestion: this.suggestion
        }).then(res => {
          _this.$message.success('退回成功')
          _this.closeTab()
          this.$router.push('/operation_center/coupon_mgr/progress_order')
        })
      }
    }
  },
  async created() {
    if (this.$route.query.orderNo) {
      const _this = this
      getCouponOrderInfo(this.$route.query.orderNo).then(res => {
        _this.params = res
        _this.couponInfo = res.couponInfo
        _this.invoiceInfo = res.invoiceInfo
        _this.programInfo = res.programInfo

        if (_this.programInfo.week.length > 0) {
          const weekTemp = _this.programInfo.week.split(',')
          weekTemp.map(e => {
            switch (e) {
              case '1':
                this.week += '周一' + ','
                break
              case '2':
                this.week += '周二' + ','
                break
              case '3':
                this.week += '周三' + ','
                break
              case '4':
                this.week += '周四' + ','
                break
              case '5':
                this.week += '周五' + ','
                break
              case '6':
                this.week += '周六' + ','
                break
              case '0':
                this.week += '周日' + ','
                break
            }
          })
        }

        this.week = this.week.substr(0, this.week.length - 1)

        if (
          _this.programInfo.ruleList[0] &&
          _this.programInfo.ruleList[0].filmId !== '-1'
        ) {
          _this.$set(_this.programInfo.ruleList[0], 'filmType', '1')
        } else {
          _this.$set(_this.programInfo.ruleList[0], 'filmType', '-1')
        }

        if (
          res.couponInfo.checkInfo &&
          res.couponInfo.checkInfo.suggestion !== 'null'
        ) {
          _this.suggestion = res.couponInfo.checkInfo.suggestion
          _this.isAgree = res.couponInfo.checkInfo.isAgree
          _this.checkName = res.couponInfo.checkInfo.checkName
          _this.createTime = res.couponInfo.checkInfo.createTime
        } else {
          _this.suggestion = ''
          _this.isAgree = ''
          _this.checkName = ''
          _this.createTime = ''
        }

        if (
          _this.programInfo.ruleList[0].settlementType === '1' &&
          _this.programInfo.ruleList[0].diffType === '2'
        ) {
          Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
            this.diffRuleArr.push({
              name: e,
              value: _this.programInfo.ruleList[0].diffRule[e]
            })
          })
        } else if (
          _this.programInfo.ruleList[0].settlementType === '3' &&
          _this.programInfo.ruleList[0].diffType === '2' &&
          _this.programInfo.ruleList[0].filmId !== '-1'
        ) {
          _this.programInfo.ruleList[0].filmList.forEach(el => {
            Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
              if (el.value === e) {
                this.diffRuleArr.push({
                  name: el.name,
                  value: _this.programInfo.ruleList[0].diffRule[e]
                })
              }
            })
          })
        } else if (
          _this.programInfo.ruleList[0].settlementType === '3' &&
          _this.programInfo.ruleList[0].diffType === '2' &&
          _this.programInfo.ruleList[0].filmId === '-1'
        ) {
          Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
            this.diffRuleArr.push({
              name: '',
              value: _this.programInfo.ruleList[0].diffRule[e]
            })
          })
        } else if (
          _this.programInfo.ruleList[0].settlementType === '2' &&
          _this.programInfo.ruleList[0].diffType === '2'
        ) {
          Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
            this.diffRuleArr.push({
              name: e,
              value: _this.programInfo.ruleList[0].diffRule[e]
            })
          })
        }
      })
    }
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
