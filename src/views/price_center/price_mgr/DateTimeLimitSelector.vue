<template>
  <el-form label-width="140px" label-position="left" :model="params" :rules="rules" ref="form">
    <el-form-item :label="title" prop="dateType">
      <el-select clearable v-model="params.dateType" style="width:320px">
        <el-option label="指定日期" value="1"></el-option>
        <el-option v-if="showSpecificDate" label="每月" value="2"></el-option>
      </el-select>
      <el-date-picker
        unlink-panels
        v-if="params.dateType==1"
        v-model="params.dateDetail1"
        type="daterange"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束时间"
        style="width:320px;"
      ></el-date-picker>
      <date-selector
        clearable
        v-if="params.dateType==2"
        v-model="params.dateDetail2"
        style="width:320px"
      ></date-selector>
    </el-form-item>
    <el-form-item label="时间限制" :prop="propType" v-if="params.dateType">
      <el-select
        clearable
        v-model="params.timeType"
        style="width:320px;margin-bottom:20px"
        v-if="params.dateType==1"
      >
        <el-option label="不限制" value="-1"></el-option>
        <el-option label="每天" value="day"></el-option>
        <el-option label="每周" value="week"></el-option>
      </el-select>
      <date-selector
        clearable
        v-if="params.timeType=='week'&&params.dateType==1"
        type="week"
        v-model="params.weekTime"
        style="width:320px"
      ></date-selector>
      <el-time-picker
        v-if="(params.timeType=='day'||params.timeType=='week')||params.dateType==2"
        v-model="params.limitTime"
        is-range
        value-format="HH:mm:ss"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        style="width:320px;"
      ></el-time-picker>
    </el-form-item>
  </el-form>
</template>

<script>
import DateSelector from '@/components/DateSelector'
export default {
  name: 'date_time_limit_selector',
  props: {
    value: Object,
    title: String,
    showSpecificDate: {
      type: Boolean,
      default: false
    }
  },
  components: { DateSelector },
  data() {
    const dateTypeValidator = (rule, value, cb) => {
      if (value) {
        if (
          this.params.dateType === '1' &&
          (!this.params.dateDetail1 || this.params.dateDetail1.length === 0)
        ) {
          cb(new Error('请选择指定日期,至少一个'))
        } else if (
          this.params.dateType === '2' &&
          (!this.params.dateDetail2 || this.params.dateDetail2.length === 0)
        ) {
          cb(new Error('请选每月的哪一天'))
        }
      } else {
        cb(new Error('请选择活动时间'))
      }
      cb()
    }

    const timeTypeValidator = (rule, value, cb) => {
      // console.log(value)
      if (value) {
        if (this.params.dateType === '1') {
          if (
            (this.params.timeType === 'day' ||
              this.params.timeType === 'week') &&
            (!this.params.limitTime || this.params.limitTime.length === 0)
          ) {
            cb(new Error('请选择开始时间,结束数据'))
          } else if (
            this.params.timeType === 'week' &&
            (!this.params.weekTime || this.params.weekTime.length === 0)
          ) {
            cb(new Error('请选每月的哪一天'))
          }
        } else if (
          this.params.dateType === '2' &&
          (!this.params.limitTime || this.params.limitTime.length === 0)
        ) {
          cb(new Error('请选择开始时间,结束数据'))
        }
      } else {
        cb(new Error('请选择时间限制'))
      }
      cb()
    }
    return {
      params: {
        dateType: '',
        dateDetail1: [],
        dateDetail2: [],
        timeType: '',
        weekTime: [],
        limitTime: null
      },
      rules: {
        dateType: {
          required: true,
          validator: dateTypeValidator,
          trigger: ['blur', 'change']
        },
        timeType: {
          required: true,
          validator: timeTypeValidator,
          trigger: ['blur', 'change']
        },
        limitTime: {
          required: true,
          validator: timeTypeValidator,
          trigger: ['blur', 'change']
        }
      }
    }
  },
  computed: {
    propType() {
      if (this.params.dateType === '1') {
        return 'timeType'
      } else if (this.params.dateType === '2') {
        return 'limitTime'
      }
    }
  },
  watch: {
    params(val, oldVal) {
      if (val !== oldVal) {
        this.$refs.form.validate(flag => {
          if (flag) {
            this.$emit('input', val)
          }
        })
      }
    },
    value(value, oldValue) {
      if (value !== oldValue) {
        this.params = value
      }
    }
  },
  methods: {},
  created() {
    if (this.value) {
      this.params = this.value
    }
  }
}
</script>

<style  lang="scss">
</style>
