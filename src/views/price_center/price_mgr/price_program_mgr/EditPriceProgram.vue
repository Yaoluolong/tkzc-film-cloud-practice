<template>
  <div class="app-container edit-price-program">
    <el-form
      label-width="140px"
      label-position="left"
      style="width:1000px;"
      :model="params"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="价格方案名称" prop="name">
        <el-input v-model.trim="params.name" placeholder="请输入价格方案名称，最多10个字" style="width:320px"></el-input>
      </el-form-item>
      <el-form-item label="价格有效期" prop="time" v-if="params.programType==1">
        <el-date-picker
          unlink-panels
          v-model="params.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:320px;"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="活动价格发起" prop="sponserType">
        <el-radio v-model="params.sponserType" label="1">公司</el-radio>
        <remote-select v-if="params.sponserType == '1'" v-model="params.companyId"></remote-select>
        <el-radio v-model="params.sponserType" label="2">影院</el-radio>
        <cinema-id-selector v-if="params.sponserType == '2'" v-model="params.sponserCinemaId" clearable style="width:200px"></cinema-id-selector>
      </el-form-item>-->
      <el-form-item v-if="params.programType==2" label="价格优先级别序号" prop="sort">
        <tip content="同个公司/影院发起的活动价格，优先级别数值越大说明优先级越高。" style="width:320px;">
          <el-input v-model.trim="params.sort" placeholder="输入价格优先序号"></el-input>
        </tip>
      </el-form-item>
      <date-time-limit-selector
        v-if="params.programType==2"
        :showSpecificDate="true"
        title="服务费时间"
        v-model="dateTimeListParams"
      ></date-time-limit-selector>
      <!-- <el-form-item label="活动时间" prop="dateType" v-if="params.programType==2">
         <el-select v-model="params.dateType" style="width:320px">
           <el-option label="指定日期" value="1"></el-option>
           <el-option label="每月" value="2"></el-option>
         </el-select>
         <el-date-picker  unlink-panels v-if="params.dateType==1" v-model="params.dateDetail1" type="daterange"  value-format="yyyy-MM-dd"  start-placeholder="开始日期" end-placeholder="结束时间" style="width:320px;"></el-date-picker>
         <date-selector clearable v-if="params.dateType==2" v-model="params.dateDetail2" style="width:320px"></date-selector>
      </el-form-item>
      <el-form-item label="时间限制" :prop="propType" v-if="params.programType==2&&params.dateType">
         <el-select v-model="params.timeType" style="width:320px;margin-bottom:20px" v-if="params.dateType==1">
           <el-option label="不限制" value="-1"></el-option>
           <el-option label="每天" value="day"></el-option>
           <el-option label="每周" value="week"></el-option>
         </el-select>
         <date-selector clearable v-if="params.timeType=='week'&&params.dateType==1" type="week" v-model="params.weekTime" style="width:320px"></date-selector>
         <el-time-picker v-if="(params.timeType=='day'||params.timeType=='week')||params.dateType==2"  v-model="params.limitTime" is-range  value-format="HH:mm:ss"   start-placeholder="开始时间" end-placeholder="结束时间"  style="width:320px;"></el-time-picker>

      </el-form-item>-->
      <el-form-item label="影院定价分组" prop="policyGroupId">
        <remote-select
          v-model="params.policyGroupId"
          @change-data="policyGroupChange"
          placeholder="请选择"
          action="/systemApi/cinemaPriceGroup/getList"
          style="width:320px"
        ></remote-select>
      </el-form-item>

      <el-form-item v-if="params.policyGroupId" label="执行商家" prop="channelId">
        <channel-id-selector v-model="params.channelId" style="width:320px"></channel-id-selector>
      </el-form-item>
      <el-form-item v-if="params.policyGroupId" label="执行影院" prop="cinemaList">
        <cinema-selector
          v-model="params.cinemaList"
          outNeedGroupId
          :outGroupId="params.policyGroupId"
        ></cinema-selector>
        <!-- <tip v-if="params.programType == 1" slot="btn" content="同一影院在价格有效期时间内有交集的情况下只能创建一条常规价格方案！" style="width:10px;height:36px"></tip> -->
      </el-form-item>

      <el-form-item label="方案类型" prop="type" v-if="params.cinemaList.length>0">
        <el-select v-model="params.type" style="width:320px" placeholder="请选择">
          <el-option value="1" label="根据影片" v-if="params.programType==2"></el-option>
          <el-option value="2" label="根据影厅"></el-option>
          <el-option value="3" label="根据制式"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="params.type">
        <el-card
          v-for="(rule,index) in params.priceRule"
          :key="index"
          shadow="hover"
          class="rule-card"
        >
          <el-form-item label="选择影厅" :prop="'rule'+index" v-if="params.type==2">
            <!-- <el-radio v-model="rule.type" label="-1">全部影厅</el-radio>
            <el-radio v-model="rule.type" label="1">指定影厅</el-radio>-->
            <!-- <hall-selector v-if="rule.type==1" v-model="rule.content" style="margin-top:10px;" :cinema-list="params.cinemaList"></hall-selector> -->
            <hall-selector
              :index="index"
              :selectTypeNotAllCallBack="selectNotAllHallCallBack"
              :selectTypeAllCallBack="selectAllHallCallBack"
              v-if="rule.type==1"
              v-model="rule.content"
              ref="hallSelector"
              :disableHallIds="getDisablehallIds(index)"
              :cinemaList="params.cinemaList"
            ></hall-selector>
          </el-form-item>
          <el-form-item label="选择制式" :prop="'rule'+index" v-else-if="params.type==3">
            <copy-type-selector
              v-model="rule.content"
              :cinemaIds="params.cinemaId"
              :needAdd="false"
            ></copy-type-selector>
          </el-form-item>
          <el-form-item label="选择影片" :prop="'rule'+index" v-else-if="params.type==1">
            <el-radio v-model="rule.type" label="-1">全部影片</el-radio>
            <el-radio v-model="rule.type" label="1">指定影片</el-radio>
            <film-selector
              v-model="rule.content"
              :content-list="rule.contentList"
              v-if="rule.type==1"
              style="margin-top:10px;"
            ></film-selector>
          </el-form-item>
          <el-form-item label="是否允许调价：" :prop="'modifyPrice'+index" style="width:320px;">
            <tip content="默认不允许调价，当选择允许调价的时候，那么该商家就必须遵守我们提供的商家排期价格基础上允许调价的范围">
              <el-radio-group
                v-model="rule.modifyPrice"
                size="medium"
                @change="modifyPriceChange(rule.modifyPrice,index)"
              >
                <el-radio label="-1">允许</el-radio>
                <el-radio label="0">不允许</el-radio>
              </el-radio-group>
            </tip>
          </el-form-item>
          <div :key="index" v-if="rule.modifyPrice==='0'">
            <!--  class="form-item-row" -->
            <el-form-item label="平台票价" :prop="'ticketPrice'+index">
              <el-input
                style="width:220px"
                v-model.trim="rule.ticketPrice"
                :placeholder="(policyRight==2||policyRight==5)? ticketPriceStr:'请输入'"
                v-if="canTicketPrice"
              >
                <template>&emsp;元</template>
              </el-input>
              <span style="color:#909399;width:150px" v-else>（由于不可定价以影院排期页面为准）</span>
            </el-form-item>
            <el-form-item label="影院服务费" :prop="'cinemaService'+index">
              <el-input
                style="width:220px"
                v-model.trim="rule.cinemaService"
                :placeholder="(policyRight==2||policyRight==6)? servicePriceStr:'请输入'"
                v-if="canCinemaService"
              >
                <template>&emsp;元</template>
              </el-input>
              <span style="color:#909399;width:200p;" v-else>（由于不可定价以影院排期页面为准）</span>
              <div class="oper" style="float:right">
                <i
                  class="el-icon-remove info"
                  title="移除该规则"
                  @click="removeRule(index)"
                  v-if="params.priceRule.length>1"
                ></i>
                <i
                  class="el-icon-circle-plus danger"
                  title="添加规则"
                  @click="newRule"
                  v-if="index==params.priceRule.length-1 && !look && rule.showAdd"
                ></i>
              </div>
            </el-form-item>
          </div>

          <div :key="index" v-if="rule.modifyPrice==='-1'">
            <!-- class="form-item-row" -->
            <el-form-item label="平台票价" :prop="'ticketPrice'+index">
              <el-input
                style="width:220px"
                v-model.trim="rule.ticketPrice"
                :placeholder="(policyRight==2||policyRight==5)? ticketPriceStr:'请输入'"
                v-if="canTicketPrice"
              >
                <template>&emsp;元</template>
              </el-input>
              <span style="color:#909399;width:150px" v-else>（由于不可定价以影院排期页面为准）</span>
            </el-form-item>
            <el-form-item label="影院服务费" :prop="'cinemaService'+index" class="modifyPriceNo">
              调价下限&emsp;
              <el-input style="width:140px" v-model.trim="rule.cinemaService" placeholder="0.00">
                <!--  v-if="canCinemaService" -->
                <!-- <template slot="append">元</template> -->
              </el-input>&emsp;元
              调价上限&emsp;
              <el-input style="width:140px" v-model.trim="rule.thresholds" placeholder="0.00">
                <!-- v-if="canCinemaService" -->
                <!-- <template slot="append">元</template> -->
              </el-input>&emsp;元
              <!-- <span style="color:#909399;width:200p;" v-else>（由于不可定价以影院排期页面为准）</span> -->
              <div class="oper" style="float:right">
                <i
                  class="el-icon-remove info"
                  title="移除该规则"
                  @click="removeRule(index)"
                  v-if="params.priceRule.length>1"
                ></i>
                <i
                  class="el-icon-circle-plus danger"
                  title="添加规则"
                  @click="newRule"
                  v-if="index==params.priceRule.length-1 && !look && rule.showAdd"
                ></i>
              </div>
            </el-form-item>
          </div>

          <!-- <i class="el-icon-remove-outline warning remove-rule" title="移除该规则" v-if="params.priceRule.length>1" @click="removeRule(index)"></i> -->
        </el-card>
        <el-form-item style="text-align:center;margin-top:20px">
          <!-- <el-button type="warning" @click="newRule" icon="el-icon-circle-plus-outline" v-if="!look">添加规则</el-button> -->
        </el-form-item>
      </template>
      <el-form-item style="text-align:center;margin-top:20px">
        <el-button type="primary" @click="save" v-if="!look">保 存 方 案</el-button>
        <el-button @click="closeTab">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  createPriceProgram,
  updatePriceProgram,
  getPriceProgramInfo
} from '@/api/priceCenter'
// import CinemaSelector from './CinemaSelector'
import CinemaSelector from '@/components/CinemaSelector'
// import HallSelector from './HallSelector'
import DateTimeLimitSelector from '../DateTimeLimitSelector'
import HallSelector from '@/components/HallSelector'
import FilmSelector from '@/components/FilmSelector'
import CopyTypeSelector from '@/components/CopyTypeSelector'
import DateSelector from '@/components/DateSelector'
import { split } from '@/utils'
import { isPositive } from '@/utils/validate'
import { realDeepClone } from '@/utils'
export default {
  name: 'edit_price_program',
  components: {
    CinemaSelector,
    HallSelector,
    CopyTypeSelector,
    FilmSelector,
    DateSelector,
    DateTimeLimitSelector
  },
  data() {
    // const dateTypeValidator = (rule, value, cb) => {
    //   if (value) {
    //     if (this.params.dateType === '1' && (!this.params.dateDetail1 || this.params.dateDetail1.length === 0)) {
    //       cb(new Error('请选择指定日期,至少一个'))
    //     } else if (this.params.dateType === '2' && (!this.params.dateDetail2 || this.params.dateDetail2.length === 0)) {
    //       cb(new Error('请选每月的哪一天'))
    //     }
    //   } else {
    //     cb(new Error('请选择活动时间'))
    //   }
    //   cb()
    // }
    // const timeTypeValidator = (rule, value, cb) => {
    //   // console.log(value)
    //   if (value) {
    //     if (this.params.dateType === '1') {
    //       if ((this.params.timeType === 'day' || this.params.timeType === 'week') && (!this.params.limitTime || this.params.limitTime.length === 0)) {
    //         cb(new Error('请选择开始时间,结束数据'))
    //       } else if (this.params.timeType === 'week' && (!this.params.weekTime || this.params.weekTime.length === 0)) {
    //         cb(new Error('请选每月的哪一天'))
    //       }
    //     } else if (this.params.dateType === '2' && (!this.params.limitTime || this.params.limitTime.length === 0)) {
    //       cb(new Error('请选择开始时间,结束数据'))
    //     }
    //   } else {
    //     cb(new Error('请选择时间限制'))
    //   }
    //   cb()
    // }
    const sponserTypeValidator = (rule, value, cb) => {
      if (value) {
        if (this.params.sponserType === '1' && !this.params.companyId) {
          cb(new Error('请选择发起公司'))
        } else if (
          this.params.sponserType === '2' &&
          !this.params.sponserCinemaId
        ) {
          cb(new Error('请选择发起影院'))
        }
      } else {
        cb(new Error('请选择活动价格发起的公司或者影院'))
      }
      cb()
    }
    const sortValidator = (rule, value, cb) => {
      const NumReg = /^[1-9]\d*$/
      if (value) {
        if (!NumReg.test(this.params.sort)) {
          cb(new Error('请输入正整数'))
        }
      } else {
        cb(new Error('请输入价格优先序号'))
      }
      cb()
    }
    return {
      params: {
        cinemaList: [],
        priceRule: [],
        type: '',
        policyGroupId: ''
      },
      dateTimeListParams: {
        dateType: '',
        dateDetail1: [],
        dateDetail2: [],
        timeType: '',
        weekTime: [],
        limitTime: null
      },
      propType: '',
      rules: {
        name: {
          required: true,
          max: 10,
          message: '请输入价格方案名称，最多10个字',
          trigger: 'blur'
        },
        time: {
          required: true,
          message: '请选择价格有效期',
          trigger: 'change'
        },
        policyGroupId: {
          required: true,
          message: '请选择归属影院策略组',
          trigger: 'change'
        },
        channelId: {
          required: true,
          message: '请选择实行渠道商',
          trigger: ['change', 'blur']
        },
        cinemaList: { required: true, message: '请选择价格适用影院' },
        type: { required: true, message: '请选择方案类型', trigger: 'change' },
        sort: {
          required: true,
          validator: sortValidator,
          trigger: ['blur', 'change']
        },
        // dateType: { required: true, validator: dateTypeValidator, trigger: ['blur', 'change'] },
        // timeType: { required: true, validator: timeTypeValidator, trigger: ['blur', 'change'] },
        // limitTime: { required: true, validator: timeTypeValidator, trigger: ['blur', 'change'] },
        sponserType: {
          required: true,
          validator: sponserTypeValidator,
          trigger: ['change']
        }
      },
      policyRight: '',
      servicePriceStr: '',
      serviceRange: {},
      ticketPriceStr: '',
      priceRightRule: {
        ticketPrice: '',
        servicePrice: ''
      },
      priceRange: {},
      isInit: false
    }
  },
  computed: {
    canTicketPrice() {
      const policyRight = this.policyRight
      return (
        policyRight === '1' ||
        policyRight === '2' ||
        policyRight === '3' ||
        policyRight === '5'
      )
    },
    canCinemaService() {
      const policyRight = this.policyRight
      return (
        policyRight === '1' ||
        policyRight === '2' ||
        policyRight === '4' ||
        policyRight === '6'
      )
    }
  },
  watch: {
    'params.policyGroupId'(val) {
      if (!this.isInit) {
        // this.params.cinemaList = []
        this.$set(this.params, 'cinemaList', [])
      }
    },
    'params.cinemaList'(val) {
      if (!this.isInit) {
        this.params.type = ''
      }
      if (val) {
        const result = []
        val.forEach(e => {
          result.push(e.value)
        })
        this.params.cinemaId = result.join(',')
      }
    },
    'params.type'(val, oldVal) {
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      if (oldVal) {
        this.params.priceRule = []
        this.newRule()
      }
    }
    // 'params.dateType'(val) {
    //   if (val === '1') {
    //     this.propType = 'timeType'
    //   } else if (val === '2') {
    //     this.propType = 'limitTime'
    //   }
    // }
  },
  methods: {
    // 如果某条规则选择了全部影片那么将其他规则清除
    selectAllHallCallBack(index) {
      if (this.params.priceRule && this.params.priceRule.length > 0) {
        const temp = this.params.priceRule[index]
        temp.showAdd = false
        this.params.priceRule = []
        this.params.priceRule.push(temp)
      }
    },
    selectNotAllHallCallBack(index) {
      this.params.priceRule[index].showAdd = true
    },
    // 切换是否允许加价后 重置金额
    modifyPriceChange(val, index) {
      this.$set(this.params.priceRule[index], 'ticketPrice', '')
      this.$set(this.params.priceRule[index], 'cinemaService', '')
      this.$set(this.params.priceRule[index], 'thresholds', '')
    },
    // 获取需要排除的影厅id
    getDisablehallIds(index) {
      let temp = []
      for (let i = 0; i < this.params.priceRule.length; i++) {
        if (i === index) {
          continue
        }
        if (this.params.priceRule[i].content) {
          const hallIdArray = this.params.priceRule[i].content.split(',')
          temp = [...temp, ...hallIdArray]
        }
      }
      return temp
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const params = Object.assign({}, this.params)
          params.cinemaId = this.params.cinemaList.map(e => e.value).join(',')
          if (params.programType === '1') {
            // 常规
            params.startDate = params.time[0]
            params.endDate = params.time[1]
          } else if (params.programType === '2') {
            // 活动
            params.dateType = this.dateTimeListParams.dateType
            params.timeType = this.dateTimeListParams.timeType

            if (params.dateType === '1') {
              params.dateDetail = this.dateTimeListParams.dateDetail1.join(',')
              if (params.timeType === 'day') {
                // params.startTime = params.limitTime[0]
                // params.endTime = params.limitTime[1]
              } else if (params.timeType === 'week') {
                params.week = this.dateTimeListParams.weekTime.join(',')
                // params.startTime = params.limitTime[0]
                // params.endTime = params.limitTime[1]
              }
            } else if (params.dateType === '2') {
              params.dateDetail = this.dateTimeListParams.dateDetail2.join(',')
            }
            if (this.dateTimeListParams.limitTime) {
              params.startTime = this.dateTimeListParams.limitTime[0]
              params.endTime = this.dateTimeListParams.limitTime[1]
            }
          }
          params.cinemaList = JSON.stringify(params.cinemaList)
          const request = realDeepClone(params)
          delete request.dateDetail2
          delete request.dateDetail1
          delete request.time
          request.priceRule.forEach(e => {
            delete e.showAdd
          })
          await (params.id
            ? updatePriceProgram(request)
            : createPriceProgram(request))
          this.$message.success('保存成功')
          this.closeTab(true)
        }
      })
    },
    newRule(rule, index) {
      if (!rule) {
        rule = { type: '1', content: '', ticketPrice: '', cinemaService: '' }
        rule.showAdd = true
        this.params.priceRule.push(rule)
      }
      const ruleValidator = rule => {
        return (_rule, value, cb) => {
          if (rule.type === '1' && rule.content === '') {
            cb(
              new Error(
                `请选择指定的${
                  this.params.type === '1'
                    ? '影片'
                    : this.params.type === '2'
                      ? '影厅'
                      : '制式'
                }`
              )
            )
          }
          cb()
        }
      }
      const checkPriceRule = (priceRules, price) => {
        let flag = true
        const left = parseFloat(price)
        for (const priceRule in priceRules) {
          const right = priceRules[priceRule]
          if (priceRule === 'egt') {
            if (left < right) {
              flag = false
            }
          } else if (priceRule === 'gt') {
            if (left <= right) {
              flag = false
            }
          } else if (priceRule === 'elt') {
            if (left > right) {
              flag = false
            }
          } else if (priceRule === 'lt') {
            if (left >= right) {
              flag = false
            }
          }
        }
        return flag
      }
      const ticketPriceValidator = rule => {
        return (_rule, value, cb) => {
          if (this.canTicketPrice && !rule.ticketPrice) {
            cb(new Error('请输入平台票价'))
          } else {
            if (
              this.canTicketPrice &&
              (!isPositive(rule.ticketPrice) || rule.ticketPrice === '0')
            ) {
              cb(new Error('请输入正数'))
            }
            if (
              this.policyRight !== '1' &&
              this.policyRight !== '3' &&
              this.canTicketPrice
            ) {
              const flag = checkPriceRule(
                this.priceRightRule.ticketPrice,
                rule.ticketPrice
              )

              if (!flag) {
                cb(
                  new Error(
                    '平台票价调整限制范围为' +
                      this.priceRange.min +
                      '至' +
                      this.priceRange.max
                  )
                )
              }
            }
          }

          cb()
        }
      }
      const modifyPriceValidator = rule => {
        return (_rule, value, cb) => {
          if (!rule.modifyPrice) {
            cb(new Error('请选择是否允许调价'))
          }
          cb()
        }
      }
      const cinemaServiceValidator = rule => {
        return (_rule, value, cb) => {
          if (this.canCinemaService && !rule.cinemaService) {
            cb(new Error('请输入影院服务费'))
          } else if (
            this.canCinemaService &&
            rule.modifyPrice === '-1' &&
            !rule.thresholds
          ) {
            cb(new Error('请输入服务费上限'))
          } else {
            if (
              this.canCinemaService &&
              (!isPositive(rule.cinemaService) || rule.cinemaService === '0') &&
              (!isPositive(rule.thresholds) || rule.thresholds === '0')
            ) {
              cb(new Error('请输入正数'))
            }
            if (
              this.policyRight !== '1' &&
              this.policyRight !== '4' &&
              this.canCinemaService
            ) {
              const flag = checkPriceRule(
                this.priceRightRule.servicePrice,
                rule.cinemaService
              )
              if (!flag) {
                cb(
                  new Error(
                    '影院服务费调整限制范围为' +
                      this.serviceRange.min +
                      '至' +
                      this.serviceRange.max
                  )
                )
              }
            }
          }
          cb()
        }
      }
      if (!index) {
        index = this.params.priceRule.length - 1
      }
      this.rules['rule' + index] = {
        required: true,
        validator: ruleValidator(rule),
        trigger: ['blur', 'change']
      }
      this.rules['ticketPrice' + index] = {
        required: true,
        validator: ticketPriceValidator(rule),
        trigger: ['blur', 'change']
      }
      this.rules['cinemaService' + index] = {
        required: true,
        validator: cinemaServiceValidator(rule),
        trigger: ['blur', 'change']
      }
      this.rules['modifyPrice' + index] = {
        required: true,
        validator: modifyPriceValidator(rule),
        trigger: ['blur', 'change']
      }
    },
    removeRule(index) {
      this.params.priceRule.splice(index, 1)
    },
    policyGroupChange(val, data) {
      if (data) {
        this.policyRight = data.priceRight
        this.servicePriceStr = data.servicePriceStr
        this.ticketPriceStr = data.ticketPriceStr
        this.priceRightRule = data.priceRightRule
        this.$set(this.params, 'cinemaList', [])
        this.createRangeValue(this.servicePriceStr, this.serviceRange)
        this.createRangeValue(this.ticketPriceStr, this.priceRange)
        // console.log(this.serviceRange, 12222)
      }
    },
    createRangeValue(value, target) {
      const code = value.indexOf('小于')
      const minStr = value.slice(0, code)
      const maxStr = value.slice(code, value.length)
      target.min = minStr.replace(/[^\d|.]/g, '')
      target.max = maxStr.replace(/[^\d|.]/g, '')
      return target
    }
  },
  async created() {
    this.params.programType = this.$route.meta.programType + ''
    // 编辑
    if (this.$route.query.id) {
      this.isInit = true
      const params = await getPriceProgramInfo(
        this.$route.query.id,
        this.params.programType
      )
      params.programType = this.params.programType
      if (params.programType === '1') {
        params.time = [params.startDate, params.endDate]
      } else if (params.programType === '2') {
        const dateTimeTemp = {}
        dateTimeTemp.dateType = params.dateType
        dateTimeTemp.timeType = params.timeType
        if (params.dateType === '1') {
          dateTimeTemp.dateDetail1 = split(params.dateDetail)
        } else if (params.dateType === '2') {
          dateTimeTemp.dateDetail2 = split(params.dateDetail)
        }
        // if (params.timeType === 'day') {
        // } else
        if (params.timeType === 'week') {
          dateTimeTemp.weekTime = split(params.week)
          dateTimeTemp.weekTime = dateTimeTemp.weekTime.map(e => {
            return parseInt(e)
          })
        }
        if (params.startTime && params.endTime) {
          dateTimeTemp.limitTime = [params.startTime, params.endTime]
        }

        this.dateTimeListParams = dateTimeTemp
      }
      // 价格规则中的 是否允许调价
      params.priceRule.forEach(e => {
        if (!e.modifyPrice) {
          this.$set(e, 'modifyPrice', '0')
        }
      })

      this.params = params
      for (let i = 0; i < this.params.priceRule.length; i++) {
        const rule = this.params.priceRule[i]
        this.newRule(rule, i)
      }
      this.$nextTick(() => {
        this.isInit = false
      })
    } else {
      this.newRule()
    }
  }
}
</script>

<style  lang="scss">
.edit-price-program {
  .el-card__body {
    padding: 20px 20px 0px 0px;
  }
  .add-rule-btn {
    text-align: center;
    font-size: 25px;
  }
  .rule-card {
    margin-bottom: 20px;
    position: relative;
  }
  .remove-rule {
    position: absolute;
    top: 5px;
    left: 20px;
    font-size: 24px;
    cursor: pointer;
  }
  .cinema-tip {
    position: absolute;
    top: 5px;
    left: 10px;
  }
  .oper {
    font-size: 28px;
    margin-left: 20px;
    i {
      cursor: pointer;
    }
  }
}
</style>
<style>
.modifyPriceNo {
  margin-left: 0px !important;
}
</style>
