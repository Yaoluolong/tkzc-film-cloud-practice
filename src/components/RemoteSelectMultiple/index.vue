<template>
    <el-select clearable remo fitler remo-method multiple v-bind="$attrs" v-on="$listeners" v-model="value1">
      <el-option :label="item[labelKey]" :value="item[valueKey]+''" v-for="item in options" :key="item[valueKey]" :disabled="item.disabled"
      @click.native="changeFun(item.value)">
      </el-option>
    </el-select>
</template>

<script>
    import { mergeArray } from '@/utils'
    export default {
      props: {
        action: String,
        query: Object,
        labelKey: {
          type: String,
          default: 'name'
        },
        valueKey: {
          type: String,
          default: 'value'
        },
        dictKey: String,
        showAllOption: { // 是否有全部
          type: Boolean,
          default: false
        },
        value: Array
      },
      data() {
        return {
          isDisabled: false,
          options: [],
          value1: [],
          currentData: {},
          needShowAllOption: this.showAllOption
        }
      },
      watch: {
        /* value(val) {
          if (val.length === 0) {
            this.options.map(e => {
              e.disabled = false
            })
          } else {
            if (val.join(',').indexOf('-1') > -1) {
              this.$set(this, 'value1', ['-1'])
              console.log(this.value1)
              this.options.map(e => {
                if (e.value === '-1') {
                  e.disabled = false
                } else {
                  e.disabled = true
                }
              })
            } else {
              this.value1 = val*/
        /* val.forEach(e => {
if (e === '-1') {
this.value1 = ['-1']
return false
} else {
this.options.map(e => {
e.disabled = false
})
}
})*/
        //     }
        //   }
        // },
        value1(val) {
          if (val.length === 0) {
            this.options.map(e => {
              e.disabled = false
            })
          }
          this.$emit('change-data', val, this.options.find(e => e[this.valueKey] === val))
          this.$emit('input', val)
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
          if (this.dictKey) {
            this.options = await this.$request.get('/v1/common/getLabelList', { params: { type: this.dictKey }})

            this.$emit('after-action', this.options)
          } else if (this.action) {
            let params = {}
            if (this.query) { params = this.query }
            this.needShowAllOption ? this.options.unshift({ 'name': '全部', 'value': '-1' }) : ''
            this.options = mergeArray(this.options, await this.$request.get(this.action, { params: params }))
            if (this.value.includes('-1')) {
              this.options.forEach(e => {
                if (e.value === '-1') {
                  e.disabled = false
                } else {
                  e.disabled = true
                }
              })
            } else {
              this.options.forEach(e => {
                e.disabled = false
              })
            }
            this.$emit('after-action', this.options)
          }
          // if (this.value) { this.value1 = this.value + '' }
        },
        changeFun(val, event) {
          if (this.value1.includes('-1')) {
            this.value1 = ['-1']
            this.$emit('change-data', this.value, ['-1'])
            this.options.map(e => {
              if (e.value === '-1') {
                e.disabled = false
              } else {
                e.disabled = true
              }
            })
          } else {
            this.value1.forEach(e => {
              if (e === '-1') {
                this.value1 = ['-1']
                return false
              } else {
                this.options.map(e => {
                  e.disabled = false
                })
              }
            })
          }
        },
        selectAll() {
        }
      },
      created() {
        if (this.value) {
          this.value1 = this.value
        }
        this.fetchOptions()
      }
    }
</script>

<style scoped>

</style>
