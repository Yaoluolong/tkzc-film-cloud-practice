<template>
  <zm-panel title="智能定价详情" :visible.sync="visible" @change="closePanel">
    <el-form label-width="100px">
      <div class="mtb20">基本信息</div>
      <el-form-item label="方案名称:">{{info.name}}</el-form-item>
      <el-form-item label="有效期:">{{info.startDate}}&nbsp;&nbsp;-&nbsp;&nbsp;{{info.endDate}}</el-form-item>
      <el-form-item label="系统商:">{{info.interfaceName}}</el-form-item>
      <el-form-item label="区域:" v-if="+info.programType===2">{{info.cinemaGroupName||'全部'}}</el-form-item>
      <el-form-item label="影片:" v-if="+info.programType===2">{{info.filmName}}</el-form-item>
      <el-form-item label="制式:" v-if="+info.programType===2">{{info.copyType.join('、')}}</el-form-item>
    </el-form>
    <el-form label-width="120px" v-for="(item,index) in info.rule" :key="index">
      <div class="mtb20">定价规则{{index+1}}</div>
      <el-form-item label="配置时间:">
        <div v-if="+item.timeType===1">有效期内，所有时间段可用</div>
        <div v-else-if="+item.timeType===2">
          <div v-for="(rule,idx) in item.timeRule" :key="idx">
            <div>
              {{idx+1}}. 有效期内，
              <span v-if="+item.dateType===1">
                {{getWeekLabel(rule.week)}}
              </span>
              <span v-else-if="+item.dateType===2">
                {{rule.startDate}}&nbsp;-&nbsp;{{rule.endDate}}
              </span>
            </div>
            <div>
              {{getTimeLabel(rule.time)}}
              可用
            </div>
          </div>
        </div>
        <div v-else>
          <div v-for="(rule,idx) in item.timeRule" :key="idx">
            {{idx+1}} .有效期内，{{rule.date}}
            <div>
              {{getTimeLabel(rule.time)}}
              可用
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="定价方式:">参考第三方价格{{getPricingType(item.priceType)}}</el-form-item>
      <el-form-item label="配置价格:">参考第三方价格，统一{{+item.type===1?'减少':'增加'}}{{item.price}}元</el-form-item>
    </el-form>
  </zm-panel>
</template>
<script>
import { WEEKS } from '@/model/type'
import { PRICING_METHODS } from './constant'
import zmPanel from '@/components/isNeedComponents/zmPanel'
import { getAutoPriceInfo } from '@/api/priceCenter'
export default {
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  components: {
    zmPanel
  },
  data() {
    return {
      visible: true,
      info: {}
    }
  },
  created() {
    this.getDetial()
  },
  methods: {
    closePanel() {
      this.$emit('cancel')
    },
    async getDetial() {
      this.info = await getAutoPriceInfo({
        id: this.id
      })
    },
    getPricingType(priceType) {
      const res = PRICING_METHODS.find(v => v.value === priceType)
      return res && res.label
    },
    getWeekLabel(week) {
      const list = week.split(',')
      const strList = list.map(v => {
        const res = WEEKS.find(val => val.value === v)
        return res.label
      })
      return strList.join('、')
    },
    getDateRangeLabel(rule) {
    },
    getTimeLabel(time) {
      const strList = time.map(v => {
        return v.startTime + ' - ' + v.endTime
      })
      return strList.join('、')
    }
  }
}
</script>

