<template>
  <div>
    <div v-for="(item,index) in dataList" :key="index" style="margin-bottom:20px;">
      <span style="display:inline-block;width:300px;">{{item.name}}</span>
      券补差面值  <el-input clearable v-model="item.complementPrice" style="width:100px;"></el-input>  元
    </div>
    <!-- <div>{{dataList}}</div>
    <div>{{outDataId}}</div> -->
  </div>     
</template>
<script>
import { getFilmIdList } from '@/api/priceCenter'
import { getProgramCopyType } from '@/api/mallCenter'
export default {
  props: {
    value: Object,
    outDataId: String,
    outDataList: Array,
    getFilm: {
      type: Boolean,
      default: false
    },
    getStandard: {
      type: Boolean,
      default: false
    },
    cinemaGroupId: String
  },
  data() {
    return {
      dataId: this.outDataId,
      dataList: []
    }
  },
  watch: {
    async outDataId(val, oldVal) {
      console.log(val, oldVal)
      const a = val.split(',').filter(e => e) // 变更后的值
      const b = oldVal.split(',').filter(e => e) // 变更前的值
      if (this.getFilm) {
        const getList = await getFilmIdList()
        if (a.length > b.length) {
          const c = a.filter(x => { return !b.includes(x) })
          const d = getList.filter(x => {
            return c.includes(x.value)
          })
          this.dataList = this.dataList.concat(d)
        } else {
          const c = b.filter(x => { return !a.includes(x) })
          this.dataList.splice(this.dataList.findIndex(item => item.value === c[0]), 1)
        }
      } else if (this.getStandard) {
        console.log(a, b)
        const getList = await getProgramCopyType(this.cinemaGroupId)

        if (a.length > b.length) {
          const c = a.filter(x => { return !b.includes(x) })
          const d = getList.filter(x => {
            return c.includes(x)
          })
          const r = d.map(e => {
            return { value: e, name: e }
          })
          this.dataList = this.dataList.concat(r)
        } else {
          console.log(232323232)
          const c = b.filter(x => { return !a.includes(x) })
          console.log(c, this.dataList)
          this.dataList.splice(this.dataList.findIndex(item => item.value === c[0]), 1)
        }
      }
    },
    dataList: {
      handler(val) {
        console.log(val)
        const t = {}
        val.map(e => {
          t[e.value] = e.complementPrice
        })
        // if (this.getFilm) {
        //   this.geDdataId()
        // }
        this.$emit('diffRuleChange', t)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async geDdataId() {
      console.log(this.dataId)
      if (this.getFilm) {
        const getList = await getFilmIdList()
        const resArr = this.dataId.split(',').filter(e => e)
        if (this.dataId && this.dataId.length > 0) {
          this.dataList = getList.filter(x => {
            return resArr.includes(x.value)
          })
        }
      } else if (this.getStandard) {
        console.log(21312321)
        this.$set(this, 'dataList', [])
        const res = this.dataId.split(',').filter(e => e)
        console.log(Object.keys(this.value).length, this.dataId, res)
        Object.keys(this.value).length > 0 ? Object.keys(this.value).map((el, k) => {
          console.log(el, k, this.value[el])
          this.dataList.push({ value: el, name: el, complementPrice: this.value[el] })
        }) : res.map((el, k) => {
          console.log(el, k)
          this.dataList.push({ value: el, name: el, complementPrice: '' })
        })
      }
    }
  },
  created() {
    console.log(this.value, 777)
    if (this.getStandard && Object.keys(this.value).length > 0) {
      this.geDdataId()
    }

    if (this.outDataList) {
      console.log(this.outDataList)
      this.dataList = this.outDataList
      this.dataList.forEach(e => {
        console.log(e)
        Object.keys(this.value).map((el, k) => {
          console.log(el, this.value[el], 787878)
          if (e.value === el) {
            console.log(e.value, el)
            this.$set(e, 'complementPrice', this.value[el])
          }
        })
      })
      console.log(this.dataList)
    }
  }
}
</script>
