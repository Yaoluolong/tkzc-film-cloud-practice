<template>
  <el-select clearable v-model="value5" multiple  placeholder="请选择" v-bind="$attrs" v-on="$listeners">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'day'
      },
      value: Array
    },
    data() {
      return {
        options: [],
        value5: []
      }
    },
    watch: {
      value5(val) {
        this.$emit('input', val)
      },
      value(val) {
        this.value5 = val
      }
    },
    created() {
      if (this.type === 'day') {
        for (let i = 1; i <= 31; i++) {
          this.options.push({ label: i + '号', value: i })
        }
      } else if (this.type === 'week') {
        const nams = ['日', '一', '二', '三', '四', '五', '六']
        for (let i = 0; i < 7; i++) {
          this.options.push({ label: '周' + nams[i], value: i })
        }
      }
      if (this.value) {
        this.value5 = this.value
      }
    }
  }
</script>

<style scoped>

</style>
