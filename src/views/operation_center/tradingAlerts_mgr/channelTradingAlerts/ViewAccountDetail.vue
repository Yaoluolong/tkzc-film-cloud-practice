<template>
	<div class="app-container">
		<div slot="header" class="header">
      <span>对账明细</span>
    </div>
    <div v-for="(detail, index) in params">
  		<el-form label-width="160px" :model="detail" ref="form"  style="width:1000px;;margin-bottom:20px;border-bottom:1px dashed rgb(19, 18, 18);">
  			<el-form-item label="合作方预付金额度：" v-if="detail.prePayAmount">
  				{{detail.prePayAmount}}  元
  			</el-form-item>
        <el-form-item label="预警条件和方式：" v-for="(v,k) in detail.warnInfo" :key="k">
          <div style="border:1px solid #f0f1f3;padding:10px 20px;">
              <div>触发预警条件：售票总金额达到合作方预付款{{v.warnPercent}}%</div>
              <div>预警处理方式：{{v.dealType==='1'?'停用售票接口':'不停用售票接口'}}，并在{{v.days}}个工作日内完成对账</div>
          </div>
        </el-form-item>
    		<el-form-item label="核对预付金到账时间：" v-if="!detail.warnDetailId">
          <span>{{detail.prePayTime}}</span> 
    		</el-form-item>
    		<el-form-item label="实际缴纳预存金：" v-if="!detail.warnDetailId">
          <span>{{detail.prePayAmount}}</span>  元			
    		</el-form-item>
        <el-form-item label="预付金核对人：" v-if="!detail.warnDetailId">
          <span>{{detail.operator}}</span>      
        </el-form-item>

        <el-form-item label="当前售票总金额：" v-if="detail.warnDetailId && detail.warnInfo[0].sellTicketAmount">
          <span>{{detail.warnInfo[0].sellTicketAmount}}</span>  元
        </el-form-item>
        <el-form-item label="合作方对账人：" v-if="detail.warnDetailId && detail.partnerCheckPeople">                
          <span>{{detail.partnerCheckPeople}}</span>
        </el-form-item>
        <el-form-item label="对账时间：" v-if="detail.warnDetailId && detail.checkTime">                
          <span>{{detail.checkTime}}</span>
        </el-form-item>
        <el-form-item label="本次结算金额：" v-if="detail.warnDetailId && detail.settlementPrice">                
          <span>{{detail.settlementPrice}}</span>   元
        </el-form-item>
        <el-form-item label="继续缴纳预存金：" v-if="detail.warnDetailId && detail.prePayAmount">
          <span>{{detail.prePayAmount}}</span>  元
        </el-form-item>
        <el-form-item label="缴纳时间：" v-if="detail.warnDetailId && detail.prePayTime">
          <span>{{detail.prePayTime}}</span>
        </el-form-item>
        <el-form-item label="我方对账人：" v-if="detail.warnDetailId && detail.operator">
          <span>{{detail.operator}}</span>
        </el-form-item>  		
  		</el-form>
    </div>
	</div>
</template>
<script>
import { platformWarnAccountDetail } from '@/api/operationCenter'
export default{
  name: 'view_account_detail',
  data() {
    return {
      params: []
    }
  },
  methods: {

  },
  async created() {
    this.params = await platformWarnAccountDetail({ channelId: this.$route.query.channelId })
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