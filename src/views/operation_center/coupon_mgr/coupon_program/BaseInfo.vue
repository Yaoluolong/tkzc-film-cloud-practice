<template>
  <div class="app-container">
    <el-form
      label-width="120px"
      style="width:1200px;"
      :model="params"
      :rules="rules"
      ref="baseInfo"
    >
      <el-form-item label="规则模板名称" prop="name">
        <el-input v-model="params.name" placeholder="请输入电影券名称,最多20个字" style="width:320px;"></el-input>
      </el-form-item>
      <el-form-item label="销售时规则是否允许修改" prop="isAllowUpdate" label-width="200">
        <!-- <el-radio-group v-model="params.isAllowUpdate">
          <el-radio :label="2">不允许</el-radio>
          <el-radio :label="1">允许</el-radio>
        </el-radio-group>-->
        <el-radio v-model="params.isAllowUpdate" label="2">不允许</el-radio>
        <el-radio v-model="params.isAllowUpdate" label="1">允许</el-radio>
        <span
          style="font-size:14px;color:rgb(142, 142, 142);margin-left:8px;"
        >业务员在销售电影券时选择该电影券规则模版后是否允许让其进行修改，在创建模版的时候默认是“不允许”！</span>
      </el-form-item>
      <!-- <el-form-item label="电影券销售单号" prop="orderNo" >
          <el-input v-model="params.orderNo" placeholder="请输入电影券销售单号" style="width:320px;"></el-input>
          <span style="font-size:14px;color:rgb(142, 142, 142);margin-left:8px;">这里的规则时间指的是影片的放映场次时间</span>
      </el-form-item>-->
      <el-form-item label="券不可用时段" class="dateTimeLimit" prop="dateLimitType">
        <el-select v-model="params.dateLimitType" style="width:320px;margin-bottom:20px;">
          <el-option label="不限制" value="1"></el-option>
          <el-option label="指定时间" value="2"></el-option>
        </el-select>
        <span style="margin-left:20px;color:gray">电影券不可用时段默认是“不限制”，代表都可用！</span>
      </el-form-item>
      <el-form-item label="券不可用时间" prop="time" v-if="params.dateLimitType==='2'">
        <el-date-picker
          unlink-panels
          v-model="params.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:320px;"
        ></el-date-picker>
        <el-select v-model="params.timeType" style="width:320px;margin-bottom:20px;">
          <el-option label="每天" value="day"></el-option>
          <el-option label="每周" value="week"></el-option>
        </el-select>
        <date-selector
          clearable
          v-if="params.timeType=='week'"
          type="week"
          v-model="params.weekTime"
          style="width:320px"
        ></date-selector>
        <el-time-picker
          v-if="params.timeType=='day'||params.timeType=='week'"
          v-model="params.limitTime"
          is-range
          value-format="HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width:320px;"
        ></el-time-picker>
      </el-form-item>
      <!-- <el-form-item label="券可用时间" prop="time">
         <el-date-picker unlink-panels v-model="params.time" type="daterange"  value-format="yyyy-MM-dd"  start-placeholder="开始日期" end-placeholder="结束日期"  style="width:320px;"></el-date-picker>
         <span style="font-size:14px;color:rgb(142, 142, 142);margin-left:8px;">这里的规则时间指的是影片的放映场次时间</span>
      </el-form-item>
      <el-form-item label="可用限制" v-if="params.time" class="dateTimeLimit">
        <el-select v-model="params.timeType" style="width:320px;margin-bottom:20px">
          <el-option label="不限制" value="-1"></el-option>
          <el-option label="每天" value="day"></el-option>
          <el-option label="每周" value="week"></el-option>
        </el-select>
        <date-selector clearable v-if="params.timeType=='week'" type="week" v-model="params.weekTime" style="width:320px"></date-selector>
        <el-time-picker v-if="params.timeType=='day'||params.timeType=='week'"  v-model="params.limitTime" is-range  value-format="HH:mm:ss"   start-placeholder="开始时间" end-placeholder="结束时间"  style="width:320px;"></el-time-picker>      
      </el-form-item>-->
      <el-form-item label="可用商家" prop="channelId">
        <template v-if="ok || !$route.query.id">
          <channel-selector
            ref="channelComponent"
            v-model="params.channelList"
            type="1"
            :changeFun="channelChangeFun"
          ></channel-selector>
        </template>
      </el-form-item>
      <el-form-item label="可用影院" prop="cinemaGroupId">
        <remote-select
          v-model="params.cinemaGroupId"
          clearable
          placeholder="请选择可用影院"
          action="/systemApi/cinemaGroup/getList"
          :query="{}"
          style="width:230px;"
        ></remote-select>
      </el-form-item>
      <div v-for="(rule,index) in params.ruleList" :key="rule.key" v-if="params.cinemaGroupId">
        <el-form-item
          label="兑换方式："
          :prop="'ruleList.'+index+'.settlementType'"
          :rules="programInfoRules.settlementType"
        >
          <el-select v-model="rule.settlementType" @change="resetDiffRuleChange">
            <el-option value="1" label="根据影厅"></el-option>
            <el-option value="2" label="根据制式"></el-option>
            <el-option value="3" label="根据影片"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择影厅："
          :prop="'ruleList.'+index+'.hallType'"
          :rules="programInfoRules.hallType"
          v-if="params.cinemaGroupId && rule.settlementType === '1'"
          style="width:300px;"
        >
          <tip content="不同类型的影厅可以在影厅管理页面进行配置！">
            <remote-select
              v-model="rule.hallType"
              placeholder="请选择影厅"
              action="/systemApi/dict/getList"
              :query="{type:'hallType'}"
            ></remote-select>
          </tip>
        </el-form-item>
        <el-form-item
          label="选择制式："
          :prop="'ruleList.'+index+'.standard'"
          :rules="programInfoRules.standard"
          v-if="params.cinemaGroupId && rule.settlementType === '2'"
        >
          <standard-selector
            ref="standard"
            v-model="rule.standard"
            :cinemaGroupId="params.cinemaGroupId"
          ></standard-selector>
        </el-form-item>
        <el-form-item
          label="选择影片："
          :prop="'ruleList.'+index+'.filmId'"
          :rules="programInfoRules.filmId"
          v-if="rule.settlementType === '3'"
        >
          <el-radio v-model="rule.filmType" label="-1" @change="filmTypeSelect">全部影片</el-radio>
          <el-radio v-model="rule.filmType" label="1" @change="filmTypeSelect">指定影片</el-radio>
          <film-selector
            :content-list="rule.filmList"
            v-if="rule.filmType === '1'"
            getFilmId
            v-model="rule.filmId"
          ></film-selector>
        </el-form-item>
        <el-form-item label="电影券种类：" prop="couponType">
          <remote-select
            v-model="params.couponType"
            clearable
            placeholder="请选择电影券种类"
            action="/systemApi/dict/getList"
            :query="{type:'couponType'}"
            style="width:230px;"
          ></remote-select>
        </el-form-item>
        <div v-if="params.couponType==='3'">
          <el-form-item
            label="补差类型："
            v-if="rule.settlementType"
            :prop="'ruleList.'+index+'.diffType'"
            :rules="programInfoRules.diffType"
            style="width:350px;"
          >
            <tip content="默认值是固定补差，可以根据实际情况更改未差额补差！">
              <el-radio
                v-model="rule.diffType"
                label="2"
                @change="complementChange(rule.diffType, rule.settlementType)"
              >固定补差</el-radio>
              <el-radio v-model="rule.diffType" label="1">差额补差</el-radio>
            </tip>
          </el-form-item>

          <el-form-item
            label=" "
            label-width="140px"
            v-if="(rule.diffType==='1' && rule.settlementType)"
          >超出此范围需补差额根据影票价格减去电影券最大可兑换价值</el-form-item>

          <el-form-item label="设定补差：" v-if="rule.diffType==='2'&& rule.settlementType==='1'">
            <hall-complement
              v-model="rule.diffRule"
              ref="complementHallRef"
              getHall
              :outDataId="rule.hallType"
              @diffRuleChange="diffByValue"
            ></hall-complement>
          </el-form-item>
          <el-form-item v-if="rule.diffType==='2'&& rule.settlementType==='2'">
            <standard-complement
              v-model="rule.diffRule"
              ref="complementStandardRef"
              getStandard
              :outDataId="rule.standard"
              :cinemaGroupId="params.cinemaGroupId"
              @diffRuleChange="diffByValue"
            ></standard-complement>
          </el-form-item>
          <el-form-item v-if="rule.diffType==='2'&& rule.settlementType==='3'">
            <film-complement
              v-model="rule.diffRule"
              ref="complementRef"
              getFilm
              :filmType="rule.filmType"
              :outDataId="rule.filmId"
              :outDataList="rule.filmList"
              @diffRuleChange="diffByValue"
            ></film-complement>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import CouponSelector from './CouponSelector.vue'
