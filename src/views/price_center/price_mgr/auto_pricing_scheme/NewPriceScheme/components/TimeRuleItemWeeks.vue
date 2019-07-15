
<template>
  <el-form :model="form" ref="form" :rules="itemRules">
    <el-form-item prop="weekList">
      <el-checkbox-group v-model="form.weekList" @change="onChangeWeek" class="vm">
        <el-checkbox v-for="(item,index) in WEEKS" :key="index" :label="item.value">{{item.label}}</el-checkbox>
      </el-checkbox-group>
      <el-button v-if="isShowAdd" type="text" class="ml20" @click="addTimeRuleItem">添加</el-button>
      <el-button v-if="isShowDelete" type="text" class="ml20 danger" @click="deleteTimeRuleItem">删除</el-button>
    </el-form-item>
    <el-form-item class="mt20">
      <time-range ref="timeRange" :time-list="item.time" @change="onChangeTime"></time-range>
    </el-form-item>
    <!-- <el-button @click="validate">校验</el-button> -->
  </el-form>
</template>
<script>
import { WEEKS } from '@/model/type'
import { APE_CHANGE_TIME_RULE_ITEM } from '@/model/bus'
import TimeRange from '@/components/TimeRange'
import timeRuleItemMixin from '@/views/price_center/price_mgr/auto_pricing_scheme/mixins/timeRuleItemMixin'
export default {
  components: {
    TimeRange
  },
  mixins: [timeRuleItemMixin],
  data() {
    return {
      WEEKS,
      form: {
        weekList: []
      },
      itemRules: {
        weekList: [
          {
            required: true,
            message: '请选择周期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.initWeekList()
  },
  methods: {
    initWeekList() {
      if (this.item.week) this.form.weekList = this.item.week.split(',')
    },
    onChangeWeek(val) {
      const week = val ? val.join(',') : ''
      const timeRuleItem = {
        ...this.item,
        week
      }
      this.$bus.$emit(APE_CHANGE_TIME_RULE_ITEM, {
        timeRuleItem,
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
<style lang="scss" scoped>
.el-form-item__error {
  margin-top: 10px;
}
</style>

