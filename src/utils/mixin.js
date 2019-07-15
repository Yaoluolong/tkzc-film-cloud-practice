import Vue from 'vue'
Vue.mixin({
  props: {
    operType: String
  },
  data() {
    return {
      prePageRouteName: ''
    }
  },
  created() {
    // if (this.$route && this.$route.name && this.$options.name) {
    //   this.$options.name = this.$route.name
    // }
    this.$options.init && this.$options.init.call(this)
    // 监听回调广播
    if (this.$route && this.$route.name && this.$route.name === this.$options.name) {
      this.$root.$on(this.$route.name + '_callback', arg => {
        const methods = this.$options.methods
        if (methods) {
          if (methods.pageCallBack) {
            methods.pageCallBack.call(this, arg)
          } else if (methods.refreshTable) {
            methods.refreshTable.call(this, arg)
          }
        }
      })
    }
    if (this.$route && this.$route.name === this.$options.name && this.$root.prePageRouteName) {
      this.prePageRouteName = this.$root.prePageRouteName
    }
  },
  computed: {
    look() {
      return this.operType === 'look'
    },
    edit() {
      return this.operType === 'edit'
    },
    create() {
      return this.operType === 'create'
    }
  },
  methods: {
    resetFields(ref) {
      const refForm = this.$refs[ref]
      if (refForm && refForm.resetFields) {
        refForm.resetFields()
      }
    },
    refreshTable(ref) {
      const refTable = this.$refs[ref]
      if (refTable && refTable.resetFields) {
        refTable.refresh()
      }
    },
    closeTab(arg, route) {
      if (arg) {
        this.prePageCallBack(arg)
      }
      const latestView = this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1]

      var backUrl = ''
      for (var i = this.$store.state.tagsView.visitedViews.length - 1; i >= 0; i--) {
        if (latestView.path !== this.$store.state.tagsView.visitedViews[i].path) {
          if (latestView.path.indexOf(this.$store.state.tagsView.visitedViews[i].path) !== -1) {
            backUrl = this.$store.state.tagsView.visitedViews[i].path
            break
          }
        }
      }
      this.$store.dispatch('delVisitedViews', this.$route)
      if (backUrl) {
        this.$router.push(backUrl)
      } else {
        this.$router.push('/')
      }

      // 以下注释备注: 页面上跳转回刷新调到登录时页面 如: '/'
      /* const latestView = route || this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1]

      var backUrl = ''
      for (var i = this.$store.state.tagsView.visitedViews.length - 1; i >= 0; i--) {
        if (latestView.path !== this.$store.state.tagsView.visitedViews[i].path) {
          if (latestView.path.indexOf(this.$store.state.tagsView.visitedViews[i].path) !== -1) {
            backUrl = this.$store.state.tagsView.visitedViews[i].path
            break
          }
        }
      }
      this.$store.dispatch('delVisitedViews', this.$route)
      if (backUrl) {
        this.$router.push(backUrl)
      } else if (this.$store.state.tagsView.visitedViews.length > 1) {
        this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1])
      } else {
        this.$router.push('/')
      }*/
    },
    prePageCallBack(arg) {
      if (this.prePageRouteName) {
        // console.log(this.prePageRouteName + '_callback call')
        this.$root.$emit(this.prePageRouteName + '_callback', arg)
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name && vm.$route.name === vm.$options.name) {
        vm.$root.prePageRouteName = from.name
        vm.prePageRouteName = from.name
      }
    })
  },
  activated() {
    this.$options.init && this.$options.init.call(this)
    // if (this.$route.fullPath !== this.$fullPath) { this.$options.init && this.$options.init.call(this) }
    // this.$fullPath = this.$route.fullPath
  }
})
