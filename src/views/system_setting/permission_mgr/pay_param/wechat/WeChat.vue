<template>
  <div>   
        <common-form style="margin-left:5%" v-model="weixinpayParam"  ref="commonForm" :payType="weixinpayParam.type">
          <br>
          <el-button type="success" @click="changePayType('mobileApp')" plain>移动APP</el-button>
          <el-button type="success" @click="changePayType('h5')" plain>微信H5</el-button>
          <el-button type="success" @click="changePayType('xcx')" plain>小程序</el-button>
          <p style="font-size:14px;font-weight:700">支付参数 :</p>          
          <we-chat-h5 ref="h5" v-model="weixinpayParam" v-show="weixinPayType === 'h5'"></we-chat-h5>
          <we-chat-xcx ref="xcx" v-model="weixinpayParam.configDetail.xcx" v-show="weixinPayType === 'xcx'"></we-chat-xcx>
        </common-form>
  </div>
</template>

<script>
import CommonForm from '../CommonForm'
import WeChatH5 from './WeChatH5'
import WeChatXcx from './WeChatXcx'
import { getPayConfig } from '@/api/systemSetting'
import { objectMerge } from '@/utils'
export default {
  components: { CommonForm, WeChatH5, WeChatXcx },
  data() {
    return {
      // 微信支付类型  mobileApp(移动APP) xcx(小程序)  h5(h5)
      weixinPayType: 'h5',
      weixinpayParam: {
        describe: '',
        image: '',
        sort: '',
        type: 'weixinPay',
        configDetail: {
          h5: {
            appId: '',
            appSecret: '',
            appKey: '',
            appAccount: '',
            apiclientCert: '',
            apiclientKey: '',
            weixinMsgconfig: {
              ticket: {
                status: '1',
                templateId: '',
                title: '',
                endRemarks: '',
                fieldMap: {
                  keyword1: '',
                  keyword2: '',
                  keyword3: '',
                  keyword4: '',
                  keyword5: '',
                  keyword6: '',
                  keyword7: '',
                  keyword8: '',
                  keyword9: ''
                }
              },
              coupon: {
                status: '2',
                templateId: '',
                title: '',
                endRemarks: '',
                fieldMap: {
                  keyword1: '',
                  keyword2: '',
                  keyword3: '',
                  keyword4: '',
                  keyword5: '',
                  keyword6: '',
                  keyword7: '',
                  keyword8: '',
                  keyword9: '' }
              },
              card: {
                status: '1',
                templateId: '',
                title: '',
                endRemarks: '',
                fieldMap: {
                  keyword1: '',
                  keyword2: '',
                  keyword3: '',
                  keyword4: '',
                  keyword5: '',
                  keyword6: '',
                  keyword7: '',
                  keyword8: '',
                  keyword9: ''
                }
              }
            }
          }
          // xcx: {}
        }

      },
      rules: {

      }
    }
  },
  methods: {
    changePayType(type) {
      this.weixinPayType = type
    }
  },
  async created() {
    const temp = await getPayConfig(this.weixinpayParam.type)
    if (temp) {
      objectMerge(this.weixinpayParam, temp)
      for (var key of Object.keys(this.$refs.h5.notify)) {
        this.$refs.h5.initTemplateField(key)
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">

</style>
