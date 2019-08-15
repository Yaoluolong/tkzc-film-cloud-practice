<!-- 所有页面的入口组件 -->
<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import webSocketMixin from '@/mixins/webSocketMixin'
export default {
  name: 'App',
  mixins: [webSocketMixin],
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  created() {
    console.log(this.$bus)
    this.$bus.$on('$$readMessage', this.readMessage)
    this.initWebSocket()
  },
  methods: {
    ...mapActions(['setMessageCount', 'setMessage']),
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    webSocketOnMessage(e) {
      console.log('获取', e)
      const obj = e && e.data && JSON.parse(e.data)
      const data = obj.data
      if (data) {
        this.setMessage(data.list)
        this.setMessageCount(data.count)
      }
      console.log(data)
    },
    readMessage(data) {
      this.webSocketSend(data)
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/size.scss";
</style>