import ChannelSelector from './ChannelSelector'
import CinemaSelector from './CinemaSelector'
import HallSelector from '@/components/HallSelector'
import StandardSelector from '@/views/operation_center/coupon_mgr/sold_coupon_list/StandardSelector'
import DateSelector from '@/components/DateSelector'
import FilmSelector from '@/components/FilmSelector'
import {
  getSettlementPriceCinemaHallList,
  getProgramCopyType
} from '@/api/mallCenter'

import FilmComplement from '@/views/operation_center/FilmComplement'
import StandardComplement from '@/views/operation_center/StandardComplement'
import HallComplement from '@/views/operation_center/HallComplement'

import { realDeepClone } from '@/utils'
import Bus from './bus.js'
export default {
  components: {
    CouponSelector,
    ChannelSelector,
    CinemaSelector,
    DateSelector,
    HallSelector,
    StandardSelector,
    FilmSelector,
    FilmComplement,
    StandardComplement,
    HallComplement
  },
  props: {
    outSideData: Object
  },
  data() {
    return {
      params: this.outSideData
        ? this.outSideData
        : {
          // interfaceTypeId: '',
          couponType: '',
          isAllowUpdate: '2',
          channelId: '',
          channelList: [],
          cinemaId: '',
          cinemaList: [],
          dateLimitType: '1',
          time: [],
          startTime: '',
          endTime: '',
          limitTime: [],
          stime: '',
          etime: '',
          weekTime: [],
          week: '',
          type: '',
          style: '',
          name: '',
          ruleList: [
            {
              filmId: '-1',
              hallId: '',
              hallType: '',
              settlementType: '',
              sort: '',
              standard: '',
              diffType: '2',
              diffRule: {}
            }
          ]
        },
      rules: {
        isAllowUpdate: { required: true, message: '请选择', trigger: 'blur' },
        name: {
          required: true,
          max: 20,
          message: '请输入方案名称,最多20个字',
          trigger: 'blur'
        },
        dateLimitType: {
          required: true,
          message: '请选择券不可用时段',
          trigger: ['blur', 'change']
        },
        time: {
          required: true,
          message: '请选择规则时间',
          trigger: ['blur', 'change']
        },
        channelId: {
          required: true,
          message: '请选择可用商家',
          trigger: 'blur'
        },
        cinemaId: {
          required: true,
          message: '请选择可用影院',
          trigger: 'blur'
        },
        couponType: {
          required: true,
          message: '请选择执行电影券种类',
          trigger: 'change'
        },
        couponStyle: {
          required: true,
          message: '请选择执行电影券类型',
          trigger: 'change'
        }
      },
      programInfoRules: {
        settlementType: {
          required: true,
          message: '请选择兑换方式',
          trigger: 'blur'
        },
        hallId: { required: true, message: '请选择影厅', trigger: 'blur' },
        standard: { required: true, message: '请选择制式', trigger: 'blur' },
        filmId: { required: true, message: '请选择影片', trigger: 'blur' },
        diffType: { required: true, message: '请选择补差类型', trigger: 'blur' }
      },
      ok: false
    }
  },
  watch: {
    'params.cinemaList'(val) {
      if (val) {
        this.params.cinemaId = val.map(e => e.value).join(',')
        Bus.$emit('cinemaId', this.params.cinemaId, val)
      }
    },
    'params.channelList'(val) {
      if (val) {
        this.params.channelId = val.map(e => e.value).join(',')
        Bus.$emit('channelId', this.params.channelId, val)
      }
      this.ok = true
    },
    'params.couponType'(val) {
      if (val === '3') {
        this.complementChange('2', this.params.ruleList[0].settlementType)
      }
    }
  },
  methods: {
    filmTypeSelect(val) {
      if (val === '-1') {
        this.$set(this.params.ruleList[0], 'filmId', '-1')
      } else {
        this.$set(this.params.ruleList, 0, {
          filmType: '1',
          filmId: '',
          hallType: '',
          settlementType: '3',
          sort: '',
          standard: ''
        })
      }
    },
    channelChangeFun(channel, callBack) {
      if (channel.length > 0) {
        channel.map(e => {
          this.params.channelId += e.value + ','
        })
      }
      this.deleteRuleInfoForCinema()
      this.params.ruleList = [
        {
          filmId: '-1',
          filmType: '1',
          hallId: '',
          hallType: '',
          settlementType: '',
          standard: ''
        }
      ]
    },
    cinemaChangeFun(cinema, callBack) {
      if (!cinema.checked) {
        this.$confirm(
          '规则内包含此影院的信息,删除此影院后将删除关联信息',
          '提示',
          { type: 'warning' }
        )
          .then(() => {
            this.params.ruleList = [
              {
                filmId: '-1',
                filmType: '-1',
                hallId: '',
                hallType: '',
                settlementType: '',
                standard: ''
              }
            ]
            this.deleteRuleInfoForCinema(cinema)
            callBack()
          })
          .catch(() => {
            cinema.checked = true
            callBack()
          })
      }
    },
    async cinemaDelFun(cinema, index) {
      if (!this.params.ruleList) {
        this.$refs.cinemaComponent.handleClose(index)
        return
      }
      // 判断是否需要提示
      let flag = false
      for (let i = 0; i < this.params.ruleList.length; i++) {
        const rule = this.ruleList[i]
        if (rule.settlementType === '1') {
          const query = {}
          query.cinemaId = cinema.value
          query.hallType = rule.hallType
          const cinemaHallList = await getSettlementPriceCinemaHallList(query)
          const hall = cinemaHallList[0].hallList.find(e => {
            return (',' + rule.hallId + ',').indexOf(',' + e.id + ',') !== -1
          })
          if (hall) {
            flag = true
            break
          }
        } else if (rule.settlementType === '2') {
          flag = true
          break
        }
      }

      if (flag) {
        // 删除影院的同时删除规则列表中关联此影院的信息
        this.$confirm(
          '规则内包含此影院的信息,删除此影院后将删除关联信息',
          '温馨提示',
          { type: 'warning' }
        ).then(() => {
          this.deleteRuleInfoForCinema(cinema)
          this.$refs.cinemaComponent.handleClose(index)
          this.$forceUpdate()
        })
      } else {
        this.$refs.cinemaComponent.handleClose(index)
      }
    },
    async deleteRuleInfoForCinema(cinema) {
      if (!this.params.ruleList) {
        return
      }
      for (let i = 0; i < this.params.ruleList.length; i++) {
        const rule = this.params.ruleList[i]
        if (rule.settlementType === '1') {
          const query = {}
          if (!cinema) {
            return false
          }
          query.cinemaId = cinema.value
          query.hallType = rule.hallType
          // 找到要删除的影院的所有影厅
          const cinemaHallList = await getSettlementPriceCinemaHallList(query)
          const hallArray = rule.hallId.split(',')
          for (let k = 0; k < hallArray.length; k++) {
            const hallId = hallArray[k]
            for (let j = 0; j < cinemaHallList[0].hallList.length; j++) {
              if (hallId === cinemaHallList[0].hallList[j].id) {
                hallArray[k] = ''
              }
            }
          }
          rule.hallId = hallArray.filter(e => e).join(',')
        } else if (rule.settlementType === '2') {
          let paramCinemaIdArray = this.params.cinemaId.split(',')
          for (var k = 0; k < paramCinemaIdArray.length; k++) {
            const el = paramCinemaIdArray[k]
            if (el === cinema.value) {
              paramCinemaIdArray[k] = ''
            }
          }
          paramCinemaIdArray = paramCinemaIdArray.filter(e => e)
          if (paramCinemaIdArray.length > 0) {
            const requestCinemaIds = paramCinemaIdArray.join(',')
            const standards = await getProgramCopyType(requestCinemaIds)
            if (rule.standard) {
              const ruleStandards = rule.standard.split(',')
              for (var a = 0; a < ruleStandards.length; a++) {
                let flag = true
                const el = ruleStandards[a]
                for (var b = 0; b < standards.length; b++) {
                  if (el === standards[b]) {
                    flag = false
                  }
                }
                if (flag) {
                  ruleStandards[a] = ''
                }
              }
              rule.standard = ruleStandards.filter(e => e).join(',')
            }
          } else {
            rule.standard = ''
          }
        }
      }
    },
    checkCinemaList() {
      /* if (this.params.ruleList[0].settlementType !== '3' && (!this.params.cinemaList || this.params.cinemaList.length === 0)) {
        this.params.ruleList[0].settlementType = ''
        this.$message.warning('请先选择影院')
        return false
      }*/
    },
    getResult() {
      return new Promise((resolve, reject) => {
        this.$refs.baseInfo.validate(valid => {
          if (valid) {
            const params = realDeepClone(this.params)
            params.startTime = this.params.time[0]
            params.endTime = this.params.time[1]
            delete params.channelList
            delete params.cinemaList
            delete params.time

            if (params.ruleList[0].filmType === '-1') {
              params.ruleList[0].filmId = '-1'
            }
            params.isAllowUpdate = params.isAllowUpdate.toString()
            console.log(params, 998)
            resolve(params)
          } else {
            reject(false)
          }
        })
      })
    },
    // 如果某条规则选择了全部影片那么将其他规则清除
    selectAllHallCallBack(index) {
      if (this.params.ruleList && this.params.ruleList.length > 0) {
        const temp = this.params.ruleList[index]
        temp.showAdd = 'false'
        this.params.ruleList = []
        this.params.ruleList.push(temp)
      }
    },
    selectNotAllHallCallBack(index) {
      this.params.ruleList[index].showAdd = 'true'
    },
    // 获取需要排除的影厅id
    getDisablehallIds(index) {
      let temp = []
      for (let i = 0; i < this.params.ruleList.length; i++) {
        if (i === index) {
          continue
        }
        if (this.params.ruleList[i].hallId) {
          const hallIdArray = this.params.ruleList[i].hallId.split(',')
          temp = [...temp, ...hallIdArray]
        }
      }
      return temp
    },
    // 获取需要排除的制式
    getDisableStandards(index) {
      let temp = []
      for (let i = 0; i < this.params.ruleList.length; i++) {
        if (i === index) {
          continue
        }
        if (this.params.ruleList[i].standard) {
          const standardArray = this.params.ruleList[i].standard.split(',')
          temp = [...temp, ...standardArray]
        }
      }
      return temp
    },
    diffByValue(val) {
      this.$set(this.params.ruleList[0], 'diffRule', val)
    },
    complementChange(val, settlementType) {
      this.$nextTick(e => {
        if (val === '2') {
          if (settlementType === '2') {
            this.$refs['complementStandardRef'][0].geDdataId()
          } else if (settlementType === '3') {
            this.$refs['complementRef'][0].geDdataId()
          } else if (settlementType === '1') {
            this.$refs['complementHallRef'][0].geDdataId()
          }
        }
      })
    },
    resetDiffRuleChange(val) {
      this.$set(this.params.ruleList[0], 'diffRule', {})
      const settlementType = this.params.ruleList[0].settlementType
      this.$set(this.params, 'ruleList', [
        {
          filmId: '-1',
          filmType: '-1',
          hallType: '',
          settlementType: settlementType,
          sort: '',
          standard: '',
          diffType: '2',
          diffRule: {}
        }
      ])
      /* this.$set(this.params.ruleList[0], 'diffType', '2')
      this.$set(this.params.ruleList[0], 'diffType', '2')
      this.$set(this.params.ruleList[0], 'diffRule', {})*/
      this.complementChange('2', val)
    }
  },
  created() {
    Bus.$on('rules', val => {
      this.params.ruleList = val
    })
    // this.params.isAllowUpdate = parseInt(this.params.isAllowUpdate)
    this.params.weekTime = this.params.week.split(',')
    this.params.ruleList = [
      {
        filmId: '-1',
        hallId: '',
        hallType: '',
        settlementType: '',
        sort: '',
        standard: ''
      }
    ]
  }
}
</script>

<style scoped lang="scss">
.app-container {
  margin: 0px;
}
.dateTimeLimit {
  margin-bottom: 0;
}
</style>
