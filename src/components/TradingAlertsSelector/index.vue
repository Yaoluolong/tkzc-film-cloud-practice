<template>
	<el-card>
		<div  v-for="(trading,index) in value" :key="index" style="border-bottom:1px #dcdfe6 dashed;margin-bottom:20px;">
			<div slot="header" class="clearfix">
			    <div class="oper" style="float:right;">
          			<i class="el-icon-remove info" title="删除" @click="removeTrading(index)" v-if="value.length!=1"></i>
          			<i class="el-icon-circle-plus danger" title="添加" @click="newTrading" v-if="index==value.length-1"></i>
        		</div>
			</div>
			<el-form ref="form" :params="trading">
				<el-form-item label="预警处理条件：" style="margin-bottom:20px;">
					售票总金额达到合作方预付款&emsp;<el-input v-model="trading.warnPercent" style="width:80px;"></el-input>&emsp;%
				</el-form-item>
				<el-form-item label="预警处理方式：" style="margin-bottom:10px;">				
					<el-radio-group v-model="trading.dealType">
						<el-radio :label="1">停用售票接口</el-radio>
						<el-radio :label="2">不停用售票接口</el-radio>
					</el-radio-group>					
				</el-form-item>
				<el-form-item label="" style="margin-left:110px;margin-bottom:20px;">
					<div>并在&emsp;<el-input v-model="trading.days" style="width:80px;"></el-input>&emsp;工作日内完成对账。</div>
				</el-form-item>
			</el-form>
		</div>
	</el-card>
</template>
<script>
export default{
  props: {
    value: Array
  },
  data() {
    return {

    }
  },
  watch: {
    value(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    newTrading() {
      this.value.push({ warnPercent: '', dealType: '', days: '' })
    },
    removeTrading(index) {
      this.value.splice(index, 1)
      this.handleChange()
    },
    async handleChange(val) {
      this.$emit('input', this.value)
    }
  },
  created() {

  }
}
</script>
<style scoped lang="scss">
	.oper{
    font-size: 28px;
    margin-left: 20px;
    i{
      cursor: pointer;
    }
  }
</style>