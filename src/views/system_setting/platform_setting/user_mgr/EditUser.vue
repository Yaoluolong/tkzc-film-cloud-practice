<template>
  <div class="app-container">
    <el-form label-width="120px" style="width:600px;" :model="params" :rules="rules" ref="form">
      <div style="margin-bottom:4%">平台用户基础信息</div>
      <el-form-item label="用户名" prop="userName">
        <tip content="用于登录平台的账号">
          <el-input v-model="params.userName" placeholder="请输入用户名,最多10个英文或数字字符"></el-input>
        </tip>
      </el-form-item>
      <el-form-item label="用户姓名" prop="realName">
        <el-input v-model="params.realName" placeholder="请输入用户姓名,最多10个字"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="params.email" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="params.mobile" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="type" placeholder="请选择用户类型">
        <tip content="用户账户归属，用于登录时的依据可登录哪个PC后台！">
          <el-select v-model="params.type" style="width:100%">
            <el-option value="1" label="平台端用户"></el-option>
            <el-option value="2" label="卡券分销商"></el-option>
            <el-option value="3" label="渠道商户"></el-option>
            <el-option value="4" label="影院"></el-option>
          </el-select>
        </tip>
      </el-form-item>
      <div v-if="+params.type===1">
      <el-form-item label="所属角色" prop="roleId">
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
      <el-form-item label="所属客户" prop="customerIds">
        <zm-select
          class="wp100"
          placeholder="请选择所属客户"
          v-model="params.customerIds"
          select-type="customerList"
          :attrOption="{multiple:true}"
        ></zm-select>
      </el-form-item>
      <el-form-item label="关联商家" prop="customerIds" v-if="+params.type===3">
        <zm-select
          class="wp100"
           placeholder="请选择关联商家"
          v-model="params.customerIds"
          select-type="channelList"
          :attrOption="{multiple:true}"
        ></zm-select>
      </el-form-item>
      <el-form-item label="关联业务员" prop="uesrIds">
        <zm-select
          class="wp100"
          placeholder="请选择关联业务员"
          v-model="params.uesrIds"
          select-type="memberList"
          :attrOption="{multiple:true}"
        ></zm-select>
      </el-form-item>
      </div>
      <div v-if="+params.type===4">
       <el-form-item label="关联影院" prop="uesrIds">
<add-cinema></add-cinema>
      </el-form-item>
      </div>
      <el-form-item label="登录密码">
        <el-input v-model="params.passWord" type="password" placeholder="请输入登录密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="params.rePassWord" type="password" placeholder="请输入确认密码"></el-input>
      </el-form-item>
      <el-form-item label="备注信息" prop="remark">
        <el-input v-model="params.remark" type="textarea" :rows="4" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center"></el-form-item>
    </el-form>
    <el-button type="primary" @click="save">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
import zmSelect from '@/components/isNeedComponents/zmSelect'
import addCinema from './components/addCinema'
import { getUserInfo, createUser, updateUser } from '@/api/systemSetting'
export default {
  name: 'edit_user',
  components: { zmSelect, addCinema },
  data() {
    return {
      params: {},
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
        type: { required: true, message: '请选择用户类型', trigger: 'blur' },
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
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await (this.params.id
            ? updateUser(this.params)
            : createUser(this.params))
          this.$message.success('保存成功')
          // this.$refs.form.clearValidate()
          this.closeTab(true)
          this.$router.push('/system_setting/platform_setting/user_mgr')
        }
      })
    },
    cancel() {
      this.closeTab()
      this.$router.push('/system_setting/platform_setting/user_mgr')
    }
  },
  async created() {
    console.log(this.$route)
    // 编辑
    if (this.$route.query.id) {
      this.isEdit = true

      getUserInfo(this.$route.query.id).then(data => {
        if (data) {
          this.params = data
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
