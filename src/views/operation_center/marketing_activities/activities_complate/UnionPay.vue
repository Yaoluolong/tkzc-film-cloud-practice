<template>
    <div class="activityContainer">
        <h3>银联支付配置:</h3>
      	<el-form label-width="140px" label-position="left"  style="width:900px;" ref="form" :params="rule" :rules="rules">
	  	  	<el-form-item label=" " prop="customize" >
            <el-radio-group v-model="rule.customize" size="medium">
              <el-radio label="1" disabled>银联后台配置</el-radio>
              <el-radio label="2">自定义</el-radio>              
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择支付商户号:" prop="payConfigId" style="width:400px;">
            <remote-select v-model="rule.payConfigId" clearable placeholder="请选择支付商户号" action="/systemApi/activityPayConfig/getList" style="width:300px;"></remote-select>
          </el-form-item>
          <el-form-item label="活动可用制式:" prop="copyType" style="width:100%;">  
            <standard-selector ref="copyType" v-model="rule.copyType" cinemaGroupId=""></standard-selector>
          </el-form-item>
          <el-form-item label="优惠方式:" prop="discountType" >
		        <el-radio-group v-model="rule.discountType" size="medium">
	            <el-radio label="1">定额立减</el-radio>
	            <el-radio label="2">随机立减</el-radio>
	            <el-radio label="3">折扣立减</el-radio>               
          	</el-radio-group>
	      	</el-form-item>
          <el-form-item label="使用门槛类型:" prop="useType">
            <el-radio-group v-model="rule.activityConfig.useType" size="medium">
              <el-radio label="1">根据单个座位售价</el-radio>
              <el-radio label="2">根据总售价</el-radio>             
            </el-radio-group>
          </el-form-item>

          <el-form-item label="使用门槛:" prop="useLimit">
            <price-area v-model="rule.activityConfig.useLimit"></price-area>
          </el-form-item>
          
          <!-- 优惠方式对应价格规则 -->
  	      <el-form-item label="减价规则:" prop="ruleType" v-if="rule.discountType==='1'">
            <el-radio-group v-model="rule.activityConfig.ruleType" size="medium">
              <el-radio label="1">满足门槛固定售价</el-radio>
              <el-radio label="2">满足门槛固定立减</el-radio>
              <!-- <el-radio label="3" v-if="rule.discountType==='2'">在使用门槛上立减区间</el-radio>                -->
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="单个座位固定售价:" prop="money" style="width:300px;" v-if="rule.discountType==='1' && rule.activityConfig.ruleType==='1'">
            <el-input v-model.trim="rule.activityConfig.money" style="width:100px"></el-input>&emsp;元
          </el-form-item>
          <el-form-item label="单个座位固定立减:" prop="money" style="width:300px;" v-if="rule.discountType==='1' && rule.activityConfig.useType==='1' && rule.activityConfig.ruleType==='2'">
            <el-input v-model.trim="rule.activityConfig.money" style="width:100px"></el-input>&emsp;元
          </el-form-item>
          <el-form-item label="总售价固定立减:" prop="money" style="width:300px;" v-if="rule.discountType==='1' && rule.activityConfig.useType==='2' && rule.activityConfig.ruleType==='2'">
            <el-input v-model.trim="rule.activityConfig.money" style="width:100px"></el-input>&emsp;元
          </el-form-item>

          <el-form-item label="随机减价区间:" prop="money" style="width:500px;" v-if="rule.discountType==='2'">
            <el-input v-model.trim="rule.activityConfig.interval1" style="width:100px"></el-input>&emsp;至&emsp;<el-input v-model.trim="rule.activityConfig.interval2" style="width:100px"></el-input>&emsp;元
          </el-form-item>
          
          <el-form-item label="折扣比例:" prop="scale" style="width:500px;" v-if="rule.discountType==='3'">
            <el-input v-model.trim="rule.activityConfig.scale" style="width:100px"></el-input>&emsp;(原价为1, 0.88即为八八折)
          </el-form-item>
          <el-form-item label="单个座位优惠上限:" prop="limit" style="width:300px;" v-if="rule.discountType==='3' && rule.activityConfig.useType==='1'">
            <el-input v-model.trim="rule.activityConfig.limit" style="width:100px"></el-input>&emsp;元
          </el-form-item>
          <el-form-item label="单笔优惠上限:" prop="limit" style="width:300px;" v-if="rule.discountType==='3' && rule.activityConfig.useType==='2'">
            <el-input v-model.trim="rule.activityConfig.limit" style="width:100px"></el-input>&emsp;元
          </el-form-item>
          <el-form-item label="活动补贴消耗上限:" prop="ceiling" style="width:300px;">
            <tip content="本条规则发放的总金额数">
                <el-input v-model.trim="rule.ceiling" style="width:120px"></el-input>&emsp;元
              </tip>
          </el-form-item>
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
    /* const checkcanFreePrice = (rule, value, cb) => {
      const isInt = /^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)
      if (!isInt) {
        cb(new Error('必须是整数,可保留两位小数点'))
      }
      cb()
    }*/
    return {
      rule: {
        customize: '2',
        payConfigId: '',
        discountType: '1',

        copyType: '',

        activityConfig: {
          ruleType: '1',
          money: '', // 定额立减->固定售价||减价金额
          interval1: '', // 随机立减
          interval2: '', // 随机立减
          scale: '', // 折扣立减
          limit: '',
          useType: '1',
          useLimit: {}
        },
        ceiling: ''
      },
      params: {
        mark: '',
        price: ''
      },
      cinemaGroupId: this.cinema_group_id,
      rules: {
        /* copyType: { required: true, message: '请选择制式', trigger: 'change' },
        useLimit: { validator: checkcanFreePrice, message: '请填写正确数值,可保留两位小数', trigger: 'blur' },

        money: [
          { required: true, message: '请输入数值', trigger: 'blur' },
          { validator: checkcanFreePrice, message: '请填写正确数值,可保留两位小数', trigger: 'blur' }
        ],
        ceiling: [
          { required: true, message: '请输入数值', trigger: 'blur' },
          { validator: checkcanFreePrice, message: '请填写正确数值,可保留两位小数', trigger: 'blur' }
        ],
        allCount: [
          { required: true, message: '请输入数值', trigger: 'blur' },
          { validator: checkcanFreePrice, message: '请填写正确数值,可保留两位小数', trigger: 'blur' }
        ],
        dayCount: [
          { required: true, message: '请输入数值', trigger: 'blur' },
          { validator: checkcanFreePrice, message: '请填写正确数值,可保留两位小数', trigger: 'blur' }
        ],
        weekCount: [
          { required: true, message: '请输入数值', trigger: 'blur' },
          { validator: checkcanFreePrice, message: '请填写正确数值,可保留两位小数', trigger: 'blur' }
        ]*/
      }
    }
  },
  watch: {
    params: {
      handler(val) {
        this.rule.useLimit[this.params.mark] = this.params.price
      },
      deep: true
    },
    rule: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {

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