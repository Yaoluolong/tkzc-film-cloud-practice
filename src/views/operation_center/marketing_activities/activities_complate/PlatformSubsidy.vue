<template>
	<div class="">
	  <el-form label-width="140px" :model="params" :rules="platformSubsidyRules" ref="platformSubsidyRulesForm">
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
      <!-- <div v-if="activityType==='3'"> -->
        <el-form-item label="选择平台商家:" prop="channelIds">
          <channel-selector v-model="params.channelIds" type="1" text="自营"></channel-selector>
        </el-form-item>
      <!-- </div> -->
      <el-form-item label="活动影院:" prop="cinemaType">
        <el-radio-group v-model="params.cinemaType">
          <el-radio label="1">根据票务系统商选择</el-radio>
          <el-radio label="2">根据影院分组选择</el-radio>
          <el-radio label="3">根据城市选择</el-radio>
        </el-radio-group>
      </el-form-item>
  		<div v-if="params.cinemaType">
  			<el-form-item label="选择票务系统商:" prop="interfaceTypeIds" v-if="params.cinemaType==='1'">
  	       <remote-select-multiple  v-model="params.filmConditions.interfaceTypeIds" showAllOption placeholder="选择票务系统商" action="/systemApi/interfaceType/getList" style="width:300px">
  	          </remote-select-multiple>
        </el-form-item>
        <el-form-item label="选择影院分组:" prop="groupId" v-if="params.cinemaType==='2'">
          	<remote-select v-model="params.filmConditions.groupId" clearable placeholder="请选择可用影院" action="/systemApi/cinemaGroup/getList" :query="{}" style="width:230px;"></remote-select>
        	</el-form-item>
        
        <el-form-item label="选择城市:" prop="area" v-if="params.cinemaType==='3'">
          	<city-cascader ref="city" v-model="area" :rang="2" showAllOptions :clearable="true" placeholder="请选择" style="width:320px;"></city-cascader> 
        </el-form-item>
  		

        <el-form-item label="活动可用制式:" prop="copyType" style="width:100%;">  
        	<standard-selector ref="copyType" v-model="params.copyType" cinemaGroupId=""></standard-selector>
      	</el-form-item>

        <el-form-item label="选择执行影片:" prop="films" v-if="params.copyType">
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
            :copyType="params.copyType"
            v-if="filmSelect==='2' && params.channelIds && ((params.cinemaType==='1' && params.filmConditions.interfaceTypeIds.length>0) || (params.cinemaType==='2' && params.filmConditions.groupId) || (params.cinemaType==='3' && area.length>0))">
          </film-selector>
        </el-form-item>

        <el-form-item label="活动补贴总金额:" prop="totalAmount">
          <el-input v-model="params.totalAmount" style="width:320px;" placeholder="请输入活动补贴总金额"></el-input>
        </el-form-item>

        <el-form-item label="影片活动售价:" v-if="params.films" prop="filmConfig.type">
            <el-radio-group v-model="params.filmConfig.type" size="medium">
              <el-radio label="1">活动规则范围内固定影片售价</el-radio>
              <el-radio label="2">活动规则范围内影片售价立减</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="影片固定售价:" prop="filmConfig.money" style="width:300px;" v-if="params.filmConfig.type==='1'">
          <el-input v-model.trim="params.filmConfig.money" style="width:100px"></el-input>&emsp;元
        </el-form-item>
        <el-form-item label="影片立减金额:" prop="interval" style="width:500px;" v-if="params.filmConfig.type==='2'">
          <el-input v-model.trim="params.filmConfig.interval1" style="width:100px"></el-input>&emsp;至&emsp;<el-input v-model.trim="params.filmConfig.interval2" style="width:100px"></el-input>&emsp;元
        </el-form-item>

        <el-card style="margin-top:10px">
          <div slot="header">
              <span>活动可用支付方式</span>
          </div>
          <!-- <el-button>微信H5</el-button> -->
          <el-tabs v-model="activeName" type="card" @tab-click="handleActiveClick">
            <el-tab-pane label="微信H5" name="wap"></el-tab-pane>
            <el-tab-pane label="移动APP" name="app"></el-tab-pane>        
          </el-tabs>
          <!-- <el-form label-width="0px" ref="payForm" :model="params" :rules="payRules"> -->
            <el-form-item  style="width:1021px" prop="payTypeDetail" v-show="activeName==='app'">
              <ul class="ul">
                <el-checkbox-group v-model="params.payTypeDetail.app" @change="checkedItemChange(payTypeList['app'])">
                  <li class="ul-li">
                    <el-checkbox @change="slelectAllPayType(payTypeList['app'])" :label="'-1'" v-model="appCheckAll">全选</el-checkbox>
                  </li>
                  <li class="ul-li" v-for="payType in payTypeList['app']" :key="payType.payCode">
                    <el-checkbox :label="payType.payCode">{{payType.payName}}</el-checkbox>
                  </li>
                </el-checkbox-group>
              </ul>          
            </el-form-item>
            <el-form-item  style="width:1021px" prop="payTypeDetail1" v-show="activeName==='wap'">
              <ul class="ul">
                <el-checkbox-group v-model="params.payTypeDetail.wap" @change="checkedItemChange(payTypeList['wap'])">
                  <li class="ul-li">
                    <el-checkbox @change="slelectAllPayType(payTypeList['wap'])" :label="'-1'" v-model="wapCheckAll">全选</el-checkbox>
                  </li>
                  <li class="ul-li" v-for="payType in payTypeList['wap']" :key="payType.payCode">
                    <el-checkbox :label="payType.payCode">{{payType.payName}}</el-checkbox>
                  </li>
                </el-checkbox-group>
              </ul>
            </el-form-item>
          <!-- </el-form> -->
        </el-card>

      </div>
	  </el-form>
  </div>
