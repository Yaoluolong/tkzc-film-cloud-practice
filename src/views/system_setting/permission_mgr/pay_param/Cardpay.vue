<template>
  <el-form ref="form" :rules="rules" :model="params" inline style="margin-top:40px;margin-left:5%;">
    <el-form-item label="消费比例" prop="money">
      <el-input v-model="money" placeholder="票价金额单位元"></el-input>
    </el-form-item>
    <el-form-item prop="point">
      <el-input v-model="point" placeholder="卡内金额单位点" style="margin-left:10px;"></el-input>
    </el-form-item>
    
      <p style="color:#c0c4cc;width:100%;">每次使用卡内金额点数的时候可以抵扣多少票价金额</p>
    
    
      <el-button type="danger" @click="save" style="margin-top: 45px;">保存</el-button>
      <el-button style="margin-top: 45px;" @click="closeTab">关闭不保存</el-button>
    
  </el-form>
  
</template>
<script>
import { isPositive } from '@/utils/validate'
import { getPayConfig, savePayConfig } from '@/api/systemSetting'
export default {
  name: 'cardpay',
  data() {
    const checkMoney = (rule, value, callback) => {
      if (!isPositive(this.money)) {
        return callback(new Error('请输入正数'))
      }
      callback()
    }
    const checkPoint = (rule, value, callback) => {
      if (!isPositive(this.point)) {
        return callback(new Error('请输入正数'))
      }
      callback()
    }
    return {
      params: {
        configDetail: {
          money: '0',
          point: '0'
        },
        type: 'cardPay'
      },
      money: '',
      point: '',
      rules: {
        money: [{ validator: checkMoney, trigger: 'blur' }],
        point: [{ validator: checkPoint, trigger: 'blur' }]
      }
    }
  },
  methods: {
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          savePayConfig({
            configDetail: {
              money: this.money,
              point: this.point
            },
            type: 'cardPay'
          }).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          })
        }
      })
    }
  },
  async created() {
    const temp = await getPayConfig(this.params.type)

    if (temp) {
      this.money = temp.configDetail.money
      this.point = temp.configDetail.point
      Object.assign(this.params, temp)
    }
  }
}
</script>
<style scoped lang="scss">

</style>