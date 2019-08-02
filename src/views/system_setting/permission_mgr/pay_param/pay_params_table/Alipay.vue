<template>
  <div>   
        <common-form style="margin-left:5%" v-model="alipayParam" :payType="alipayParam.type">
            <el-form :model="alipayParam.configDetail" inline label-width="150px" :rules="rules">
              <p style="font-size:14px;font-weight:700">支付参数 :</p>
              <el-card  class="box-card" >
                  <el-form-item label="应用ID" prop="appid" class="attributes">
                    <tip content="仅用于原路退回时填写" style="width:350px;">
                      <el-input clearable  v-model.trim="alipayParam.configDetail.appid" placeholder="请输入内容最多10个字"></el-input>            
                    </tip>
                  </el-form-item>
                  <el-form-item label="partnerId" prop="aliPayPid">
                    <el-input clearable  v-model.trim="alipayParam.configDetail.aliPayPid" placeholder="请输入内容"></el-input>            
                  </el-form-item>
                  <el-form-item label="sellerEmail" prop="aliPayAppId">
                    <el-input clearable  v-model.trim="alipayParam.configDetail.aliPayAppId" placeholder="请输入内容"></el-input>            
                  </el-form-item>
                  <!-- <el-form-item label="key" prop="aliPayPublicSecret">
                    <el-input clearable  v-model.trim="alipayParam.configDetail.aliPayPublicSecret" placeholder="请输入内容"></el-input>            
                  </el-form-item>
                  <el-form-item label="加密方式" prop="aliPayEncryptType">
                      <el-select v-model="alipayParam.configDetail.aliPayEncryptType" placeholder="请选择" style="width: 187px;">
                          <el-option v-for="item in encryptTypes" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                      </el-select>       
                  </el-form-item> -->
                  <el-form-item label="支付宝公钥" prop="merchantPublicSecret" class="attributes">
                    <el-input clearable  class="scription" v-model.trim="alipayParam.configDetail.merchantPublicSecret" type="textarea" :rows="7" placeholder="请输入内容最多10个字"></el-input>
                  </el-form-item>
                  <el-form-item label="应用私钥(PHP)" prop="merchantPrivateSecret" class="attributes">
                    <el-input clearable  class="scription" v-model.trim="alipayParam.configDetail.merchantPrivateSecret" type="textarea" :rows="7" placeholder="请输入内容最多10个字"></el-input>            
                  </el-form-item>
                  <el-form-item label="应用私钥(java)" prop="merchantJavaPrivateSecret" class="attributes">
                    <el-input clearable  class="scription" v-model.trim="alipayParam.configDetail.merchantJavaPrivateSecret" type="textarea" :rows="7" placeholder="请输入内容最多10个字"></el-input>
                  </el-form-item>
                  
                  <!-- <el-form-item label=" " label-width="150px" prop="merchantPrivateSecretRSA2" class="attributes">
                    <div style="font-weight:bold;">PHP RSA2私钥(原路退回时配置)</div>
                    <el-input clearable  class="scription" v-model.trim="alipayParam.configDetail.merchantPrivateSecretRSA2" type="textarea" placeholder="请输入内容最多10个字"></el-input> 
                  </el-form-item> -->
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
      // 加密方式数组
      encryptTypes: [{
        label: 'RSA',
        value: '1'
      }, {
        label: 'MD5',
        value: '2'
      }],
      alipayParam: {
        configDetail: {
          aliPayPid: '',
          aliPayAppId: '',
          aliPayPublicSecret: '',
          aliPayEncryptType: '',
          merchantPublicSecret: '',
          merchantPrivateSecret: '',
          merchantJavaPrivateSecret: '',
          appid: '',
          merchantPrivateSecretRSA2: ''
        },
        type: 'aliPay',
        describe: '',
        image: '',
        sort: ''
      },
      rules: {
        aliPayPid: [{ required: true, message: '请输入partnerId', trigger: 'blur' }],
        aliPayAppId: [{ required: true, message: '请输入sellerEmail', trigger: 'blur' }],
        aliPayPublicSecret: [{ required: true, message: '请输入key', trigger: 'blur' }],
        aliPayEncryptType: [{ required: true, message: '请选择加密方式', trigger: 'blur' }],
        merchantPublicSecret: [{ required: true, message: '请输入公钥', trigger: 'blur' }],
        merchantPrivateSecret: [{ required: true, message: '请输入PHP私钥', trigger: 'blur' }],
        merchantJavaPrivateSecret: [{ required: true, message: '请输入java私钥', trigger: 'blur' }],
        appid: [{ required: true, message: '请输入应用ID', trigger: 'blur' }],
        merchantPrivateSecretRSA2: [{ required: true, message: '请输入PHP RSA2私钥', trigger: 'blur' }]
      }
    }
  },
  methods: {
  },
  async created() {
    if (this.$route.query.id) {
      // const temp = await getPayConfig(this.alipayParam.type)
      const temp = await getPayConfig(this.$route.query.id)
      if (temp) {
        Object.assign(this.alipayParam, temp)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.attributes{
    display: block;
}
.scription{
    display: inline-block;
    width: 600px;
    vertical-align: bottom;
    font-size: 14px;
}
</style>
