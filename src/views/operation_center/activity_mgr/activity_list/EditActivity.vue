<template>
  <div class="app-container edit-price-program">    
    <el-form label-width="140px" label-position="left"  style="width:1000px;" :model="activityParams" :rules="rules" ref="form" v-if="$route.query.setting==='1'">
        <el-form-item>
          <h2>活动序号：{{$route.query.activity_id||''}}</h2>
        </el-form-item>
          <el-form-item label="活动名称:" prop="activity_subject">
            <el-input placeholder="请输入活动名称标题,最多15个字" v-model.trim="activityParams.activity_subject" style="width:320px"></el-input>
          </el-form-item>
          <el-form-item  label="投放商家:" prop="mchList" v-if="!$route.query.activity_id || (ok && $route.query.activity_id)">
              <channel-form-selector v-model="activityParams.mchList" type="1" :outDisabled="ok"></channel-form-selector>
          </el-form-item>
          <el-form-item label="活动地区:" prop="area">
              <city-cascader ref="city" v-model.trim="activityParams.area" :rang="0" showAllOptions :clearable="true" placeholder="请选择" style="width:170px;"></city-cascader>
          </el-form-item>
          <el-form-item label="活动投放时间:" prop="time" >
              <el-date-picker v-model="activityParams.time" type="daterange"  value-format="yyyy-MM-dd"
                      start-placeholder="开始日期" end-placeholder="结束日期"  style="width:320px;"></el-date-picker>
              <el-select v-model="activityParams.showtime_cycle" style="width:320px;" v-if="activityParams.time">
              	<!-- <el-option label="不限制" value="-1"></el-option> -->
              	<el-option label="每天" value="daily"></el-option>
              	<el-option label="每周" value="weekly"></el-option>
            	</el-select>
            	<date-selector clearable v-if="activityParams.showtime_cycle=='weekly'" type="week" v-model="activityParams.weekTime" style="width:320px"></date-selector>
            	<el-time-picker v-if="activityParams.time && (activityParams.showtime_cycle=='daily' || activityParams.showtime_cycle=='weekly')"  v-model="activityParams.limitTime" is-range  value-format="HH:mm:ss"   start-placeholder="开始时间" end-placeholder="结束时间"  style="width:320px;margin-top:20px"></el-time-picker>
      	   </el-form-item>           
           <el-form-item label="活动范围:" prop="scopes" >
              <el-checkbox-group v-model="activityParams.scopes">
                <el-checkbox label="activity">活动版块</el-checkbox>
                <el-checkbox label="banner">首页banner</el-checkbox>
                <el-checkbox label="detail">影片详情页</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item label="活动排序:" prop="page_rank" >
              <el-input placeholder="输入活动顺序" v-model.trim="activityParams.page_rank" style="width:120px"></el-input>
          </el-form-item> -->
          <el-form-item label="上传活动图片:" prop="activity_banner" >
              <pic-upload outHeight="100px" outWidth="400px" content="上传App或微信端Banner图（尺寸比例2:1，建议大小800*400）" v-model="activityParams.activity_banner"></pic-upload>
          </el-form-item>
          <el-form-item label="活动说明:" prop="description" >
            <el-input v-model="activityParams.description" type="textarea" rows="5" placeholder="请填写活动对象、活动规则、活动流程等活动说明"></el-input>
          </el-form-item>        
          <el-form-item style="text-align:center;margin-top:20px">
              <el-button type="primary" @click="save" v-if="!look">保存</el-button>
              <el-button @click="closeTab" >取消</el-button>
          </el-form-item>       
    </el-form>
    <el-form  label-width="140px" label-position="left"  style="width:1000px;" :model="settingParams" :rules="SettingRules" ref="settingForm" v-if="$route.query.setting==='2'">
        <el-form-item>
          <h2>活动序号：{{$route.query.activity_id||''}}</h2>
        </el-form-item>
        <el-form-item label="活动类型:" prop="activity_type" >
          <el-radio-group v-model="settingParams.activity_type" size="medium" @change="activityTypeChange">
              <el-radio label="cash">现金支付活动</el-radio>
              <el-radio label="coupon">抢券活动</el-radio>               
          </el-radio-group>
        </el-form-item>
        <div v-if="settingParams.activity_type==='cash'">
          <el-form-item label="活动可用影院" prop="cinema_group_id" >
            <remote-select v-model="settingParams.cinema_group_id" clearable placeholder="请选择可用影院" action="/systemApi/cinemaGroup/getList" :query="{}" style="width:230px;"></remote-select>
          </el-form-item>
          <el-form-item label="活动可用影片：" prop="film_codes" v-if="settingParams.cinema_group_id">
            <el-radio v-model="settingParams.filmType" label="-1">全部影片</el-radio>
            <el-radio v-model="settingParams.filmType" label="1">指定影片</el-radio>
            <film-selector :content-list="settingParams.filmList"  v-if="settingParams.filmType === '1'" getFilmId v-model="settingParams.film_codes"></film-selector>            
          </el-form-item>
          <el-form-item label="活动可用制式：" v-if="settingParams.cinema_group_id" prop="film_copies">
                <standard-selector ref="film_copies" v-model="settingParams.film_copies" :cinemaGroupId="settingParams.cinema_group_id"></standard-selector>
          </el-form-item>
          <el-form-item label="活动场次时间:" prop="time">
            <el-date-picker v-model="settingParams.time" type="daterange"  value-format="yyyy-MM-dd"
                    start-placeholder="开始日期" end-placeholder="结束日期"  style="width:320px;"></el-date-picker>
            <el-select v-model="settingParams.activity_cycle" style="width:320px;" v-if="settingParams.time">
              <el-option label="每天" value="daily"></el-option>
              <el-option label="每周" value="weekly"></el-option>
            </el-select>
            <date-selector clearable v-if="settingParams.activity_cycle=='weekly'" type="week" v-model="settingParams.weekTime" style="width:320px"></date-selector>
            <el-time-picker v-if="settingParams.time && (settingParams.activity_cycle=='daily'||settingParams.activity_cycle=='weekly')"  v-model="settingParams.limitTime" is-range  value-format="HH:mm:ss"   start-placeholder="开始时间" end-placeholder="结束时间"  style="width:320px;margin-top:20px"></el-time-picker>
          </el-form-item>
          <el-form-item label="支付方式:" prop="activity_payment" >
            <el-checkbox-group v-model="settingParams.activity_payment">
              <el-checkbox label="wxpay">微信支付</el-checkbox>
              <el-checkbox label="anionpay" disabled>银联支付</el-checkbox>
              <el-checkbox label="alipay" disabled>支付宝支付</el-checkbox>
              <el-checkbox label="cardpay" disabled>电影卡支付</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="活动规则:" prop="activity_rules" >
            <activity-rules v-model="settingParams.activity_rules"></activity-rules>
          </el-form-item>
          <el-form-item label="前端标签:" prop="activity_tag" >
            <el-input placeholder="输入前端标签" v-model.trim="settingParams.activity_tag" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="结算方式:" prop="activity_settlement_type" >
            <el-checkbox-group v-model="settingParams.activity_settlement_type">
              <el-checkbox label="order">按订单金额</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div v-if="settingParams.activity_type==='coupon'" prop="external_link">
          <el-form-item label="活动网址:" prop="external_link" >
            <el-input v-model.trim="settingParams.external_link" style="width:521px">
            </el-input>
          </el-form-item>
        </div>
        <el-form-item style="text-align:center;margin-top:20px"> 
          <el-button type="primary" @click="settingSave">保存</el-button>
          <el-button type="primary" @click="settingApproval">提交审核</el-button>
          <el-button @click="closeTab" >取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ChannelFormSelector from '@/components/ChannelFormSelector'
