<template>
  <div class="app-container">
    <base-info :outSideData="params" ref="baseInfo"></base-info>
    <div style="text-align:center;margin-top:20px">
      <el-button type="primary" @click="save" v-if="!look">保存</el-button>
      <el-button @click="cancel" >取消</el-button>
    </div>
  </div>
</template>

<script>
import BaseInfo from './BaseInfo.vue'
import RuleList from './RuleList.vue'
import { createCouponProgram, getCouponProgramInfo, updateCouponProgram } from '@/api/operationCenter'
// import { objectMerge } from '@/utils'
export default {
  name: 'edit_coupon_program',
  components: { BaseInfo, RuleList },
  data() {
    return {
      params: {
        interfaceTypeId: '',
        isAllowUpdate: '2',
        ruleList: [],
        cinemaId: '',
        cinemaList: [],
        channelId: '',
        channelList: [],
        time: [],
        startTime: '',
        endTime: '',
        // limitTime: [],
        etime: '',
        stime: '',
        weekTime: [],
        week: '',
        couponTypeId: '',
        couponTypeList: [],
        name: '',
        timeType: '-1',
        way: '1'
      },
      activeNames: ['1', '2'],
      programInfo: {
        programInfo: {}
      }
    }
  },
  methods: {
    async save() {
      let params = {}
      try {
        params = Object.assign({}, (await this.$refs.baseInfo.getResult()))
        if (params.limitTime) {
          // params.limitTime.forEach(e => {
          params.stime = params.limitTime[0]
          params.etime = params.limitTime[1]
          // })
          delete params.limitTime
        }

        if (params.weekTime && params.weekTime.length > 0) {
          params.week = params.weekTime.join(',')
          delete params.weekTime
        }
        this.$set(params, 'isTemplate', '1')

        this.$set(this.programInfo, 'programInfo', params)
        this.$route.query.id ? Object.assign(this.programInfo, { id: this.$route.query.id }) : ''

        this.$route.query.id ? updateCouponProgram(this.programInfo).then((e) => {
          this.$message.success('保存成功')
          this.closeTab(true)
          this.$router.push('/operation_center/coupon_mgr/coupon_program')
        }) : createCouponProgram(this.programInfo).then((e) => {
          this.$message.success('保存成功')
          this.closeTab(true)
          this.$router.push('/operation_center/coupon_mgr/coupon_program')
        })
      } catch (error) {
        console.log(error)
      }
    },
    cancel() {
      this.closeTab()
      this.$router.push('/operation_center/coupon_mgr/coupon_program')
    }
  },
  async created() {
    // 编辑
    if (this.$route.query.id) {
      this.params = Object.assign(this.params, await getCouponProgramInfo(this.$route.query.id))
      if (this.params.ruleList[0] && this.params.ruleList[0].filmId !== '-1') {
        delete this.params.ruleList[0].id
        delete this.params.ruleList[0].programId
        delete this.params.ruleList[0].ruleName
        delete this.params.ruleList[0].sort
        delete this.params.ruleList[0].priceRule
        delete this.params.ruleList[0].hallId
        this.$set(this.params.ruleList[0], 'filmType', '1')
        this.params.ruleList[0].filmId = this.params.ruleList[0].filmId ? this.params.ruleList[0].filmId : ''
        this.params.ruleList[0].hallType = this.params.ruleList[0].hallType ? this.params.ruleList[0].hallType : ''
        this.params.ruleList[0].settlementType = this.params.ruleList[0].settlementType ? this.params.ruleList[0].settlementType : ''
        this.params.ruleList[0].standard = this.params.ruleList[0].standard ? this.params.ruleList[0].standard : ''
      } else {
        this.$set(this.params.ruleList[0], 'filmType', '-1')
        delete this.params.ruleList[0].id
        delete this.params.ruleList[0].programId
        delete this.params.ruleList[0].ruleName
        delete this.params.ruleList[0].sort
        delete this.params.ruleList[0].priceRule
        delete this.params.ruleList[0].hallId
        delete this.params.ruleList[0].filmList
        this.$set(this.params.ruleList[0], 'filmType', '-1')
        this.params.ruleList[0].filmId = this.params.ruleList[0].filmId ? this.params.ruleList[0].filmId : ''
        this.params.ruleList[0].hallType = this.params.ruleList[0].hallType ? this.params.ruleList[0].hallType : ''
        this.params.ruleList[0].settlementType = this.params.ruleList[0].settlementType ? this.params.ruleList[0].settlementType : ''
        this.params.ruleList[0].standard = this.params.ruleList[0].standard ? this.params.ruleList[0].standard : ''
      }
      this.params.time = []
      if (this.params.startTime) {
        this.params.time[0] = this.params.startTime
      }
      if (this.params.endTime) {
        this.params.time[1] = this.params.endTime
      }
      if (this.params.stime && this.params.etime) {
        this.$set(this.params, 'limitTime', [])
        this.params.limitTime[1] = this.params.etime
        this.params.limitTime[0] = this.params.stime
      }
      this.params.weekTime = []
      if (this.params.week) {
        this.params.weekTime = this.params.week.split(',')
        this.params.weekTime = this.params.weekTime.map(e => {
          return parseInt(e)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
