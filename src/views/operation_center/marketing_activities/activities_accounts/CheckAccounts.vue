<template>
	<div class="app-container">
		<h2>营销活动对账</h2>
		<el-form label-width="180px"  ref="form" :model="params" :rules="rules" style="width:1000px;">
			<el-form-item label="活动ID：">
				{{params.activitiId}}
			</el-form-item>
			<el-form-item label="活动名称：">
				{{params.name}}
			</el-form-item>
			<el-form-item label="活动补贴金额：">
				{{params.totalAmount}}&emsp;元
			</el-form-item>
			<el-form-item label="当前预警条件：">
        {{params.warnCondition}}
				<!-- 活动金额达到活动总金额{{params.warnConfig.warnPercent}}% -->        
			</el-form-item>
			<el-form-item label="当前预警处理方式：">
        {{params.warnTreatment}}
				<!-- <span v-if="params.warnConfig.dealType==='1'">活动结算，并在{{params.warnConfig.days}}个工作日内完成对账</span>
        <span v-else-if="params.warnConfig.dealType==='2'">暂时停止活动，等预付款补充后继续活动，并在{{params.warnConfig.days}}个工作日内完成对账</span>
        <span v-else-if="params.warnConfig.dealType==='3'">直接结束活动，结算，并在{{params.warnConfig.days}}个工作日内完成对账</span> -->
			</el-form-item>
			<el-form-item label="本次活动支出总金额：">
				{{params.useFee}}&emsp;元
			</el-form-item>
			<el-form-item label="本次活动结算金额：" prop="settlementPrice">
				<el-input clearable  v-model="params.settlementPrice" style="width:100px" holdspace="0"></el-input>&emsp;元
			</el-form-item>
			<el-form-item label="发票类型：" prop="invoiceType">
	          	<el-select clearable v-model="params.invoiceType"  style="width:300px;">
	              <el-option v-for="invoiceType in allInvoiceTypes" :key="invoiceType.value" :value="invoiceType.value" :label="invoiceType.name"></el-option>
	          	</el-select>
	      	</el-form-item>
			<el-form-item label="对账备注：" prop="accountCentent" style="width:600px;">
				<el-input clearable  type="textarea" :row="5" class="accountCentent" v-model="params.accountCentent"></el-input>
			</el-form-item>
			<el-button style="margin-top:20px;" type="primary" @click="save">确认对账</el-button>
    		<el-button @click="cancel">取 消</el-button>	
		</el-form>
	</div>
</template>
<script>
import { getInvoiceTypeList } from '@/api/operationCenter'
import { activityWarnAccountGetInfo, activityWarnAccountCheckWarnAccount } from '@/api/activitySetting'
export default{
  name: 'check_accounts',
  components: { },
  data() {
    return {
      id: '',
      params: {
        warnConfig: {
          warnPercent: '',
          dealType: '',
          days: ''
        }
      },
      allInvoiceTypes: [],
      rules: {
        settlementPrice: { required: true, message: '请输入本次活动结算金额', trigger: 'blur' },
        invoiceType: { required: true, message: '请选择发票类型', trigger: 'blur' },
        accountCentent: { required: true, message: '请输入对账备注', trigger: 'blur' }
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {}
          params.activitiId = this.params.activitiId
          params.settlementPrice = this.params.settlementPrice
          params.invoiceType = this.params.invoiceType
          params.accountCentent = this.params.accountCentent
          params.warnAccountId = this.params.warnAccountId
          activityWarnAccountCheckWarnAccount(params).then(res => {
            this.$message.success('对账成功')
            this.closeTab(true)
            this.$router.push('/operation_center/marketing_activities/activities_accounts')
          })
        }
      })
    },
    cancel() {
      this.closeTab()
      this.$router.push('/operation_center/marketing_activities/activities_accounts')
    }
  },
  async created() {
    this.allInvoiceTypes = await getInvoiceTypeList()
    this.params = await activityWarnAccountGetInfo({ warnAccountId: this.$route.query.id })
  }
}
</script>
<style>
	.accountCentent .el-textarea__inner {		
		height:200px !important;
	}
</style>
