<template>
  <div class="time-range vm">
    <el-form inline :model="form" ref="form" size="small">
      <el-form-item
        class="time-range-item vm"
        v-for="(timeItem,timeIndex) in timeList"
        :prop="'time.' + timeIndex + '.valid'"
        :key="timeIndex"
        :rules="itemRule"
      >
        <el-time-picker
          is-range
          v-model="timeItem.valid"
          range-separator
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          @change="valid=>onTimeChange(valid,timeItem)"
          style="width:200px;"
          :value-format="dateOptions.valueFormat"
          :format="dateOptions.format"
        ></el-time-picker>
        <i type="danger" v-if="timeList.length>1" class="del-icon el-icon-circle-close" @click="delTime(timeIndex)"></i>
      </el-form-item>
      <!-- </div> -->
    </el-form>
    <el-button v-if="timeList.length<maxNumber" @click="addTimeRange" size="small" class="add-button">+时段</el-button>
    <!-- <el-button @click="onValidate">测试</el-button> -->
  </div>
</template>
<script>
export default {
  data() {
    const validTime = (rule, value, cb) => {
      console.log(value)
      if (!value || !value.length) {
        return cb(new Error('请选择时间'))
      } else {
        return cb()
      }
    }
    return {
      maxNumber: 10,
      form: {
        time: this.timeList
      },
      itemRule: { validator: validTime, message: '请选择时间', trigger: 'blur' },
      dateOptions: {
        'valueFormat': 'HH:mm:ss',
        'format': 'HH:mm:ss'
      }
    }
  },
  props: {
    timeList: {
      type: Array,
      default() {
        return []
      }
    },
    dateAttr: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    timeLen(val) {
      if (val === this.maxNumber) {
        this.$notify({
          title: '提示',
          message: `最多只能添加${this.maxNumber}个时段`,
          type: 'warning'
        })
      }
    },
    'timeList': {
      handler(val) {
        this.form.time = JSON.parse(JSON.stringify(val))
        console.log('watch-timeRange')
        this.$emit('change', this.timeList)
      },
      deep: true
    }
  },
  created() {
    this.form.time = JSON.parse(JSON.stringify(this.timeList))
    this.dateOptions = {
      ...this.dateOptions,
      ...this.dateAttr
    }
  },
  computed: {
    timeLen() {
      return this.timeList.length
    }
  },
  methods: {
    onTimeChange(valid, item) {
      if (valid && valid.length === 2) {
        item.startTime = valid[0]
        item.endTime = valid[1]
      } else {
        item.startTime = ''
        item.endTime = ''
      }
    },
    addTimeRange() {
      if (this.timeList.length < this.maxNumber) {
        this.timeList.push({ startTime: null, endTime: null })
      }
    },
    delTime(timeIndex) {
      this.timeList.splice(timeIndex, 1)
    },
    validate() {
      return this.$refs.form ? this.$refs.form.validate() : Promise.resolve()
    },
    onValidate() {
      console.log(this.$refs.form.validate())
      this.validate().then(d => {
        console.log(d)
        console.log('success')
      }).catch(e => {
        console.log('success')
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.time-range {
  padding-right: 80px;
  box-sizing: border-box;
  position: relative;
  min-height: 43px;
  &-item {
    position: relative;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    .del-icon {
      position: absolute;
      top: -5px;
      right: -5px;
    }
  }
  .add-button {
    height: 32px;
    font-size: 12px;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
