
<template>
  <el-form :model="form" :rules="itemRules" ref="form">
    <el-form-item prop="date">
      <el-date-picker
        v-model="form.date"
        type="date"
        size="small"
        clearable
        placeholder="请选择日期"
        value-format="yyyy-MM-dd"
        @change="handleChangeDate"
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
        date: []
      },
      itemRules: {
        date: [
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
    this.initDate()
  },
  methods: {
    initDate() {
      this.form.date = this.item.date
    },
    handleChangeDate(val) {
      this.$bus.$emit(APE_CHANGE_TIME_RULE_ITEM, {
        timeRuleItem: Object.assign({}, this.item, { date: this.form.date }),
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

