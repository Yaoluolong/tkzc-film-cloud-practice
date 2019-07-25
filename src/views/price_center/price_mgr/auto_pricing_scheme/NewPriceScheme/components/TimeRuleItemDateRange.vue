
<template>
  <el-form :model="form" :rules="itemRules" ref="form">
    <el-form-item prop="priceDateRange">
      <el-date-picker
        unlink-panels
        v-model="form.priceDateRange"
        type="daterange"
        size="small"
        clearable
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="handleChangeDateRange"
        class="w320"
      ></el-date-picker>
      <el-button v-if="isShowAdd" type="text" class="ml20" @click="addTimeRuleItem">添加</el-button>
      <el-button v-if="isShowDelete" type="text" class="ml20 danger" @click="deleteTimeRuleItem">删除</el-button>
    </el-form-item>
    <el-form-item class="mt20">
      <time-range ref="timeRange" :time-list="item.time"></time-range>
    </el-form-item>
    <!-- <el-button @click="validate">校验</el-button> -->
  </el-form>
</template>
<script>
import TimeRange from '@/components/TimeRange'
import { APE_CHANGE_TIME_RULE_ITEM } from '@/model/bus'
import timeRuleItemMixin from '@/views/price_center/price_mgr/auto_pricing_scheme/mixins/timeRuleItemMixin'
export default {
  components: {
    TimeRange
  },
  mixins: [timeRuleItemMixin],
  data() {
    return {
      form: {
        priceDateRange: []
      },
      itemRules: {
        priceDateRange: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.initDateRange()
  },
  methods: {
    initDateRange() {
      this.form.priceDateRange =
        this.item.startDate && this.item.endDate
          ? [this.item.startDate, this.item.endDate]
          : []
    },
    handleChangeDateRange(val) {
      const timeRuleItem = {}
      if (val) {
        timeRuleItem.startDate = val[0]
        timeRuleItem.endDate = val[1]
      } else {
        timeRuleItem.startDate = ''
        timeRuleItem.endDate = ''
      }
      this.$bus.$emit(APE_CHANGE_TIME_RULE_ITEM, {
        timeRuleItem: Object.assign({}, this.item, timeRuleItem),
        ruleIndex: this.ruleIndex,
        timeRuleIndex: this.timeRuleIndex,
        from: this
      })
    },
    validate() {
      const priomiseArry = []
      const timeRange = this.$refs.timeRange && this.$refs.timeRange.validate()
      if (timeRange) priomiseArry.push(timeRange)
      const form = this.$refs.form && this.$refs.form.validate()
      if (form) priomiseArry.push(form)
      return Promise.all(priomiseArry)
    }
  }
}
</script>

