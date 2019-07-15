<template>
  <div class="app-container" >
       <el-form ref="mainform" style="width:100%" :model="submitData" :rules="rules1">
            <el-form-item label="短信平台参数:"  style="width:100%">
                <el-card>
                    <el-form-item label="短信平台:" label-width="100px" style="width:900px">
                        <el-radio-group style="width:100%" v-model="submitData.type">
                          <el-radio style="margin-left:5%" v-for="smsType in initData.smsTypes" :key="smsType.type" :label="smsType.type" >
                            {{smsType.name}}
                          </el-radio>  
                        </el-radio-group>                   
                    </el-form-item>
                      <el-form :rules="rules2" inline :model="submitData">
                        <el-form-item label="平台账号:" label-width="100px" prop="accountName">
                            <el-input v-model.trim="submitData.accountName"></el-input>
                        </el-form-item>   
                        <el-form-item label="平台密码:" label-width="100px" prop="password">
                            <el-input v-model.trim="submitData.password"></el-input>
                        </el-form-item>
                      </el-form>                       
                      <el-form-item label="短信签名:" label-width="100px" style="margin-top:1%;" prop="sign">
                            <el-input v-model.trim="submitData.sign" style="width:185px"></el-input>
                      </el-form-item>   
                </el-card>
            </el-form-item>     
            <el-form-item label="短信模板管理:">    
                <el-card>
                  <el-collapse accordion>
                    <el-collapse-item v-for="templateCategory in initData.templateCategorys" v-if="templateCategory.show" :title="templateCategory.name" :key="templateCategory.type" :name="templateCategory.type">
                      <el-row v-if="template.parentType === templateCategory.type && template.show" v-for="(template , key) in submitData.templateList" :key="key" style="margin-top:2%">
                          <el-form ref="subForm" :model="template" :rules="rules3" label-position="right" label-width="20%">
                            <el-form-item :label="template.name">
                                <el-radio-group style="width:50%;margin-left:5%" v-model="template.status">
                                  <el-radio :label="'1'">
                                    开启
                                  </el-radio>  
                                  <el-radio :label="'2'">
                                    关闭
                                  </el-radio>
                                </el-radio-group>   
                            </el-form-item>
                            <el-form-item prop="templateCode" label="阿里短信CODE:" style="margin-top:1%" >
                                <el-input v-model.trim="template.templateCode" style="width:20%;margin-left:5%" placeholder="阿里短信模板code"></el-input> <span style="margin-left:3%">短信运营商是阿里短信的必填</span>
                            </el-form-item>
                            <el-form-item  label="选择要插入的变量:" style="margin-top:1%">
                                <el-button v-for="shortcut in template.shortcuts" @click="insertVariable(template , shortcut , 'content_'+ key)" :key="shortcut" type="primary" style="margin-left:5%">
                                  {{shortcut}}
                                </el-button>
                            </el-form-item>
                            <el-form-item :show-message="false" label="短信模版:" style="margin-top:1%" prop="content">
                                <el-input v-model.trim="template.content" :id="'content_'+ key" style="width:80%;margin-left:5%" placeholder="请输入内容"></el-input>  <br>
                                <span style="margin-left:5%;color:gray">{{template.format}}</span>                          
                            </el-form-item>
                          </el-form>
                          <div style="width:100%;height:0px;    border-top: 1px solid #DCDCDC;" />
                      </el-row>                      
                    </el-collapse-item>                                                    
                  </el-collapse>
                </el-card>  
            </el-form-item>   
      </el-form>
        <el-button style="margin-left:30%" type="success" @click="saveSms">保存</el-button>
  </div>
</template>

