<template>
  <div>   
        <common-form style="margin-left:5%" v-model="abcPayParam" :payType="abcPayParam.type">
          <el-form :model="abcPayParam.configDetail" inline label-width="150px" :rules="rules">
            <p style="font-size:14px;font-weight:700">支付参数 :</p>
            <el-card class="box-card">
                <el-form-item label="商户号" prop="account" style="width:100%;">
                  <el-input v-model.trim="abcPayParam.configDetail.account" placeholder="请输入内容" style="width:400px;"></el-input>            
                </el-form-item>
                <el-form-item label="支付证书" prop="payCertPath" style="width:100%;">
                  <el-input v-model.trim="abcPayParam.configDetail.payCertPath" placeholder="请输入内容" style="width:400px;"></el-input>            
                </el-form-item>
                <el-form-item label="商户证书" prop="accountCertPath" style="width:100%;">
                  <el-input v-model.trim="abcPayParam.configDetail.accountCertPath" placeholder="请输入内容" style="width:400px;"></el-input>            
                </el-form-item>
                <el-form-item label="秘钥密码" prop="secretPassword" style="width:100%;">
                  <el-input v-model.trim="abcPayParam.configDetail.secretPassword" placeholder="请输入内容" style="width:400px;"></el-input>            
                </el-form-item>
                <el-form-item label="合作商APPID" prop="appId" style="width:100%;">
                  <el-input v-model.trim="abcPayParam.configDetail.appId" placeholder="请输入内容" style="width:400px;"></el-input>            
                </el-form-item>             
            </el-card> 
          </el-form>        
        </common-form>
  </div>
</template>

<script>
import CommonForm from './CommonForm'
import { getPayConfig } from '@/api/systemSetting'
export default {
  components: { CommonForm },
  data() {
    return {
      abcPayParam: {
        configDetail: {
          account: '',
          payCertPath: '',
          accountCertPath: '',
          secretPassword: ''
        },
        type: 'abcPay',
        describe: '',
        image: '',
        sort: ''
      },
      rules: {
        account: [{ required: true, message: '请输入商户号', trigger: 'blur' }],
        payCertPath: [{ required: true, message: '请输入支付证书', trigger: 'blur' }],
        accountCertPath: [{ required: true, message: '请输入商户证书', trigger: 'blur' }],
        secretPassword: [{ required: true, message: '请输入秘钥密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
  },
  async created() {
    const temp = await getPayConfig(this.$route.query.id)
    if (temp) {
      Object.assign(this.abcPayParam, temp)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
