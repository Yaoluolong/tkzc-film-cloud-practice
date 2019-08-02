<template>
  <div class="app-container">
    <el-tabs v-model="query.smsStatus" @tab-click="tabClick">
      <el-tab-pane label="短信平台" name="0"></el-tab-pane>
      <el-tab-pane label="短信模板" name="1"></el-tab-pane>
    </el-tabs>
    <el-form inline label-width="120px">
      <el-form-item>
        <el-button type="success" icon="el-icon-tickets" @click="addSms">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 平台 -->
    <page-table
      ref="table"
      index
      :query="query"
      :fetch="queryTable"
      v-show="query.smsStatus ==='0'"
    >
      <el-table-column min-width="100" label="短信平台" align="center" prop="typeName"></el-table-column>
      <el-table-column
        min-width="120"
        label="账户"
        align="center"
        prop="accountName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="180" label="密码" align="center" prop="password"></el-table-column>
      <el-table-column min-width="100" label="签名" align="center" prop="sign"></el-table-column>
      <el-table-column width="80" label="是否启用" align="center" prop="status">
        <template slot-scope="{row}">
          <switch-confirm
            v-model="row.status"
            confirm-text="是否进行此操作"
            :id="row.id"
            action="/systemApi/sms/setStatus"
          ></switch-confirm>
        </template>
      </el-table-column>
      <el-table-column min-width="250" label="操作" align="center" prop="oper" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" @click="editSms(row.id)">编辑</el-button>
          <el-button type="text" @click="cancel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </page-table>
    <!-- 模板 -->
    <page-table
      ref="moduleTable"
      index
      :query="modulesQuery"
      :fetch="modulesQueryTable"
      v-show="query.smsStatus ==='1'"
    >
      <el-table-column min-width="80" label="模板类型" align="center" prop="parentTypeName"></el-table-column>
      <el-table-column
        min-width="140"
        label="模板名称"
        align="center"
        prop="typeStrName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="60" label="短信平台" align="center" prop="smsTypeName"></el-table-column>
      <el-table-column min-width="400" label="短信模板" align="center" prop="content"></el-table-column>
      <el-table-column min-width="100" label="添加时间" align="center" prop="createTime"></el-table-column>
      <el-table-column width="80" label="是否启用" align="center" prop="status">
        <template slot-scope="{row}">
          <switch-confirm
            v-model="row.status"
            confirm-text="是否进行此操作"
            :id="row.id"
            action="/systemApi/smsTemplate/setStatus"
          ></switch-confirm>
        </template>
      </el-table-column>
      <el-table-column min-width="250" label="操作" align="center" prop="oper" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" @click="editSmsModules(row.id)">编辑</el-button>
          <el-button type="text" @click="cancelTemplate(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </page-table>
    <!-- 短信平台 -->
    <el-dialog :title="diaLogTitle" :visible.sync="dialogFormVisible" width="40%">
      <el-form label-width="120px" :model="params" :rules="rules" ref="form">
        <el-form-item label="短信平台" prop="type">
          <remote-select
            v-model="params.type"
            clearable
            placeholder="请选择短信平台"
            action="/systemApi/dict/getList"
            :query="{type:'smsType'}"
          ></remote-select>
        </el-form-item>
        <el-form-item label="平台账号" prop="accountName">
          <el-input clearable v-model="params.accountName" label="描述文字" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="平台密码" prop="password">
          <el-input clearable v-model="params.password" label="描述文字" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="短信签名" prop="sign">
          <el-input clearable v-model="params.sign" label="描述文字" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetParams">取 消</el-button>
        <el-button type="primary" @click="smsOrder()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 短信模板 -->
    <el-dialog :title="diaLogModulesTitle" :visible.sync="dialogModulesVisible" width="50%">
      <el-form label-width="120px" :model="module" :rules="moduleRules" ref="modulesForm">
        <el-form-item label="模板类型" prop="parentType">
          <remote-select
            v-model="module.parentType"
            clearable
            placeholder="请选择"
            action="/systemApi/dict/getList"
            :query="{type:'smsTemplateType'}"
            @change="parentTypeChange"
          ></remote-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="typeStr">
          <el-select clearable v-model="module.typeStr" placeholder="请选择模板名称">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信平台" prop="smsType">
          <remote-select
            v-model="module.smsType"
            clearable
            placeholder="请选择"
            action="/systemApi/dict/getList"
            :query="{type:'smsType'}"
          ></remote-select>
        </el-form-item>
        <el-form-item label="阿里短信CODE" prop="templateCode" v-if="module.smsType==='1'">
          <el-input
            clearable
            v-model.trim="module.templateCode"
            style="width:200px;"
            placeholder="阿里短信模板code"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择变量" style="margin-top:1%" v-if="module.parentType && module.typeStr">
          <el-button
            v-for="shortcut in module.shortcuts"
            @click="insertVariable(module , shortcut , 'content_'+ module.typeStr)"
            :key="shortcut"
            type="primary"
            style="margin-right:20px;margin-bottom:10px;margin-left:0px;"
          >{{shortcut}}</el-button>
        </el-form-item>
        <el-form-item
          :show-message="false"
          label="短信模版:"
          style="margin-top:1%"
          prop="content"
          v-if="module.parentType && module.typeStr"
        >
          <el-input
            clearable
            v-model.trim="module.content"
            :id="'content_'+ module.typeStr"
            style="width:90%;"
            placeholder="请输入内容"
          ></el-input>
          <br />
          <span style="color:gray">{{module.format}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetModules">取 消</el-button>
        <el-button type="primary" @click="modulesOrder()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSmsPageList,
  getSmsInfo,
  getSmsTemplatePageList,
  getTemplateParamList,
  getTemplateNameList,
  getSmsTemplateInfo,
  createSms,
  updateSms,
  deleteSms,
  createSmsTemplate,
  updateSmsTemplate,
  deleteSmsTemplate
} from '@/api/systemSetting'
import { realDeepClone } from '@/utils'
export default {
  // components: {},
  name: 'create_edit_sms',
  data() {
    return {
      query: {
        smsStatus: '0'
      },
      params: {
        id: '',
        type: '',
        accountName: '',
        password: '',
        sign: ''
      },
      modulesQuery: {
        typeName: '0',
        accountName: '0',
        password: '0',
        sign: '0',
        status: '0'
      },
      module: {
        parentType: '',
        typeStr: '',
        smsType: '',
        templateCode: '',
        shortcuts: [],
        content: '',
        format: ''
      },
      rules: {
        type: { required: true, message: '请选择短信平台', trigger: 'change' },
        accountName: {
          required: true,
          message: '请输入平台账号',
          trigger: 'change'
        },
        password: {
          required: true,
          message: '请输入平台密码',
          trigger: 'change'
        },
        sign: { required: true, message: '请输入短信签名', trigger: 'change' }
      },
      moduleRules: {
        parentType: {
          required: true,
          message: '请选择模板类型',
          trigger: 'change'
        },
        typeStr: {
          required: true,
          message: '请选择模板名称',
          trigger: 'change'
        },
        smsType: {
          required: true,
          message: '请选择短信平台',
          trigger: 'change'
        },
        templateCode: {
          required: true,
          message: '请输入阿里code',
          trigger: 'change'
        },
        content: { required: true, message: '请输入短信内容', trigger: 'blur' }
      },
      dialogFormVisible: false,
      diaLogTitle: '新增短信平台',
      dialogModulesVisible: false,
      diaLogModulesTitle: '新增短信模板',

      options: [],
      modulesList: {
        dadi1_0: {
          parentType: '2',
          name: '大地（众蓝）系统商购票成功',
          status: '1',
          type: '6',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的【平台名称】会员：您已成功订购【放映时间】在【影院名称】的【影片名称】电影票，请凭取票码【取票码】至影院柜台或自助机取票，祝您观影愉快！',
          shortcuts: ['平台名称', '放映时间', '影院名称', '影片名称', '取票码'],
          show: true
        },
        taopp1_0: {
          parentType: '2',
          name: '淘票票平台购票成功',
          status: '1',
          type: '6',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的【平台名称】会员：您已成功订购【放映时间】在【影院名称】的【影片名称】电影票，请凭取票信息【变量】至影院柜台或自助机取票，祝您观影愉快！',
          shortcuts: ['平台名称', '放映时间', '影院名称', '影片名称', '变量'],
          show: true
        },
        mtx1_0: {
          parentType: '2',
          name: '满天星系统商购票成功',
          status: '1',
          type: '6',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭订单号【订单号】及取票码【取票码】至影院柜台或自助机取票，祝您观影愉快！',
          shortcuts: [
            '日期',
            '影院名称',
            '影片名称',
            '订单号',
            '取票码',
            '验证码',
            '取票序列号'
          ]
        },
        dx1_0: {
          parentType: '2',
          name: '鼎新系统商购票成功',
          status: '1',
          type: '6',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭序列号【取票序列号】或验证码【验证码】至影院柜台或自助机取票，祝您观影愉快！',
          shortcuts: [
            '日期',
            '影院名称',
            '影片名称',
            '订单号',
            '取票码',
            '验证码',
            '取票1序列号'
          ]
        },
        vista1_0: {
          parentType: '2',
          name: 'VISTA系统商购票成功',
          status: '1',
          type: '6',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的用户：您已成功订购【日期】在【影院名称】的【影片名称】电影票，请凭序列号【取票序列号】或验证码【验证码】至影院柜台或自助机取票，祝您观影愉快！',
          shortcuts: [
            '日期',
            '影院名称',
            '影片名称',
            '订单号',
            '取票码',
            '验证码',
            '取票1序列号'
          ]
        },
        exportTask: {
          parentType: '3',
          name: '导出电影券/卡',
          status: '1',
          type: '9',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的【平台名称】客户，本次导出的电影券/卡文件【文件名称】请使用解压码【解压密码】来打开文件，请注意保管解压密码，如有疑问请咨询：4008-616-123',
          shortcuts: ['平台名称', '文件名称', '解压密码']
        },
        ticketFailAuto: {
          parentType: '4',
          name: '购票失败系统自动退票',
          status: '1',
          type: '7',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的【平台名称】会员：您购买在【影院名称】的【放映时间】放映【影片名称】的影票，订单未能成功系统已自动为您操作退款，支付金额会在1-7个工作日返回支付来源。如想继续观影您可重新下单购买，感谢您的理解与支持，如有疑问请致电客服热线400-8507-010，祝您生活愉快！',
          shortcuts: ['平台名称', '影院名称', '影片名称', '放映时间'],
          show: true
        },
        platformManual: {
          parentType: '4',
          name: '平台手动退票',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的【平台名称】会员：您购买在【影院名称】的【放映时间】放映【影片名称】的影票，已由人工客服介入为您操作退款退票（影院设备故障或来电申请），支付金额会在1-7个工作日返回支付来源。如想继续观影您可重新下单购买，感谢您的理解与支持，如有疑问请致电客服热线400-8507-010，祝您生活愉快！',
          shortcuts: ['平台名称', '影院名称', '影片名称', '放映时间'],
          show: true
        },
        marketCouponWarn: {
          parentType: '5',
          name: '电影券营销票业务预付金超限',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：您好：【业务人员】销售给【客户名称】的业务预付金已超限，请及时督促处理，请在【天数】内完成对账。',
          shortcuts: ['业务人员', '客户名称', '销售订单', '天数'],
          show: true
        },
        groupCouponWarn: {
          parentType: '5',
          name: '电影券团体票业务预付金超限',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：您好：【业务人员】销售给【客户名称】的业务预付金已超限，请及时督促处理，请在【天数】内完成对账。',
          shortcuts: ['业务人员', '客户名称', '销售订单', '天数'],
          show: true
        },
        plateformOrderWarn: {
          parentType: '5',
          name: '平台商家交易预警',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：您好：【平台商家】缴纳的【预付金】使用已达到【额度】，请及时督促处理，请在【天数】内完成对账。',
          shortcuts: ['平台商家', '预付金', '额度', '天数'],
          show: true
        },
        couponApprovalSms: {
          parentType: '6',
          name: '电影券销售单审批',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：电影券销售单审批：您有一笔【业务人员】的电影券销售单需要您进行【审批环节】，请及时处理，销售单号为：【销售订单号】',
          shortcuts: ['业务人员', '审批环节', '销售订单号'],
          show: true
        },
        cardApprovalSms: {
          parentType: '6',
          name: '电影卡销售单审批',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：电影卡销售单审批：您有一笔【业务人员】的电影卡销售单需要您进行【审批环节】，请及时处理，销售单号为：【销售订单号】。',
          shortcuts: ['业务人员', '审批环节', '销售订单号'],
          show: true
        },
        activeApprovalSms: {
          parentType: '6',
          name: '营销活动审批',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：营销活动审批：您有一个【活动类型】的营销活动需要您进行【审批环节】操作，请及时处理，创建人是【创建人】，活动序号为【活动序号】。',
          shortcuts: ['活动类型', '审批环节'],
          show: true
        },
        login: {
          parentType: '6',
          name: '手机号快捷登录验证码',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：您本次的登录验证码是：【验证码】，验证码在10分钟之内有效，超时请重新获取，请不要泄露给他人。',
          shortcuts: ['验证码'],
          show: true
        },
        bindMobile: {
          parentType: '6',
          name: '绑定手机号',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：您正在进行会员关联手机号的操作，本次的验证码是：【验证码】，验证码在10分钟之内有效，超时请重新获取，请不要泄露给他人。',
          shortcuts: ['验证码'],
          show: true
        },
        changeBindingMobile: {
          parentType: '6',
          name: '更换绑定手机号',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：您正在进行会员关联手机号更换的操作，本次的验证码是：【验证码】，验证码在10分钟之内有效，超时请重新获取，请不要泄露给他人。',
          shortcuts: ['验证码'],
          show: true
        },
        oneValue: {
          parentType: '6',
          name: '一个变量',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的【平台商家】会员：您已成功订购【放映时间】在【影院名称】的【影片名称】电影票，请凭取票信息【变量1】至影城柜台或自助机取票，祝您观影愉快！',
          shortcuts: [''],
          show: true
        },
        twoValue: {
          parentType: '6',
          name: '两个变量',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的【平台商家】会员：您已成功订购【放映时间】在【影院名称】的【影片名称】电影票，请凭取票信息【变量1】及【变量2】至影城柜台或自助机取票，祝您观影愉快！',
          shortcuts: [''],
          show: true
        },
        threeValue: {
          parentType: '6',
          name: '三个变量',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：尊敬的【平台商家】会员：您已成功订购【放映时间】在【影院名称】的【影片名称】电影票，请凭取票信息【变量1】及【变量2】和【变量3】至影城柜台或自助机取票，祝您观影愉快！',
          shortcuts: [''],
          show: true
        },
        activityWarn: {
          parentType: '6',
          name: '营销活动预警',
          status: '1',
          type: '8',
          templateCode: '',
          content: '',
          format:
            '样式：您好：【活动名称】的【活动款】使用已达到【额度】，请及时处理。',
          shortcuts: [''],
          show: true
        }
      }
    }
  },
  watch: {
    'module.parentType'(val, oldVal) {
      if (val !== oldVal) {
        /* this.$set(this.module, 'typeStr', '')
        this.$set(this.module, 'shortcuts', [])
        this.$set(this.module, 'content', '')
        this.$set(this.module, 'format', '')*/
        this.getTemplateNameOptions(val)
      }
    },
    'module.typeStr'(val, oldVal) {
      if (val !== oldVal) {
        this.$set(this.module, 'shortcuts', [])
        // this.$set(this.module, 'content', '')
        this.$set(this.module, 'format', '')
        this.modulesShortCutsChange()
      }
    }
  },
  methods: {
    queryTable(query) {
      const req = realDeepClone(query)
      return getSmsPageList(req)
    },
    modulesQueryTable(query) {
      const req = realDeepClone(query)
      return getSmsTemplatePageList(req)
    },
    tabClick() {
      window.sessionStorage.setItem(`query.smsStatus`, this.query.smsStatus)
      this.refreshTable()
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    refreshTemplateTable() {
      this.$refs.moduleTable.refresh()
    },
    getTemplateNameOptions(val) {
      getTemplateNameList({ type: val }).then(res => {
        this.options = []
        res.forEach(e => {
          this.options.push({
            label: e.name,
            value: e.value
          })
        })
      })
    },
    parentTypeChange(val) {
      this.$set(this.module, 'typeStr', '')
      this.$set(this.module, 'shortcuts', [])
      // this.$set(this.module, 'content', '')
      this.$set(this.module, 'format', '')
      this.getTemplateNameOptions(val)
    },
    modulesShortCutsChange() {
      if (this.module.parentType && this.module.typeStr) {
        /* Object.keys(this.modulesList).forEach((v, k) => {
          if (v === this.module.typeStr) {
            this.$set(this.module, 'shortcuts', [])
            // this.$set(this.module, 'content', this.modulesList[v].content)
            this.$set(this.module, 'format', this.modulesList[v].format)
            getTemplateParamList({ parentType: this.module.parentType, typeStr: this.module.typeStr }).then(res => {
              res.forEach(e => {
                this.module.shortcuts.push(e.name)
              })
            })
          } else {
            this.$set(this.module, 'shortcuts', [])
            getTemplateParamList({ parentType: this.module.parentType, typeStr: this.module.typeStr }).then(res => {
              res.forEach(e => {
                this.module.shortcuts.push(e.name)
              })
            })
          }
        })*/
        this.$set(this.module, 'shortcuts', [])
        getTemplateParamList({
          parentType: this.module.parentType,
          typeStr: this.module.typeStr
        }).then(res => {
          res.forEach(e => {
            this.module.shortcuts.push(e.name)
            Object.keys(this.modulesList).forEach((v, k) => {
              if (v === this.module.typeStr) {
                this.$set(this.module, 'format', this.modulesList[v].format)
              }
            })
          })
        })
      }
    },
    async insertVariable(template, shortcut, id) {
      shortcut = '【' + shortcut + '】'

      const myField = document.querySelector('#' + id)
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        template.content =
          myField.value.substring(0, startPos) +
          shortcut +
          myField.value.substring(endPos, myField.value.length)
        await this.$nextTick() // 这句是重点, 圈起来
        myField.focus()
        myField.setSelectionRange(
          endPos + shortcut.length,
          endPos + shortcut.length
        )
      } else {
        template.content += shortcut
      }
    },
    resetModuleParams() {
      this.$refs.modulesForm.resetFields()
    },
    addSms() {
      if (this.query.smsStatus === '0') {
        this.diaLogTitle = '新增短信平台'
        delete this.params.id
        this.dialogFormVisible = true
      } else {
        this.diaLogModulesTitle = '新增短信模板'
        this.$set(this.module, 'templateCode', '')
        this.$set(this.module, 'content', '')
        this.dialogModulesVisible = true
      }
    },
    editSms(id) {
      this.diaLogTitle = '编辑短信平台'
      this.dialogFormVisible = true
      getSmsInfo(id).then(e => {
        this.params = e
        this.$set(this.params, 'id', id)
        this.refreshTable()
      })
    },
    editSmsModules(id) {
      this.diaLogModulesTitle = '编辑短信模板'
      this.dialogModulesVisible = true
      getSmsTemplateInfo(id).then(e => {
        this.module = e
        this.$set(this.module, 'id', id)
        this.refreshTemplateTable()
      })
    },
    async cancel(id) {
      this.$confirm(
        `删除短信平台后，将导致平台内有调用到此短信平台的接口全部失效，确认是否删除！`,
        '温馨提示',
        { type: 'warning' }
      ).then(async() => {
        await deleteSms(id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.refreshTable()
      })
    },
    async cancelTemplate(id) {
      this.$confirm(
        `删除短信模版后，如果系统内有调用此短信模版的地方，将导致用户无法接收到短信信息提醒，是否确认删除！`,
        '温馨提示',
        { type: 'warning' }
      ).then(async() => {
        await deleteSmsTemplate(id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.refreshTemplateTable()
      })
    },
    resetParams() {
      this.dialogFormVisible = false
      this.$refs.form.resetFields()
    },
    resetModules() {
      this.dialogModulesVisible = false
      this.$refs.modulesForm.resetFields()
    },
    smsOrder() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.params.id) {
            updateSms(this.params).then(e => {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.$refs.form.resetFields()
              delete this.params.id
              this.refreshTable()
              this.dialogFormVisible = false
            })
          } else {
            createSms(this.params).then(e => {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.$refs.form.resetFields()
              this.refreshTable()
              this.dialogFormVisible = false
            })
          }
        }
      })
    },
    modulesOrder() {
      this.$refs.modulesForm.validate(valid => {
        if (valid) {
          if (this.module.id) {
            updateSmsTemplate(this.module).then(e => {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.$refs.modulesForm.resetFields()
              delete this.module.id
              this.refreshTemplateTable()
              this.dialogModulesVisible = false
            })
          } else {
            createSmsTemplate(this.module).then(e => {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.$refs.modulesForm.resetFields()
              this.refreshTemplateTable()
              this.dialogModulesVisible = false
            })
          }
        }
      })
    }
  }
}
</script>