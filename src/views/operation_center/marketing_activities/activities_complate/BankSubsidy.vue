<template>
  <div class>
    <el-form
      label-width="140px"
      :model="params"
      :rules="bankSubsidyRules"
      ref="bankSubsidyRulesForm"
    >
      <el-form-item label="投放终端:" prop="devices">
        <el-checkbox-group v-model="params.devices">
          <el-checkbox label="1">微信H5</el-checkbox>
          <el-checkbox label="2">APP</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="投放位置:" prop="scopes">
        <el-checkbox-group v-model="params.scopes">
          <el-checkbox label="1">影片资料页</el-checkbox>
          <el-checkbox label="2">活动模块</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div v-if="activityType==='2'">
        <el-form-item label="选择平台商家:" prop="channelIds">
          <channel-selector v-model="params.channelIds" type="1" text="自营"></channel-selector>
        </el-form-item>
      </div>
      <el-form-item label="活动影院:" prop="cinemaType">
        <el-radio-group v-model="params.cinemaType">
          <el-radio label="1">根据票务系统商选择</el-radio>
          <el-radio label="2">根据影院分组选择</el-radio>
          <el-radio label="3">根据城市选择</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择票务系统商:" prop="interfaceTypeIds" v-if="params.cinemaType==='1'">
        <remote-select-multiple
          v-model="params.filmConditions.interfaceTypeIds"
          showAllOption
          placeholder="选择票务系统商"
          action="/systemApi/interfaceType/getList"
          style="width:300px"
        ></remote-select-multiple>
      </el-form-item>
      <el-form-item label="选择影院分组:" prop="groupId" v-if="params.cinemaType==='2'">
        <remote-select
          v-model="params.filmConditions.groupId"
          clearable
          placeholder="请选择可用影院"
          action="/systemApi/cinemaGroup/getList"
          :query="{}"
          style="width:230px;"
        ></remote-select>
      </el-form-item>

      <el-form-item label="选择城市:" prop="area" v-if="params.cinemaType==='3'">
        <city-cascader
          ref="city"
          v-model="area"
          :rang="2"
          showAllOptions
          :clearable="true"
          placeholder="请选择"
          style="width:320px;"
        ></city-cascader>
      </el-form-item>
      <el-form-item label="选择执行影片:" prop="films">
        <el-radio-group v-model="filmSelect" @change="filmSelectChange">
          <el-radio label="1">全部影片</el-radio>
          <el-radio label="2">指定影片</el-radio>
        </el-radio-group>
        <film-selector
          v-model="params.films"
          getFilmId
          :cinemaType="params.cinemaType"
          :channelIds="params.channelIds"
          :cinemaGroupId="params.filmConditions.groupId"
          :interfaceTypeIds="params.filmConditions.interfaceTypeIds"
          :area="area"
          v-if="filmSelect==='2' && params.channelIds && ((params.cinemaType==='1' && params.filmConditions.interfaceTypeIds.length>0) || (params.cinemaType==='2' && params.filmConditions.groupId) || (params.cinemaType==='3' && area.length>0))"
        ></film-selector>
      </el-form-item>
      <el-form-item label="活动补贴总金额:" prop="totalAmount">
        <el-input
          clearable
          v-model="params.totalAmount"
          style="width:320px;"
          placeholder="请输入活动补贴总金额"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动白名单:" prop="hasWhiteList">
        <el-radio-group v-model="params.hasWhiteList">
          <el-radio label="1">支持</el-radio>
          <el-radio label="2">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="白名单号码:" prop="key" v-if="params.hasWhiteList==='1'">
        <file-upload
          v-model="params.key"
          @fileUploadKey="fileUploadKey"
          content="文件大小不超过3M，建议单次导入号码10万个以内"
        ></file-upload>
      </el-form-item>
      <el-form-item label-width="200px" label="每笔订单最多可购座位数:" prop="orderSeatsLimit">
        <el-radio-group v-model="params.orderSeatsLimit">
          <el-radio label="2">不限</el-radio>
          <el-radio label="1">限制</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label-width="200px"
        label="每笔订单最多可购座位数:"
        prop="orderMaxCanBuy"
        v-if="params.orderSeatsLimit==='1'"
      >
        <el-input
          clearable
          v-model="params.orderMaxCanBuy"
          style="width:320px;"
          placeholder="输入每笔订单最多可购座位数"
        ></el-input>
      </el-form-item>

      <el-form-item label-width="200px" label="每个活动日限购座位总张数:" prop="totalSeatsLimit">
        <el-radio-group v-model="params.totalSeatsLimit">
          <el-radio label="2">不限</el-radio>
          <el-radio label="1">限制</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label-width="200px"
        label="每个活动日限购座位总张数:"
        prop="totalMaxCanBuy"
        v-if="params.totalSeatsLimit==='1'"
        style="width:450px;"
      >
        <tip content="单个活动日限制的总座位数量张数">
          <el-input clearable v-model="params.totalMaxCanBuy" placeholder="每个活动日限购座位总张数"></el-input>
        </tip>
      </el-form-item>

      <el-form-item label="支付方式:" prop="payType">
        <el-checkbox-group v-model="params.payType" @change="payTypeChange">
          <el-checkbox label="1">微信支付</el-checkbox>
          <el-checkbox label="2">银联支付</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 支付方式配置 -->
      <el-form-item
        label
        label-width="0px"
        prop="weixinPay"
        v-if="params.payType && params.payType.includes('1')"
      >
        <weixin-pay ref="weixinPay" v-model="params.weixinPay" :cinemaGroupId="cinemaGroupId"></weixin-pay>
      </el-form-item>

      <el-form-item
        label
        label-width="0px"
        prop="unionPay"
        v-if="params.payType && params.payType.includes('2')"
      >
        <union-pay ref="unionPay" v-model="params.unionPay" :cinemaGroupId="cinemaGroupId"></union-pay>
      </el-form-item>

      <el-form-item label="用户参与规则:" class="noTag" style="width:600px;" prop="allCount">
        单个用户参与总次数&emsp;&emsp;
        <el-input
          clearable
          placeholder="次数"
          v-model.trim="params.ruleConfig.allCount"
          style="width:120px"
        ></el-input>
      </el-form-item>
      <el-form-item label=" " class="noTag" style="width:600px;" prop="dayCount">
        单个用户每日参与次数&emsp;
        <el-input
          clearable
          placeholder="次数"
          v-model.trim="params.ruleConfig.dayCount"
          style="width:120px"
        ></el-input>
      </el-form-item>
      <el-form-item label=" " class="noTag" style="width:600px;" prop="weekCount">
        单个用户每周参与次数&emsp;
        <el-input
          clearable
          placeholder="次数"
          v-model.trim="params.ruleConfig.weekCount"
          style="width:120px"
        ></el-input>
      </el-form-item>
      <el-form-item label=" " class="noTag" style="width:600px;" prop="monthCount">
        单个用户每月参与次数&emsp;
        <el-input
          clearable
          placeholder="次数"
          v-model.trim="params.ruleConfig.monthCount"
          style="width:120px"
        ></el-input>
      </el-form-item>

      <el-form-item label="退款返还参与次数:" prop="refundAndReturnTimes" label-width="180px">
        <el-radio-group v-model="params.refundAndReturnTimes">
          <el-radio label="1">支持</el-radio>
          <el-radio label="2">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="放弃付款返还参与次数:" prop="backAndReturnTimes" label-width="180px">
        <el-radio-group v-model="params.backAndReturnTimes">
          <el-radio label="1">支持</el-radio>
          <el-radio label="2">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ChannelSelector from './ChannelSelector'
