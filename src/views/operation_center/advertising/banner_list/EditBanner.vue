<template>
  <div class="app-container edit-price-program">
    <el-form
      label-width="140px"
      label-position="left"
      class="100wp"
      :model="params"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="广告名称:" prop="name">
        <span v-if="ok">{{params.name}}</span>
        <el-input
          v-else
          placeholder="请输入广告名称标题,最多15个字"
          v-model.trim="params.name"
          style="width:320px"
        ></el-input>
      </el-form-item>
      <el-form-item label="投放商家:" prop="channelList" v-if="ok || !$route.query.id" class="wp80">
        <div v-if="ok" style="border:1px #ecf6fd solid;padding: 10px 20px;">
          <div v-for="(v,index) in params.channelList" :key="index">
            <span>{{v.name}}</span>
          </div>
        </div>
        <channel-form-selector v-else v-model="params.channelList" type="1" :outDisabled="ok"></channel-form-selector>
      </el-form-item>
      <el-form-item label="投放城市:" prop="area">
        <city-cascader
          ref="city"
          v-model.trim="params.area"
          :rang="1"
          showAllOptions
          :clearable="true"
          placeholder="请选择"
          style="width:170px;"
        ></city-cascader>
      </el-form-item>
      <!-- <el-form-item label="投放时间:" prop="time" >
            <el-date-picker v-model="time" type="daterange"  value-format="yyyy-MM-dd"
                    start-placeholder="开始日期" end-placeholder="结束日期"  style="width:320px;"></el-date-picker>
      </el-form-item>-->
      <div class="timeStyle">
        <el-form-item label="投放时间:" prop="time" style="display:inline-block;width:320px;">
          <el-date-picker
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:320px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label prop="timeType" v-if="time" style="display:inline-block;">
          <el-select v-model="params.timeType" style="width:320px;" @change="timeTypeChange">
            <el-option label="每天" value="daily"></el-option>
            <el-option label="每周" value="weekly"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="params.timeType==='weekly'"
          prop="weekTime"
          style="display:inline-block;width:320px;"
        >
          <date-selector clearable type="week" v-model="params.weekTime" style="width:320px;"></date-selector>
        </el-form-item>
        <el-form-item
          v-if="time && (params.timeType==='daily'||params.timeType==='weekly')"
          label
          prop="limitTime"
          style="display:inline-block;"
        >
          <el-time-picker
            v-model="params.limitTime"
            is-range
            value-format="HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width:320px;"
          ></el-time-picker>
        </el-form-item>
      </div>
      <el-form-item label="广告类型:" prop="type" class="mb0">
        <el-radio-group v-model="params.type" size="medium" @change="changeParams('type')">
          <el-radio v-for="type in allTypeList" :key="type.value" :label="type.value">{{type.name}}</el-radio>
          <!-- :disabled="$route.query.id ? type.value !== params.type : false"              -->
        </el-radio-group>
        <el-form-item label-width="120px" label="投放终端：" prop="deviceType" class="mt10 mb20">
          <zm-checkbox v-model="params.deviceType" :list="deviceTypes">
            <template slot-scope="msg">
              <div>
                <span v-if="!msg.item.content">{{msg.item.label}}</span>
                <tip :content="msg.item.content" v-else>
                  <span style="line-height:2.5;">{{msg.item.label}}</span>
                </tip>
              </div>
            </template>
          </zm-checkbox>
        </el-form-item>
        <template v-if="params.type === '4'">
          <el-form-item label-width="120px" label="选择活动入口:" class="mb20" prop="activityJumpType">
            <el-select
              v-model="params.activityJumpType"
              clearable
              @change="changeParams('activityJumpType',$event)"
            >
              <el-option
                v-for="(item,index) in DEVICE_JUMP_TYPES"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label-width="120px"
            label="活动列表："
            v-if="+params.activityJumpType === 2"
            class="mb20"
          >
            <remote-select
              v-model="params.typeValue"
              clearable
              placeholder="请选择活动列表"
              action="/systemApi/activity/getBannerActivityList"
              class="w200"
            ></remote-select>
          </el-form-item>
        </template>
        <div v-if="params.type === '1'">
          <el-input v-model.trim="params.typeValue" class="w520">
            <template slot="prepend">
              <el-select class="w100" v-model="httpType">
                <el-option label="Http://" value="Http://"></el-option>
                <el-option label="Https://" value="Https://"></el-option>
              </el-select>
            </template>
          </el-input>
          <div class="mt10">
            <span>记录用户登录信息：</span>
            <tip
              content="默认“否”不记录用户登录信息，选择“是”则表示用户在访问外链的网页时会传送登录信息到对应的网页中</br>（含手机号、微信openId、微信unionId），也就说必须要登录"
              class="vm w120"
            >
              <el-radio-group v-model="params.isRecordMember" size="medium">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </tip>
          </div>
        </div>
        <div v-if="params.type === '2'">
          <film-selector getFilmId v-model.trim="params.typeValue" class="mb20"></film-selector>
        </div>
      </el-form-item>

      <el-form-item label="上传广告图片:" prop="image">
        <pic-upload
          outHeight="100px"
          outWidth="400px"
          content="上传App或微信端Banner图（尺寸比例2:1，建议大小800*400）"
          v-model="params.image"
        ></pic-upload>
      </el-form-item>
      <el-form-item label="广告排序:" prop="sort">
        <el-input placeholder="输入投放顺序" v-model.trim="params.sort" style="width:120px"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center;margin-top:20px">
        <el-button type="primary" @click="save" v-if="!look">保存</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ChannelFormSelector from '@/components/ChannelFormSelector'
