<template>
  <div>
    <rule-item
      v-for="(ruleData,ruleIndex) in rules"
      :key="ruleIndex"
      :rule-data="ruleData"
      :rule-index="ruleIndex"
      :is-show-delete="rules.length>1&&ruleIndex>0"
      :is-show-add="rules.length<maxLength"
      :program-id="programId"
      @on-add="addItem"
      @on-delete="delleteItem"
      @on-change-date-type="onChangeDateType"
      @on-change-time-type="onChangeTimeType"
      @change="onChange"
      ref="priceRule"
    ></rule-item>
  </div>
</template>
<script>
import {
  createRuleItem,
  createTimeRuleItem
} from '@/views/price_center/price_mgr/auto_pricing_scheme/constant'
import RuleItem from './RuleItem'
import * as busTypes from '@/model/bus'
export default {
  model: {
    prop: 'rules',
    event: 'change'
  },
  props: {
    rules: {
      type: Array,
      default() {
        return []
      }
    },
    programId: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    RuleItem
  },
  data() {
    return {
      maxLength: 3
    }
  },
  mounted() {
    // 指定周期/日期/节日，timeType=2/3时，新增和删除时间
    this.$bus.$on(busTypes.APE_ADD_TIME_RULE_ITEM, this.onAddTimeRuleItem)
    // 表单值更改
    this.$bus.$on(
      busTypes.APE_CHANGE_TIME_RULE_ITEM,
      this.onChangeTimeRuleItem
    )
  },
  methods: {
    addItem(index) {
      if (this.rules.length === this.maxLength) return
      this.rules.splice(index + 1, 0, createRuleItem())
      // this.$emit('change', this.rules)
    },
    delleteItem(index) {
      this.rules.splice(index, 1)
      // this.$emit('change', this.rules)
    },
    onChange(item, index) {
      this.rules[index] = item
    },
    onChangeDateType(dateType, ruleIndex) {
      this.$set(this.rules[ruleIndex], 'dateType', dateType)
      const timeType = this.rules[ruleIndex].timeType
      if (+timeType !== 2) return
      const timeRule = [createTimeRuleItem(timeType)]
      this.$set(this.rules[ruleIndex], 'timeRule', timeRule)
    },
    onChangeTimeType(timeType, ruleIndex) {
      this.$set(this.rules[ruleIndex], 'timeType', timeType)
      const timeRule = [createTimeRuleItem(timeType)]
      this.$set(this.rules[ruleIndex], 'timeRule', timeRule)
    },
    // 更改周期的表单
    onChangeTimeRuleItem({ timeRuleItem, ruleIndex, timeRuleIndex } = {}) {
      // console.log('onChangeTimeRuleItem', this.rules)
      console.log(timeRuleItem, ruleIndex, timeRuleIndex)
      this.$set(this.rules[ruleIndex].timeRule, timeRuleIndex, timeRuleItem)
    },
    // 增删TimeRule
    onAddTimeRuleItem({ isAdd, ruleIndex, timeRuleIndex } = {}) {
      if (isAdd) {
        const timeType = this.rules[ruleIndex].timeType
        this.rules[ruleIndex].timeRule.push(createTimeRuleItem(timeType))
      } else {
        const list = this.rules[ruleIndex].timeRule.slice(0)
        // this.rules[ruleIndex].timeRule.splice(timeRuleIndex, 1)
        list.splice(timeRuleIndex, 1)
        this.$set(this.rules[ruleIndex], 'timeRule', list)
      }
    },
    // addTimeRuleItem(ruleIndex, timeRuleIndex) {
    //   let timeType = this.rules[ruleIndex].timeType;
    //   let timeRuleItem = null;
    //   if (+timeType === 1) {
    //     timeRuleItem = createTimeRuleItem();
    //   } else if (+timeType === 2) {
    //     let dateType = this.rules[ruleIndex].dateType;
    //     if (+dateType === 1) {
    //       timeRuleItem = createTimeRuleItem(timeType, dateType);
    //     } else {
    //     }
    //   } else {
    //   }
    // },
    validateAll() {
      return Promise.all(
        this.$refs.priceRule.map(component => component.validate())
      )
    }
  }
}
</script>

