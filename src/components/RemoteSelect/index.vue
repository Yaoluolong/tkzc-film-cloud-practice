<template>
    <el-select clearable v-bind="$attrs" v-on="$listeners" v-model="value1" >
        <el-option v-if="showAllOption" value="-1" label="全部"></el-option>
        <el-option :label="item[labelKey]" v-if="!type || type===item['type']" :value="item[valueKey]+''" v-for="item in options" :key="item[valueKey]"></el-option>
    </el-select>
</template>

<script>
    export default {
      props: {
        showAllOption: { // 是否显示全部这个选项
          type: Boolean,
          default: false
        },
        action: String,
        query: Object,
        type: String, // 暂时只用于比较类型的判断
        labelKey: {
          type: String,
          default: 'name'
        },
        valueKey: {
          type: String,
          default: 'value'
        },
        dictKey: String,
        value: [String, Number],
        label: String // value对应的值
      },
      data() {
        return {
          options: [],
          value1: '',
          currentData: {}
        }
      },
      watch: {
        value(val) {
          if (this.value1 !== val) {
            this.value1 = val + ''
          }
        },
        async value1(val) {
          if (this.options && this.options.length > 0) {
            const option = val !== '-1' ? this.options.find(e => e[this.valueKey] === val) : { name: '全部', value: '-1' }
            if (option) {
              this.$emit('change-data', val, option)
              this.$emit('input', val)
              this.$emit('update:label', option[this.labelKey])
            }
          } else {
            await this.fetchOptions()
            const option = val !== '-1' ? this.options.find(e => e[this.valueKey] === val) : { name: '全部', value: '-1' }
            if (option) {
              this.$emit('change-data', val, option)
              this.$emit('input', val)
              this.$emit('update:label', option[this.labelKey])
            }
          }
        },
        dictKey(val) {
          this.fetchOptions()
        },
        options() {
          this.$emit('change-data', this.value1, this.options.find(e => e[this.valueKey] === this.value1))
        }
      },
      methods: {
        async fetchOptions() {
          return new Promise(async(resolve, reject) => {
            if (this.dictKey) {
              this.options = await this.$request.get('/v1/common/getLabelList', { params: { type: this.dictKey }})
              this.$emit('after-action', this.options)
            } else if (this.action) {
              let params = {}
              if (this.query) { params = this.query }
              this.options = await this.$request.get(this.action, { params: params })
              this.$emit('after-action', this.options)
            }
            resolve('success')
          })
    
          // if (this.value) { this.value1 = this.value + '' }
        }
      },
      async created() {
        this.fetchOptions().then(() => {
          if (this.value) {
            this.value1 = this.value
          }
        })
    
        // console.log(this.valueKey)
        // console.log(this.value)
        // })
      }
    }
</script>

<style scoped>

</style>
