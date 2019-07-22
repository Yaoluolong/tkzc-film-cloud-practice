<template>
    <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
        <el-form label-width="140px" :model="submitData" inline-message label-position="right" ref="form" :rules="rules">
            <!-- <el-form-item label="收款类型:" >
                <div style="float:right"> <span :style="style">{{detail.isReceiveMoney === '1' ? '已收款' : '未收款'}}</span> </div>
                <div>{{detail.payTypeName}}</div>           
            </el-form-item>
            <div v-if="detail.payType === '1'">
                <el-form-item label="转账银行:" prop="transferBank">
                    <el-input style="width:400px" v-model="submitData.transferBank" placeholder="输入银行名称"></el-input>
                </el-form-item>
                <el-form-item label="转账金额:" prop="transferMoney">
                    <el-input style="width:200px" v-model="submitData.transferMoney" placeholder="0.00"></el-input>
                </el-form-item>
                <el-form-item label="转账人:" prop="transportName">
                    <el-input style="width:250px" v-model="submitData.transportName" placeholder="输入转账人姓名"></el-input>
                </el-form-item>
                <el-form-item label="转账时间:" prop="transferTime">
                    <el-date-picker  type="date" v-model="submitData.transferTime" value-format="yyyy-MM-dd"  placeholder="选择日期"></el-date-picker>
                </el-form-item>                
                <el-form-item label="收款人:" prop="collectPeople">
                    <el-input style="width:250px" v-model="submitData.collectPeople" placeholder="输入收款人姓名"></el-input>
                </el-form-item>
                <el-form-item label="收款账户:" prop="collectAccount">
                    <el-input  style="width:400px" v-model="submitData.collectAccount" placeholder="输入收款银行名称或账号"></el-input>
                </el-form-item>
            </div>
            <div v-if="detail.payType === '2'">
                <el-form-item label="付款人:" prop="transportName">
                    <el-input style="width:250px" v-model="submitData.transportName" placeholder="输入付款人姓名"></el-input>
                </el-form-item>
                <el-form-item label="付款金额:" prop="transferMoney">
                    <el-input style="width:200px" v-model="submitData.transferMoney" placeholder="0.00"></el-input>
                </el-form-item>                
                <el-form-item label="付款时间:" prop="transferTime">
                    <el-date-picker type="date" v-model="submitData.transferTime" value-format="yyyy-MM-dd"  placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="收款人:" prop="collectPeople">
                    <el-input style="width:250px" v-model="submitData.collectPeople" placeholder="输入收款人姓名"></el-input>
                </el-form-item>
                <el-form-item label="收款账户:" prop="collectAccount">
                    <el-input style="width:400px" v-model="submitData.collectAccount" placeholder="输入收款银行名称或账号"></el-input>
                </el-form-item>
            </div> -->
            <el-form-item label="付款方式:" prop="payType">
            <el-radio-group v-model="detail.payType">
                <el-radio label="1" :disabled="$route.query.isReceiveMoney!=='0'">银行收账</el-radio>
                <el-radio label="2" :disabled="$route.query.isReceiveMoney!=='0'">现金付款</el-radio>
            </el-radio-group>
            </el-form-item>
            <el-form-item label="转账银行:" prop="transferBank" v-if="detail.payType === '1'">
              <span v-if="detail.collectPeople">{{detail.transferBank}}</span>
              <el-input v-else v-model.trim="detail.transferBank" placeholder="请输入银行名称或账户" style="width:300px;" ></el-input> 
            </el-form-item>
            <el-form-item :label="detail.payType==='1'?'转账金额:':'付款金额:'" prop="transferMoney">
                <span v-if="detail.collectPeople">{{detail.transferMoney}}</span>
                <el-input v-else v-model.trim="detail.transferMoney" placeholder="0.00" style="width:100px;" ></el-input> 元
            </el-form-item>
            <el-form-item  :label="detail.payType==='1'?'转账人:':'付款人:'" prop="transferPeople">
              <span v-if="detail.collectPeople">{{detail.transferPeople}}</span>
              <el-input v-else v-model.trim="detail.transferPeople" placeholder="请输入转账人姓名" style="width:200px;" ></el-input> 
            </el-form-item>
            <el-form-item  label="收款状态:" v-if="isCollectName">
              {{isCollectName}}
            </el-form-item>
            <el-form-item  label="收款人:" v-if="detail.collectPeople">
              {{detail.collectPeople}}
            </el-form-item>
            <el-form-item  label="收款时间:" v-if="detail.collectTime">
              {{detail.collectTime}}
            </el-form-item>
            <el-form-item style="margin-top:30px" v-if="!detail.collectPeople">
                <el-button style="margin-left:180px" @click="save" type="primary">确定收款</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { makeCardCollection, makeCouponCollection } from '@/api/operationCenter'
export default {
  props: {
    outData: [Object, Array],
    type: String, // 开票类型  coupon  card
    isCollectName: String
  },
  data() {
    return {
      detail: this.outData,
      submitData: {
        collectPeople: '',
        collectTime: '',
        payType: '2',
        transferBank: '',
        transportName: '',
        transferMoney: ''
      },
      rules: {
        transferBank: { required: true, message: '请输入转账银行', trigger: 'blur' },
        transferMoney: { required: true, message: '请输入金额', trigger: 'blur' },
        transportName: { required: true, message: '请输入付款人', trigger: 'blur' },
        collectTime: { required: true, message: '请输入付款时间', trigger: 'change' },
        collectPeople: { required: true, message: '请输入收款人', trigger: 'blur' }
      }
    }
  },
  watch: {
    'outData'(val) {
      this.detail = val
      this.submitData = val
    }
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitData.orderNo = this.$route.query.orderNo
          if (this.type === 'card') {
            makeCardCollection(this.submitData).then(res => {
              this.$message.success('收款成功')
              this.$set(this.detail, 'collectPeople', res)
            })
          } else if (this.type === 'coupon') {
            makeCouponCollection(this.submitData).then(res => {
              this.$message.success('收款成功')
              this.$set(this.detail, 'collectPeople', res)
            })
          }
          setTimeout(() => { this.$emit('refresh') }, 200)
        }
      })
    }
  },
  created() {
    this.submitData = Object.assign(this.submitData, this.detail)
  }
}
</script>

<style scoped lang="scss">

</style>
