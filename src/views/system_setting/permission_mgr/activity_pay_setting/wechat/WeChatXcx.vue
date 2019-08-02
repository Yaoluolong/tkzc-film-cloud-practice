<template>
  <div>
    <el-card class="box-card">
      <el-form
        inline
        ref="form"
        :rules="rules"
        :model="weixinpayParam.configDetail.minApp"
        label-width="150px"
      >
        <el-form-item label="appid" prop="appId" style="width:500px">
          <el-input
            clearable
            v-model.trim="weixinpayParam.configDetail.minApp.appId"
            placeholder="请输入appid"
          ></el-input>
        </el-form-item>
        <el-form-item label="secret" prop="appSecret" style="width:500px">
          <el-input
            clearable
            v-model.trim="weixinpayParam.configDetail.minApp.appSecret"
            placeholder="请输入secret"
          ></el-input>
        </el-form-item>
        <el-form-item label="key" prop="appKey" style="width:500px">
          <el-input
            clearable
            v-model.trim="weixinpayParam.configDetail.minApp.appKey"
            placeholder="请输入key"
          ></el-input>
        </el-form-item>
        <el-form-item label="商户号" prop="appAccount">
          <el-input
            clearable
            v-model.trim="weixinpayParam.configDetail.minApp.appAccount"
            placeholder="请输入商户号"
          ></el-input>
        </el-form-item>
        <el-form-item label=" " prop="apiclientCert">
          <div style="font-weight:bold;width:100%;">SSL证书(原路退回时需要配置)</div>
          <el-input
            clearable
            class="scription"
            :rows="7"
            type="textarea"
            v-model.trim="weixinpayParam.configDetail.minApp.apiclientCert"
            placeholder="请输入SSL证书"
          ></el-input>
        </el-form-item>
        <el-form-item label=" " prop="apiclientKey">
          <div style="font-weight:bold;width:100%;">SSL秘钥(原路退回时需要配置)</div>
          <el-input
            clearable
            class="scription"
            :rows="7"
            type="textarea"
            v-model.trim="weixinpayParam.configDetail.minApp.apiclientKey"
            placeholder="请输入SSL秘钥"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <p style="font-size:14px;font-weight:700">微信消息通知 :</p>
    <el-card class="box-card">
      <div
        style="border:1px solid 	#D3D3D3;margin-top:5px;"
        v-for="(value , key) in notify"
        :key="key"
      >
        <!-- ====================购票通知================================== -->
        <el-form
          style="padding-top:10px"
          :ref="'form'+key"
          :rules="rulesTicket"
          :model="weixinpayParam.configDetail.minApp.weixinMsgconfig[key]"
          label-width="150px"
        >
          <el-form-item :label="value.title">
            <el-radio
              v-model="weixinpayParam.configDetail.minApp.weixinMsgconfig[key].status"
              label="1"
            >开启</el-radio>
            <el-radio
              v-model="weixinpayParam.configDetail.minApp.weixinMsgconfig[key].status"
              label="2"
            >关闭</el-radio>
          </el-form-item>
          <template v-if="weixinpayParam.configDetail.minApp.weixinMsgconfig[key].status === '1'">
            <el-form-item label="消息模板ID">
              <remote-select
                ref="msgTemplateId"
                v-model="weixinpayParam.configDetail.minApp.weixinMsgconfig[key].templateId"
                @change="initTemplateField(key)"
                valueKey="templateId"
                labelKey="title"
                :query="{type:key}"
                lab
                placeholder="请选择消息模板ID"
                action="/systemApi/payConfig/getWechatTemplate"
                style="width:320px"
              ></remote-select>
              <el-button type="primary" @click="syncWechatTemplate">同步模板ID</el-button>
            </el-form-item>
            <el-form-item label="消息标题">
              <el-input
                clearable
                v-model.trim="weixinpayParam.configDetail.minApp.weixinMsgconfig[key].title"
                placeholder="请输入消息标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="消息结束语">
              <el-input
                clearable
                v-model.trim="weixinpayParam.configDetail.minApp.weixinMsgconfig[key].endRemarks"
                placeholder="请输入消息结束语"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <div>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <div class="grid-content bg-purple">模板字段</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple">关联</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple">输出变量</div>
                  </el-col>
                </el-row>
                <el-row
                  v-if="weixinpayParam.configDetail.minApp.weixinMsgconfig[key].templateId"
                  :gutter="20"
                  v-for="field in templateField[key]"
                  :key="field.name"
                >
                  <el-col :span="6">
                    <div class="grid-content bg-purple">{{field.value}}</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple">----></div>
                  </el-col>
                  <el-col :span="6">
                    <el-select
                      clearable
                      v-model="weixinpayParam.configDetail.minApp.weixinMsgconfig[key].fieldMap[field.name]"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="exportField in exportFields[key]"
                        :label="exportField.name"
                        :value="exportField.value"
                        :key="exportField.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  getWechatTemplateField,
  getSelfWechatField,
  syncWechatTemplate
} from '@/api/systemSetting'
export default {
  props: {
    value: Object
  },
  data() {
    return {
      weixinpayParam: {
        describe: ''
      },

      minAppPayParam: {
        // 这里的数据结构要看外面传进来的value
      },
      // 输出变量
      exportFields: {
        ticket: '',
        coupon: '',
        card: ''
      },
      // 模板字段
      templateField: {
        ticket: {},
        coupon: [],
        card: []
      },
      notify: {
        ticket: { title: '购票成功通知' }
        /*,
        coupon: { title: '购券成功通知' },
        card: { title: '购卡成功通知' }*/
      },
      rules: {
        // appId: [{ required: true, message: '请输入appid', trigger: 'blur' }],
        // appSecret: [{ required: true, message: '请输入secret', trigger: 'blur' }],
        // appKey: [{ required: true, message: '请输入key', trigger: 'blur' }],
        // appAccount: [{ required: true, message: '请输入商户号', trigger: 'blur' }],
        // apiclientCert: [{ required: true, message: '请输入SSL证书', trigger: 'blur' }],
        // apiclientKey: [{ required: true, message: '请输入SSL秘钥', trigger: 'blur' }]
      },
      rulesTicket: {},
      rulesCoupon: {},
      rulesCard: {}
    }
  },
  watch: {},
  methods: {
    async syncWechatTemplate() {
      await syncWechatTemplate()
      this.$refs.msgTemplateId.forEach(e => e.fetchOptions())
    },
    async initTemplateField(type) {
      if (
        this.weixinpayParam.configDetail.minApp.weixinMsgconfig[type].templateId
      ) {
        const temp = await getWechatTemplateField(
          this.weixinpayParam.configDetail.minApp.weixinMsgconfig[type]
            .templateId
        )
        this.templateField[type] = temp
      }
    },
    async initExportField() {
      for (var key of Object.keys(this.exportFields)) {
        this.exportFields[key] = await getSelfWechatField(key)
      }
    }
  },
  created() {
    this.weixinpayParam = this.value
    this.initExportField()
  }
}
</script>

<style scoped lang="scss">
.scription {
  display: inline-block;
  width: 600px;
  vertical-align: bottom;
  font-size: 14px;
}
</style>
