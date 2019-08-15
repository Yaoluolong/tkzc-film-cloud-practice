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
      <el-form label-width="100px" :model="params" :rules="rules" ref="form">
        <el-form-item label="处理方式：" prop="manageType" v-if="+info.status===0">
          <el-radio-group v-model="params.manageType">
            <el-radio :label="'1'">接收</el-radio>
            <el-radio :label="'0'">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="w400 fs14 mb20" v-else>
          <span>处理方式：</span>
          <span>{{info.statusName}}</span>
        </div>
        <div class="w400 fs14 mb20" v-if="+info.status!==0">
          <span>处理时间：</span>
          <span>{{info.handleTime}}</span>
        </div>
        <el-form-item
          label="备注："
          prop="approvalContent"
          v-if="+info.status===0&&+params.manageType===0"
        >
          <el-input
          clearable 
            v-model="params.approvalContent"
            type="textarea"
            :rows="5"
            class="w600"
            placeholder="请输入拒绝理由，不超过300个字"
          ></el-input>
        </el-form-item>
        <div class="w400 fs14 mb20" v-if="+info.status===2">
          <span>备注：</span>
          <span>{{info.approvalContent}}</span>
        </div>
        <div class="w400 fs14 mb20" v-if="+info.status===1||+info.status===3">
          <span>销售订单号：</span>
          <el-button type="text" @click="goSale(info)">{{info.orderNo}}</el-button>
        </div>
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
      // 销售单创建流程未走完，跳转到编辑页，否则跳到明细页
      // info.checkStatus 审核状态 0、未提交 1、提交审核 2、初审完成 3、审核完成 4、被退回
      this.$router.push({
        path:
          info.checkStatus && +info.checkStatus !== 0
            ? '/operation_center/coupon_mgr/get_sale_coupon_list'
            : '/operation_center/coupon_mgr/sold_coupon_list/edit',
        query: { orderNo: info.orderNo }
      })
    },
    async submit() {
      const valid = await this.$refs.form.validate()
      if (!valid) return
      // 提交时拒绝走接口改成状态，确定则跳转到创建销售单开始创建流程
      this.params.id = this.id
      this.params.manageType + '' === '0'
        ? await setApprovalStatus(this.params)
        : this.$router.push({
          path: '/operation_center/coupon_mgr/sold_coupon_list/create',
          query: {
            applyId: this.params.id,
            applyName: this.params.customerName
          }
        })
      this.params.manageType + '' === '0'
        ? this.$message.success('申请处理成功')
        : console.log('接收')
      this.$emit('save-after')
    }
  }
}
</script>
