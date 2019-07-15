<template>
  <el-menu class="navbar" mode="horizontal" :default-active="$route.matched[0].path">
    <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
    <!-- <breadcrumb></breadcrumb> -->
    <div class="navbg" />
    <li class="logo menu-wapper" style="float: left;width: 250px;">
      <img src="~@/assets/layout/logo.png" />
      <!-- <span class="logo-text">最 美 影 云</span> -->
    </li>
    <el-menu-item
      :index="item.path"
      @click="menuClick(item)"
      v-for="item in permission_routers"
      v-if="!item.hidden&&item.children"
      :key="item.path"
    >{{item.meta.title}}</el-menu-item>
    <li class="menu-wapper split">
      <i class="el-icon-logout" title="安全退出" @click="logout"></i>
    </li>
    <li class="menu-wapper split">
      <i class="el-icon-msg" title="我的消息" @click="$router.push({name:'message_list'})"></i>
    </li>
    <li class="menu-wapper split">
      <i class="el-icon-clean" title="清楚缓存" @click="clearCache"></i>
    </li>
    <li class="avatar-container menu-wapper">
      <img class="user-avatar" :src="avatar" v-default-img />
      <span class="user-name">{{name}}</span>
    </li>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { clearCache } from '@/api/systemSetting'
export default {
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name', 'permission_routers'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    menuClick(item) {
      let path = item.path
      const currentViews = this.$store.state.tagsView.visitedViews.filter(
        e => e.topMenuName === item.name
      )
      if (currentViews.length > 0) {
        path = currentViews[currentViews.length - 1].fullPath
      }
      this.$router.push(path)
    },
    async clearCache() {
      const loading = this.$loading({
        lock: true,
        text: '正在清楚缓存',
        spinner: 'el-icon-loading'
      })
      try {
        await clearCache()
        this.$message.success('清除成功')
        loading.close()
      } catch (error) {
        loading.close()
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
.navbar {
  height: 60px;
  line-height: 60px;
  border-radius: 0px !important;
  position: relative;
  background: linear-gradient(to bottom right, #2973e9, #2ba4ea);
  border-bottom: 0px;
  .logo-text {
    font-size: 22px;
    color: #fff;
    font-weight: bold;
    width: 210px;
  }
  .navbg {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: url("~@/assets/layout/nav_bg.png");
    background-size: auto 100%;
  }
  .hamburger-container {
    line-height: 68px;
    height: 60px;
    float: left;
    padding: 0 10px;
    color: #fff;
  }
  .menu-wapper {
    height: 60px;
    display: flex;
    align-items: center;
    float: right;
    padding: 0 20px;
    position: relative;
    i {
      font-size: 22px;
      cursor: pointer;
      color: #fff;
    }
    &.split {
      &:before {
        position: absolute;
        content: " ";
        display: inline-block;
        height: 24px;
        width: 1px;
        background-color: rgba(255, 255, 255, 0.3);
        left: 0px;
      }
    }
  }
  .avatar-container {
    float: right;
    .user-avatar {
      height: 32px;
      width: 32px;
      border-radius: 50%;
    }
    .user-name {
      margin-left: 10px;
      font-size: 14px;
      font-weight: 200;
      color: #fff;
    }
  }
}
</style>
<style  lang="scss">
.navbar {
  .el-badge__content.is-fixed {
    top: 22px;
    right: 8px;
  }
  .el-badge__content {
    border: 0;
  }
  .el-menu-item {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    border-bottom: 0px;
    letter-spacing: 2px;
    &.is-active,
    &:focus {
      color: rgba(255, 255, 255, 0.9) !important;
      font-weight: 600;
      background-color: rgba(255, 255, 255, 0.2) !important;
      border-bottom: 0px;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
      color: rgba(255, 255, 255, 0.9) !important;
    }
  }
}
</style>
