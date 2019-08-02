<template>
  <div>
    <template v-if="!showAddNewCoupon">
      <el-select
        v-model="coupon.id"
        @clear="options=[]"
        @focus="querySearch('', value)"
        @change="handleChange"
        clearable
        filterable
        remote
        :remote-method="querySearch"
        placeholder="输入电影券名称模糊查询"
        :style="selectStyle"
        :loading="loading"
      >
        <el-option
          v-for="item in coupon.options"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        type="text"
        v-if="isAddNew"
        @click="showAddNewCoupon = true;addParam.name = ''"
      >+添加券名称</el-button>
    </template>
    <template v-if="showAddNewCoupon">
      <el-input clearable placeholder="请输入电影券名称" v-model="addParam.name" style="width:250px"></el-input>
      <el-button type="primary" @click="saveCoupon">保存</el-button>
      <el-button @click="showAddNewCoupon = false">取消</el-button>
    </template>
  </div>
</template>

<script>
import { createCouponName, getCouponNameList } from '@/api/operationCenter'
export default {
  props: {
    value: String,
    isAddNew: {
      type: Boolean,
      default: true
    },
    selectStyle: {
      type: String,
      default: 'width:320px'
    },
    couponType: String,
    couponStyle: String
  },
  data() {
    return {
      showAddNewCoupon: false,
      coupon: {},
      addParam: {
        name: ''
      },
      loading: false,
      options: []
    }
  },
  methods: {
    async querySearch(val, couponId) {
      console.log(val, couponId)
      if (val) {
        const options = await getCouponNameList({
          name: val,
          type: this.couponType,
          style: this.couponStyle
        })
        this.coupon.options = options.filter(e => e.value)
        this.$forceUpdate()
      } else if (couponId) {
        getCouponNameList({
          type: this.couponType,
          style: this.couponStyle
        }).then(res => {
          this.coupon.options = res
          this.coupon.id = couponId
          this.handleChange()
          this.$forceUpdate()
        })
      } else {
        const options = await getCouponNameList({
          type: this.couponType,
          style: this.couponStyle
        })
        this.coupon.options = options
        console.log(this.coupon, 2312321)
        this.$forceUpdate()
        // this.coupon.options = []
      }
    },
    async handleChange(val) {
      this.$emit('input', this.coupon.id)
    },
    saveCoupon() {
      if (this.addParam.name) {
        createCouponName({
          name: this.addParam.name,
          type: this.couponType,
          style: this.couponStyle
        }).then(res => {
          this.showAddNewCoupon = false
          this.querySearch(undefined, res, this.couponType, this.couponStyle)
        })
      } else {
        this.$message.warning('请输入客户名称')
      }
    }
  },
  created() {
    if (this.value) {
      this.querySearch(undefined, this.value, this.couponType, this.couponStyle)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
