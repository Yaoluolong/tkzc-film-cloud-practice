<template>
    <zm-panel title="智能定价详情" :visible.sync="visible" @change="closePanel">
        <el-form label-width="100px">
            <div class="mtb20">
                基本信息
            </div>
            <el-form-item label="方案名称:">{{info.name}}</el-form-item>
            <el-form-item label="有效期:">{{info.startDate}}&nbsp;&nbsp;-&nbsp;&nbsp;{{info.endDate}}</el-form-item>
            <el-form-item label="系统商:">{{info.interfaceName}}</el-form-item>
        </el-form>
        <el-form label-width="120px" v-for="(item,index) in info.rule" :key="index">
            <div>定价规则{{index+1}}</div>
            <el-form-item label="配置时间:" v-if="+item.timeType===1">有效期内，所有时间段可用</el-form-item>
            <el-form-item label="配置时间:" v-else-if="+item.timeType===2">
              <div v-for="(rule,idx) in item.timeRule" :key="idx">
                <div>
                  有效期内，{{getWeekLabel(rule.week)}}
                </div>
                <div>
                  <!-- <span v-for="(time,i) in rule.time" :key="i">
                    {{time.startTime}}&nbsp;&nbsp;-&nbsp;&nbsp;{{time.endTime}}
                    <span>{{(i<rule.time.length-1)?'、':''}}</span>
                  </span> -->
                  {{getTimeLabel(rule.time)}}
                  可用
                </div>
              </div>
            </el-form-item>
            <el-form-item label="配置时间:" v-else-if="+item.timeType===2">
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
    getTimeLabel(time) {
      const strList = time.map(v => {
        return v.startTime + ' - ' + v.endTime
      })
      return strList.join('、')
    }
  }
}
</script>

