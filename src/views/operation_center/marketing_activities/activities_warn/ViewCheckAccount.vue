<template>
	<div class="app-container">
		<h3>配置营销活动预警</h3>
		<el-form ref="form" label-width="180px" style="width:1000px;">
			<!-- 预警对账部分/提前对账部分/预警对账/预警对账 -->
			<!-- settleType: 1预警对账 2补充活动款对账 3提前对账 -->
			<!-- <div v-if="params"></div> -->
			<div v-if="noData" style="margin-bottom:20px;">暂无对账记录</div>
			<div v-for="(item,index) in params" :key="index">
				<div v-if="index !==0" style="margin-bottom:20px;">--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
				<el-form-item label="本次活动补贴金额：" v-if="item.type!=='2'">
					{{item.totalFee||'--'}}&emsp;元
				</el-form-item>
				
				<el-form-item label="活动优惠方式：" v-if="item.type!=='2'">
					{{item.typeStr||'--'}}
				</el-form-item>
				<el-form-item label="预警条件：" v-if="item.type!=='2'">
					{{item.warnCondition||'--'}}
					<!-- 活动金额达到活动总金额{{item.warnConfig.warnPercent}}% -->					
				</el-form-item>
				<el-form-item label="预警处理方式：" v-if="item.type!=='2'">
					{{item.warnTreatment||'--'}}
					<!-- <span v-if="item.warnConfig.dealType==='1'">活动结算，并在{{item.warnConfig.days}}个工作日内完成对账</span>
					<span v-else-if="item.warnConfig.dealType==='2'">暂时停止活动，等预付款补充后继续活动，并在{{item.warnConfig.days}}个工作日内完成对账</span>
					<span v-else-if="item.warnConfig.dealType==='3'">直接结束活动，结算，并在{{item.warnConfig.days}}个工作日内完成对账</span> -->
				</el-form-item>
				<el-form-item label="本次活动支出总金额：" v-if="item.type!=='2'">
					{{item.useFee||'--'}}&emsp;元
				</el-form-item>
				<el-form-item label="本次结算活动支出金额：" v-if="item.type!=='2'">
					{{item.settlementPrice||'--'}}&emsp;元
				</el-form-item>

				<!-- 追加活动款 -->
				<el-form-item label="剩余活动补贴金额：" v-if="item.type==='2'">
					{{item.leftFee||'--'}}&emsp;元
				</el-form-item>
				<el-form-item label="补充活动款金额：" v-if="item.type==='2'">
					{{item.addFee||'--'}}&emsp;元
				</el-form-item>
				<el-form-item label="补充活动款说明：" v-if="item.type==='2'">
					{{item.addFeeContent||'--'}}
				</el-form-item>
				
				<el-form-item label="发票类型：">
					{{item.invoiceType||'--'}}
				</el-form-item>
				<el-form-item label="对账时间：">
					{{item.checkTime||'--'}}
				</el-form-item>
				<el-form-item label="对账人：">
					{{item.operator||'--'}}
				</el-form-item>
				<el-form-item label="对账备注：">
					{{item.accountCentent||'--'}}
				</el-form-item>
			</div>
			<el-button @click="$router.push('/operation_center/marketing_activities/activities_warn')" >取 消</el-button>		
		</el-form>
	</div>
</template>
<script>
import { activityWarnAccountGetDetailList } from '@/api/activitySetting'
export default{
  data() {
    return {
      params: {},
      query: {
        params: []
      },
      noData: false
    }
  },
  async created() {
    this.params = await activityWarnAccountGetDetailList({ id: this.$route.query.id })
    console.log(this.params)
    if (this.params.length === 0) {
      this.noData = true
    }
  }
}
</script>