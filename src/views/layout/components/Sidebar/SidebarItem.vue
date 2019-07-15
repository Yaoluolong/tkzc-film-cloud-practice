<template>
  <div class="menu-wrapper">
    <template v-for="(item,index)  in showRoutes" v-if="!item.hidden&&item.children">
      <router-link v-if="hasOneShowingChildren(item,item.children) && !item.children[0].children&&!item.alwaysShow" :to="topPath+'/'+item.path+'/'+item.children[0].path"
        :key="item.children[0].path">
        <el-menu-item :index="topPath+'/'+item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <i v-if="item.children[0].meta&&item.children[0].meta.icon" :class="'el-icon-'+item.children[0].meta.icon"  class="main-icon" :style="iconColorStyle(index)" ></i>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.path">
        <template slot="title">
          <i v-if="item.meta&&item.meta.icon" :class="'el-icon-'+item.meta.icon"  class="main-icon" :style="iconColorStyle(index)" ></i>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="topPath+'/'+item.path+'/'+child.path" :key="child.path">
            <el-menu-item :index="topPath+'/'+item.path+'/'+child.path">
              <i v-if="child.meta&&child.meta.icon" :class="'el-icon-'+child.meta.icon"></i>
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      topPath: ''
    }
  },
  computed: {
    showRoutes() {
      this.topPath = this.$route.matched[0].path
      if (this.routes.length > 0) {
        const foundRoute = this.routes.find(e => e.path === this.topPath)
        if (foundRoute) {
          return foundRoute.children
        }
      }
      return []
    }
  },
  methods: {
    hasOneShowingChildren(item, children) {
      // const showingChildren = children.filter(item => {
      //   return !item.hidden
      // })
      // if (showingChildren.length === 1) {
      //   children[0].meta.icon = item.meta.icon
      //   return true
      // }
      return false
    },
    iconColorStyle(index) {
      const colors = ['#fb762b', '#f3a223', '#615daa', '#fa575e', '#f79f08', '#3ca0ec', '#d5a08b', '#5eb95a', '#bd80aa', '#78d5c5']
      return {
        backgroundColor: colors[index % (colors.length - 1)]
      }
    }
  }
}
</script>
