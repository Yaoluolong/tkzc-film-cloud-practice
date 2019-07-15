import {
  APE_ADD_TIME_RULE_ITEM,
  APE_CHANGE_TIME_RULE_ITEM
} from '@/model/bus'
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    timeRuleIndex: {
      type: Number,
      default() {
        return {}
      }
    },
    ruleIndex: {
      type: Number,
      default() {
        return {}
      }
    },
    isShowDelete: {
      type: Boolean,
      default: false
    },
    isShowAdd: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addTimeRuleItem() {
      this.$bus.$emit(APE_ADD_TIME_RULE_ITEM, {
        isAdd: true,
        ruleIndex: this.ruleIndex,
        timeRuleIndex: this.timeRuleIndex,
        from: this
      })
    },
    deleteTimeRuleItem() {
      this.$bus.$emit(APE_ADD_TIME_RULE_ITEM, {
        isAdd: false,
        ruleIndex: this.ruleIndex,
        timeRuleIndex: this.timeRuleIndex,
        from: this
      })
    },
    // 时间
    onChangeTime(time) {
      const timeRuleItem = {
        ...this.item,
        time
      }
      this.$bus.$emit(APE_CHANGE_TIME_RULE_ITEM, {
        timeRuleItem,
        ruleIndex: this.ruleIndex,
        timeRuleIndex: this.timeRuleIndex,
        from: this
      })
    }
  }
}