import StandardSelector from './StandardSelector'
import FilmSelector from '@/components/FilmSelector'
import ActivityRules from './ActivityRules'
import { editActivity, getActivityById, editActivitySettings, activitySubmitById } from '@/api/activitySetting'
// import { isPositiveInteger } from '@/utils/validate'
import DateSelector from '@/components/DateSelector'
import CityCascader from '@/components/CityCascader'
import { getFilmIdList } from '@/api/priceCenter'
export default {
  name: 'edit_activity',
  components: { ChannelFormSelector, FilmSelector, CityCascader, DateSelector, StandardSelector, ActivityRules },
  data() {
    const checkType = (rule, value, cb) => {
      if (!this.activityParams.scopes) {
        cb(new Error('请输入活动类型数据'))
      }
      cb()
    }
    /* const checkSort = (rule, value, cb) => {
      if (!isPositiveInteger(value)) {
        cb(new Error('请输入活动排序,必须是正整数'))
      }
      cb()
    }*/
    const checkChannelList = (rule, value, cb) => {
      if (!this.activityParams.mchList || this.activityParams.mchList.length === 0) {
        cb(new Error('请选择投放商家'))
      }
      cb()
    }
    const checkFilmList = (rule, value, cb) => {
      if (!this.settingParams.filmType || (this.settingParams.filmType === '1' && this.settingParams.film_codes.length === 0)) {
        cb(new Error('请选择影片'))
      }
      cb()
    }
    const checkStandardList = (rule, value, cb) => {
      if (!value) {
        cb(new Error('请选择制式'))
      }
      cb()
    }
    const checkTime = (rule, value, cb) => {
      if (!value || value.length < 2) {
        cb(new Error('请选择投放时间'))
      }
      if (this.activityParams.activity_cycle === 'weekly' && this.activityParams.weekTime.length === 0) {
        cb(new Error('请选择活动星期'))
      }
      if (this.activityParams.limitTime.length === 0) {
        cb(new Error('请选择活动场次时间区间'))
      }
      cb()
    }
    const checkSettingTime = (rule, value, cb) => {
      if (!value || value.length < 2) {
        cb(new Error('请选择投放时间'))
      }
      if (this.settingParams.activity_cycle === 'weekly' && this.settingParams.weekTime.length === 0) {
        cb(new Error('请选择活动星期'))
      }
      if (this.settingParams.limitTime.length === 0) {
        cb(new Error('请选择活动时间区间'))
      }
      cb()
    }
    const checkRules = (rule, value, cb) => {
      value.forEach(res => {
        if (!res.rule_discount_tag) {
          cb(new Error('请填写活动标签'))
          return false
        }
        if (!res.rule_mininum) {
          cb(new Error('请填写使用门槛'))
          return false
        }
        if (res.rule_discount_type === 'cash_back' && !res.rule_min_unit) {
          cb(new Error('请填写完整金额'))
          return false
        }
        if (res.rule_discount_type === 'random_cash_back' && (!res.rule_min_unit || !res.rule_max_unit)) {
          cb(new Error('请填写完整金额'))
          return false
        }
        if (res.rule_discount_type === 'discount' && (!res.rule_min_unit || !res.rule_max_unit)) {
          cb(new Error('请填写完整金额'))
          return false
        }
        if (!res.rule_total_amount) {
          cb(new Error('请填写发放金额'))
          return false
        }
        if (!res.rule_total_chances) {
          cb(new Error('请填写活动期间最多参与次数'))
          return false
        }
        if (!res.rule_seats_per_order) {
          cb(new Error('请填写每笔订单最多座位数'))
          return false
        }
      })
      cb()
    }
    return {
      allTypeList: [{
        value: 'activity',
        name: '活动版块',
        checked: false
      }, {
        value: 'banner',
        name: '首页banner',
        checked: false
      }, {
        value: 'detail',
        name: '影片详情页',
        checked: false
      }], // 所有活动类型的列表
      activityParams: {
        activity_subject: '',
        mch_id: '',
        mchList: [],
        area: [],
        region_id: '',
        setting: {},
        showtime_start_boundary: '',
        showtime_end_boundary: '',
        showtime_cycle: 'daily',
        weekTime: [],
        limitTime: ['08:00:00', '22:00:00'],
        showtime_days: '',
        showtime_begin: '',
        showtime_end: '',
        scopes: ['activity'],
        // page_rank: '',
        activity_banner: '',
        description: ''
      },
      settingParams: {
        activity_type: 'cash',
        cinema_group_id: '',
        filmList: [{ id: '', name: '', options: [] }],
        film_codes: '',
        film_copies: '',
        activity_cycle: 'daily',
        weekTime: [],
        limitTime: ['08:00:00', '22:00:00'],
        activity_payment: ['wxpay'],
        activity_rules: [{
          rule_discount_type: 'cash_back',
          rule_discount_tag: '',
          rule_mininum: '',
          rule_min_unit: '',
          rule_max_unit: '',
          rule_total_amount: '',
          rule_chances_per_day: '',
          rule_chances_per_week: '',
          rule_chances_per_month: '',
          rule_total_chances: '',
          rule_seats_per_order: ''
        }],
        activity_tag: '',
        activity_settlement_type: ['order']
      },
      rules: {
        activity_subject: { required: true, max: 15, message: '请输入活动名称标题，最多15个字', trigger: 'blur' },
        activity_banner: { required: true, message: '请上传活动图片', trigger: 'change' },
        // page_rank: { required: true, validator: checkSort, trigger: 'blur' },
        mchList: { required: true, validator: checkChannelList, trigger: 'change' },
        area: { required: true, message: '请填写投放城市', trigger: 'blur' },
        time: { required: true, validator: checkTime, trigger: 'blur' },
        scopes: { required: true, validator: checkType, trigger: 'blur' },
        description: { required: true, message: '请填写活动说明', trigger: 'blur' }
      },
      SettingRules: {
        cinema_group_id: { required: true, message: '请选择可用影院', trigger: 'change' },
        film_codes: { required: true, validator: checkFilmList, trigger: 'change' },
        film_copies: { required: true, validator: checkStandardList, trigger: 'change' },
        time: { required: true, validator: checkSettingTime, trigger: 'blur' },
        activity_payment: { required: true, message: '请选择支付方式', trigger: 'change' },
        activity_rules: { required: true, validator: checkRules, trigger: 'change' },
        activity_tag: { required: true, message: '请上传前端标签', trigger: 'blur' },
        activity_settlement_type: { required: true, message: '请上传结算方式', trigger: 'blur' },
        external_link: { required: true, message: '请上传活动地址', trigger: 'blur' }
      },
      ok: false
    }
  },
  computed: {
    mch_idChange: function() {
      return this.activityParams.mchList.map(e => e.value).join(',')
    }
  },
  watch: {
    mch_idChange(val) {
      this.$set(this.activityParams, 'mch_id', val)
    }
  },
  methods: {
    activityTypeChange(val) {
      if (val === 'cash') {
        this.$set(this, 'settingParams', {
          activity_type: 'cash',
          cinema_group_id: '',
          film_codes: '',
          film_copies: '',
          activity_cycle: 'daily',
          activity_payment: ['wxpay'],
          activity_rules: [{
            rule_discount_type: 'cash_back',
            rule_discount_tag: '',
            rule_mininum: '',
            rule_min_unit: '',
            rule_max_unit: '',
            rule_total_amount: '',
            rule_chances_per_day: '',
            rule_chances_per_week: '',
            rule_chances_per_month: '',
            rule_total_chances: '',
            rule_seats_per_order: ''
          }],
          activity_tag: '',
          activity_settlement_type: ['order']
        })
      } else {
        this.$set(this, 'settingParams', {
          activity_type: 'coupon',
          external_link: ''
        })
      }
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.activityParams.mch_id === '') {
            this.$message.warning('请选择投放商家')
            return
          }
          if (this.activityParams.time.length < 2) {
            this.$message.warning('请选择投放时间')
            return
          }
          const result = {}
          result.activity_id = this.$route.query.activity_id || ''
          result.activity_subject = this.activityParams.activity_subject
          result.mch_id = this.activityParams.mch_id
          /* result.showtime_start_boundary = this.activityParams.time[0]
          result.showtime_end_boundary = this.activityParams.time[1]
          result.showtime_begin = this.activityParams.limitTime[0]
          result.showtime_end = this.activityParams.limitTime[1]*/
          console.log(this.activityParams.limitTime)
          this.$set(result, 'showtime_start_boundary', this.activityParams.time[0])
          this.$set(result, 'showtime_end_boundary', this.activityParams.time[1])
          this.$set(result, 'showtime_begin', this.activityParams.limitTime[0])
          this.$set(result, 'showtime_end', this.activityParams.limitTime[1])

          result.region_id = this.activityParams.area.map(e => e).join(',')
          if (this.activityParams.showtime_cycle === 'weekly') {
            this.activityParams.weekTime.map(e => {
              switch (e) {
                case 1:
                  this.activityParams.showtime_days += 'Monday,'
                  break
                case 2:
                  this.activityParams.showtime_days += 'Tuesday,'
                  break
                case 3:
                  this.activityParams.showtime_days += 'Wednesday,'
                  break
                case 4:
                  this.activityParams.showtime_days += 'Thursday,'
                  break
                case 5:
                  this.activityParams.showtime_days += 'Saturday,'
                  break
                case 6:
                  this.activityParams.showtime_days += 'Friday,'
                  break
                case 0:
                  this.activityParams.showtime_days += 'Sunday,'
                  break
              }
            })
          }
          result.scopes = this.activityParams.scopes.map(e => e).join(',')
          result.showtime_cycle = this.activityParams.showtime_cycle
          result.showtime_days = this.activityParams.showtime_days
          // result.page_rank = this.activityParams.page_rank
          result.activity_banner = this.activityParams.activity_banner
          result.description = this.activityParams.description

          result.id = this.$route.query.id
          editActivity(result).then(e => {
            this.$message.success('保存成功')
            this.closeTab(true)
            this.$router.push({ path: '/operation_center/activity_mgr/activity_list' })
          }).catch(e => {
            this.$message.warning(e.content)
          })
        }
      })
    },
    settingSave() {
      this.$refs.settingForm.validate((valid) => {
        if (valid) {
          const result = this.settingSaveParams()
          const loading = this.$loading({
            lock: true,
            text: '正在提交',
            spinner: 'el-icon-loading'
          })
          editActivitySettings(result).then(res => {
            loading.close()
            this.$message.success('保存成功')
            this.closeTab(true)
            this.$router.push({ path: '/operation_center/activity_mgr/activity_list' })
          }).catch(e => {
            loading.close()
            this.$message.warning(e.content + ',请重新填写')
            this.getInfo()
          })
        }
      })
    },
    settingApproval() {
      this.$refs.settingForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在提交',
            spinner: 'el-icon-loading'
          })
          const result = this.settingSaveParams()
          editActivitySettings(result).then(res => {
            activitySubmitById({ activity_id: this.$route.query.activity_id }).then(res => {
              loading.close()
              this.$message.success('提交审核成功')
              this.closeTab(true)
              this.$router.push({ path: '/operation_center/activity_mgr/activity_list' })
            }).catch(e => {
              this.getInfo()
              loading.close()
              e.status === 4800 ? this.$message.warning(e.content) : this.$message.warning(e.content + ',请重新填写')
            })
          }).catch(e => {
            this.getInfo()
            loading.close()
            this.$message.warning(e.content + ',请重新填写')
          })
        }
      })
    },
    settingSaveParams() {
      const result = this.settingParams
      if (this.settingParams.activity_type === 'cash') {
        result.activity_payment = this.settingParams.activity_payment.map(e => e).join(',')
        result.activity_settlement_type = this.settingParams.activity_settlement_type.map(e => e).join(',')
        /* result.activity_start_boundary = this.settingParams.time[0]
        result.activity_end_boundary = this.settingParams.time[1]*/
        this.$set(result, 'activity_start_boundary', this.settingParams.time[0])
        this.$set(result, 'activity_end_boundary', this.settingParams.time[1])
        this.settingParams.filmType === '-1' ? result.film_codes = '-1' : ''
        if (this.settingParams.limitTime.length > 0) {
          this.$set(result, 'activity_begin', this.settingParams.limitTime[0])
          this.$set(result, 'activity_end', this.settingParams.limitTime[1])
          /* result.activity_begin = this.settingParams.limitTime[0]
          result.activity_end = this.settingParams.limitTime[1]*/
        }
        if (this.settingParams.activity_cycle === 'weekly' && this.settingParams.weekTime.length > 0) {
          this.settingParams.activity_days = this.settingParams.activity_days ? this.settingParams.activity_days + ',' : ''
          this.settingParams.weekTime.map(e => {
            switch (e) {
              case 1:
                this.settingParams.activity_days += 'Monday,'
                break
              case 2:
                this.settingParams.activity_days += 'Tuesday,'
                break
              case 3:
                this.settingParams.activity_days += 'Wednesday,'
                break
              case 4:
                this.settingParams.activity_days += 'Thursday,'
                break
              case 5:
                this.settingParams.activity_days += 'Friday,'
                break
              case 6:
                this.settingParams.activity_days += 'Saturday,'
                break
              case 0:
                this.settingParams.activity_days += 'Sunday,'
                break
            }
          })
        }
        result.activity_id = this.$route.query.activity_id
        // result.activity_rules = JSON.stringify(this.settingParams.activity_rules)
        /* delete result.rules
            delete result.time
            delete result.limitTime*/
      } else if (this.settingParams.activity_type === 'coupon') {
        this.$set(result, 'activity_type', this.settingParams.activity_type)
        this.$set(result, 'external_link', this.settingParams.external_link)
        this.$set(result, 'activity_id', this.$route.query.activity_id)
      }
      return result
    },
    async getInfo() {
      const result = await getActivityById({ activity_id: this.$route.query.activity_id })

      this.activityParams.activity_id = result.activity_id
      this.activityParams.activity_subject = result.activity_subject
      result.mch_id.split(',').forEach(e => { this.activityParams.mchList.push({ name: e, value: e, checked: true }) })
      this.ok = true
      this.activityParams.activity_banner = result.activity_banner

      this.$set(this.activityParams, 'time', [])
      result.showtime_start_boundary ? this.$set(this.activityParams.time, 0, result.showtime_start_boundary.substring(0, 10)) : ''
      result.showtime_end_boundary ? this.$set(this.activityParams.time, 1, result.showtime_end_boundary.substring(0, 10)) : ''
      this.$set(this.activityParams, 'limitTime', [new Date(), new Date()])
      result.showtime_begin ? this.$set(this.activityParams.limitTime, 0, result.showtime_begin) : ''
      result.showtime_end ? this.$set(this.activityParams.limitTime, 1, result.showtime_end) : ''
      this.activityParams.weekTime = []
      if (result.showtime_days) {
        const arrTemp = [...result.showtime_days.split(',')]
        arrTemp.map(e => {
          switch (e) {
            case 'Monday':
              this.activityParams.weekTime.push(1)
              break
            case 'Tuesday':
              this.activityParams.weekTime.push(2)
              break
            case 'Wednesday':
              this.activityParams.weekTime.push(3)
              break
            case 'Thursday':
              this.activityParams.weekTime.push(4)
              break
            case 'Friday':
              this.activityParams.weekTime.push(5)
              break
            case 'Saturday':
              this.activityParams.weekTime.push(6)
              break
            case 'Sunday':
              this.activityParams.weekTime.push(0)
              break
          }
        })
      }
      this.activityParams.showtime_cycle = result.showtime_cycle
      result.province_id ? this.$set(this.activityParams.area, 0, result.province_id) : ''
      result.province_id && result.region_id ? this.$set(this.activityParams.area, 1, result.region_id) : ''

      // this.activityParams.page_rank = result.page_rank
      this.activityParams.description = result.description
      this.activityParams.scopes = result.scopes.split(',')

      // 配置规则内容
      if (Object.keys(result.settings).length > 0) {
        this.settingParams = result.settings
        if (this.settingParams.activity_type === 'cash') {
          this.settingParams.activity_payment = this.settingParams.activity_payment.split(',')
          this.settingParams.activity_settlement_type = this.settingParams.activity_settlement_type.split(',')
          this.$set(this.settingParams, 'filmType', this.settingParams.film_codes === '-1' ? '-1' : '1')

          const filmListTemp = []
          await getFilmIdList({}).then(res => {
            this.settingParams.film_codes !== '-1'
              ? this.settingParams.film_codes.split(',').map(e => {
                res.map(el => {
                  if (e === el.value) {
                    filmListTemp.push({ value: e, name: el.name })
                  }
                })
              })
              : ''
          })
          this.$set(this.settingParams, 'filmList', result.settings.film_list)

          this.$set(this.settingParams, 'time', [])
          result.settings.activity_start_boundary ? this.$set(this.settingParams.time, 0, result.settings.activity_start_boundary.substring(0, 10)) : ''
          result.settings.activity_end_boundary ? this.$set(this.settingParams.time, 1, result.settings.activity_end_boundary.substring(0, 10)) : ''
          this.$set(this.settingParams, 'limitTime', [])
          result.settings.activity_begin ? this.$set(this.settingParams.limitTime, 0, result.settings.activity_begin) : ''
          result.settings.activity_end ? this.$set(this.settingParams.limitTime, 1, result.settings.activity_end) : ''

          /* this.settingParams.time[0] = result.settings.activity_start_boundary.substring(0, 10)
          this.settingParams.time[1] = result.settings.activity_end_boundary.substring(0, 10)
          this.settingParams.limitTime = []
          this.settingParams.limitTime[0] = result.settings.activity_begin
          this.settingParams.limitTime[1] = result.settings.activity_end*/
          this.settingParams.weekTime = []
          if (result.settings.activity_days) {
            const arrTemp = [...result.settings.activity_days.split(',')]
            arrTemp.map(e => {
              switch (e) {
                case 'Monday':
                  this.settingParams.weekTime.push(1)
                  break
                case 'Tuesday':
                  this.settingParams.weekTime.push(2)
                  break
                case 'Wednesday':
                  this.settingParams.weekTime.push(3)
                  break
                case 'Thursday':
                  this.settingParams.weekTime.push(4)
                  break
                case 'Friday':
                  this.settingParams.weekTime.push(5)
                  break
                case 'Saturday':
                  this.settingParams.weekTime.push(6)
                  break
                case 'Sunday':
                  this.settingParams.weekTime.push(0)
                  break
              }
            })
          }
        }
        this.$nextTick(() => {
          this.$set(this.settingParams, 'activity_rules', result.settings.rules)
        })
      } else {
        this.$set(this.settingParams, 'limitTime', ['08:00:00', '22:00:00'])
        // this.activityParams.filmList = [{ id: '', name: '', options: [] }]
        this.$set(this.settingParams, 'filmList', [{ id: '', name: '', options: [] }])
      }
    }
  },
  async created() {
    if (this.$route.query.activity_id) {
      this.getInfo()
    }
  }
}
</script>

<style  lang="scss">
.edit-price-program{
  .el-card__body {
      padding: 20px 20px 0px 0px;
  }
  .add-rule-btn{
    text-align: center;
    font-size: 25px;
  }
  .rule-card{
    margin-bottom:20px;
    position: relative;
  }
  .remove-rule{
    position: absolute;
    top:26px;
    left:20px;
    font-size: 24px;
    cursor: pointer;
  }
  .cinema-tip{
    position: absolute;
    top:5px;
    left:10px;
  }
  .oper{
    font-size: 28px;
    margin-left: 20px;
    i{
      cursor: pointer;
    }
  }
}
</style>
