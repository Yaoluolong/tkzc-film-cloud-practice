<template>
  <div class="app-container">
    <el-form label-width="120px" label-position="left" style="width:1000px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="票务系统商" prop="interfaceId" >
        <remote-select v-model="params.interfaceId"  placeholder="请选择系统商" action="/systemApi/interfaceType/getList" style="width:320px;"></remote-select>
      </el-form-item>
      <el-form-item label="定价权" prop="priceRight">
        <remote-select v-model="params.priceRight" @change="prChange(params.priceRight)" placeholder="请选择系统商" action="/systemApi/cinema/getPriceRight" style="width:320px;margin-bottom:20px"></remote-select>
        <!-- <el-form-item label="票价阀值" prop="ticketPrice" v-if="params.priceRight==2||params.priceRight==5" class="inner-item" >
            <gl-input v-model="params.ticketPrice"></gl-input>
        </el-form-item>
        <el-form-item label="影院服务费阀值" prop="servicePrice" v-if="params.priceRight==2||params.priceRight==6"  class="inner-item" >
            <gl-input v-model="params.servicePrice"></gl-input>
        </el-form-item> -->
      </el-form-item>
      <el-form-item label="购票接入">
        <title-plane>
          <template slot="header">
            <el-radio v-model="params.ticketConfigRadio" label="1">关闭</el-radio>
            <el-radio v-model="params.ticketConfigRadio" label="2">开启</el-radio>
          </template>
          <template v-if="params.ticketConfigRadio==2">
            <el-form-item label="接口请求地址" prop="ticketConfig.requestUrl"  class="inner-item" >
                  <el-input disabled v-model="params.ticketConfig.requestUrl"   placeholder="请输入正确访问系统商接口地址" ></el-input>
            </el-form-item>
              <el-form-item label="请求账号" prop="ticketConfig.account"  class="inner-item" >
                  <el-input disabled v-model="params.ticketConfig.account"   placeholder="请输入系统商分发账号" ></el-input>
            </el-form-item>
            <el-form-item label="请求密码" prop="ticketConfig.password"  class="inner-item" >
                  <el-input disabled v-model="params.ticketConfig.password"   placeholder="请输入系统商分发密码" ></el-input>
            </el-form-item>
            <el-form-item label="调用接口参数" prop="ticketConfig.otherInfo"  class="inner-item" >
                  <el-form-item :label="key" v-for="(val,key) in params.ticketConfig.otherInfo" :key="key" class="inner-item">
                    <el-input v-model="params.ticketConfig.otherInfo[key]" :disabled="paramsTwo.ticketConfig.otherInfo[key] != false && paramsTwo.ticketConfig.otherInfo[key] != null&& paramsTwo.ticketConfig.otherInfo[key] != ''"></el-input>
                  </el-form-item>
                  <span class="subtitle">
                    1、根据选择的票务系统商系统会自动填入所需的参数字段，只需填写对应的参数值即可！<br>
                    2、鼎鑫、猫眼的接口参数值可不填，在保存时系统会自动写入。
                  </span>
            </el-form-item>
          </template>
        </title-plane>
      </el-form-item>
      <!-- <el-form-item label="影院卡接入">
        <title-plane>
          <template slot="header">
            <el-radio v-model="params.memberConfigRadio" label="1">关闭</el-radio>
            <el-radio v-model="params.memberConfigRadio" label="2">开启</el-radio>
          </template>
          <template v-if="params.memberConfigRadio==2">
            <el-form-item label="接口请求地址" prop="memberConfig.requestUrl"  class="inner-item" >
                  <el-input v-model="params.memberConfig.requestUrl"   placeholder="请输入正确访问系统商接口地址" ></el-input>
            </el-form-item>
              <el-form-item label="请求账号" prop="memberConfig.account"  class="inner-item" >
                  <el-input v-model="params.memberConfig.account"   placeholder="请输入系统商分发账号" ></el-input>
            </el-form-item>
            <el-form-item label="请求密码" prop="memberConfig.password"  class="inner-item" >
                  <el-input v-model="params.memberConfig.password"   placeholder="请输入系统商分发密码" ></el-input>
            </el-form-item>
            <el-form-item label="调用接口参数" prop="memberConfig.otherInfo"  class="inner-item" >
                  <el-form-item :label="key" v-for="(val,key)  in otherInfoList" :key="key" class="inner-item">
                    <el-input v-model="params.memberConfig.otherInfo[key]" ></el-input>
                  </el-form-item>
                  <span class="subtitle">
                    1、根据选择的票务系统商系统会自动填入所需的参数字段，只需填写对应的参数值即可！<br>
                    2、鼎鑫、猫眼的接口参数值可不填，在保存时系统会自动写入。
                  </span>
            </el-form-item>
          </template>
        </title-plane>
      </el-form-item> -->
      <!-- <el-form-item label="卖品接入" prop="serviceTelType" >
        <title-plane>
          <template slot="header">
            <el-radio v-model="params.saleConfigRadio" label="1">关闭</el-radio>
            <el-radio v-model="params.saleConfigRadio" label="2">开启</el-radio>
          </template>
          <template v-if="params.saleConfigRadio==2">
            <el-form-item label="接口请求地址" prop="saleConfig.requestUrl"  class="inner-item" >
                  <el-input v-model="params.saleConfig.requestUrl"   placeholder="请输入正确访问系统商接口地址" ></el-input>
            </el-form-item>
              <el-form-item label="请求账号" prop="saleConfig.account"  class="inner-item" >
                  <el-input v-model="params.saleConfig.account"   placeholder="请输入系统商分发账号" ></el-input>
            </el-form-item>
            <el-form-item label="请求密码" prop="saleConfig.password"  class="inner-item" >
                  <el-input v-model="params.saleConfig.password"   placeholder="请输入系统商分发密码" ></el-input>
            </el-form-item>
          </template>
        </title-plane>
      </el-form-item> -->
      <el-form-item label="退票限制"  >
        <title-plane>
          <template slot="header">
            <tip style="width:200px" content="1、默认值是“不可退票”；</br>2、如果从系统商平台能获取到参数，那么此时获取到的参数值自动填入文本框内并不能二次修改；</br>3、如果从系统商平台未能获取到参数，那么此时用户可自行在文本框内进行自定义输入。">
              <el-radio v-model="params.refundType" label="2">不可退票</el-radio>
              <el-radio v-model="params.refundType" label="1">可退票</el-radio>
            </tip>
          </template>
          <template v-if="params.refundType==1">
            <el-form-item  prop="refundTime"  class="inner-item" >
              <!-- <el-button type="primary" size="small" style="margin-right:20px;">获取票务系统商</el-button> -->
              <el-input v-model="params.refundTime"   placeholder="请输入" style="margin-right:20px;width:320px">
                <template slot="prepend">影片开映前</template><template slot="append">分钟内不可退</template>
              </el-input>
              
            </el-form-item>
          </template>
        </title-plane>
      </el-form-item>
      <!-- <el-form-item label="影院特殊制式" prop="copyTypeRadio" >
        <tip style="width:280px" content="影院特殊制式是除国标制式以外的制式，</br>特殊制式与影片国标制式或者影院影厅包含字样进行关联后，</br>系统可自动为其修改影片放映制式，按照特殊制式展示。">
            <el-radio v-model="params.copyTypeRadio" label="1">暂无特殊制式</el-radio>
            <el-radio v-model="params.copyTypeRadio" label="2">定义特殊制式</el-radio>
        </tip>
        <template  v-if="params.copyTypeRadio==2">
          <el-form-item label=""  label-width="0px" prop="copyType" >
            <copy-type-selector :need-standard="false" ref="copyTypeSelector" style="margin-top:10px" v-model="params.copyType"></copy-type-selector>
          </el-form-item>
          <title-plane title="新增制式管理" style="margin-top:20px" v-if="params.copyType">
              <el-form-item style="margin-bottom:20px;" :label="copyType.name+'影院制式关联影片国标制式'"  label-width="230px" :prop="'copyTypeConfig_'+copyType.name" v-for="(copyType,index) in params.copyTypeConfig" :key="index">
                <el-select v-model="copyType.standard"   multiple placeholder="请选择(多选)" >
                  <el-option :label="item" :value="item" v-for="item in defaultCopyType" :key="item"></el-option>
                </el-select>
                <span>或关联影厅名称包含字样</span>
                <el-select v-model="copyType.hall"  style="width:230px" multiple  placeholder="请选择影厅" >
                  <el-option :label="item.name" :value="item.hallNo" v-for="item in hallList" :key="item.hallNo"></el-option>
                </el-select>
                
              </el-form-item>
          </title-plane>
        </template>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import GlInput from '@/components/GlInput'
