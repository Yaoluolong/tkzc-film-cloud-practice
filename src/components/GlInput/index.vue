<template>
  <div class="gl-input-box">
    <el-select
      clearable
      placeholder="请选择"
      v-model="value1"
      class="gl-input"
      style="width:100px"
      @change="change"
    >
      <el-option :label="item.name" :value="item.value" v-for="item in lSelect" :key="item.value"></el-option>
    </el-select>
    <el-input clearable v-model="value2" class="gl-input" @change="change" style="width:100px"></el-input>
    <span>{{unit}},且</span>
    <el-select
      clearable
      placeholder="请选择"
      v-model="value3"
      class="gl-input"
      style="width:100px"
      @change="change"
    >
      <el-option :label="item.name" :value="item.value" v-for="item in rSelect" :key="item.value"></el-option>
    </el-select>
    <el-input clearable v-model="value4" class="gl-input" @change="change" style="width:100px"></el-input>
    <span>{{unit}}</span>
  </div>
</template>

<script>
export default {
  props: {
    lSelect: {
      type: Array,
      default: function() {
        return [
          { name: '大于', value: 'gt' },
          { name: '大于等于', value: 'egt' }
        ]
      }
    },
    rSelect: {
      type: Array,
      default: function() {
        return [
          { name: '小于', value: 'lt' },
          { name: '小于等于', value: 'elt' }
        ]
      }
    },
    unit: {
      type: String,
      default: '元'
    },
    value: [String, Object]
  },
  data() {
    return {
      value1: '',
      value2: '',
      value3: '',
      value4: ''
    }
  },
  watch: {
    value() {
      this.init()
    }
  },
  methods: {
    init() {
      let value = this.value
      if (typeof value === 'string') {
        value = JSON.parse(value)
      }
      if (typeof value === 'object') {
        this.value1 = Object.keys(value)[0]
        this.value3 = Object.keys(value)[1]
        this.value2 = value[this.value1]
        this.value4 = value[this.value3]
      }
    },
    change(val) {
      if (
        this.value1 === '' ||
        this.value2 === '' ||
        this.value3 === '' ||
        this.value4 === ''
      ) {
        this.$emit('input', '')
      } else {
        const result = {}
        result[this.value1] = this.value2
        result[this.value3] = this.value4
        this.$emit('input', result)
      }
    }
  },
  created() {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.gl-input-box {
  // display: flex;
  width: 100%;
  margin: 0 -10px;
  .gl-input {
    // flex:1;
    margin: 0 10px;
  }
}
</style>
