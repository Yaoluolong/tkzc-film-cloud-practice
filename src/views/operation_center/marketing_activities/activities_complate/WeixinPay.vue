<template>
    <div class="activityContainer">
        <h3>微信支付配置:</h3>
      	<el-form label-width="140px" label-position="left"  style="width:900px;" ref="weixinForm" :params="rule" :rules="rules">
	  	  	<el-form-item label="优惠方式:" prop="discountType" >
		        <el-radio-group v-model="rule.discountType" size="medium">
		            <el-radio label="1">定额立减</el-radio>
		            <el-radio label="2">随机立减</el-radio>
		            <el-radio label="3">折扣立减</el-radio>               
	          	</el-radio-group>
	      	</el-form-item>
          <div v-for="(item,index) in rule.activityConfig" :key="index">
            <div v-if="index>0">---------------------------------------------------</div>
  	      	<!-- <el-form-item label="活动优惠标记:" :prop="`rule.activityConfig.${index}.tag`" :rules="rules.tag"> -->
  	      	<el-form-item label="活动优惠标记:" prop="tag">
            	<tip content="微信商户客户端配置的标记(goods_tag)" style="width:130px;">
  	            <el-input clearable  placeholder="输入活动标记" v-model.trim="item.tag" style="width:120px"></el-input>
  	          </tip>
              <div class="ruleHeader">
                <div class="oper" style="float:right;">
                  <i class="el-icon-remove info" title="删除" @click="removeActivityRule(index)" v-if="rule.activityConfig.length!=1"></i>
                  <i class="el-icon-circle-plus danger" title="添加" @click="newActivityRule" v-if="index==rule.activityConfig.length-1"></i>
                </div>
              </div>
  	    	  </el-form-item>
  	        <el-form-item label="活动可用制式:" prop="copyType" style="width:100%;">	
              <standard-selector ref="copyType" v-model="item.copyType" cinemaGroupId="" :forIndex="index" :forDisabled="rule.activityConfig"></standard-selector>
  	        </el-form-item>
            <el-form-item label="使用门槛:" prop="useLimit">
              <price-area v-model="item.useLimit"></price-area>
            </el-form-item>

            <!-- <el-form-item label="减价金额:" prop="money1" style="width:300px;" v-if="rule.discountType==='1'">
              <el-input clearable  v-model.trim="item.money" style="width:100px"></el-input>&emsp;元
            </el-form-item>
            
            <el-form-item label="随机减价区间:" prop="money1" style="width:500px;" v-if="rule.discountType==='2'">
              <el-input clearable  v-model.trim="item.interval1" style="width:100px"></el-input>&emsp;至&emsp;<el-input clearable  v-model.trim="item.interval2" style="width:100px"></el-input>&emsp;元
            </el-form-item>
            
            <el-form-item label="折扣比例:" prop="scale" style="width:500px;" v-if="rule.discountType==='3'">
              <el-input clearable  v-model.trim="item.scale" style="width:100px"></el-input>&emsp;(原价为1, 0.88即为八八折)
            </el-form-item>
            <el-form-item label="单笔优惠上限:" prop="limit" style="width:300px;" v-if="rule.discountType==='3'">
              <el-input clearable  v-model.trim="item.limit" style="width:100px"></el-input>&emsp;元
            </el-form-item> -->

            <el-form-item label="活动补贴消耗上限:" prop="ceiling" style="width:300px;">
              <tip content="本条规则发放的总金额数">
                  <el-input clearable  v-model.trim="item.ceiling" style="width:120px"></el-input>&emsp;元
                </tip>
            </el-form-item>
          </div>	                 
      	</el-form>     
    </div>
</template>
<script>
import PriceArea from './PriceArea'
import StandardSelector from './StandardSelector'
export default{
  components: { StandardSelector, PriceArea },
  props: {
    value: [Array, Object, String]
  },
  data() {
    return {
      rule: {
        discountType: '1',
        activityConfig: [{
          tag: '',
          copyType: '',
          useLimit: {},
          ceiling: ''
        }]
      },
      cinemaGroupId: this.cinema_group_id,
      canValidate: false,
      rules: {

      }
    }
  },
  watch: {
    rule: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    },
    value(val) {
      if (val) {
        this.rule = val
      }
    }
  },
  methods: {
    removeActivityRule(index) {
      this.rule.activityConfig.splice(index, 1)
    },
    newActivityRule(val) {
      if (this.rule.activityConfig.length === 2) {
        this.$message.warning('至多可添加两条')
        return
      }
      this.rule.activityConfig.push({
        tag: '',
        copyType: '',
        useLimit: {},
        /* money: '',
        interval1: '',
        interval2: '',
        scale: '',
        limit: '',*/
        ceiling: ''
      })
    }
  },
  created() {
    if (this.$route.query.id) {
      this.rule = this.value
    }
  }
}
</script>
<style scoped lang="scss">
	.activityContainer {
		padding:0 20px 20px 20px;
  		border: 1px solid #DCDFE6;
  		border-radius: 4px;
  		overflow: hidden;
	}
	.el-form-item {
	    margin-bottom: 22px;
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
<style>
  .noTag .el-form-item__label:before {
    content:'' !important;
  }
  .isTag .el-form-item__label:before {
    content: '*';
    color: #f55c5c;
    margin-right: 4px;
  }
</style>