<template>
  <div class="content-item">
    <div class="button-item mr20 vm">
      <el-date-picker
        class="w400"
        v-model="queryParams.joinTime"
        align="right"
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        ormat="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        unlink-panels
        @change="changeDateRange"
      ></el-date-picker>
    </div>
    <el-radio-group v-model="queryParams.dateType" @change="changeTimeType" class="vm">
      <el-radio-button
        v-for="(item,index) in dateTypeList"
        :key="index"
        :label="item.label"
        v-if="getShowType(item.label)"
      >{{item.name}}</el-radio-button>
      <!-- <el-radio-button label="yesterday">昨日</el-radio-button>
      <el-radio-button label="prve30Days">近30天</el-radio-button>-->
      <!-- <el-radio-button label="nowWeek">本周</el-radio-button>
            <el-radio-button label="prveWeek">上周</el-radio-button>
            <el-radio-button label="nowYear">本年</el-radio-button>
            <el-radio-button label="prveYear">上年</el-radio-button>
      <el-radio-button label="all">全部</el-radio-button>-->
    </el-radio-group>
  </div>
</template>

<script>
import { getData } from '@/utils/date'
export default {
  props: {
    defaultChooseType: {
      type: Array,
      default() {
        return ['yesterday', 'prve7Days', 'prve30Days']
      }
    }
  },
  data() {
    return {
      queryParams: {
        dateType: 'today',
        joinTime: []
      },
      dateTypeList: [
        {
          label: 'today',
          name: '今日'
        },
        {
          label: 'yesterday',
          name: '昨天'
        },
        {
          label: 'prve7Days',
          name: '近7天'
        },
        {
          label: 'prve30Days',
          name: '近30天'
        },
        {
          label: 'nowWeek',
          name: '本周'
        },
        {
          label: 'prveWeek',
          name: '上周'
        },
        {
          label: 'nowMonth',
          name: '本月'
        },
        {
          label: 'prveMonth',
          name: '上月'
        },
        {
          label: 'nowYear',
          name: '本年'
        },
        {
          label: 'prveYear',
          name: '上年'
        },
        {
          label: 'all',
          name: '全部'
        }
      ]
    }
  },
  created() {
    this.queryParams.dateType = this.defaultChooseType[0]
    this.changeTimeType(this.queryParams.dateType)
  },
  methods: {
    changeDateRange(val) {
      // if (!val) {
      this.queryParams.dateType = val ? '' : 'all'
      this.queryParams.joinTime = val || ['', '']
      // }
      this.$emit('on-change', this.queryParams)
    },
    changeTimeType(val) {
      this.chooseTimeType(val)
      this.$emit('on-change', this.queryParams)
    },
    // 获取需要展示的选项类型
    getShowType(type) {
      const index = this.defaultChooseType.findIndex(e => e === type)
      return index !== -1
    },
    chooseTimeType(val) {
      const time = new Date()
      const Year = time.getFullYear()
      let startTime = ''
      let endTime = ''
      switch (val) {
        case 'today':
          startTime = getData('today') + ' 00:00:00'
          endTime = getData('today') + ' 23:59:59'
          break
        case 'yesterday':
          startTime = getData('yesterday') + ' 00:00:00'
          endTime = getData('yesterday') + ' 23:59:59'
          break
        case 'nowWeek':
          startTime = getData('nowWeekStart') + ' 00:00:00'
          endTime = getData('nowWeekEnd') + ' 23:59:59'
          break
        case 'prveWeek':
          startTime = getData('prveWeekStart') + ' 00:00:00'
          endTime = getData('prveWeekEnd') + ' 23:59:59'
          break
        case 'prve7Days':
          startTime = getData('prve7Days') + ' 00:00:00'
          endTime = getData('today') + ' 23:59:59'
          break
        case 'prve30Days':
          startTime = getData('prve30Days') + ' 00:00:00'
          endTime = getData('today') + ' 23:59:59'
          break
        case 'nowMonth':
          startTime = getData('nowMonthStart') + ' 00:00:00'
          endTime = getData('nowMonthEnd') + ' 23:59:59'
          break
        case 'prveMonth':
          startTime = getData('prveMonthStart') + ' 00:00:00'
          endTime = getData('prveMonthEnd') + ' 23:59:59'
          break
        case 'nowYear':
          startTime = Year + '-01-01 00:00:00'
          endTime = Year + '-12-31 23:59:59'
          break
        case 'prveYear':
          startTime = Year - 1 + '-01-01 00:00:00'
          endTime = Year - 1 + '-12-31 23:59:59'
          break
        case 'all':
          startTime = ''
          endTime = ''
          break
      }
      this.$set(this.queryParams, 'joinTime', [startTime, endTime])
    }
  }
}
</script>
