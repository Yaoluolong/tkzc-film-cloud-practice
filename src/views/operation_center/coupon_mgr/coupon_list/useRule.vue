<template >
    <el-card class="mt10">
          <div slot="header">
              <span>使用规则</span>
          </div>
          <el-form label-width="160px" label-position="right" style="width:1000px;" :model="programInfo">
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
            <el-form-item label="可用影院:" prop="cinemaGroupId" >
              <div>{{programInfo.cinemaGroupName}}</div>
            </el-form-item>
            <div v-for="(rule,index) in programInfo.ruleList" :key="rule.key">
              <el-form-item label="兑换方式："  :prop="'ruleList.'+index+'.settlementType'">
                 <span v-if="rule.settlementType==='1'">根据影厅</span>
                 <span v-else-if="rule.settlementType==='2'">根据制式</span>
                 <span v-else-if="rule.settlementType==='3'">根据影片</span>
              </el-form-item>
              <el-form-item label="选择影厅："  :prop="'ruleList.'+index+'.hallType'" v-if="programInfo.cinemaGroupId && rule.settlementType === '1'" style="width:300px;">
                 <span>{{rule.hallTypeName}}</span>
              </el-form-item>
              <el-form-item label="选择制式：" :prop="'ruleList.'+index+'.standard'" v-if="programInfo.cinemaGroupId && rule.settlementType === '2'">
                  <span>{{rule.standard}}</span>
              </el-form-item>
              <el-form-item label="选择影片：" :prop="'ruleList.'+index+'.filmId'" v-if="rule.settlementType === '3'">
                <el-radio v-model="rule.filmType" label="-1" disabled>全部影片</el-radio>
                <el-radio v-model="rule.filmType" label="1" disabled>指定影片</el-radio>
                <div style="border:1px solid #ebeef5;width:800px;padding: 10px 20px;" v-if="rule.filmType === '1'">
                  <div v-for="(v,i) in rule.filmList" :key="i">
                    影片名称：<span>{{v.name}}</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="补差类型：" v-if="couponInfo.type === '3'">
                {{rule.diffType==='1'?'差额补差':'固定补差'}}
              </el-form-item>
              <!-- <el-form-item label="设定补差：" v-if="rule.diffType==='1'">
                影票价格{{couponInfo.priceRuleStr}}元时，需补差价=影票价格-{{couponInfo.priceRuleMoney}}元
              </el-form-item> -->
              <!-- 根据影厅 补差类型:固定补差 -->
              <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '1'"> 
                <div v-for="(item,value) in diffRuleArr" :key="value"> 
                  影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元
                </div>
              </el-form-item>
              <!-- 根据制式 补差类型:固定补差 -->
              <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '2'" >
                <div v-for="(item,value) in diffRuleArr" :key="value">
                  <div>{{item.name}}影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元</div>
                </div>                  
              </el-form-item>
              <!-- 根据影片 补差类型:固定补差 -->
              <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '3'" >
                <div v-for="(item,value) in diffRuleArr" :key="value">
                  <div>{{item.name}}<span v-if="item.name">&emsp;&emsp;</span>影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元</div>
                </div>
              </el-form-item>      
            </div>
          </el-form>
        </el-card>
</template>
<script>
import { getCouponOrderInfo } from '@/api/operationCenter'
export default {
  props: {
    orderNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      programInfo: {},
      couponInfo: {},
      week: ''
    }
  },
  watch: {
    orderNo(value) {
      if (value) this.queryInitTable(value)
    }
  },
  created() {
    if (this.orderNo) this.queryInitTable(this.orderNo)
  },
  methods: {
    async queryInitTable(orderNo) {
      const temp = await getCouponOrderInfo(orderNo)
      this.couponInfo = temp.couponInfo
      //   this.data = temp.list
      //   this.invoiceInfo = temp.invoiceInfo
      //   this.payInfo = temp.payInfo.length !== 0 ? temp.payInfo : {}

      const _this = this
      _this.programInfo = temp.programInfo

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

      if (temp.couponInfo.checkInfo && temp.couponInfo.checkInfo.suggestion !== 'null') {
        _this.suggestion = temp.couponInfo.checkInfo.suggestion
      } else {
        _this.suggestion = ''
      }

      this.week = this.week.substr(0, this.week.length - 1)

      if (_this.programInfo.ruleList[0] && _this.programInfo.ruleList[0].filmId !== '-1') {
        _this.$set(_this.programInfo.ruleList[0], 'filmType', '1')
      } else {
        _this.$set(_this.programInfo.ruleList[0], 'filmType', '-1')
      }

      if ((_this.programInfo.ruleList[0].settlementType === '1' || _this.programInfo.ruleList[0].settlementType === '2') && _this.programInfo.ruleList[0].diffType === '2') {
        Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
          this.diffRuleArr.push({ name: e, value: _this.programInfo.ruleList[0].diffRule[e] })
        })
      } else if (_this.programInfo.ruleList[0].settlementType === '3' && _this.programInfo.ruleList[0].diffType === '2' && _this.programInfo.ruleList[0].filmId !== '-1') {
        _this.programInfo.ruleList[0].filmList.forEach(el => {
          Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
            if (el.value === e) {
              this.diffRuleArr.push({ name: el.name, value: _this.programInfo.ruleList[0].diffRule[e] })
            }
          })
        })
      } else if (_this.programInfo.ruleList[0].settlementType === '3' && _this.programInfo.ruleList[0].diffType === '2' && _this.programInfo.ruleList[0].filmId !== '-1') {
        Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
          this.diffRuleArr.push({ name: '', value: _this.programInfo.ruleList[0].diffRule[e] })
        })
      } else if (_this.programInfo.ruleList[0].settlementType === '3' && _this.programInfo.ruleList[0].diffType === '2' && _this.programInfo.ruleList[0].filmId === '-1') {
        Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
          this.diffRuleArr.push({ name: '', value: _this.programInfo.ruleList[0].diffRule[e] })
        })
      }
    }
  }
}
</script>