// import { objectMerge } from '@/utils'
import { cloneObject, realDeepClone } from '@/utils'
import { getInterfaceOtherInfo, getCinemaHallList, priceRight } from '@/api/mallCenter'
import CopyTypeSelector from '@/components/CopyTypeSelector'
import ArgEditPlane from '@/components/ArgEditPlane'

export default {
  name: 'systemer_info',
  components: { GlInput, CopyTypeSelector, ArgEditPlane },
  data() {
    const refundTimeValidator = (rule, value, cb) => {
      if (this.params.refundType === '2' && !value) {
        cb(new Error('请输入时间'))
      }
      cb()
    }
    const copyTypeValidator = (rule, value, cb) => {
      if (this.params.copyTypeRadio === '2' && !this.params.copyType) {
        cb(new Error('至少勾选一个制式'))
      }
      cb()
    }
    return {
      params: {
        id: '',
        cinemaId: '',
        refundType: '2',
        saleConfigRadio: '2',
        ticketConfigRadio: '2',
        memberConfigRadio: '2',
        copyTypeRadio: '1',
        copyTypeConfig: [],
        ticketConfig: {
          otherInfo: {}
          // requestUrl: 'http://123',
          // account: 'testaccount',
          // password: 'testpassword',
          // otherInfo: 'otherInfo'
        },
        // saleConfig: {
        // requestUrl: 'http://123',
        // account: 'testaccount',
        // password: 'testpassword'
        // },
        // memberConfig: {
        // otherInfo: {}
        // requestUrl: 'http://123',
        // account: 'testaccount',
        // password: 'testpassword',
        // otherInfo: 'otherInfo'
        // },
        refundTime: 0,
        // ticketPrice: '',
        // servicePrice: '',
        interfaceId: '',
        priceRight: '',
        priceRightName: '',
        priceRightConfig: ''
      },
      temp: {},
      paramsTwo: {
        ticketConfig: {
          otherInfo: {}
        }
      },
      serviceTelParams: {

      },
      serviceTelRules: {

      },
      rules: {
        interfaceId: { required: true, message: '请选择票务系统商', trigger: 'change' },
        priceRight: { required: true, message: '请选择定价权', trigger: 'change' },
        // 'ticketConfig.requestUrl': { required: true, message: '请输入接口请求地址', trigger: 'blur' },
        // 'ticketConfig.account': { required: true, message: '请输入请求账号', trigger: 'blur' },
        // 'ticketConfig.password': { required: true, message: '请输入请求密码', trigger: 'blur' },
        'ticketConfig.otherInfo': { required: true, message: '请输入调用接口参数', trigger: 'blur' },
        // 'memberConfig.requestUrl': { required: true, message: '请输入接口请求地址', trigger: 'blur' },
        // 'memberConfig.account': { required: true, message: '请输入请求账号', trigger: 'blur' },
        // 'memberConfig.password': { required: true, message: '请输入请求密码', trigger: 'blur' },
        // 'memberConfig.otherInfo': { required: true, message: '请输入调用接口参数', trigger: 'blur' },
        // 'saleConfig.requestUrl': { required: true, message: '请输入接口请求地址', trigger: 'blur' },
        // 'saleConfig.account': { required: true, message: '请输入请求账号', trigger: 'blur' },
        // 'saleConfig.password': { required: true, message: '请输入请求密码', trigger: 'blur' },
        refundTime: { validator: refundTimeValidator, trigger: 'blur' },
        // ticketPrice: { required: true, message: '请选择并输入相应值', trigger: ['blur', 'change'] },
        // servicePrice: { required: true, message: '请选择并输入相应值', trigger: ['blur', 'change'] },
        copyType: { validator: copyTypeValidator, trigger: ['blur', 'change'] }
      },
      defaultCopyType: ['2D', '3D', 'IMAX2D', 'IMAX3D', 'DMAX2D', 'DMAX3D'],
      hallList: null,
      otherInfoList: {}
    }
  },
  watch: {
    async 'params.copyType'(val) {
      const copyTypeConfigValidator = (val) => {
        return (rule, value, cb) => {
          if (this.params.copyTypeRadio === '2' && (val.standard.length <= 0 && !val.hall)) {
            cb(new Error('请勾选或填写包含字样'))
          }
          cb()
        }
      }
      if (this.$refs && this.$refs.copyTypeSelector) {
        const result = this.$refs.copyTypeSelector.copyTypeList.filter(e => e.checked && e.closable).map(e => {
          return { name: e.name, standard: [], hall: [] }
        })
        result.forEach(e => {
          const found = this.params.copyTypeConfig.find(k => k.name === e.name)
          if (found) {
            Object.assign(e, found)
          }
          this.rules['copyTypeConfig_' + e.name] = { validator: copyTypeConfigValidator(e), trigger: ['blur', 'change'] }
        })
        if (this.params.id) {
          this.hallList = await getCinemaHallList({ cinemaId: this.params.id })
        }
        if (result.length > 0) {
          this.params.copyTypeConfig = result
          // if (this.hallList && this.params.id) {
          //   this.hallList = await getCinemaHallList({ cinemaId: this.params.cinemaId })
          // }
        }
      }
    },
    async 'params.interfaceId'(val, oldVal) {
      // this.params.ticketConfig.otherInfo = {}
      // this.params.memberConfig.otherInfo = {}

      if (val && val !== '') {
        this.otherInfoList = await getInterfaceOtherInfo(val)

        this.paramsTwo.ticketConfig = {}
        this.paramsTwo.ticketConfig.requestUrl = this.otherInfoList.requestUrl
        this.paramsTwo.ticketConfig.account = this.otherInfoList.account
        this.paramsTwo.ticketConfig.password = this.otherInfoList.password
        this.paramsTwo.ticketConfig.otherInfo = realDeepClone(this.otherInfoList.otherInfo)

        if (!this.params.ticketConfig) {
          this.params.ticketConfig = {}
        }
        this.params.ticketConfig.requestUrl = this.otherInfoList.requestUrl
        this.params.ticketConfig.account = this.otherInfoList.account
        this.params.ticketConfig.password = this.otherInfoList.password
        if (!this.params.ticketConfig.otherInfo) {
          this.params.ticketConfig.otherInfo = Object.assign({}, this.otherInfoList.otherInfo)
        } else {
          this.params.ticketConfig.otherInfo = Object.assign(this.otherInfoList.otherInfo, this.params.ticketConfig.otherInfo)
        }
      }

      // this.params.memberConfig.otherInfo = Object.assign({}, this.otherInfoList)
    }
  },
  methods: {
    getResult() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            // for (const key in this.params) {
            //   if (this.params[key] === undefined) {
            //     delete this.params[key]
            //   }
            // }
            // const params = Object.assign({}, this.params)
            const params = realDeepClone(this.params)
            this.temp = params
            if (params.ticketConfigRadio === '2') {
              // params.ticketConfig.otherInfo = JSON.parse(params.ticketConfig.otherInfo)
              params.ticketConfig = JSON.stringify(params.ticketConfig)
            } else {
              params.ticketConfig = ''
            }
            if (params.memberConfigRadio === '2') {
              // params.memberConfig.otherInfo = JSON.parse(params.memberConfig.otherInfo)
              params.memberConfig = JSON.stringify(params.memberConfig)
            } else {
              params.memberConfig = ''
            }
            if (params.saleConfigRadio === '2') {
              params.saleConfig = JSON.stringify(params.saleConfig)
            } else {
              params.saleConfig = ''
            }
            const priceRightConfig = {}
            // if (params.priceRight === '2' || params.priceRight === '5') {
            //   priceRightConfig.ticketPrice = params.ticketPrice
            // }
            // if (params.priceRight === '2' || params.priceRight === '6') {
            //   priceRightConfig.servicePrice = params.servicePrice
            // }
            if (params.refundType === '2') {
              params.refundTime = ''
            }
            params.priceRightConfig = JSON.stringify(priceRightConfig)
            params.priceRightConfig = params.priceRightConfig === '{}' ? '' : params.priceRightConfig
            if (params.copyTypeRadio === '2') {
              params.copyTypeConfig.forEach(e => {
                if (e.standard) {
                  e.standard = e.standard.join(',')
                }
                if (e.hall && e.length > 0) {
                  e.hall = e.hall.join(',')
                } else {
                  e.hall = ''
                }
              })
              params.copyTypeConfig = JSON.stringify(params.copyTypeConfig) // JSON.stringify({ 'ZMAX': params.copyTypeConfig1.join(','), 'REL': params.copyTypeConfig2 })
            } else {
              params.copyTypeConfig = ''
              params.copyType = ''
            }
            resolve(params)
          } else {
            reject('validError')
          }
        })
      })
    },
    // {"cinemaThirdNo":"123"}
    setResult(paramsOld) {
      this.params.copyType = paramsOld.copyType
      this.params.cinemaId = paramsOld.cinemaId
      const params = cloneObject(Object.assign({}, this.params), paramsOld)
      params.ticketConfigRadio = params.ticketConfig ? '2' : '1'
      // if (params.ticketConfig && params.ticketConfig.otherInfo) { params.ticketConfig.otherInfo = JSON.stringify(params.ticketConfig.otherInfo) }
      params.memberConfigRadio = params.memberConfig ? '2' : '1'
      // if (params.memberConfig && params.memberConfig.otherInfo) { params.memberConfig.otherInfo = JSON.stringify(params.memberConfig.otherInfo) }
      params.saleConfigRadio = params.saleConfig ? '2' : '1'
      // if (params.priceRightConfig) {
      // if (params.priceRightConfig.ticketPrice) {
      //   params.ticketPrice = params.priceRightConfig.ticketPrice
      // }
      // if (params.priceRightConfig.servicePrice) {
      //   params.servicePrice = params.priceRightConfig.servicePrice
      // }
      // }
      if (params.copyType) {
        params.copyTypeRadio = '2'
      } else {
        params.copyTypeRadio = '1'
      }

      if (params.copyTypeConfig && (params.copyTypeConfig instanceof Array)) {
        params.copyTypeConfig.forEach(e => {
          e.standard = e.standard.split(',')
          e.hall = e.hall.split(',')
        })
      } else {
        params.copyTypeConfig = []
      }
      this.params = params
      this.$refs.form.resetFields()
    },
    async prChange(val) {
      // this.params.ticketPrice = {}
      // this.params.servicePrice = {}
      await priceRight().then(res => {
        res.map(e => {
          if (e.value === +val) {
            this.$set(this.params, 'priceRightName', e.name)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inner-item {
  margin-bottom: 20px ;
}
.subtitle{
  font-size: 12px;
  color:#909399;
  font-weight: normal;
  display: block;
  line-height: 20px;
  margin-top: 2px;
}
</style>

