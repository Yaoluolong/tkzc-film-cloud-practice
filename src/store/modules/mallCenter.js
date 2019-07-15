const mallCenter = {
  state: {
    cinemaList: [],
    channelList: []
  },
  mutations: {
    UPDATE_CINEMA_LIST: (state, cinemaList) => {
      state.cinemaList = cinemaList
    },
    UPDATE_CHANNEL_LIST: (state, channelList) => {
      state.channelList = channelList
    }
  },
  actions: {

  }
}

export default mallCenter
