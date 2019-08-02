<template>
	<div class="app-container">
		<div slot="header" class="header">
            <span>业务对账</span>
        </div>
		<el-form label-width="160px" style="width:1000px;" :model="query" ref="form" :rules="rules">
			<el-form-item label="合作方预付金额度：">
				{{params.prePayAmount}}  元
			</el-form-item>
            <el-form-item label="预警条件和方式：" v-for="(v,index) in params.warnConfig" :key="index">
                <div style="border:1px solid #f0f1f3;padding:10px 20px;">
                    <div>触发预警条件：售票总金额达到合作方预付款{{v.warnPercent}}%</div>
                    <div>预警处理方式：{{v.dealType==='1'?'停用售票接口':'不停用售票接口'}}，并在{{v.days}}个工作日内完成对账</div>
                </div>
            </el-form-item>      
    		<el-form-item label="预警通知：">
                <span>{{params.notifyTypeName}}</span>
    		</el-form-item>
    		<el-form-item label="短信平台：">
                <span>{{params.smsTypeName}}</span> 
    		</el-form-item>
    		<el-form-item label="模板类型：">
                <span>{{params.smsTemplateTypeName}}</span>			
    		</el-form-item>
    		<el-form-item label="模板名称：">
            	<span>{{params.smsTemplateName}}</span>
        	</el-form-item>
        	<el-form-item label="短信内容：">
                <span>{{params.smsTemplateContent}}</span>
        	</el-form-item>
        	<el-form-item label="预警通知接收人：">
              {{params.notifyPeople}}
            </el-form-item>
            <el-form-item label="核对预付金到账时间：" prop="prePayTime" label-width="180px">
                <el-date-picker
                  v-model="query.prePayTime"
                  type="datetime"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="实际预付金额度：" prop="prePayAmount">
                <el-input clearable  v-model="query.prePayAmount" style="width:220px;"></el-input> 元
            </el-form-item>
		</el-form>
    <el-button style="margin-top:20px;" type="primary" @click="save">确认对账</el-button>
    <el-button @click="cancel" >取消</el-button>
	</div>
</template>
<script>
import { getSmsTemplateInfo, checkPrePayAmount } from '@/api/operationCenter'
import { parseTime } from '@/utils'
export default{
  name: 'not_in_force_trading',
  data() {
    return {
      params: {

      },
      query: {
        prePayTime: '',
        prePayAmount: ''
      },
      rules: {
        prePayTime: { required: true, message: '请输入核对预付金到账时间', trigger: 'change' },
        prePayAmount: { required: true, message: '请输入实际预付金额度', trigger: 'change' }
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const query = this.query
          query.prePayTime = parseTime(this.query.prePayTime)
          query.channelId = this.$route.query.channelId
          checkPrePayAmount(query).then(res => {
            this.$message.success('对账成功')
            this.closeTab(true)
            this.$router.push('/operation_center/paltform_trading_alerts_mgr/channel_trading_alerts')
          })
        }
      })
    },
    cancel() {
      this.closeTab()
      this.$router.push('/operation_center/paltform_trading_alerts_mgr/channel_trading_alerts')
    }
  },
  async created() {
    this.params = await getSmsTemplateInfo({ channelId: this.$route.query.channelId })
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