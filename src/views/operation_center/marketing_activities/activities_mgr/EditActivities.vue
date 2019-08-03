<template>
  <div class="app-container edit-price-program">
    <el-form
      label-width="140px"
      label-position="left"
      style="width:1000px;"
      :model="activityParams"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="活动名称:" prop="name">
        <el-input
          clearable
          placeholder="请输入活动名称标题,最多30个字"
          maxlength="30"
          v-model.trim="activityParams.name"
          style="width:640px"
        ></el-input>
      </el-form-item>
      <div class="timeStyle">
        <el-form-item label="活动时间:" prop="time" style="display:inline-block;width:320px;">
          <el-date-picker
            unlink-panels
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:320px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label prop="showTimeCycle" v-if="time" style="display:inline-block;">
          <el-select clearable v-model="activityParams.showTimeCycle" style="width:320px;">
            <el-option label="任意时段" value="any"></el-option>
            <el-option label="每天" value="daily"></el-option>
            <el-option label="每周" value="weekly"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activityParams.showTimeCycle==='weekly'"
          prop="weekTime"
          style="display:inline-block;width:320px;"
        >
          <date-selector clearable type="week" v-model="weekTime" style="width:320px;"></date-selector>
        </el-form-item>
        <el-form-item
          v-if="time && (activityParams.showTimeCycle==='daily'||activityParams.showTimeCycle==='weekly')"
          label
          prop="limitTime"
          style="display:inline-block;"
        >
          <el-time-picker
            v-model="limitTime"
            is-range
            value-format="HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width:320px;"
          ></el-time-picker>
        </el-form-item>
      </div>
      <el-form-item label="上传活动图片:" prop="image">
        <pic-upload
          outHeight="100px"
          outWidth="400px"
          content="上传活动图片（尺寸比例2:1，建议大小800*400）"
          v-model="activityParams.image"
        ></pic-upload>
      </el-form-item>
      <el-form-item label="活动区域:" prop="area">
        <el-input
          clearable
          v-model="area"
          placeholder="选择地区模糊查询"
          class="w170"
          @change="onOperateClick('changeArea',$event)"
          @focus="onOperateClick('area')"
        ></el-input>
        <!-- <city-cascader
          ref="city"
          v-model.trim="area"
          :rang="1"
          showAllOptions
          :clearable="true"
          placeholder="请选择"
          style="width:170px;"
        ></city-cascader>-->
      </el-form-item>
      <el-form-item label="活动对象:" prop="objects">
        <el-input
          clearable
          type="textarea"
          :row="10"
          class="areaTextHeight"
          v-model="activityParams.objects"
          placeholder="请输入活动对象"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="活动流程:" prop="process">
            <el-input clearable  type="textarea" :row="10" class="areaTextHeight" v-model="activityParams.process" placeholder="请输入活动流程"></el-input>
      </el-form-item>-->
      <el-form-item label="活动规则:" prop="rule">
        <el-input
          clearable
          type="textarea"
          :row="10"
          class="areaTextHeight"
          v-model="activityParams.rule"
          placeholder="请输入活动规则"
        ></el-input>
      </el-form-item>
      <el-form-item label="前端活动标签:" style="width:400px">
        <tip content="展示在活动详情前，可填入例如“特惠”等">
          <el-input
            clearable
            type="text"
            v-model="activityParams.tag"
            maxlength="6"
            placeholder="请输入前端活动标签,最多6个字"
          ></el-input>
        </tip>
      </el-form-item>
      <el-form-item label="活动类型:" prop="type">
        <el-radio-group v-model="activityParams.type" @change="typeChange">
          <el-radio label="1" :disabled="$route.query.id>0">抢购电影券活动</el-radio>
          <el-radio label="2" :disabled="$route.query.id>0">银行贴补活动</el-radio>
          <el-radio label="3" :disabled="$route.query.id>0">平台补贴活动</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="activityParams.type">
        <panic-buying
          ref="panic"
          @submitType="getSubmitType"
          :activityType="activityParams.type"
          v-model="activityParams.panicBuying"
          v-if="(($route.query.id && showChild)||(!$route.query.id && !showChild)) && activityParams.type==='1'"
        ></panic-buying>

        <bank-subsidy
          ref="bank"
          @submitType="getSubmitType"
          :activityType="activityParams.type"
          v-model="activityParams.bankSubsidy"
          v-if="(($route.query.id && showChild)||(!$route.query.id && !showChild)) && activityParams.type==='2'"
        ></bank-subsidy>

        <platform-subsidy
          ref="platform"
          @submitType="getSubmitType"
          :activityType="activityParams.type"
          v-model="activityParams.platformSubsidy"
          v-if="(($route.query.id && showChild)||(!$route.query.id && !showChild)) && activityParams.type==='3'"
        ></platform-subsidy>
      </div>

      <el-button style="margin-top:20px;" type="primary" @click="payInfoSave" v-if="!look">保存</el-button>
      <el-button style="margin-top:20px;" type="primary" @click="submitAudit" v-if="!look">提交审核</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form>
    <query-city
      v-model="areaVisible"
      v-if="areaVisible"
      :city-params="activityParams"
      @cancel="onOperateClick('closeCity')"
      @change="onOperateClick('saveArea',$event)"
    ></query-city>
  </div>
