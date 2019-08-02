<template>
	<div class="app-container">
		<div slot="header" class="header">
      <span>业务对账</span>
    </div>
		<el-form label-width="180px" style="width:1000px;" :model="query" ref="alertsForm" :rules="rules">
			<el-form-item label="合作方预付金额度：">
				<span>{{params.prePayAmount}}</span>  元
			</el-form-item>
      <el-form-item label="触发预警条件：">       
            <div>售票总金额达到合作方预付款{{params.warnPercent}}%</div>
      </el-form-item>
      <el-form-item label="预警处理方式：">
            <div>{{params.dealType==='1'?'停用售票接口':'不停用售票接口'}}，并在{{params.days}}个工作日内完成对账</div>
      </el-form-item>     
  		<el-form-item label="当前售票总金额：">
        <span>{{params.sellTicketAmount}}</span>  元
  		</el-form-item>
  		<el-form-item label="合作方对账人：" prop="partnerCheckPeople">                
        <el-input clearable  v-model="query.partnerCheckPeople" style="width:220px;"></el-input>
      </el-form-item>
      <el-form-item label="对账时间：" prop="checkTime">
        <el-date-picker
          v-model="query.checkTime"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="本次结算金额：" prop="settlementPrice">                
        <el-input clearable  v-model.number="query.settlementPrice" palceholder="0.00" style="width:220px;"></el-input>  元
      </el-form-item>
      <el-form-item label="继续缴纳预存金：" prop="prePayAmount">                
        <el-input clearable  v-model="query.prePayAmount" palceholder="0.00" class="w220 mr10"></el-input>元
        <span class="db fs14" style="color:grey;">确认对账成功后，下一次预警使用的合作方预付金额度将根据（原合作方预付金额度减去本次结算金额加上继续缴纳预存金额度）</span>
      </el-form-item>
      <el-form-item label="缴纳时间：" prop="prePayTime">
        <el-date-picker
          v-model="query.prePayTime"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
		</el-form>
    <el-button style="margin-top:20px;" type="primary" @click="save">确认对账</el-button>
    <el-button @click="cancel" >取消</el-button>
	</div>
</template>
<script>
import { getplatformWarnWarnInfo, platformWarnCheckAccount } from '@/api/operationCenter'
import { parseTime } from '@/utils'
export default{
  name: 'reach_alerts',
  data() {
    return {
      params: {

      },
      query: {
        channelId: this.$route.query.channelId,
        partnerCheckPeople: '',
        checkTime: '',
        settlementPrice: '',
        prePayAmount: '',
        prePayTime: ''
      },
      rules: {
        partnerCheckPeople: { required: true, message: '请输入合作方对账人', trigger: 'blur' },
        checkTime: { required: true, message: '请输入对账时间', trigger: 'change' },
        settlementPrice: { required: true, message: '请输入本次结算金额', trigger: 'blur' },
        prePayAmount: { required: true, message: '请输入继续缴纳预存金额度', trigger: 'blur' },
        prePayTime: { required: true, message: '请输入缴纳时间', trigger: 'change' }
      }
    }
  },
  methods: {
    save() {
      this.$refs['alertsForm'].validate((valid) => {
        if (valid) {
          const query = this.query
          query.checkTime = parseTime(this.query.checkTime)
          query.prePayTime = parseTime(this.query.prePayTime)
          platformWarnCheckAccount(query).then(res => {
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
    this.params = await getplatformWarnWarnInfo({ channelId: this.$route.query.channelId })
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