<template>
	<div class="app-container">
		<h2>补充活动款对账</h2>
		<el-form label-width="180px"  ref="form" :model="params" :rules="rules" style="width:1000px;">
			<el-form-item label="活动ID：">
				{{params.activitiId}}
			</el-form-item>
			<el-form-item label="活动名称：">
				{{params.name}}
			</el-form-item>
			<el-form-item label="当前剩余活动补贴金额：">
				{{params.leftFee}}元
			</el-form-item>
			<el-form-item label="补充活动金额：">
				{{params.addFee}}元
			</el-form-item>
			<el-form-item label="补充活动款金额说明：">
				{{params.addFeeContent||'--'}}
			</el-form-item>
			<el-form-item label="发票类型：" prop="invoiceType">
	          	<el-select v-model="params.invoiceType"  style="width:300px;">
	              <el-option v-for="invoiceType in allInvoiceTypes" :key="invoiceType.value" :value="invoiceType.value" :label="invoiceType.name"></el-option>
	          	</el-select>
	      	</el-form-item>
			<el-form-item label="对账备注：" prop="accountCentent" style="width:600px;">
				<el-input type="textarea" :row="5" class="accountCentent" v-model="params.accountCentent"></el-input>
			</el-form-item>
			<el-button style="margin-top:20px;" type="primary" @click="save">确认对账</el-button>
    		<el-button @click="cancel" >取 消</el-button>	
		</el-form>
	</div>
</template>
<script>
import { getInvoiceTypeList } from '@/api/operationCenter'
import { activityWarnAccountGetInfo, activityWarnAccountCheckAccount } from '@/api/activitySetting'
export default{
  name: 'suppl_advance_pay',
  components: {},
  data() {
    return {
      id: '',
      params: {

      },
      allInvoiceTypes: [],
      rules: {
        invoiceType: { required: true, message: '请选择发票类型', trigger: 'blur' },
        accountCentent: { required: true, message: '请输入对账备注', trigger: 'blur' }
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          activityWarnAccountCheckAccount(this.params).then(res => {
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
