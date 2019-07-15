import 'babel-polyfill'
import Vue from 'vue'
import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import '@/styles/element-ui.css'

import '@/styles/index.scss' // 全局CSS

import App from './App'
import router from './router'
import store from './store'
import request from '@/utils/request'

import '@/permission'

import '@/components'
import '@/utils/mixin'
import bus from '@/utils/bus'
Vue.use(ElementUI, { size: 'medium' })

Vue.config.productionTip = false

Vue.prototype.$request = request
// 原型链挂载
Object.defineProperties(Vue.prototype, {
  $bus: {
    value: bus
  }
})
import directives from '@/utils/directives'
Vue.use(directives)
// 初始化VUE所有资源(组件,路由,STORT)导入的入口
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// mock
if (process.env.NODE_ENV !== 'production') {
  require('@/api/mock')
}
