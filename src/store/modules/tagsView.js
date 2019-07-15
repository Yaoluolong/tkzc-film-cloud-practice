const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      const topMenuName = view.matched[0].name
      if (!topMenuName) {
        console.error('没有找到顶级菜单')
        return
      }
      const findView = state.visitedViews.find(v => v.path === view.path)
      if (findView) {
        findView.fullPath = view.fullPath
        return
      }
      let title = view.meta.title
      if (view.params && view.params.operType) {
        let operName = ''
        switch (view.params.operType) {
          case 'create':operName = '新增'; break
          case 'edit':operName = '编辑'; break
          case 'look':operName = '查看'; break
        }
        if (view.meta.titles && view.meta.titles[view.params.operType]) {
          title = view.meta.titles[view.params.operType]
        } else { title = operName + view.meta.title }
      }
      // console.log('topMenuName', topMenuName)
      state.visitedViews.push({
        name: view.name,
        path: view.path,
        fullPath: view.fullPath,
        title: title || 'no-name',
        topMenuName
      })
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      for (let i = 0; i < state.cachedViews.length; i++) {
        const temp = state.cachedViews[i]
        if (temp === view.name) {
          state.cachedViews[i] = ''
        }
      }
      state.cachedViews = state.cachedViews.filter(e => e)
      // for (const i of state.cachedViews) {
      //   if (i === view.name) {
      //     const index = state.cachedViews.indexOf(i)
      //     state.cachedViews.splice(index, 1)
      //   }
      // }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, i + 1)
          break
        }
      }
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      state.cachedViews = []
    }
  },
  actions: {
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView
