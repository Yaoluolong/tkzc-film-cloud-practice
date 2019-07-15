<template>
	<div class="app-container">
		<div slot="header" class="header">
            <span>配置预警</span>
        </div>
		<el-form label-width="160px" style="width:1000px;" :model="params" :rules="rules" ref="form">
			<el-form-item label="合作方预付金额度：" prop="prePayAmount">
				<tip content="根据与合作方协议合同内标注的预付金进行如实填写，由财务复核！" style="width:260px;">
					<el-input v-model="params.prePayAmount" style="width:230px;" :disabled="params.hasCheckAccount==='1'"></el-input>  元
				</tip>
			</el-form-item>
      <el-form-item label="预警条件和方式：" prop="warnConfig">
        <trading-alerts-selector v-model="params.warnConfig"></trading-alerts-selector>
      </el-form-item>
      
			<el-form-item label="预警通知：" prop="notifyType">
				<el-radio-group v-model="params.notifyType">
                    <el-radio label="1">短信</el-radio>
                    <el-radio label="2" disabled>邮箱</el-radio>
                </el-radio-group>
			</el-form-item>
			<el-form-item label="短信平台：" prop="smsType">
				<el-radio-group v-model="params.smsType">
                    <el-radio label="1" checked>阿里</el-radio>
                </el-radio-group>
			</el-form-item>
			<el-form-item label="模板类型：" prop="smsTemplateType">
				<remote-select v-model="params.smsTemplateType" clearable placeholder="请选择模板类型" action="/systemApi/dict/getList" :query="{type:'smsTemplateType'}"  style="width:230px;" @change="smsTemplateTypeChange"></remote-select>
                </el-form-item>
			</el-form-item>
			<el-form-item label="模板名称：" prop="smsTemplateStr">
        <el-select v-model="params.smsTemplateStr" clearable placeholder="请选择模板名称">
        	<el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    	</el-form-item>
    	<el-form-item label="短信内容：" prop="smsTemplateId" v-if="params.smsTemplateStr || !$route.query.channelId">
    		<el-table border  align="center" :data="smsContent">
    			<el-table-column
	          prop="content"
	          label="短信模板内容"
            header-align="center">
	        </el-table-column>
    			<el-table-column prop="selected" label="选择" width="80" align="center">
    			  <template slot-scope="{row}">
    			  	<el-radio-group v-model="params.smsTemplateId">
    			  	  <el-radio :label="row.id">&nbsp;</el-radio>
    			  	</el-radio-group>          			  	
    			  </template>	
    			</el-table-column>
    		</el-table>
    	</el-form-item>
    	<el-form-item label="预警通知接收人：" prop="notifyPeople">
          <el-input v-model.trim="params.notifyPeople" type="textarea" placeholder="接收号码间用英文','隔开" :rows="5"></el-input>
      </el-form-item>
		</el-form>
    <el-button style="margin-top:20px;" type="primary" @click="save">保存</el-button>
    <el-button @click="cancel" >取消</el-button>
	</div>
</template>
<script>
import { getTemplateNameList } from '@/api/systemSetting'
import { smsTemplateGetList, getSmsTemplateInfo, smsTemplateSetWarning } from '@/api/operationCenter'
import TradingAlertsSelector from '@/components/TradingAlertsSelector'
export default{
  components: { TradingAlertsSelector },
  name: 'channel_trading',
  data() {
    const checkWarnConfig = (rule, value, cb) => {
      value.forEach(e => {
        if (!e.warnPercent || !e.dealType || !e.days) {
          cb(new Error('请填写完整预警条件和处理方式'))
        }
        cb()
      })
    }
    return {
      params: {
        prePayAmount: '',
        warnConfig: [
          {
            warnPercent: '',
            dealType: '',
            days: ''
          }
        ],
        notifyType: '1',
        smsType: '1',
        smsTemplateType: '',
        smsTemplateStr: '',
        smsTemplateId: '',
        notifyPeople: ''
      },
      options: [],
      smsContent: [],
      rules: {
        prePayAmount: { required: true, message: '请输入合作方预付金额度', trigger: 'change' },
        warnConfig: [
          { required: true, message: '请填写预警条件和处理方式', trigger: 'blur' },
          { validator: checkWarnConfig, message: '请填写预警条件和处理方式', trigger: 'blur' }],
        smsTemplateType: { required: true, message: '请选择模板类型', trigger: 'change' },
        smsTemplateStr: { required: true, message: '请选择模板名称', trigger: 'change' },
        smsTemplateId: { required: true, message: '请选择模板内容', trigger: 'change' }
      }
    }
  },
  watch: {
    'params.smsTemplateType'(val) {
      this.templateNameList(val)
    },
    'params.smsTemplateStr'(val) {
      if (this.params.smsTemplateType && this.params.smsTemplateStr) {
        this.templateStrChange()
      }
    }
  },
  methods: {
    templateNameList(val) {
      getTemplateNameList({ type: val }).then(res => {
        this.options = []
        res.forEach(e => {
          this.options.push({
            label: e.name,
            value: e.value
          })
        })
      })
    },
    smsTemplateTypeChange(val) {
      this.$set(this.params, 'smsTemplateStr', '')
      this.templateNameList(val)
    },
    templateStrChange() {
      smsTemplateGetList({ smsType: this.params.smsType, parentType: this.params.smsTemplateType, typeStr: this.params.smsTemplateStr }).then(res => {
        this.smsContent = res
      })
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$set(this.params, 'channelId', this.$route.query.channelId)
          this.params.warnConfig.forEach(e => {
            e.dealType = e.dealType.toString()
            e.days = e.days.toString()
          })
          const _this = this
          smsTemplateSetWarning(this.params).then(res => {
            _this.$alert('预警设置完成后，请通知财务对预警内的合作放预付额度进行确认收款的操作，否则预警条件无法开始执行！', '温馨提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.closeTab(true)
                this.$router.push('/operation_center/paltform_trading_alerts_mgr/channel_trading_alerts')
              }
            })
          }).catch(e => {
            _this.params.warnConfig.forEach(e => {
              e.dealType = parseInt(e.dealType)
            })
          })
        }
      })
    },
    cancel() {
      this.closeTab()
      this.$router.push('/operation_center/paltform_trading_alerts_mgr/channel_trading_alerts')
    },
    async getInfo() {
      const paramsTemp = await getSmsTemplateInfo({ channelId: this.$route.query.channelId })
      if (paramsTemp && paramsTemp.length !== 0) {
        this.params = paramsTemp
        this.params.warnConfig.forEach(e => {
          this.$set(e, 'dealType', parseInt(e.dealType))
        })
      }
    }
  },
  created() {
    this.getInfo()
  }
}
</script>
<style type="scoped">
	.header{
		font-size: 18px;
	    font-weight: bold;
	    margin-bottom: 30px;
	}
</style>