<template>
	<el-form label-width="140px" label-position="left"  style="width:900px;" ref="form" :params="query" :rules="rules">
		<el-form-item label="" label-width="0px" prop="useLimit">
          <el-select clearable v-model.trim="query.mark" placeholder="请选择" style="width:120px;">
            <el-option label="小于" value="lt"></el-option>
            <el-option label="小于等于" value="elt"></el-option>
          </el-select>&nbsp;
          <el-input clearable v-model.trim="query.price" style="width:160px;"></el-input>&nbsp;元及以下金额订单可用
        </el-form-item>
	</el-form>
</template>
<script>
export default{
  props: {
    value: Object
  },
  data() {
    return {
      query: {
        mark: 'gt',
        price: ''
      },
      result: {

      },
      rules: {

      }
    }
  },
  watch: {
    query: {
      handler(val) {
        this.$set(this, 'result', {})
        this.$set(this.result, this.query.mark, this.query.price)
        this.$emit('input', this.result)
      },
      deep: true
    }
  },
  created() {
    if (this.value) {
      const res = Object.keys(this.value)
      this.query.mark = res[0]
      this.query.price = this.value[res[0]]
    }
  }
}
</script>