import FilmSelector from './FilmSelector'
import FileUpload from './FileUpload'
import WeixinPay from './WeixinPay'
import UnionPay from './UnionPay'
import CityCascader from '@/components/CityCascader'

export default {
  name: 'bank_subsidy',
  components: {
    ChannelSelector,
    CityCascader,
    FilmSelector,
    FileUpload,
    WeixinPay,
    UnionPay
  },
  props: {
    value: Object,
    activityType: String
  },
  watch: {
    params: {
      handler(val) {
        val = Object.assign(val, this.key)
        this.$emit('input', val)
      },
      deep: true
    },
    'params.channelIds'() {
      this.$set(this, 'filmSelect', '1')
    },
    'params.cinemaType'() {
      this.$set(this, 'filmSelect', '1')
    },
    'params.filmConditions': {
      handler() {
        this.$set(this, 'filmSelect', '1')
      },
      deep: true
    },
    area: {
      handler(val) {
        this.params.filmConditions.provinceId = this.area[0]
        this.params.filmConditions.cityId = this.area[1]
        this.params.filmConditions.countryId = this.area[2]
        this.$set(this, 'filmSelect', '1')
      },
      deep: true
    }
    /*,
    value(val) {
      if (val) {
        this.params = val
      }
    }*/
  },
  data() {
    const checkInterfaceTypeIds = (rule, value, cb) => {
      if (
        this.params.cinemaType === '1' &&
        this.params.filmConditions.interfaceTypeIds.length === 0
      ) {
        cb(new Error('请选择系统商'))
      }
      cb()
    }
    const checkGroupId = (rule, value, cb) => {
      if (
        this.params.cinemaType === '2' &&
        this.params.filmConditions.groupId.length === 0
      ) {
        cb(new Error('请选择影院组'))
      }
      cb()
    }
    const checkArea = (rule, value, cb) => {
      if (this.params.cinemaType === '3' && this.area.length === 0) {
        cb(new Error('请选择城市'))
      }
      cb()
    }
    const checkFilms = (rule, value, cb) => {
      if (this.filmSelect === '2' && this.params.films.length === 0) {
        cb(new Error('请选择影片'))
      }
      cb()
    }
    /* const checkAllCount = (rule, value, cb) => {
      const str = /^[0-9]+$/
      if (this.params.ruleConfig.allCount.length === 0 || !str.test(this.params.ruleConfig.allCount)) {
        cb(new Error('请填写完整次数'))
      }
      cb()
    }
    const checkDayCount = (rule, value, cb) => {
      const str = /^[0-9]+$/
      if (this.params.ruleConfig.dayCount.length === 0 || !str.test(this.params.ruleConfig.dayCount)) {
        cb(new Error('请填写完整次数'))
      }
      cb()
    }
    const checkWeekCount = (rule, value, cb) => {
      const str = /^[0-9]+$/
      if (this.params.ruleConfig.weekCount.length === 0 || !str.test(this.params.ruleConfig.weekCount)) {
        cb(new Error('请填写完整次数'))
      }
      cb()
    }*/
    const checkKey = (rule, value, cb) => {
      if (
        this.params.hasWhiteList === '1' &&
        !this.params.key &&
        !this.$route.query.id
      ) {
        cb(new Error('请上传白名单'))
      }
      cb()
    }
    const checkWeixinPay = (rule, value, cb) => {
      if (this.params.payType.includes('1')) {
        this.params.weixinPay.activityConfig.forEach(e => {
          if (
            e.tag.length === 0 ||
            e.copyType.length === 0 ||
            e.ceiling.length === 0
          ) {
            cb(new Error('请填写完整支付配置'))
          }
          const userLimit1 = Object.keys(e.useLimit)[0]
          if (userLimit1 === 'undefined' || !e.useLimit[userLimit1]) {
            cb(new Error('请填写完整支付配置'))
          }
        })
      }
      cb()
    }
    const checkUnionPay = (rule, value, cb) => {
      const userLimit1 = Object.keys(
        this.params.unionPay.activityConfig.useLimit
      )[0]
      if (this.params.payType.includes('2')) {
        if (
          this.params.unionPay.payConfigId.length === 0 ||
          this.params.unionPay.copyType.length === 0 ||
          this.params.unionPay.ceiling.length === 0
        ) {
          cb(new Error('请填写完整支付配置'))
        }
        if (
          userLimit1 === 'undefined' ||
          !this.params.unionPay.activityConfig.useLimit[userLimit1]
        ) {
          cb(new Error('请填写完整支付配置'))
        }
        if (
          this.params.unionPay.discountType === '1' &&
          !this.params.unionPay.activityConfig.money
        ) {
          cb(new Error('请填写完整支付配置'))
        }
        if (
          this.params.unionPay.discountType === '2' &&
          (!this.params.unionPay.activityConfig.interval1 ||
            !this.params.unionPay.activityConfig.interval2)
        ) {
          cb(new Error('请填写完整支付配置'))
        }
        if (
          this.params.unionPay.discountType === '3' &&
          (!this.params.unionPay.activityConfig.scale ||
            !this.params.unionPay.activityConfig.limit)
        ) {
          cb(new Error('请填写完整支付配置'))
        }
      }
      cb()
    }
    return {
      params: {
        devices: [],
        scopes: [],

        channelZYType: [],
        channelZY: [],
        channelJMType: [],
        channelJM: [],

        cinemaType: '1',
        filmConditions: {
          interfaceTypeIds: ['-1'],
          groupId: '',
          provinceId: '',
          cityId: '',
          countryId: ''
        },
        films: '-1',
        totalAmount: '',
        hasWhiteList: '1',
        // whiteList: '',
        key: '', // 上传数据后的 白名单key
        orderSeatsLimit: '2',
        orderMaxCanBuy: '',
        totalSeatsLimit: '2',
        totalMaxCanBuy: '',

        payType: [],

        weixinPay: {},
        unionPay: {},

        ruleConfig: {
          allCount: '',
          dayCount: '',
          weekCount: '',
          monthCount: ''
        },
        refundAndReturnTimes: '2',
        backAndReturnTimes: '1'
      },
      area: [],
      cinemaGroupId: '',

      filmSelect: '1',

      bankSubsidyRules: {
        devices: {
          required: true,
          message: '请选择投放终端',
          trigger: 'change'
        },
        scopes: {
          required: true,
          message: '请选择投放位置',
          trigger: 'change'
        },
        channelIds: {
          required: true,
          message: '请选择平台商家',
          trigger: 'change'
        },
        interfaceTypeIds: {
          required: true,
          validator: checkInterfaceTypeIds,
          message: '请选择系统商',
          trigger: 'blur'
        },
        groupId: {
          required: true,
          validator: checkGroupId,
          message: '请选择影院组',
          trigger: 'blur'
        },
        area: {
          required: true,
          validator: checkArea,
          message: '请选择城市',
          trigger: 'blur'
        },
        films: {
          required: true,
          validator: checkFilms,
          message: '请选择影片',
          trigger: 'blur'
        },

        totalAmount: {
          required: true,
          message: '请输入活动补贴总金额',
          trigger: 'blur'
        },

        key: {
          required: true,
          validator: checkKey,
          message: '请上传白名单',
          trigger: 'change'
        },
        payType: {
          required: true,
          message: '请选择支付方式',
          trigger: 'change'
        },
        orderMaxCanBuy: {
          required: true,
          message: '请输入每笔订单最多可购座位数',
          trigger: 'blur'
        },
        totalMaxCanBuy: {
          required: true,
          message: '请输入日限购座位总张数',
          trigger: 'blur'
        },

        weixinPay: {
          required: true,
          validator: checkWeixinPay,
          message: '请填写完整支付配置',
          trigger: 'blur'
        },
        unionPay: {
          required: true,
          validator: checkUnionPay,
          message: '请填写完整支付配置',
          trigger: 'blur'
        }

        /*,
        allCount: { required: true, validator: checkAllCount, message: '请填写完整次数', trigger: 'blur' },
        dayCount: { required: true, validator: checkDayCount, message: '请填写完整次数', trigger: 'blur' },
        weekCount: { required: true, validator: checkWeekCount, message: '请填写完整次数', trigger: 'blur' }*/
      }
    }
  },
  methods: {
    validateChild() {
      const _this = this
      this.$refs.bankSubsidyRulesForm.validate(async valid => {
        if (valid) {
          _this.$emit('submitType', ['subject', true])
        } else {
          this.$message.warning('请填写完整表单内容')
          this.$emit('submitType', ['subject', false])
        }
      })
    },
    getSubmitType(type) {
      // 获取验证子组件表单的通过状态
      if (type[0] === 'subject') {
        this.canValidate = type[1]
      }
    },
    fileUploadKey(val) {
      this.$set(this.params, 'key', val)
    },
    filmSelectChange() {
      if (this.filmSelect === '1') {
        this.$set(this.params, 'films', '-1')
      } else {
        this.$set(this.params, 'films', '')
      }
    },
    payTypeChange(val) {
      if (!val.includes('1')) {
        this.$set(this.params, 'weixinPay', {
          discountType: '1',
          activityConfig: [
            {
              tag: '',
              copyType: '',
              useLimit: {},
              ceiling: ''
            }
          ]
        })
      }
      if (!val.includes('2')) {
        if (!this.params.unionPay) {
          this.$set(this.params, 'unionPay', {
            customize: '2',
            payConfigId: '',
            discountType: '1',

            copyType: '',

            activityConfig: {
              ruleType: '1',
              money: '', // 定额立减->固定售价||减价金额
              interval1: '', // 随机立减
              interval2: '', // 随机立减
              scale: '', // 折扣立减
              limit: '',
              useType: '1',
              useLimit: { lt: '' }
            },
            ceiling: ''
          })
        }
      }
    }
  },
  mounted() {},
  async created() {
    if (this.$route.query.id && this.value) {
      this.params = this.value

      this.$nextTick(el => {
        console.log(this.params)
        typeof this.params.payType === 'string' &&
          this.$set(
            this.params,
            'payType',
            this.params.payType.split(',').filter(e => e)
          )
        typeof this.params.devices === 'string' &&
          this.$set(
            this.params,
            'devices',
            this.params.devices.split(',').filter(e => e)
          )
        typeof this.params.scopes === 'string' &&
          this.$set(
            this.params,
            'scopes',
            this.params.scopes.split(',').filter(e => e)
          )
      })

      if (this.params.cinemaType === '3') {
        const arrTemp = []
        arrTemp.push(this.params.filmConditions.provinceId)
        this.params.filmConditions.cityId
          ? arrTemp.push(this.params.filmConditions.cityId)
          : ''
        this.params.filmConditions.countryId
          ? arrTemp.push(this.params.filmConditions.countryId)
          : ''
        if (this.params.filmConditions.provinceId !== '-1') {
          this.$nextTick(e => {
            this.$set(this, 'area', arrTemp)
          })
        } else {
          this.$nextTick(e => {
            this.area.push(this.params.filmConditions.provinceId)
          })
        }
      }
      /* this.$set(this.params, 'filmConditions', {
        interfaceTypeIds: ['-1'],
        groupId: this.params.filmConditions.groupId,
        provinceId: '',
        cityId: '',
        countryId: ''
      })*/
      // 编辑,如果没有返回unionPay,按初始给调weixinPay
      if (!this.params.weixinPay) {
        this.$set(this.params, 'weixinPay', {
          discountType: '1',
          activityConfig: [
            {
              tag: '',
              copyType: '',
              useLimit: {},
              ceiling: ''
            }
          ]
        })
      }
      // 编辑,如果没有返回unionPay,按初始给调unionPay
      if (!this.params.unionPay) {
        this.$set(this.params, 'unionPay', {
          customize: '2',
          payConfigId: '',
          discountType: '1',

          copyType: '',

          activityConfig: {
            ruleType: '1',
            money: '', // 定额立减->固定售价||减价金额
            interval1: '', // 随机立减
            interval2: '', // 随机立减
            scale: '', // 折扣立减
            limit: '',
            useType: '1',
            useLimit: { lt: '' }
          },
          ceiling: ''
        })
      }
      this.filmSelect = this.params.films === '-1' ? '1' : '2'
    }
  }
}
</script>