<template>
    <div>      
        <el-select v-model="couponType.id" @clear="options=[]" @change="handleChange" @focus="querySearch('')" clearable filterable remote :remote-method="querySearch" placeholder="输入卡名称模糊查询" style="width:320px" :loading="loading">
            <el-option v-for="item in couponType.options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select> 
    </div>
</template>

<script>

import { getCouponTypeList } from '@/api/operationCenter'
export default {
  props: {
    value: String,
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showAddNewCustom: false,
      couponType: {

      },
      addParam: {
        name: ''
      },
      loading: false,
      options: []
    }
  },
  methods: {
    async querySearch(val, couponTypeId) {
      if (!this.type) {
        this.$message.warning('请先选择电影券类型')
        return
      }
      if (val) {
        const param = { name: val }
        param.type = this.type
        const options = await getCouponTypeList(param)
        this.couponType.options = options.filter(e => e.id)
        this.$forceUpdate()
      } else if (couponTypeId) {
        getCouponTypeList({ name: '' }).then(res => {
          this.couponType.options = res
          this.couponType.id = couponTypeId
          this.$forceUpdate()
        })
      } else {
        const param = { name: '' }
        param.type = this.type
        this.couponType.options = await getCouponTypeList(param)
        this.$forceUpdate()
      }
    },
    async handleChange(val) {
      this.$emit('input', this.couponType.id)
    },
    saveCustom() {
    }
  },
  created() {
    if (this.value) {
      this.querySearch(undefined, this.value)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
