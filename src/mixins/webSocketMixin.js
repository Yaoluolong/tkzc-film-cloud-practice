// import { mapState, mapActions } from 'vuex'
import { mapGetters } from 'vuex'
// import { flow } from '@/api'
const webSocketUrl = 'ws://47.105.116.91:9501'
export default {
  data() {
    return {
      webSock: null,
      connectTime: 0,
      user: {
        name: 'agan',
        address: '福州'
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
  },
  methods: {
    initWebSocket() {
      if ('WebSocket' in window) {
        // 初始化weosocket
        this.webSock = new WebSocket(webSocketUrl)
        this.webSock.onmessage = this.webSocketOnMessage
        this.webSock.onopen = this.webSocketOnOpen
        this.webSock.onerror = this.webSocketOnError
        this.webSock.onclose = this.webSocketClose
        this.connectTime++
      } else {
        this.$comfirm('您的浏览器不支持WebSocket!', 'warning')
      }
    },
    webSocketOnOpen(e) {
      // 连接建立之后执行send方法发送数据
      console.log(this.webSock.readyState)
      console.log('webSocket链接成功！', e)
      this.webSocketSend({})
    },
    webSocketOnError(e) {
      // 连接建立失败重连
      console.log('error', e)
      if (this.connectTime > 5) {
        this.initWebSocket()
      } else {
        this.connectTime = 0
        this.$message({
          showClose: true,
          message: '已经尝试5次连接webSocket，都失败了!',
          type: 'error'
        })
      }
    },
    webSocketOnMessage(e) {
      console.log('接收到的数据', e) // JSON.parse(e.data)
    },
    webSocketSend(data) {
      // 数据发送
      this.webSock.send(JSON.stringify({ tokenId: this.token, ...data }))
    },
    webSocketClose(e) {
      // 关闭
      console.log('断开连接', e)
      // this.webSock.close()
    }
  }
}
