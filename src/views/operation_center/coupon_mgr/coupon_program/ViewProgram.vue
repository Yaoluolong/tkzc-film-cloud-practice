<template>
	<div class="app-container">
		<el-form label-width="140px" label-position="left" style="width:1000px;" :model="params">
            <el-form-item label="规则名称:">
              <span>{{params.name}}</span>
            </el-form-item>
            <el-form-item label="适用电影券销售订单:" label-width="160px">
              <span>{{params.orderNo}}</span>
            </el-form-item>
            <el-form-item label="券不可用时段:">
              <span>{{params.dateLimitType ==='1'? '不限制':'指定时间'}}</span>
            </el-form-item>
            <el-form-item label="券不可用时间:" v-if="params.dateLimitType !=='1'">
              <span v-if="params.timeType==='day'">每天</span>
              <span v-else-if="params.timeType==='week'">每周</span>
              <span v-else>不限制</span>
              <span v-if="params.timeType==='week'">{{week}}</span>
              <span v-if="params.timeType!=='-1'">{{params.stime}}--{{params.etime}}</span>
            </el-form-item>
            <el-form-item label="可用商家:">
              <div v-for="channel in params.channelList">
                <div>{{channel.name}}</div>
              </div>
            </el-form-item>
            <el-form-item label="可用影院" prop="cinemaGroupId" >
              <div>{{params.cinemaGroupName}}</div>
            </el-form-item>
            <div v-for="(rule,index) in params.ruleList" :key="rule.key">
              <el-form-item label="兑换方式："  :prop="'ruleList.'+index+'.settlementType'">
                 <span v-if="rule.settlementType==='1'">根据影厅</span>
                 <span v-else-if="rule.settlementType==='2'">根据制式</span>
                 <span v-else="rule.settlementType==='3'">根据影片</span>
              </el-form-item>
              <el-form-item label="选择影厅："  :prop="'ruleList.'+index+'.hallType'" v-if="params.cinemaGroupId && rule.settlementType === '1'" style="width:300px;">
                  <span>{{rule.hallTypeName}}</span>
              </el-form-item>
              <el-form-item label="选择制式：" :prop="'ruleList.'+index+'.standard'" v-if="params.cinemaGroupId && rule.settlementType === '2'">
                    <standard-selector ref="standard" v-model="rule.standard" :cinemaGroupId="params.cinemaGroupId" disabled></standard-selector>
              </el-form-item>
              <el-form-item label="影片名称：" :prop="'ruleList.'+index+'.filmId'" v-if="rule.settlementType === '3'">
                <el-radio v-model="rule.filmType" label="-1" disabled>全部影片</el-radio>
                <el-radio v-model="rule.filmType" label="1" disabled>指定影片</el-radio>
                <div style="border:1px solid #ebeef5;width:800px;padding: 10px 20px;" v-if="rule.filmType === '1'">
                  <div v-for="v in rule.filmList">
                    影片名称：<span>{{v.name}}</span>
                  </div>
                </div>                
              </el-form-item>
              <el-form-item label="电影券类型：" style="width:350px;">
                <span>{{couponInfoParams.typeName}}</span>
              </el-form-item>
              <el-form-item label="补差类型：" v-if="couponInfoParams.type==='3' && rule.settlementType" style="width:350px;">
                <el-radio v-model="rule.diffType" label="1" disabled>差额补差</el-radio>
                <el-radio v-model="rule.diffType" label="2" disabled>固定补差</el-radio>
              </el-form-item>
              <el-form-item  label="设定补差：" v-if="couponInfoParams.type==='3' && rule.diffType==='2'&& rule.settlementType==='1'">
                <hall-complement v-model="rule.diffRule" ref="complementHallRef" getHall :outDataId="rule.hallType" disabled></hall-complement>
              </el-form-item>
              <el-form-item v-if="couponInfoParams.type==='3' && rule.diffType==='2'&& rule.settlementType==='2'">
                <standard-complement v-model="rule.diffRule" ref="complementStandardRef" getStandard :outDataId="rule.standard" :cinemaGroupId="params.cinemaGroupId" disabled></standard-complement>        
              </el-form-item>
              <el-form-item v-if="couponInfoParams.type==='3' && rule.diffType==='2'&& rule.settlementType==='3'">
                <film-complement v-model="rule.diffRule" ref="complementRef" getFilm :filmType="rule.filmType" :outDataId="rule.filmId" :outDataList="rule.filmList" disabled></film-complement>          
              </el-form-item>
              <el-form-item v-if="couponInfoParams.type==='3' && rule.diffType==='1'">
                影票价格范围{{couponInfoParams.priceRuleStr}}元可使用券，超出此范围需补差额根据影票价格减去电影券最大可兑换价值。
              </el-form-item>        
            </div>
          </el-form>
    </div>
</template>
<script>
import { getCouponOrderInfo } from '@/api/operationCenter'
import StandardSelector from '@/views/operation_center/coupon_mgr/sold_coupon_list/StandardSelector'

import FilmComplement from '@/views/operation_center/FilmComplement'
import StandardComplement from '@/views/operation_center/StandardComplement'
import HallComplement from '@/views/operation_center/HallComplement'

export default{
  components: { StandardSelector, FilmComplement, StandardComplement, HallComplement },
  name: 'view_program',
  data() {
    return {
      params: {

      },
      couponInfoParams: {

      }
    }
  },
  methods: {

  },
  async created() {
    const _this = this
    await getCouponOrderInfo(this.$route.query.orderNo).then(res => {
      this.params = res.programInfo
      this.couponInfoParams = res.couponInfo
      if (this.params.week.length > 0) {
        const weekTemp = _this.params.week.split(',').filter(e => e)
        this.week = ''
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
            case '7':
              this.week += '周日' + ','
              break
          }
        })
        this.week = this.week || this.week.substr(0, this.week.length - 1)
      }

      if (_this.params.ruleList[0] && _this.params.ruleList[0].filmId !== '-1') {
        _this.$set(_this.params.ruleList[0], 'filmType', '1')
      } else {
        _this.$set(_this.params.ruleList[0], 'filmType', '-1')
      }
    })
  }
}
</script>