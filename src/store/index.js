import Vue from 'vue'
import 'babel-polyfill'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import socket from './modules/socket'
import getters from './getters'
import permission from './modules/permission'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    socket,
    tagsView
  },
  getters
})

export default store
