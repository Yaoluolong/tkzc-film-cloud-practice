<template>
  <div>
    <div v-for="(item,index) in dataList" :key="index" style="margin-bottom:20px;">
      <span v-if="filmType==='1'" style="display:inline-block;">影片：{{item.name}},</span>
      <span style="display:inline-block;" v-if="outPriceRule">影票价格范围{{priceRuleName}}{{priceRuleValue}}元可使用券，</span>
      <span >需补差价&emsp;</span>
      <el-input v-model="item.complementPrice" style="width:100px;" :disabled="disabled"></el-input>  元
    </div>
  </div>     
</template>
<script>
import { getFilmIdList } from '@/api/priceCenter'
export default {
  props: {
    value: Object,
    outDataId: String,
    outDataList: Array,
    outPriceRule: Object,
    getFilm: {
      type: Boolean,
      default: false
    },
    filmType: String,
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
    filmType(val, oldVal) {
      if (val !== oldVal) {
        this.dataList = []
        if (val === '-1') {
          this.dataList = [{ name: '-1', value: '-1', complementPrice: '' }]
        }
      }
    },
    async outDataId(val, oldVal) {
      const a = val.split(',').filter(e => e) // 变更后的值
      const b = oldVal.split(',').filter(e => e) // 变更前的值
      if (this.getFilm && this.filmType !== '-1') {
        const getList = await getFilmIdList()
        if (a !== b) {
          /* const c = a.filter(x => { return !b.includes(x) })
          const d = getList.filter(x => {
            return c.includes(x.value)
          })
          this.dataList = this.dataList.concat(d)*/
          this.dataList = getList.filter(x => {
            return a.includes(x.value)
          })
        }
        // else {
        //   const c = b.filter(x => { return !a.includes(x) })
        //   this.dataList.splice(this.dataList.findIndex(item => item.value === c[0]), 1)
        // }
      } else if (this.filmType === '-1') {
        console.log(this.value)
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
      if (this.getFilm && this.filmType !== '-1') {
        const getList = await getFilmIdList()
        const resArr = this.dataId.split(',').filter(e => e)
        if (this.dataId && this.dataId.length > 0) {
          this.dataList = getList.filter(x => {
            return resArr.includes(x.value)
          })
        }
      } else if (this.getFilm && this.filmType === '-1') {
        this.dataList = [{ name: '-1', value: '-1', complementPrice: '' }]
      }
    }
  },
  created() {
    if (this.outPriceRule) {
      Object.keys(this.outPriceRule).forEach(e => {
        this.priceRuleName = e === 'lt' ? '小于' : '小于等于'
        this.priceRuleValue = this.outPriceRule[e]
      })
    }

    if (this.value) {
      if (this.outDataList) {
        this.dataList = this.outDataList
        this.dataList.forEach(e => {
          Object.keys(this.value).map((el, k) => {
            if (e.value === el) {
              this.$set(e, 'complementPrice', this.value[el])
            }
          })
        })
      } else {
        console.log(Object.keys(this.value))
        Object.keys(this.value).map((el, k) => {
          if (el === '-1') {
            this.dataList = [{ name: '', value: '-1', complementPrice: this.value[el] }]
          }
        })
      }
    }
  }
}
</script>
