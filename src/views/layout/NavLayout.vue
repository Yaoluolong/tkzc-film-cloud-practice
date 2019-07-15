<template>
  <div class="app-wrapper">
    <navbar></navbar>   <!-- 导航头 -->
    <keep-alive >
      <router-view></router-view>     <!-- 根据导航头显示对应的侧边栏与主窗口 -->
    </keep-alive>
  </div>
</template>

<script>
import { Navbar } from './components'
export default {
  name: 'navlayout',
  components: { Navbar },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.matched[0].path
    // }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