<script>
// 短信模板类型 1注册获取验证码 2 成功注册 3 获取登录验证码 4 首次采用验证码登录时自动创建会员账号 5找回密码 6购票成功 7 购票失败系统自动退 8平台手动退票 9购电影券成功 10购礼品卡/电影卡成功
import { saveSms, getSms } from '@/api/systemSetting'
import { objectMerge } from '@/utils'
import { realDeepClone } from '@/utils'
export default {
  name: 'sms',
  data() {
    const checkTemplateCode = (rule, value, callback) => {
      if (this.submitData.type === '4') {
        if (!value) {
          return callback(new Error('短信平台选择阿里时阿里短信CODE不能为空'))
        }
        return callback()
      }
    }
    return {
      // 用来初始化的数据
      initData: {
        // 短信平台类型
        smsTypes: [
          {
            type: '1',
            name: '互忆'
          },
          {
            type: '2',
            name: '微网'
          },
          {
            type: '3',
            name: '云通讯'
          },
          {
            type: '4',
            name: '阿里'
          }
        ],
        // 短信模板类型
        templateCategorys: [
          { name: '注册/登录类短信模板', type: '1', show: true },
          { name: '购票成功类短信模板', type: '2', show: true },
          { name: '商品购买成功类短信模板', type: '3' },
          { name: '退订或改签类短信模板', type: '4', show: true }
        ]
      },
      // 需要提交的数据
      submitData: {
        type: '1',
        accountName: '',
        password: '',
        sign: '',
        templateList: {
          memberRegistCode: {
            parentType: '1',
            name: '会员注册获取验证码',
            status: '1',
            type: '1',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：您本次的注册验证码是：【验证码】，验证码在10分钟之内有效，超时请重新获取，请不要泄露给他人。',
            shortcuts: [
              '验证码'
            ],
            show: true
          },
          registSuccess: {
            parentType: '1',
            name: '会员注册成功',
            status: '1',
            type: '2',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：欢迎您加入【平台名称】的大家庭并成为其中一员，我们将提供各种的影视娱乐服务来丰富您的生活！',
            shortcuts: [
              '平台名称'
            ],
            show: true
          },
          phoneLoginCode: {
            parentType: '1',
            name: '手机号快捷登录验证码',
            status: '2',
            type: '3',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：您本次的登录验证码是：【验证码】，验证码在10分钟之内有效，超时请重新获取，请不要泄露给他人。',
            shortcuts: [
              '验证码'
            ],
            show: true
          },
          firstPhoneLoginSuccess: {
            parentType: '1',
            name: '首次手机号快捷登录成功/导入新会员成功',
            status: '1',
            type: '4',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：欢迎您注册成为【平台名称】会员，账号是：【手机号码】，初始登入密码为：【登录密码】，为了您账户的安全请及时进入平台进行密码修改，感谢您的支持与配合，谢谢！',
            shortcuts: [
              '平台名称', '手机号码', '登录密码'
            ],
            show: true
          },
          findPwd: {
            parentType: '1',
            name: '找回密码验证',
            status: '1',
            type: '5',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：您正在申请找回密码，校验码是：【验证码】验证码【时间】分钟之内有效，超时请重新获取。',
            shortcuts: [
              '验证码', '时间'
            ],
            show: true
          },
          mantianxing: {
            parentType: '2',
            name: '满天星系统商购票成功',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭订单号【订单号】及取票码【取票码】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '日期', '影院名称', '影片名称', '订单号', '取票码', '验证码', '取票序列号'
            ]
          },
          huofenghuang: {
            parentType: '2',
            name: '火凤凰系统商购票成功',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭取票码【取票码】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '日期', '影院名称', '影片名称', '订单号', '取票码', '验证码', '取票序列号'
            ]
          },
          chengxing: {
            parentType: '2',
            name: '晨星系统商购票成功',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭订单号【订单号】及取票序列号【取票序列号】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '日期', '影院名称', '影片名称', '订单号', '取票码', '验证码', '取票序列号'
            ]
          },
          dadi1_0: {
            parentType: '2',
            name: '大地（众蓝）系统商购票成功',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的【平台名称】会员：您已成功订购【放映时间】在【影院名称】的【影片名称】电影票，请凭取票码【取票码】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '平台名称', '放映时间', '影院名称', '影片名称', '取票码'
            ],
            show: true
          },
          taopp1_0: {
            parentType: '2',
            name: '淘票票平台购票成功',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的【平台名称】会员：您已成功订购【放映时间】在【影院名称】的【影片名称】电影票，请凭取票信息【变量】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '平台名称', '放映时间', '影院名称', '影片名称', '变量'
            ],
            show: true
          },
          system1905: {
            parentType: '2',
            name: '1905系统商购票成功',
            status: '2',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭取票码【取票码】或验证码【验证码】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '日期', '影院名称', '影片名称', '订单号', '取票码', '验证码', '取票序列号'
            ]
          },
          yunzhi: {
            parentType: '2',
            name: '火凤凰（云智）系统商购票成功',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭取票码【取票码】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '日期', '影院名称', '影片名称', '订单号', '取票码', '验证码', '取票序列号'
            ]
          },
          dingxing: {
            parentType: '2',
            name: '鼎新系统商购票成功',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭序列号【取票序列号】或验证码【验证码】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '日期', '影院名称', '影片名称', '订单号', '取票码', '验证码', '取票序列号'
            ]
          },
          huolieniao: {
            parentType: '2',
            name: '火烈鸟系统商购票成功',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭取票码【取票码】或验证码【验证码】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '日期', '影院名称', '影片名称', '订单号', '取票码', '验证码', '取票序列号'
            ]
          },
          maoyanOne: {
            parentType: '2',
            name: '猫眼渠道商购票成功（一）',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭【变量】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '日期', '影院名称', '影片名称', '变量'
            ]
          },
          maoyanTwo: {
            parentType: '2',
            name: '猫眼渠道商购票成功（二）',
            status: '1',
            type: '6',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭【变量1】及【变量2】至影院柜台或自助机取票，祝您观影愉快！',
            shortcuts: [
              '日期', '影院名称', '影片名称', '变量1', '变量2'
            ]
          },
          ticketCoupon: {
            parentType: '3',
            name: '购电影券成功',
            status: '1',
            type: '9',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购订单号【订单号】，【商品名称+数量】，请关注“影托邦”公众号，点击“微信购票”菜单查看和使用。祝您观影愉快！',
            shortcuts: [
              '商品名称+数量', '订单号'
            ]
          },
          giftCard: {
            parentType: '3',
            name: '购礼品卡/电影卡成功',
            status: '1',
            type: '10',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的用户：您已成功订购订单号【订单号】，【商品名称+数量】，【卡号】，请关注“影托邦”公众号，点击“微信购票”菜单查看和使用。祝您观影愉快！',
            shortcuts: [
              '商品名称+数量', '订单号', '卡号'
            ]
          },
          ticketFailAuto: {
            parentType: '4',
            name: '购票失败系统自动退票',
            status: '1',
            type: '7',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的【平台名称】会员：您购买的【影院名称】【放映时间】【影片名称】的影票，订单未能成功系统已自动为您操作退款，支付金额会在1-7个工作日返回支付来源。如想继续观影您可重新下单购买，感谢您的理解与支持，如有疑问请致电客服热线400-8507-010，祝您生活愉快！',
            shortcuts: [
              '平台名称', '影院名称', '影片名称', '放映时间'
            ],
            show: true
          },
          platformManual: {
            parentType: '4',
            name: '平台手动退票',
            status: '1',
            type: '8',
            templateCode: '',
            interfaceVersion: '',
            content: '',
            format: '样式：尊敬的【平台名称】会员：您购买的【影院名称】【放映时间】【影片名称】的影票，已由人工客服介入为您操作退款退票（影院设备故障或来电申请），支付金额会在1-7个工作日返回支付来源。如想继续观影您可重新下单购买，感谢您的理解与支持，如有疑问请致电客服热线400-8507-010，祝您生活愉快！',
            shortcuts: [
              '平台名称', '影院名称', '影片名称', '放映时间'
            ],
            show: true
          }
        }
      },
      rules1: {
        sign: [{ required: true, message: '请输入短信签名', trigger: 'blur' }]
      },
      rules2: {
        accountName: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入平台密码', trigger: 'blur' }]
      },
      rules3: {
        templateCode: [{ validator: checkTemplateCode, trigger: 'blur' }],
        content: [{ required: true, message: '请输入短信模板', trigger: 'blur' }]
      }

    }
  },
  methods: {
    async insertVariable(template, shortcut, id) {
      shortcut = '【' + shortcut + '】'

      const myField = document.querySelector('#' + id)
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        template.content = myField.value.substring(0, startPos) + shortcut + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick() // 这句是重点, 圈起来
        myField.focus()
        myField.setSelectionRange(endPos + shortcut.length, endPos + shortcut.length)
      } else {
        template.content += shortcut
      }
    },
    saveSms() {
      const submitDataObj = realDeepClone(this.submitData)
      for (const key in submitDataObj.templateList) {
        delete submitDataObj.templateList[key].format
        delete submitDataObj.templateList[key].name
        delete submitDataObj.templateList[key].show
        delete submitDataObj.templateList[key].shortcuts
      }
      this.$refs.mainform.validate((valid) => {
        if (valid) {
          saveSms(submitDataObj).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    },
    getSms() {
      getSms()
    }
  },
  async created() {
    const temp = await getSms()
    if (temp) {
      objectMerge(this.submitData, temp)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
