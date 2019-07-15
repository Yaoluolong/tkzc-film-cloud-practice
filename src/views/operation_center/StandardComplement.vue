<template>
  <div>
    <div v-for="(item,index) in dataList" :key="index" style="margin-bottom:20px;">
      <span style="display:inline-block;width:250px;">{{item.name}}</span>
      <span style="display:inline-block;" v-if="outPriceRule">影票价格范围{{priceRuleName}}{{priceRuleValue}}元可使用券，需补差价</span>
      <span v-else>需补差价&emsp;</span>
      <el-input v-model="item.complementPrice" style="width:100px;" :disabled="disabled"></el-input>  元
    </div>
  </div>
</template>
<script>
import { getProgramCopyType } from '@/api/mallCenter'
export default {
  props: {
    value: Object,
    outDataId: String,
    outDataList: Object,
    outPriceRule: Object,
    getStandard: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    cinemaGroupId: String
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
    async outDataId(val, oldVal) {
      const newData = val.split(',').filter(e => e) // 变更后的值
      const oldData = oldVal.split(',').filter(e => e) // 变更前的值
      if (this.getStandard) {
        const getList = await getProgramCopyType(this.cinemaGroupId)
        console.log(newData.length, oldData.length)
        if (newData.length > oldData.length) {
          const c = newData.filter(x => { return !oldData.includes(x) })
          const d = getList.filter(x => {
            return c.includes(x)
          })
          const r = d.map(e => {
            return { value: e, name: e }
          })
          this.dataList = this.dataList.concat(r)
        } else if (newData.length < oldData.length && newData.length !== 0) {
          const c = oldData.filter(x => { return !newData.includes(x) })
          this.dataList.splice(this.dataList.findIndex(item => item.value === c[0]), 1)
        } else if (newData.length === 0) {
          this.dataList = []
        }
      }
    },
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
    async geDdataId() {
      if (this.getStandard) {
        this.$set(this, 'dataList', [])
        const res = this.dataId.split(',').filter(e => e)
        Object.keys(this.value).length > 0 ? Object.keys(this.value).map((el, k) => {
          this.dataList.push({ value: el, name: el, complementPrice: this.value[el] })
        }) : res.map((el, k) => {
          this.dataList.push({ value: el, name: el, complementPrice: '' })
        })
      }
    }
  },
  created() {
    if (this.getStandard && Object.keys(this.value).length > 0) {
      this.geDdataId()
    }

    if (this.outPriceRule) {
      Object.keys(this.outPriceRule).forEach(e => {
        this.priceRuleName = e === 'lt' ? '小于' : '小于等于'
        this.priceRuleValue = this.outPriceRule[e]
      })
    }
    /* if (this.outDataList) {
      this.dataList = this.outDataList
      this.dataList.forEach(e => {
        Object.keys(this.value).map((el, k) => {
          if (e.value === el) {
            this.$set(e, 'complementPrice', this.value[el])
          }
        })
      })
    }*/
  }
}
</script>
