<template>
    <el-cascader :clearable='clearable'
      :options="options"
      @active-item-change="handleItemChange"
      v-model="selectedOptions"
      :props="{label:'name',value:'value',children:'children'}"
      expand-trigger="hover"
      filterable
      change-on-select
      >
    </el-cascader>
</template>

<script>
import { getCityRegion } from '@/api/mallCenter'
import { mergeArray } from '@/utils'
export default {
  props: {
    value: [String, Array],
    rang: { // 最多显示的层级
      type: Number,
      default: 1
    },
    clearable: { // 是否可以清除
      type: Boolean,
      defalut: false
    },
    showAllOptions: Boolean
  },
  data() {
    return {
      options: [],
      selectedOptions: [],
      address: []
    }
  },
  computed: {
    addressStr() {
      const length = this.selectedOptions.length
      let temp = this.options
      let str = ''
      for (let i = 0; i < length; i++) {
        const regionId = this.selectedOptions[i]
        const findObj = temp.find(e => e.value === regionId)
        if (findObj) {
          str += findObj.name
          if (findObj.children && findObj.children.length > 0) {
            temp = findObj.children
          }
        }
      }
      return str
    }

  },
  watch: {
    selectedOptions(val) {
      this.$emit('input', val)
    },
    value(val) {
      if (this.selectedOptions !== val) { this.selectedOptions = val }
      this.handleItemChange(val, true)
    }
  },
  methods: {
    async handleItemChange(val, boolean) {
      const deepfind = async(deep, options) => {
        const value = val[deep]
        if (value) {
          const findObj = options.find(e => e.value === value)
          if (findObj) {
            if (!findObj.nextInit) {
              findObj.children = await this.fetchCityRegion(value, deep < (this.rang - 1))
              if (!findObj.children || findObj.children.length === 0) {
                delete findObj.children
              }
              findObj.nextInit = false // 下次是否需要去服务端取数据  false层级到市 true层级继续往下
              if (boolean && deep < 1) { // 层级到市
                deepfind(deep + 1, findObj.children)
                this.address.push(findObj.name)
              }
              if (boolean) {
                findObj.children.forEach(e => {
                  if (e.value === val[deep + 1]) {
                    this.address.push(e.name)
                  }
                })
              }
            } else if (findObj.children && findObj.children.length > 0) {
              deepfind(deep + 1, findObj.children)
            }
          }
        }
      }
      deepfind(0, this.options)
    },
    async fetchCityRegion(parentId, appendChild = true) {
      const optionsTemp = [{ name: '全国', value: '-1' }]
      const options = this.showAllOptions ? mergeArray(optionsTemp, await getCityRegion({ parentId })) : await getCityRegion({ parentId })
      options.forEach(e => {
        if (e.value === '-1') {
          return false
        }
        if (appendChild) { e.children = [] }
        e.nextInit = false
      })
      return options
    }
  },
  async created() {
    this.options = await this.fetchCityRegion(0)
  }
}
</script>

<style scoped>

</style>
