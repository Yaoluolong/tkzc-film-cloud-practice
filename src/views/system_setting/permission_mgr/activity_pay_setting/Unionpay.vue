<template>
  <div>   
        <common-form style="margin-left:5%" v-model="unionPayParam" :payType="unionPayParam.type">
          <el-form :model="unionPayParam.configDetail" inline label-width="150px" :rules="rules">
            <p style="font-size:14px;font-weight:700">支付参数 :</p>
            <el-card class="box-card">
                <el-form-item label="商户号" prop="account">
                  <el-input clearable  v-model.trim="unionPayParam.configDetail.account" placeholder="请输入内容"></el-input>            
                </el-form-item>
                <el-form-item label="短秘钥目录" prop="shortKey">
                  <el-input clearable  v-model.trim="unionPayParam.configDetail.shortKey" placeholder="请输入内容"></el-input>            
                </el-form-item>
                <el-form-item label="秘钥密码" prop="secretPassword">
                  <el-input clearable  v-model.trim="unionPayParam.configDetail.secretPassword" placeholder="请输入内容"></el-input>            
                </el-form-item>             
            </el-card> 
          </el-form>        
        </common-form>
  </div>
</template>

<script>
import CommonForm from './CommonForm'
import { getPayConfig } from '@/api/activitySetting'
export default {
  components: { CommonForm },
  data() {
    return {
      unionPayParam: {
        configDetail: {
          account: '',
          shortKey: '',
          secretPassword: ''
        },
        type: 'unionPay',
        describe: '',
        image: '',
        sort: ''
      },
      rules: {
        account: [{ required: true, message: '请输入商户号', trigger: 'blur' }],
        shortKey: [{ required: true, message: '请输入短秘钥目录', trigger: 'blur' }],
        secretPassword: [{ required: true, message: '请输入秘钥密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
  },
  async created() {
    if (this.$route.query.id) {
      const temp = await getPayConfig(this.$route.query.id)
      if (temp) {
        Object.assign(this.unionPayParam, temp)
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
