<template>
  <div class="app-middle-container">
    <el-form label-width="120px"  style="width:420px;" :model="params" :rules="rules" ref="form">
      <el-form-item class="avatar-middle">
       <pic-upload v-model.trim="params.headImg" class="avatar" title="点击更换头像"></pic-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input clearable  v-model.trim="params.userName" placeholder="请输入用户名" disabled></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input clearable  v-model.trim="params.email" placeholder="请输入电子邮箱" disabled></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldPassWord">
        <el-input clearable  type="password" v-model.trim="params.oldPassWord" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassWord">
        <el-input clearable  type="password" v-model.trim="params.newPassWord" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassWord">
        <el-input clearable  type="password" v-model.trim="params.rePassWord" placeholder="请输入确认密码"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getUserInfo, resetUserPassWord } from '@/api/systemSetting'
  export default {
    name: 'account_setting',
    data() {
      const checkPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else if (value.length < 6) {
          callback(new Error('密码至少要6位'))
        }
        callback()
      }
      return {
        params: {},
        rules: {
          // userName: { required: true, message: '请输入用户名', trigger: 'blur' },
          // email: { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          oldPassWord: [{ validator: checkPassword, trigger: 'blur' },
            { min: 6, message: '密码至少要6位', trigger: 'blur' }],
          newPassWord: [{ validator: checkPassword, min: 6, trigger: 'blur' },
            { min: 6, message: '密码至少要6位', trigger: 'blur' }],
          rePassWord: [{ validator: checkPassword, min: 6, trigger: 'blur' },
            { min: 6, message: '密码至少要6位', trigger: 'blur' }]
        }
      }
    },
    methods: {
      httpRequest() {

      },
      save() {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            if (this.params.oldPassWord === this.params.newPassWord) {
              this.$message.warning('新密码不可与旧密码一致')
              return
            }
            const temp = {}
            temp.oldPassWord = this.params.oldPassWord
            temp.newPassWord = this.params.newPassWord
            temp.rePassWord = this.params.rePassWord
            temp.headImg = this.params.headImg
            await resetUserPassWord(temp)
            this.$message.success('保存成功')
            this.closeTab()
            // this.$refs.form.clearValidate()
          }
        })
      }
    },
    async created() {
      this.params = await getUserInfo(this.$store.getters.userId)
    }
  }
</script>
<style lang="scss" scoped>
.avatar-middle{
  display: flex;
  justify-content: center;
}
</style>

<style lang="scss" >
// .avatar-uploader{
//   display: flex;
//   justify-content: center;
//   .el-upload {
//     width: 100px;
//     height: 100px;
//     border: 1px dashed #d9d9d9;
//     border-radius: 50%;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//     &:hover {
//       border-color: #409EFF;
//     }
//   }
//   .avatar-uploader-icon {
//     font-size: 28px;
//     color: #8c939d;
//     width: 100px;
//     height: 100px;
//     line-height: 100px;
//     text-align: center;
//   }
//   .avatar {
//     width: 100px;
//     height: 100px;
//     display: block;
//   }
// }
</style>
