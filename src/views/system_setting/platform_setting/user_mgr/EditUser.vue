<template>
  <div class="app-container">
    {{params.channelId}}
    <el-form label-width="120px" :model="params" :rules="rules" ref="form">
      <div style="margin-bottom:4%">平台用户基础信息</div>
      <el-form-item label="用户名" prop="userName" class="w600">
        <tip content="用于登录平台的账号">
          <el-input v-model="params.userName" placeholder="请输入用户名,最多10个英文或数字字符"></el-input>
        </tip>
      </el-form-item>
      <el-form-item label="用户姓名" prop="realName" class="w600">
        <el-input v-model="params.realName" placeholder="请输入用户姓名,最多10个字"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email" class="w600">
        <el-input v-model="params.email" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile" class="w600">
        <el-input v-model="params.mobile" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="type" placeholder="请选择用户类型" class="w600">
        <tip content="用户账户归属，用于登录时的依据可登录哪个PC后台！">
          <el-select v-model="params.type" class="wp100" @change="chooseType">
            <el-option value="1" label="平台端用户"></el-option>
            <el-option value="2" label="卡券分销商"></el-option>
            <el-option value="3" label="渠道商户"></el-option>
            <el-option value="4" label="影院"></el-option>
          </el-select>
        </tip>
      </el-form-item>
      <div v-if="+params.type===1">
        <el-form-item label="所属角色" prop="roleId" class="w600">
          <remote-select
            v-model="params.roleId"
            placeholder="请选择所属角色"
            action="/systemApi/systemAccountRole/getList"
            class="wp100"
          ></remote-select>
          <div style="color:#909399">选择所属角色后默认继承角色权限，同时可在成员列表中单独设置权限。</div>
        </el-form-item>
      </div>
      <div v-if="+params.type===2||+params.type===3">
        <el-form-item label="所属客户" prop="customerId" class="w600">
          <zm-select
            class="wp100"
            placeholder="请选择所属客户"
            v-model="params.customerId"
            select-type="customerList"
            :attrOption="{multiple:true}"
          ></zm-select>
        </el-form-item>
        <el-form-item label="关联商家" prop="channelId" v-if="+params.type===3" class="w600">
          <zm-select
            class="wp100"
            placeholder="请选择关联商家"
            v-model="params.channelId"
            select-type="channelList"
            :attrOption="{multiple:true}"
          ></zm-select>
        </el-form-item>
        <el-form-item label="关联业务员" prop="accountRelationId" class="w600">
          <zm-select
            class="wp100"
            placeholder="请选择关联业务员"
            v-model="params.accountRelationId"
            select-type="memberList"
            :attrOption="{multiple:true}"
          ></zm-select>
        </el-form-item>
      </div>
      <div v-if="+params.type===4">
        <el-form-item label="关联影院" prop="cinemaId" class="wp100">
          <el-button type="primary" @click="onOperateClick('addCinema')" v-if="showAddbtn">添加影院</el-button>
        </el-form-item>
        <add-cinema class="mb20" v-show="!showAddbtn" :chooseInfo="chooseInfo" ref="addCineam" @change="getChoosedId"></add-cinema>
      </div>
      <el-form-item label="登录密码" class="w600">
        <el-input v-model="params.passWord" type="password" placeholder="请输入登录密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" class="w600">
        <el-input v-model="params.rePassWord" type="password" placeholder="请输入确认密码"></el-input>
      </el-form-item>
      <el-form-item label="备注信息" prop="remark" class="w600">
        <el-input v-model="params.remark" type="textarea" :rows="4" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center"></el-form-item>
    </el-form>
    <el-button type="primary" @click="save">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
import uuid from 'uuid'
import zmSelect from '@/components/isNeedComponents/zmSelect'
import addCinema from './components/addCinema'
import { getUserInfo, createUser, updateUser } from '@/api/systemSetting'
export default {
  name: 'edit_user',
  components: { zmSelect, addCinema },
  data() {
    const cinemaIdValid = (rule, value, callback) => {
      if (!this.params.cinemaId) {
        callback(new Error('请选择影院'))
      } else {
        callback()
      }
    }
    return {
      chooseInfo: {
        code: ''
      },
      params: {},
      showAddbtn: true, // 类型为影院时，展示添加按钮
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号码必须是11位', trigger: 'blur' },
          { pattern: /^1\d{10}/, message: '手机号码格式错误', trigger: 'blur' }
        ],
        userName: {
          required: true,
          max: 10,
          message: '请输入用户名,最多10个英文或数字字符',
          trigger: 'blur'
        },
        realName: {
          required: true,
          max: 10,
          message: '请输入用户姓名,最多10个字',
          trigger: 'blur'
        },
        roleId: { required: true, message: '请选择所属角色', trigger: 'blur' },
        channelId: {
          required: true,
          message: '请选择关联商户',
          trigger: 'change'
        },
        customerId: {
          required: true,
          message: '请选择所属客户',
          trigger: 'change'
        },
        accountRelationId: {
          required: true,
          message: '请选择关联业务员',
          trigger: 'change'
        },
        cinemaId: { required: true, validator: cinemaIdValid, message: '请选择所属影院' },
        type: { required: true, message: '请选择用户类型', trigger: 'change' },
        passWord: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, message: '长度至少6位', trigger: 'blur' }
        ],
        rePassWord: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, message: '长度至少6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    chooseType() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate([
          'channelId',
          'customerId',
          'accountRelationId'
        ])
      })
    },
    onOperateClick(type) {
      this.$refs.addCineam.onOperateClick(type)
    },
    getChoosedId(msg) {
      this.params.cinemaId = msg.cinemaId
      this.showAddbtn = !msg.cinemaId
      this.$refs.form.validateField('cinemaId')
    },
    async save() {
      const valid = await this.$refs.form.validate()
      if (!valid) return
      const params = Object.assign({}, this.params, {
        accountRelationId: this.params.accountRelationId
          ? this.params.accountRelationId.join(',')
          : '',
        customerId: this.params.customerId
          ? this.params.customerId.join(',')
          : '',
        channelId: this.params.channelId ? this.params.channelId.join(',') : ''
      })
      await (params.id ? updateUser(params) : createUser(params))
      this.$message.success('保存成功')
      // this.$refs.form.clearValidate()
      this.closeTab(true)
      this.$router.push('/system_setting/platform_setting/user_mgr')
    },
    cancel() {
      if (this.$refs.addCinema) this.$refs.addCinema.colsePage()
      this.closeTab()
      this.$router.push('/system_setting/platform_setting/user_mgr')
    }
  },
  async created() {
    const code = uuid().split('-')
    this.chooseInfo.code = code[code.length - 1] + '' + code[code.length - 2]
    // 编辑
    if (this.$route.query.id) {
      this.isEdit = true

      getUserInfo(this.$route.query.id).then(data => {
        if (data) {
          this.params = data
          this.chooseInfo = Object.assign({}, this.chooseInfo, data)
          this.showAddbtn = !data.cinemaId
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.sub-menu {
  margin: 10px;
}
.elform {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
</style>
