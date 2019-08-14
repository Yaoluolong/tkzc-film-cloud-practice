const type = {
  MESSAGE_COUNT: 'MESSAGE_COUNT',
  MESSAGE: 'MESSAGE'
}
export default {
  state: {
    message: {},
    messageCount: 0
  },
  actions: {
    setMessageCount({ commit }, data) {
      commit(type.MESSAGE_COUNT, data)
    },
    setMessage({ commit }, data) {
      commit(type.MESSAGE, data)
    }
  },
  mutations: {
    [type.MESSAGE_COUNT]: (state, count) => {
      state.messageCount = count
    },
    [type.MESSAGE](state, message) {
      state.message = message
    }
  }
}