</template>
<script>
import ChannelFormSelector from '@/components/ChannelFormSelector'
import FilmSelector from '@/components/FilmSelector'
import DateSelector from '@/components/DateSelector'
import CityCascader from '@/components/CityCascader'
import PanicBuying from '../activities_complate/PanicBuying'
import BankSubsidy from '../activities_complate/BankSubsidy'
import PlatformSubsidy from '../activities_complate/PlatformSubsidy'
import queryCity from '@/components/isNeedComponents/addCinemaQuery/queryCity'
import {
  createActivity,
  updateActivity,
  getActivityCompleteInfo
} from '@/api/activitySetting'
// , activitySetApprovalStatus

export default {
  name: 'edit_activities',
  components: {
    ChannelFormSelector,
    FilmSelector,
    CityCascader,
    DateSelector,
    PanicBuying,
    BankSubsidy,
    PlatformSubsidy,
    queryCity
  },
  data() {
    const checkArea = (rule, value, cb) => {
      if (!this.area || this.area.length === 0) {
        cb(new Error('请选择活动区域'))
      }
      cb()
    }
    const checkTime = (rule, value, cb) => {
      if (!this.time || this.time.length < 2) {
        cb(new Error('请选择活动时间'))
      }
      cb()
    }
    const checkShowTimeCycle = (rule, value, cb) => {
      if (!this.activityParams.showTimeCycle) {
        cb(new Error('请选择时间类型'))
      }
      cb()
    }
    const checkWeekTime = (rule, value, cb) => {
      if (
        this.activityParams.showTimeCycle === 'weekly' &&
        (!this.weekTime || this.weekTime.length === 0)
      ) {
        cb(new Error('请选择星期'))
      }
      cb()
    }
    const checkLimitTime = (rule, value, cb) => {
      if (!this.limitTime || this.limitTime.length < 2) {
        cb(new Error('请选择活动具体时间'))
      }
      cb()
    }
    return {
      areaVisible: false,
      activityParams: {
        name: '',
        provinceId: '',
        cityId: '',

        startTime: '',
        endTime: '',
        showTimeCycle: 'any',
        showTimeBegin: '',
        showTimeEnd: '',
        showTimeDays: '',

        image: '',
        objects: '',
        process: '',
        rule: '',
        tag: '',
        type: '',

        panicBuying: {},
        bankSubsidy: {},
        platformSubsidy: {}
      },
      area: '',
      time: [],
      weekTime: [],
      limitTime: ['08:00:00', '22:00:00'],
      panicBuyingPra: {},
      rules: {
        name: {
          required: true,
          max: 30,
          message: '请输入活动名称标题，最多30个字',
          trigger: 'blur'
        },
        area: { required: true, validator: checkArea, trigger: 'change' },
        time: { required: true, validator: checkTime, trigger: 'blur' },
        image: { required: true, message: '请上传活动图片', trigger: 'change' },
        objects: { required: true, message: '请填写活动对象', trigger: 'blur' },
        process: { required: true, message: '请填写活动流程', trigger: 'blur' },
        rule: { required: true, message: '请填写活动规则', trigger: 'blur' },
        type: { required: true, message: '请选择活动类型', trigger: 'blur' },
        showTimeCycle: {
          required: true,
          validator: checkShowTimeCycle,
          trigger: 'blur'
        },
        weekTime: { required: true, validator: checkWeekTime, trigger: 'blur' },
        limitTime: {
          required: true,
          validator: checkLimitTime,
          trigger: 'blur'
        }
      },
      showChild: false
    }
  },
  watch: {},
  methods: {
    onOperateClick(type, val) {
      switch (type) {
        case 'area': // 打开地区
          this.areaVisible = true
          break
        case 'changeArea': // 处理clear地区情况
          if (!val) {
            this.activityParams.provinceId = ''
            this.activityParams.cityId = ''
          }
          break
        case 'closeCity': // 关闭地区弹窗
          this.areaVisible = false
          break
        case 'saveArea': // 保存选择地区
          this.activityParams.provinceId = val.provinceId
          this.activityParams.cityId = val.cityId
          this.area =
            val.provinceName +
            (val.provinceName && val.cityName ? ',' : '') +
            val.cityName
      }
    },
    typeChange(val) {
      if (val === '1') {
        /* this.$set(this.activityParams, 'bankSubsidy', {})
        this.$set(this.activityParams, 'platformSubsidy', {})*/
        this.$refs.panic.resetFields()
      } else if (val === '2') {
        /* this.$set(this.activityParams, 'panicBuying', {})
        this.$set(this.activityParams, 'platformSubsidy', {})*/
        this.$refs.bank.resetFields()
      } else if (val === '3') {
        /* this.$set(this.activityParams, 'panicBuying', {})
        this.$set(this.activityParams, 'bankSubsidy', {})*/
        this.$refs.platform.resetFields()
      }
    },
    getSubmitType(type) {
      // 获取验证子组件表单的通过状态
      if (type[0] === 'subject') {
        this.canValidate = type[1]
      }
    },
    payInfoSave() {
      this.activityParams.startTime = this.time[0]
      this.activityParams.endTime = this.time[1]
      this.activityParams.showTimeDays = this.weekTime.join(',')
      this.activityParams.showTimeBegin = this.limitTime[0]
      this.activityParams.showTimeEnd = this.limitTime[1]

      this.activityParams.area = this.area
      // this.activityParams.provinceId =
      //   this.area && this.area.length ? this.area[0] : ''
      // this.activityParams.cityId =
      //   this.area && this.area.length ? this.area[1] : ''

      const params = this.activityParams
      if (params.type === '1') {
        params.bankSubsidy = {}
        params.platformSubsidy = {}
      } else if (params.type === '2') {
        params.panicSubsidy = {}
        params.platformSubsidy = {}
      } else if (params.type === '3') {
        params.bankSubsidy = {}
        params.panicSubsidy = {}
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.bank && this.$refs.bank.validateChild()
          this.$refs.panic && this.$refs.panic.validateChild()
          this.$refs.platform && this.$refs.platform.validateChild()
          if (this.canValidate) {
            // 验证通过
            if (this.$route.query.id) {
              params.id = this.$route.query.id
              updateActivity(params).then(res => {
                this.closeTab(true)
                // this.$router.push('/operation_center/marketing_activities/activities_mgr')
              })
            } else {
              createActivity(params).then(res => {
                this.closeTab(true)
                // this.$router.push('/operation_center/marketing_activities/activities_mgr')
              })
            }
          }
        } else {
          this.$message.warning('请填写完整表单内容')
        }
      })
    },
    submitAudit() {
      this.activityParams.startTime = this.time[0]
      this.activityParams.endTime = this.time[1]
      this.activityParams.showTimeDays = this.weekTime.join(',')
      this.activityParams.showTimeBegin = this.limitTime[0]
      this.activityParams.showTimeEnd = this.limitTime[1]
      this.activityParams.area = this.area
      // this.activityParams.provinceId = this.area[0]
      // this.activityParams.cityId = this.area[1]

      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.bank && this.$refs.bank.validateChild()
          this.$refs.panic && this.$refs.panic.validateChild()
          this.$refs.platform && this.$refs.platform.validateChild()
          if (this.canValidate) {
            // 验证通过
            console.log(this.activityParams)
            if (this.$route.query.id) {
              this.activityParams.id = this.$route.query.id
              this.activityParams.approvalStatus = '1'
              updateActivity(this.activityParams).then(res => {
                this.$message.success('操作成功')
                this.closeTab(true)
                // this.$router.push('/operation_center/marketing_activities/activities_mgr')
              })
            } else {
              this.activityParams.approvalStatus = '1'
              createActivity(this.activityParams).then(res => {
                this.$message.success('操作成功')
                this.closeTab(true)
                // this.$router.push('/operation_center/marketing_activities/activities_mgr')
              })
            }
          }
        } else {
          this.$message.warning('请填写完整表单内容')
        }
      })
    },
    cancel() {
      this.closeTab()
      this.$router.push('/operation_center/marketing_activities/activities_mgr')
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.activityParams = await getActivityCompleteInfo({
        id: this.$route.query.id
      })
      this.area = this.activityParams.area
      this.$set(this.time, 0, this.activityParams.startTime)
      this.$set(this.time, 1, this.activityParams.endTime)
      if (this.activityParams.showTimeDays.length > 0) {
        this.weekTime = this.activityParams.showTimeDays.split(',').map(e => {
          return +e
        })
      }
      this.$set(this.limitTime, 0, this.activityParams.showTimeBegin)
      this.$set(this.limitTime, 1, this.activityParams.showTimeEnd)

      // this.$set(this.area, 0, this.activityParams.provinceId)
      // this.$set(this.area, 1, this.activityParams.cityId)
      this.$nextTick(() => {
        this.showChild = true
      })
    }
  }
}
</script>
<style>
.areaTextHeight .el-textarea__inner {
  width: 650px;
  height: 120px;
}
</style>
