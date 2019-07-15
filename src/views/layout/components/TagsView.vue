<template>
  <div class="tags-view-container">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <el-tabs v-model="activeTab" type="card" @tab-click="tabClick" closable @tab-remove="removeTab"  @contextmenu.prevent.native="openMenu($event)">
      <el-tab-pane :label="tag.title" :name="tag.path" v-for="tag in Array.from(visitedViews)" :key="tag.path"></el-tab-pane>
    </el-tabs>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px' , top:top-50+'px'}">
      <li @click="closeSelectedTag">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li></ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
export default {
  components: { Hamburger },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      activeTab: ''
    }
  },
  computed: {
    visitedViews() {
      const topMenuName = this.$route.matched[0].name
      return this.$store.state.tagsView.visitedViews.filter(e => e.topMenuName === topMenuName)
    },
    ...mapGetters([
      'sidebar'
    ]),
    currentTag() {
      return this.visitedViews.find(e => e.path === this.activeTab)
    }
  },
  watch: {
    $route() {
      this.addViewTags()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    tabClick() {
      this.$router.push(this.currentTag.fullPath)
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    addViewTags() {
      this.$store.dispatch('addVisitedViews', this.$route)
      this.activeTab = this.$route.path
    },
    removeTab(path) {
      this.selectedTag = this.visitedViews.find(e => e.path === path)
      this.closeSelectedTag()
    },
    closeSelectedTag() {
      if (this.visitedViews.length <= 1) {
        this.$message.warning('这是最后一个标签页了')
        return
      }
      this.$store.dispatch('delVisitedViews', this.selectedTag).then(views => {
        if (this.isActive(this.selectedTag)) {
          const latestView = this.visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.fullPath)
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.fullPath)
      this.$store.dispatch('delOthersViews', this.selectedTag)
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(e) {
      const path = e.target.id.replace('tab-', '')
      const selectedTag = this.visitedViews.find(e => e.path === path)
      if (selectedTag) {
        this.selectedTag = selectedTag
        this.visible = true
        this.left = e.clientX
        this.top = e.clientY
      }
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style  lang="scss" >
.tags-view-container {
  padding-top: 4px;
  display: flex;
  .hamburger-container{
    padding: 4px 0px 0px 20px;
    border-bottom: 1px solid #e4e7ed;
  }
  .el-tabs{
    flex:1;
  }
  .el-tabs__header{
    padding: 0 20px;
    margin-bottom: 0px;
    .el-tabs__nav{
      border-radius: 2px 2px 0 0;
    }
    .el-tabs__item{
      height: 30px;
      line-height:30px;
      // font-weight: bold;
      font-size: 12px;
      color:#606266;
      border-bottom:0;
      &.is-active{
        font-weight: bold;
        color:#303133;
        background-color: #e9eef3;
      }
      .el-icon-close{
        top:-2px;
      }
    }
    .el-tabs__nav-prev,.el-tabs__nav-next{
      line-height: 30px;
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