import FilmSelector from './FilmSelector'
import zmCheckbox from '@/components/isNeedComponents/zmCheckbox'
import {
  getBannerType,
  createBanner,
  getBannerInfo,
  updateBanner
} from '@/api/operationCenter'
import { isPositiveInteger } from '@/utils/validate'
import CityCascader from '@/components/CityCascader'
import DateSelector from '@/components/DateSelector'
import { DEVICE_TYPES, DEVICE_JUMP_TYPES } from './const'
export default {
  name: 'edit_banner',
  components: {
    ChannelFormSelector,
    FilmSelector,
    CityCascader,
    DateSelector,
    zmCheckbox
  },
  data() {
    const checkType = (rule, value, cb) => {
      if (this.params.type === '2' && !this.params.typeValue) {
        cb(new Error('请输入广告类型数据'))
      }
      cb()
    }
    const checkSort = (rule, value, cb) => {
      if (!isPositiveInteger(value)) {
        cb(new Error('请输入广告排序,必须是正整数'))
      }
      cb()
    }
    const checkChannelList = (rule, value, cb) => {
      if (!this.params.channelList || this.params.channelList.length === 0) {
        cb(new Error('请选择投放商家'))
      }
      cb()
    }
    const checkTime = (rule, value, cb) => {
      if (!this.time || this.time.length < 2) {
        cb(new Error('请选择投放时间'))
      }
      cb()
    }
    const checkTimeType = (rule, value, cb) => {
      if (!this.params.timeType) {
        cb(new Error('请选择时间类型'))
      }
      cb()
    }
    const checkWeekTime = (rule, value, cb) => {
      if (
        this.params.timeType === 'weekly' &&
        (!this.params.weekTime || this.params.weekTime.length === 0)
      ) {
        cb(new Error('请选择星期'))
      }
      cb()
    }
    const checkLimitTime = (rule, value, cb) => {
      if (!this.params.limitTime || this.params.limitTime.length < 2) {
        cb(new Error('请选择投放具体时间'))
      }
      cb()
    }
    return {
      DEVICE_JUMP_TYPES,
      httpType: 'Http://',
      allTypeList: [], // 所有广告类型的列表
      // channelList: [],
      time: [],

      params: {
        name: '',
        type: '1',
        channelList: [],
        area: [],
        timeType: '',
        weekTime: [],
        limitTime: ['08:00:00', '22:00:00'],
        isRecordMember: '0',
        sort: '',
        image: '',
        deviceType: '',
        activityJumpType: ''
      },
      rules: {
        name: {
          required: true,
          max: 15,
          message: '请输入广告名称标题，最多15个字',
          trigger: 'blur'
        },
        image: { required: true, message: '请上传广告图片', trigger: 'change' },
        sort: { required: true, validator: checkSort, trigger: 'blur' },
        channelList: {
          required: true,
          validator: checkChannelList,
          trigger: 'change'
        },
        area: { required: true, message: '请填写投放城市', trigger: 'change' },
        time: { required: true, validator: checkTime, trigger: 'change' },
        timeType: {
          required: true,
          validator: checkTimeType,
          trigger: 'change'
        },
        weekTime: {
          required: true,
          validator: checkWeekTime,
          trigger: 'change'
        },
        limitTime: {
          required: true,
          validator: checkLimitTime,
          trigger: 'blur'
        },
        type: { required: true, validator: checkType, trigger: 'blur' },
        deviceType: {
          required: true,
          message: '请选择终端',
          trigger: 'change'
        },
        activityJumpType: {
          required: true,
          message: '请选择活动入口类型',
          trigger: 'change'
        }
      },
      ok: false
    }
  },
  computed: {
    channelId: function() {
      return this.params.channelList.map(e => e.value).join(',')
    },
    deviceTypes() {
      return DEVICE_TYPES(this.params)
    }
  },
  watch: {
    'params.way': {
      handler: function(newValue, oldValue) {},
      deep: true
    },
    'params.image': function(val) {
      this.$refs.form.validateField('image')
    },
    'params.channelList': function(val) {
      if (!this.ok) this.$refs.form.validateField('channelList')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.form.clearValidate()
    })
  },
  methods: {
    changeParams(type, val) {
      switch (type) {
        case 'type':
          this.params.typeValue = ''
          break
        case 'activityJumpType':
          this.params.typeValue = +val === 1 ? '-1' : ''
      }
    },
    timeTypeChange(val) {
      if (val === 'daily') {
        this.$set(this.params, 'weekTime', [])
        this.$set(this.params, 'limitTime', ['08:00:00', '22:00:00'])
      } else {
        this.$set(this.params, 'limitTime', ['08:00:00', '22:00:00'])
      }
    },
    async save() {
      const valid = await this.$refs.form.validate()
      if (!valid) return
      if (this.channelId === '') {
        this.$message.warning('请选择投放商家')
        return
      }
      if (this.time.length < 2) {
        this.$message.warning('请选择投放时间')
        return
      }
      const result = {}
      result.name = this.params.name
      result.channelId = this.channelId
      result.startTime = this.time[0]
      result.endTime = this.time[1]
      result.sTime = this.params.limitTime[0]
      result.eTime = this.params.limitTime[1]
      result.timeType = this.params.timeType
      result.week = this.params.weekTime.join(',')
      result.type = this.params.type
      result.isRecordMember = this.params.isRecordMember
      result.provinceId = this.params.area[0]
      result.cityId = this.params.area[1]
      result.deviceType = this.params.deviceType // 投放终端类型 1微信 2app
      result.activityJumpType =
        result.type === '4' ? this.params.activityJumpType : '' // 活动入口类型 1列表页 2详情页
      result.typeValue =
        result.type === '1'
          ? this.httpType + this.params.typeValue
          : this.params.typeValue

      result.image = this.params.image
      result.sort = this.params.sort
      result.id = this.$route.query.id || ''
      const submitApi = this.$route.query.id
        ? updateBanner(result)
        : createBanner(result)
      await submitApi
      this.$message.success('保存成功')
      this.closeTab(true)
      this.$router.push({
        path: '/operation_center/advertising/banner_list'
      })

      // if (this.$route.query.id) {
      //   result.id = this.$route.query.id
      //   updateBanner(result).then(e => {
      // this.$message.success('保存成功')
      // this.closeTab(true)
      // this.$router.push({
      //   path: '/operation_center/advertising/banner_list'
      // })
      //   })
      // } else {
      //   createBanner(result).then(e => {
      //     this.$message.success('保存成功')
      //     this.closeTab(true)
      //     this.$router.push({
      //       path: '/operation_center/advertising/banner_list'
      //     })
      //   })
      // }
    }
  },
  async created() {
    this.allTypeList = await getBannerType()
    if (this.$route.query.id) {
      await getBannerInfo(this.$route.query.id).then(result => {
        this.params = Object.assign(this.params, result)
        // this.params.name = result.name

        // this.params.isRecordMember = result.isRecordMember

        const https = 'Https://'
        const http = 'Http://'
        this.params.typeValue = result.typeValue
        if (result.typeValue.indexOf(https) !== -1) {
          this.httpType = https
          this.params.typeValue = result.typeValue.replace(https, '')
        } else if (result.typeValue.indexOf(http) !== -1) {
          this.httpType = http
          this.params.typeValue = result.typeValue.replace(http, '')
        }
        // this.params.image = result.image
        // this.params.sort = result.sort
        this.$nextTick(() => {
          this.params.type = result.type
        })
        const channelList = []
        result.channelList.forEach(e => {
          channelList.push({
            name: e.name,
            value: e.value,
            checked: true
          })
        })
        this.$set(this.params, 'channelList', channelList)

        this.time = []
        // this.$set(this, 'time', [])
        this.$set(this.time, 0, result.startTime)
        this.$set(this.time, 1, result.endTime)

        // this.$set(this.params, 'timeType', result.timeType)

        this.$set(this.params, 'limitTime', ['08:00:00', '22:00:00'])
        this.$set(
          this.params.limitTime,
          0,
          result.sTime ? result.sTime : '08:00:00'
        )
        this.$set(
          this.params.limitTime,
          1,
          result.eTime ? result.eTime : '22:00:00'
        )

        result.week &&
          result.week.split(',').forEach(e => {
            this.params.weekTime.push(parseInt(e))
          })

        result.provinceId ? this.params.area.push(result.provinceId) : ''
        result.cityId ? this.params.area.push(result.cityId) : ''

        this.ok = true
      })
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
    top: 26px;
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
