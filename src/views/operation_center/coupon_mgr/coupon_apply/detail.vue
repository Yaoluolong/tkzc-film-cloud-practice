<template>
  <div class="app-container pd0">
    <p class="fs14 fb">申请详情</p>
    <div class="df-wrap">
      <div class="w400 fs14 mb20" v-for="(item,index) in detailList" :key="index">
        <span class="label">{{item.name}}：</span>
        <span class="value">{{info[item.key]||item.render}}{{item.unit}}</span>
      </div>
    </div>
    <p class="fs14 fb">申请处理</p>
    <div>
      <el-form label-width="120px" :model="params" :rules="rules" ref="form">
        <el-form-item label="处理方式：" prop="manageType">
          <el-radio-group v-model="params.manageType" v-if="+detailParams.status===0">
            <el-radio :label="'1'">接收</el-radio>
            <el-radio :label="'0'">拒绝</el-radio>
          </el-radio-group>
          <span v-else>{{info.statusName}}</span>
        </el-form-item>
        <el-form-item label="处理时间：" prop="status" v-if="+detailParams.status!==0">
          <span>{{info.handleTime}}</span>
        </el-form-item>
        <div v-if="+detailParams.status===0||+detailParams.status===2">
          <el-form-item label="备注：" prop="approvalContent" v-if="+params.manageType===0">
            <el-input
              :disabled="+detailParams.status===2"
              v-model="params.approvalContent"
              type="textarea"
              :rows="5"
              class="w600"
              placeholder="请输入拒绝理由，不超过300个字"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="销售订单号" prop="status" v-else>
          <el-button type="text" @click="goSale(info)">{{info.orderNo}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import detailPanel from '@/mixins/detailPanel'
import { getCouponApplyInfo, setApprovalStatus } from '@/api/operationCenter'
import { couponApplyDetaliType } from './const'
export default {
  mixins: [detailPanel],
  data() {
    return {
      // detailParams.status 0待处理 1申请中 2已拒绝 3已通过
      params: {
        manageType: '1',
        approvalContent: ''
      },
      rules: {
        manageType: {
          required: true,
          message: '请选择处理结果',
          trigger: 'change'
        },
        approvalContent: {
          required: true,
          max: 300,
          message: '请输入拒绝理由，不超过300个字',
          trigger: 'blur'
        }
      }
    }
  },
  computed: {
    detailList() {
      return couponApplyDetaliType(this.info)
    }
  },
  methods: {
    async getInfo() {
      const res = await getCouponApplyInfo({ id: this.id })
      this.info = res
    },
    goSale(info) {
      this.$emit('cancel')
      this.$router.push({
        name: 'get_sale_coupon_list',
        query: { orderNo: info.orderNo }
      })
    },
    async submit() {
      const valid = await this.$refs.form.validate()
      if (!valid) return
      this.params.id = this.id
      this.params.manageType + '' === '0'
        ? await setApprovalStatus(this.params)
        : this.$router.push({
          path: '/operation_center/coupon_mgr/sold_coupon_list/create',
          query: { applyId: this.params.id, applyName: this.params.customerName }
        })
      this.params.manageType + '' === '0' ? this.$message.success('申请处理成功') : console.log('接收')
      this.$emit('save-after')
    }
  }
}
</script>