</template>
<script>
import ChannelSelector from './ChannelSelector'
import FilmSelector from './FilmSelector'
import CityCascader from '@/components/CityCascader'
import StandardSelector from './StandardSelector'

import { getPayTypeList } from '@/api/mallCenter'

export default{
  name: 'platform_subsidy',
  components: { ChannelSelector, CityCascader, FilmSelector, StandardSelector },
  props: {
    value: Object,
    activityType: String
  },
  watch: {
    params: {
      handler(val) {
        // if (val.channelIds) {
        this.$emit('input', val)
        // }
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
      if (this.params.cinemaType === '1' && this.params.filmConditions.interfaceTypeIds.length === 0) {
        cb(new Error('请选择系统商'))
      }
      cb()
    }
    const checkGroupId = (rule, value, cb) => {
      if (this.params.cinemaType === '2' && this.params.filmConditions.groupId.length === 0) {
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
    const checkInterval = (rule, value, cb) => {
      if (this.params.filmConfig.type === '2' && (this.params.filmConfig.interval1.length === 0 || this.params.filmConfig.interval2.length === 0)) {
        cb(new Error('请选择影片立减金额'))
      }
      cb()
    }
    const checkPayDetail = (rule, value, cb) => {
      if (this.params.payTypeDetail.app.length === 0) {
        cb(new Error('请确认微信H5和移动APP支付方式是否都已选择'))
      }
      cb()
    }
    const checkPayDetail1 = (rule, value, cb) => {
      if (this.params.payTypeDetail.wap.length === 0) {
        cb(new Error('请确认微信H5和移动APP支付方式是否都已选择'))
      }
      cb()
    }
    return {
      params: {
        devices: [],
        scopes: [],

        cinemaType: '1',

        filmConditions: {
          interfaceTypeIds: ['-1'],
          groupId: '',
          provinceId: '',
          cityId: '',
          countryId: ''
        },
        copyType: '',
        films: '-1',
        totalAmount: '',
        filmConfig: {
          type: '',
          money: '',
          interval1: '',
          interval2: ''
        },
        payTypeDetail: {
          app: [],
          wap: []
        }
      },
      area: [],
      cinemaGroupId: '',

      filmSelect: '1',

      payTypeList: { 'app': [{ name: '', value: '', payTypeList: [] }], 'wap': [{ name: '', value: '', payTypeList: [] }] },
      activeName: 'wap',
      appCheckAll: false,
      wapCheckAll: false,

      platformSubsidyRules: {
        devices: { required: true, message: '请选择投放终端', trigger: 'change' },
        scopes: { required: true, message: '请选择投放位置', trigger: 'change' },
        channelIds: { required: true, message: '请选择平台商家', trigger: 'change' },
        interfaceTypeIds: { required: true, validator: checkInterfaceTypeIds, message: '请选择系统商', trigger: 'blur' },
        groupId: { required: true, validator: checkGroupId, message: '请选择影院组', trigger: 'blur' },
        area: { required: true, validator: checkArea, message: '请选择城市', trigger: 'blur' },
        films: { required: true, validator: checkFilms, message: '请选择影片', trigger: 'blur' },

        copyType: { required: true, message: '请选择可用制式', trigger: 'blur' },

        totalAmount: { required: true, message: '请输入活动补贴总金额', trigger: 'blur' },

        'filmConfig.type': { required: true, message: '请选择影片活动售价', trigger: 'blur' },
        'filmConfig.money': { required: true, message: '请填写影片固定售价', trigger: 'blur' },
        interval: { validator: checkInterval, message: '请填写影片立减金额', trigger: 'blur' },
        payTypeDetail: { required: true, validator: checkPayDetail, message: '请确认微信H5和移动APP支付方式是否都已选择', trigger: 'blur' },
        payTypeDetail1: { required: true, validator: checkPayDetail1, message: '请确认微信H5和移动APP支付方式是否都已选择', trigger: 'blur' }

        /* type: { required: true, message: '请选择影片活动售价', trigger: 'blur' },
        money: { required: true, message: '请选择影片活动售价', trigger: 'blur' },
        interval: { required: true, message: '请选择影片活动售价', trigger: 'blur' }*/
      }
    }
  },
  methods: {
    validateChild() {
      const _this = this
      this.$refs.platformSubsidyRulesForm.validate(async(valid) => {
        if (valid) {
          _this.$emit('submitType', ['subject', true])
        } else {
          this.$message.warning('请填写完整表单内容')
          this.$emit('submitType', ['subject', false])
        }
      })
    },
    getSubmitType(type) { // 获取验证子组件表单的通过状态
      if (type[0] === 'subject') {
        this.canValidate = type[1]
      }
    },
    filmSelectChange() {
      if (this.filmSelect === '1') {
        this.$set(this.params, 'films', '-1')
      } else {
        this.$set(this.params, 'films', '')
      }
    },
    slelectAllPayType(row) {
      if (this.activeName === 'app') {
        const temp = this.params.payTypeDetail.app
        if (temp.find(e => e === '-1')) {
          this.params.payTypeDetail.app = row.map(e => e.payCode)
          this.params.payTypeDetail.app.push('-1')
        } else {
          this.params.payTypeDetail.app = []
        }
      } else if (this.activeName === 'wap') {
        const temp = this.params.payTypeDetail.wap
        if (temp.find(e => e === '-1') < 0) {
          this.params.payTypeDetail.wap = row.map(e => e.payCode)
          this.params.payTypeDetail.wap.push('-1')
        } else {
          this.params.payTypeDetail.wap = []
        }
      }
    },
    handleActiveClick(tab, event) {
      this.$set(this, 'activeName', tab.name)
    },
    checkedItemChange(row) {
      const appValue = this.params.payTypeDetail.app
      const wapValue = this.params.payTypeDetail.wap

      if (this.activeName === 'app' && appValue.findIndex(el => el === '-1') === -1 && appValue.length === row.length) {
        this.params.payTypeDetail.app.push('-1')
      } else if (this.activeName === 'app' && appValue.findIndex(el => el === '-1') !== -1 && appValue.length === row.length) {
        this.params.payTypeDetail.app.splice(this.params.payTypeDetail.app.findIndex(el => el === '-1'), 1)
      }

      if (this.activeName === 'wap' && wapValue.findIndex(el => el === '-1') === -1 && wapValue.length === row.length) {
        this.params.payTypeDetail.wap.push('-1')
      } else if (this.activeName === 'wap' && wapValue.findIndex(el => el === '-1') !== -1 && wapValue.length === row.length) {
        this.params.payTypeDetail.wap.splice(this.params.payTypeDetail.wap.findIndex(el => el === '-1'), 1)
      }
      console.log(this.params.payTypeDetail.wap)
    }
  },
  async created() {
    if (this.$route.query.id && this.value) {
      this.params = this.value

      this.$nextTick(el => {
        if (typeof (this.params.devices) === 'string') {
          this.$set(this.params, 'devices', this.params.devices.split(',').filter(e => e))
          this.$set(this.params, 'scopes', this.params.scopes.split(',').filter(e => e))
        }
      })

      if (this.params.cinemaType === '3') {
        const arrTemp = []
        arrTemp.push(this.params.filmConditions.provinceId)
        this.params.filmConditions.cityId ? arrTemp.push(this.params.filmConditions.cityId) : ''
        this.params.filmConditions.countryId ? arrTemp.push(this.params.filmConditions.countryId) : ''
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
      this.$nextTick(e => {
        this.filmSelect = this.params.films === '-1' ? '1' : '2'
      })

      if (!this.params.payTypeDetail) {
        this.$set(this.params, 'payTypeDetail', {
          app: [],
          wap: []
        })
      }
    }

    await getPayTypeList().then(e => {
      this.$set(this.payTypeList, 'app', e['app'].filter(el => {
        return el.value === 'payTicket'
      })[0].payTypeList)
      this.$set(this.payTypeList, 'wap', e['wap'].filter(el => {
        return el.value === 'payTicket'
      })[0].payTypeList)
    })
  }
}
</script>
<style scoped lang="scss">
.ul-li{
  width:25%;
  display:inline-block
}
</style>