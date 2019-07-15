<template>
	<div class="app-container">
		<h2>配置营销活动预警</h2>
		<el-form ref="form" label-width="140px" style="width:1000px;" :model="params" :rules="rules">
			<el-form-item label="活动ID：">
				{{params.id}}
			</el-form-item>
			<el-form-item label="活动名称：">
				{{params.name}}
			</el-form-item>
			<el-form-item label="活动补贴总金额：">
				{{params.totalAmount}}
			</el-form-item>
			<el-form-item label="活动结算方式：" v-if="!entrance" prop="type">
				<el-radio-group v-model="params.type">
					<el-radio label="1">按售价结算</el-radio>
					<el-radio label="2">按优惠金额结算</el-radio>
					<el-radio label="3">按固定金额结算</el-radio>
				</el-radio-group>
			</el-form-item>
      <el-form-item label="活动结算方式：" v-else>
      {{params.typeStr}}
      </el-form-item>
			<el-form-item label="固定结算金额：" v-if="params.type==='3'" style="width:300px;" prop="money">
				<el-input v-model="params.money" placeholder="0"></el-input>
			</el-form-item>
			<div class="triggerWarningConditions">
				<div v-for="(item, index) in params.warnConfig" class="siggleConditions">
          <div v-if="index!==0">----------------------------------------------</div>
					<el-form-item label="触发预警条件：" :prop="'warnConfig.'+index+'.warnPercent'" :rules="rules.warnPercent">
						优惠总金额达到合作方总金额&emsp;<el-input v-model="item.warnPercent" placeholder="0" style="width:100px"></el-input>&emsp;%
						<div class="ruleHeader">
			                <div class="oper" style="float:right;">
			                  <i class="el-icon-remove info" title="删除" @click="removeActivityRule(index)" v-if="params.warnConfig.length!=1"></i>
			                  <i class="el-icon-circle-plus danger" title="添加" @click="newActivityRule" v-if="index==params.warnConfig.length-1"></i>
			                </div>
			              </div>
					</el-form-item>
					<el-form-item label="预警处理方式：" :prop="'warnConfig.'+index+'.dealType'" :rules="rules.dealType">
						<el-radio-group v-model="item.dealType">
							<el-radio label="1">活动继续</el-radio>
							<el-radio label="2">暂时停止活动，等预付款补充后继续活动</el-radio>
							<el-radio label="3">直接结束活动，结算</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label=" " :prop="'warnConfig.'+index+'.days'" :rules="rules.days">
						并在&emsp;<el-input v-model="item.days" placeholder="0" style="width:100px;"></el-input>&emsp;个工作日内完成对账。
					</el-form-item>
				</div>
			</div>
			<el-form-item label="活动账单：">
				<span>自动生成活动账单</span>&emsp;&emsp;&emsp;&emsp;<span style="color:rgb(168, 174, 187);">每次触发预警时，将自动生产一条活动对账单</span>
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
	    	<el-form-item label="短信内容：" prop="smsTemplateId" v-if="params.smsTemplateStr">
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
		<el-button style="margin-top:20px;" type="primary" @click="save">设置预警</el-button>
    	<el-button @click="cancel" >取 消</el-button>		
	</div>
</template>
<script>
import { getTemplateNameList } from '@/api/systemSetting'
import { smsTemplateGetList } from '@/api/operationCenter'
import { activityWarnInfo, activityWarnUpdate } from '@/api/activitySetting'
export default{
  name: 'activities_warn_setting',
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
      entrance: '', // 设置预警 编辑预警 切换
      params: {
        id: '',
        name: '',
        totalAmount: '',
        type: '',
        money: '',
        warnConfig: [{
          warnPercent: '',
          dealType: '',
          days: ''
        }],
        invoiceType: '',

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
        type: { required: true, message: '请选择活动结算方式', trigger: 'change' },
        money: { required: true, message: '请填写固定结算金额', trigger: 'change' },
        warnPercent: { required: true, message: '请输入触发预警条件', trigger: 'change' },
        dealType: { required: true, message: '请选择预警处理方式', trigger: 'change' },
        days: { required: true, message: '请选择工作日', trigger: 'change' },
        warnConfig: [
          { required: true, message: '请填写预警条件和处理方式', trigger: 'blur' },
          { validator: checkWarnConfig, message: '请填写预警条件和处理方式', trigger: 'blur' }
        ],
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
    removeActivityRule(index) {
      this.params.warnConfig.splice(index, 1)
    },
    newActivityRule(val) {
      if (this.params.warnConfig.length === 5) {
        this.$message.warning('至多可添加五条')
        return
      }
      this.params.warnConfig.push({
        warnPercent: '',
        dealType: '',
        days: ''
      })
    },

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
          this.params.warnConfig.forEach(e => {
            e.dealType = e.dealType.toString()
            e.days = e.days.toString()
          })
          const _this = this
          this.params.id = this.$route.query.id
          this.$confirm(`预警设置完成后，请通知财务对预警内的合作放预付额度进行确认收款的操作，否则预警条件无法开始执行！`, '执行提示', { type: 'warning' }).then(async() => {
            activityWarnUpdate(this.params).then(res => {
              this.closeTab(true)
              this.$router.push('/operation_center/marketing_activities/activities_warn')
            }).catch(e => {
              _this.params.warnConfig.forEach(e => {
                e.dealType = parseInt(e.dealType)
              })
            })
          })
        }
      })
    },
    cancel() {
      this.closeTab()
      // this.$router.push('/operation_center/marketing_activities/activities_warn')
    }
  },
  async created() {
    this.entrance = this.$route.query.entrance

    await activityWarnInfo({ id: this.$route.query.id }).then(params => {
      if (this.entrance) {
        this.$set(this, 'params', params)
      } else {
        this.$set(this, 'params', {
          id: params.id,
          name: params.name,
          totalAmount: params.totalAmount,
          type: '',
          money: '',
          warnConfig: [{
            warnPercent: '',
            dealType: '',
            days: ''
          }],
          invoiceType: '',

          notifyType: '1',
          smsType: '1',
          smsTemplateType: '',
          smsTemplateStr: '',
          smsTemplateId: '',
          notifyPeople: ''
        })
      }
    })
  }
}
</script>
<style scoped lang="scss">
	.triggerWarningConditions {
		width:1000px;
		border:1px solid #f0f1f3;
		margin-bottom:20px;
		.siggleConditions{
			margin-top:20px;
		}
	}
	.ruleHeader{
	  display: flex;
	  align-items: center;
    width:100px;
    float:right;
	  &>span{
	    width: 120px;
	    text-align: right;
	    margin-right: 20px;
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