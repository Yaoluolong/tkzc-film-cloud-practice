<template>
  <div>
    <div v-for="(item,index) in dataList" :key="index" style="margin-bottom:20px;">
      <span
        style="display:inline-block;"
        v-if="outPriceRule"
      >影票价格范围{{priceRuleName}}{{priceRuleValue}}元可使用券，需补差价</span>
      <span v-else>需补差价&emsp;</span>
      <el-input clearable v-model="item.complementPrice" style="width:100px;" :disabled="disabled"></el-input>元
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: [Object, String],
    outDataId: String,
    outDataList: Array,
    getHall: {
      type: Boolean,
      default: false
    },
    outPriceRule: Object,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataId: this.outDataId,
      dataList: [],
      priceRuleName: '',
      priceRuleValue: ''
    }
  },
  watch: {
    dataList: {
      handler(val) {
        const t = {}
        val.map(e => {
          t[e.value] = e.complementPrice
        })
        this.$emit('diffRuleChange', t)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    geDdataId() {
      if (this.getHall) {
        this.$set(this, 'dataList', [])

        Object.keys(this.value).length > 0
          ? Object.keys(this.value).map((el, k) => {
            this.dataList.push({
              value: el,
              name: el,
              complementPrice: this.value[el]
            })
          })
          : this.dataList.push({ value: '', name: '', complementPrice: '' })
      }
    }
  },
  created() {
    if (this.getHall) {
      console.log(this.dataList)
      this.geDdataId()
    }

    if (this.outPriceRule) {
      Object.keys(this.outPriceRule).forEach(e => {
        this.priceRuleName = e === 'lt' ? '小于' : '小于等于'
        this.priceRuleValue = this.outPriceRule[e]
      })
    }
  }
}
</script>
