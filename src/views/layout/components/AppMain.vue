<template>
  <section class="app-main" ref="viewBox">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  watch: {
    $route: function(to, from) {
      // 页面初始滚动条要在顶部
      this.$refs.viewBox.scrollTop = 0
    }
  }
}
</script>
