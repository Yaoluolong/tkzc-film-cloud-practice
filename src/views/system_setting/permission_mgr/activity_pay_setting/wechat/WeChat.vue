<template>
  <div>   
        <common-form style="margin-left:5%" v-model="weixinpayParam"  ref="commonForm" :payType="weixinpayParam.type">
          <br>
          <span style="font-weight:bold;font-size:14px;">接入类型&emsp;</span><el-button type="" @click="changePayType('app')" :class="{weixinPayTypeStyle: weixinPayType==='app'}">移动APP</el-button>
          <el-button type="" @click="changePayType('h5')"  autofocus :class="{weixinPayTypeStyle: weixinPayType==='h5'}">微信H5</el-button>
          <el-button type="" @click="changePayType('minApp')"  :class="{weixinPayTypeStyle: weixinPayType==='minApp'}">小程序</el-button>
          
          <!-- <div style="font-weight:bold;display:inline-block; vertical-align:text-bottom;line-height:40px;height:40px;">接入类型：</div><el-tabs v-model="weixinPayType" type="card" @tab-click="changePayType" style="display:inline-block;">
            <el-tab-pane label="移动APP" name="app"></el-tab-pane>
            <el-tab-pane label="微信H5" name="h5"></el-tab-pane>
            <el-tab-pane label="小程序" name="minApp"></el-tab-pane>
          </el-tabs> -->

          <p style="font-size:14px;font-weight:700">{{paytypeText}}支付参数 :</p>
          <we-chat-app ref="app" v-model="weixinpayParam" v-if="weixinPayType === 'app'"></we-chat-app>        
          <we-chat-h5 ref="h5" v-model="weixinpayParam" v-if="weixinPayType === 'h5'"></we-chat-h5>
          <we-chat-xcx ref="minApp" v-model="weixinpayParam" v-if="weixinPayType === 'minApp'"></we-chat-xcx>
        </common-form>
  </div>
</template>

<script>
import CommonForm from '../CommonForm'
import WeChatApp from './WeChatApp'
import WeChatH5 from './WeChatH5'
import WeChatXcx from './WeChatXcx'
import { getPayConfig } from '@/api/activitySetting'
import { objectMerge } from '@/utils'
export default {
  components: { CommonForm, WeChatH5, WeChatXcx, WeChatApp },
  data() {
    return {
      // 微信支付类型  app(移动APP) minApp(小程序)  h5(h5)

      paytypeText: 'H5',
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
          },
          app: {
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
          },
          minApp: {
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
        }

      },
      rules: {

      }
    }
  },
  watch: {
    weixinPayType(val) {
      switch (val) {
        case 'app':
          this.paytypeText = '移动APP'
          break
        case 'h5':
          this.paytypeText = 'H5'
          break
        case 'minApp':
          this.paytypeText = '小程序'
          break
      }
    }
  },
  methods: {
    changePayType(tab) {
      this.$set(this, 'weixinPayType', tab)
    }
  },
  async created() {
    if (this.$route.query.id) {
      const temp = await getPayConfig(this.$route.query.id)
      if (temp) {
        objectMerge(this.weixinpayParam, temp)

        temp.accessType.map(e => {
          if (this.$refs.app && e === 'app') {
            for (var key of Object.keys(this.$refs.app.notify)) {
              this.$refs.app.initTemplateField(key)
            }
          } else if (this.$refs.h5 && e === 'h5') {
            for (var key2 of Object.keys(this.$refs.h5.notify)) {
              this.$refs.h5.initTemplateField(key2)
            }
          } else if (this.$refs.minApp && e === 'minApp') {
            for (var key3 of Object.keys(this.$refs.minApp.notify)) {
              this.$refs.minApp.initTemplateField(key3)
            }
          }
        })
      }
    }
  },
  mounted() {
  }
}
</script>

<style>
  .el-tabs__header{
    margin:0
  }
  .weixinPayTypeStyle {
    color: #fff;
    background-color: #98d023;
    border-color: #98d023;
  }
    .weixinPayTypeStyle:hover, .weixinPayTypeStyle:focus  {

    color: #fff;
    background-color: #98d023;
    border-color: #98d023;
  }
</style>
