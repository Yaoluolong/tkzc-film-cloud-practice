<template>
  <!-- <div class="login-container"  v-loading="loading" element-loading-text="登录中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="middle-plane">
      <div class="inner-middle-plane">
        <div class="title">{{titleWapper.title}}</div>
        <div class="subtitle">{{titleWapper.subtitle}}</div>
        <div style="margin-top:20px">
          <div v-if="index" class="button-list">
            <el-button type="primary" size="large" @click="$router.push('/login/platform')">平 台 登 录</el-button>
            <el-button  type="primary"  size="large" @click="$router.push('/login/mall')">商 户 登 录</el-button>
          </div>
          <el-form v-else inline ref="loginForm" :rules="loginRules" :model="loginForm">
            <el-form-item prop="username">
              <el-input clearable  class="username-input" size="large" prefix-icon="el-icon-yonghu" v-model="loginForm.username" placeholder="请输入用户名称">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input clearable  class="password-input" size="large" type="password"  prefix-icon="el-icon-lock"  v-model="loginForm.password" placeholder="请输入登入密码">
              </el-input>
            </el-form-item>
            <el-form-item>
              <i class="el-icon-login login-button" title="登录" :disabled="loading" @click="handleLogin"></i>
            </el-form-item>
          </el-form>

        </div>
      </div>
    </div>
  </div> -->
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title">{{titleWapper.title}}</div>
      <div class="subtitle" v-if="titleWapper.subtitle">{{titleWapper.subtitle}}</div>
      <div v-if="index" class="login-type-wapper">
        <el-button type="primary" icon="el-icon-pingtai" @click="$router.push('/login/platform')">平 台 登 录</el-button>
        <el-button  type="primary" icon="el-icon-shanghu" @click="$router.push('/login/mall')">商 户 登 录</el-button>
      </div>
      <template v-else>
        <el-form-item prop="username">
          <el-input clearable   type="text" prefix-icon="el-icon-user" v-model="loginForm.username" size="large" auto-complete="on" placeholder="账 号" /></el-form-item>
        <el-form-item prop="password">
          <el-input clearable   type="password" prefix-icon="el-icon-mima"  @keyup.enter.native="handleLogin" size="large" v-model="loginForm.password" auto-complete="on" placeholder="密 码" /></el-form-item>
        <!-- <el-form-item class="forget-plane">
          <el-checkbox style="float:left;color:#606266">记住密码</el-checkbox>
          <el-button style="float:right" type="text">忘记密码?</el-button>
        </el-form-item> -->
        <el-form-item>
        <el-button type="primary" class="login-btn"  :loading="loading" @click.native.prevent="handleLogin">登 录</el-button></el-form-item>
      </template>
    </el-form>
    <img src="~@/assets/user/logo.png" class="logo">
  </div>
</template>

<script>
export default {
  name: 'login',
  props: {
    operType: String
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  computed: {
    index() {
      return this.operType === 'index'
    },
    platform() {
      return this.operType === 'platform'
    },
    mall() {
      return this.operType === 'mall'
    },
    titleWapper() {
      if (this.index) {
        return {
          title: '最美影云',
          subtitle: 'The most beautiful shadow Cloud'
        }
      } else if (this.platform) {
        return {
          title: '最美影云平台中心',
          subtitle: 'Most beautiful shadow cloud platform center'
        }
      } else if (this.mall) {
        return {
          title: '最美影云商户数据中心',
          subtitle: 'Most beautiful cloud business data center'
        }
      }
      return {
        title: '最美影云',
        subtitle: 'The most beautiful shadow Cloud'
      }
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.type = this.platform ? 1 : 2
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            window.sessionStorage.removeItem('toLogin')
            window.localStorage.setItem('hash', window.location.hash.replace('#', ''))
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-container{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-image: url('~@/assets/user/login_bg.jpg');
  background-size: 100% 100%;
  .login-form{
    background-color: #fff;
    border-radius: 4px;
    padding: 30px 60px;
    width: 450px;
  }
  .el-input__inner{
    padding-left: 36px;
  }
  .el-input__icon{
    font-size: 20px;
  }
  .login-btn{
    width: 100%;
    font-size: 20px;
    font-weight: 200;
  }
  .title,.subtitle{
    text-align: center;
    font-size: 24px;
    color:#3ca0ec;
    margin-bottom: 40px;
    font-weight: 200;
  }
  .subtitle{
    margin-top: -30px;
    font-size: 12px;
  }
  .logo{
    position: absolute;
    top: 40px;
    left: 100px;
  }
  .forget-plane{
    margin-bottom:8px;
    margin-top: -2px;
  }
  .login-type-wapper{
    display: flex;
    flex-direction: column;
    .el-button{
      margin: 20px 0px;
      font-size: 20px;
      font-weight: 200;
      span{
        margin-left: 8px;
      }
    }
  }
}

</style>
