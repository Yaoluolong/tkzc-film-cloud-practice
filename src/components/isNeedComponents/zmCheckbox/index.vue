<template>
  <div>
    <el-checkbox
      v-model="chooseInfo.isAll"
      :indeterminate="chooseInfo.indeterminate"
      @change="changeCheckbox('all',chooseInfo)"
    >全部</el-checkbox>
    <el-checkbox-group v-model="checkValue" :class="option.groupClass">
      <el-checkbox
        v-for="(item,index) in list"
        :key="index"
        :label="item[labelKey]"
        @change="changeCheckbox('one',chooseInfo)"
      >
      <slot :item="item"></slot>
      </el-checkbox>
    </el-checkbox-group>
  </div>
  <!-- :class="item.content?'mr10':''" -->
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    labelKey: {
      type: String,
      default: 'value'
    },
    option: {
      type: Object,
      default() {
        return {
          groupClass: 'dib ml30'
        }
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      checkValue: [],
      chooseInfo: {
        isAll: false,
        indeterminate: false
      },
      isBackfill: false
    }
  },
  watch: {
    value(val) {
      // 只回填一次
      if (val && val.length && !this.isBackfill) {
        this.getVlaue(val)
        this.isBackfill = true
      }
    }
  },
  mounted() {
    // 多次销毁再打开时，重复回填使用
    this.getVlaue(this.value)
  },
  methods: {
    getVlaue(value) {
      // 默认传入值为字符串，如果需要数组传入的情况也做接收判断
      this.checkValue =
        value && typeof value === 'string'
          ? value.split(',')
          : Array.isArray(value)
            ? value
            : []
    },
    // 选择终端
    changeCheckbox(type, item) {
      const ids = this.list.map(e => {
        return e[this.labelKey]
      })
      const deviceLen = this.checkValue.length
      switch (type) {
        case 'all':
          this.checkValue = item.isAll ? ids : []
          item.indeterminate = false
          break
        case 'one':
          item.isAll = deviceLen === ids.length
          item.indeterminate = deviceLen > 0 && deviceLen < ids.length
          break
      }
      this.$emit('input', this.checkValue.length ? this.checkValue.join(',') : '')
    }
  }
}
</script>
