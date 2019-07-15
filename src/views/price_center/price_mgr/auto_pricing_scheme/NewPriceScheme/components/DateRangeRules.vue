<template>
  <div>
    <template v-for="(item, index) in timeRule">
      <component
        :is="componentName"
        :key="item.id"
        :item="item"
        :time-rule-index="index"
        :rule-index="ruleIndex"
        :is-show-delete="timeRule.length>1"
        :is-show-add="timeRule.length<maxLength"
        :date-type="dateType"
        @on-add="addItem"
        @on-delete="delleteItem"
        ref="timeRule"
        class="time-rule-item mt5"
      ></component>
    </template>
  </div>
</template>
<script>
import DateRnageRuleItem from './DateRnageRuleItem'
import WeeksRuleItem from './WeeksRuleItem'
import {
  createTimeRuleItem,
  DATE_TYPES_MAP
} from '@/views/price_center/price_mgr/auto_pricing_scheme/constant'
export default {
  props: {
    timeRule: {
      type: Array,
      default() {
        return []
      }
    },
    ruleIndex: {
      type: Number,
      default: 0
    },
    programId: {
      type: [String, Number],
      default: null
    },
    dateType: {
      type: [String, Number],
      default: DATE_TYPES_MAP.WEEKS // 1指定周期可用 2指定日期可用
    }
  },
  components: {
    DateRnageRuleItem,
    WeeksRuleItem
  },
  data() {
    return {
      maxLength: 10
    }
  },
  computed: {
    componentName() {
      return this.dateType === DATE_TYPES_MAP.WEEKS ? 'WeeksRuleItem' : 'DateRnageRuleItem'
    }
  },
  //   watch: {
  //       dateType() {}
  //   },
  created() {
    !this.programId &&
        this.timeRule.length === 0 &&
        this.timeRule.push(createTimeRuleItem('date'))
  },
  methods: {
    addItem(index) {
      if (this.rules.length === this.maxLength) return
      const itemData = createTimeRuleItem('date')
      this.rules.splice(index + 1, 0, itemData)
    },
    delleteItem(index) {
      this.$emit('on-delte')
      this.rules.splice(index, 1)
    },
    validateAll() {
      return Promise.all(
        this.$refs.timeRule.map(component => component.validate())
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.time-rule-item {
  border-bottom: 1px solid #f0f1f3;
}
</style>
