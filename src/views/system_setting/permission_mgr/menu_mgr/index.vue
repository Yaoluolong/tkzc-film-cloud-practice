<template>
  <div class="app-container col">
    <el-tabs v-model="activeTab" @tab-click="onSearch">
      <el-tab-pane
        v-for="(item,index) in  tabsList"
        :key="index"
        :label="item.label"
        :name="item.value"
      ></el-tab-pane>
    </el-tabs>
    <div class="df">
    <menu-plane
      ref="menuPlane1"
      title="一级菜单"
      level="1"
      v-model="level2parentId"
      parent-id="0"
      :active-tab="activeTab"
      @create="createMenu"
      @edit="editMenu"
    ></menu-plane>
    <div class="split"></div>
    <menu-plane
      ref="menuPlane2"
      title="二级菜单"
      level="2"
      v-model="level3parentId"
      :parent-id="level2parentId"
      :active-tab="activeTab"
      @create="createMenu"
      @edit="editMenu"
    ></menu-plane>
    <div class="split"></div>
    <menu-plane
      ref="menuPlane3"
      title="三级菜单"
      level="3"
      :parent-id="level3parentId"
      :active-tab="activeTab"
      @create="createMenu"
      @edit="editMenu"
    ></menu-plane>
    <edit-menu ref="editMenu" :active-tab="activeTab" @after-save="refreshMenu"></edit-menu>
    </div>
  </div>
</template>

<script>
import MenuPlane from './MenuPlane'
import EditMenu from './EditMenu'
export default {
  name: 'menu_mgr',
  components: { MenuPlane, EditMenu },
  data() {
    return {
      activeTab: '1',
      tabsList: [
        {
          label: '平台菜单',
          value: '1'
        },
        {
          label: '卡券分销商菜单',
          value: '2'
        },
        {
          label: '渠道商户菜单',
          value: '3'
        },
        {
          label: '影院菜单',
          value: '4'
        }
      ],
      level2parentId: '-2',
      level3parentId: '-2'
    }
  },
  methods: {
    onSearch() {
      this.refreshMenu('1')
      const level = ['1', '2', '3']
      level.forEach(e => {
        this.clearChildMenu(e, e === '1')
      })
    },
    createMenu(info) {
      if (info.parentId === '-2') {
        this.$message.warning('请选选择上级菜单')
        return
      }
      info.title = '新增' + info.title
      this.$refs.editMenu.show(info)
    },
    editMenu(info) {
      console.log('ddd', info)
      info.title = '编辑' + info.title
      this.$refs.editMenu.show(info)
    },
    clearChildMenu(level, boolean) {
      this.$refs['menuPlane' + level].clearMenu(boolean)
    },
    refreshMenu(level) {
      this.$refs['menuPlane' + level].fetchMenu(this.activeTab)
    }
  }
}
</script>

<style scoped lang="scss">
// .app-container {
//   display: flex;
// }
.split {
  width: 1px;
  background-color: #e4e7ed;
}
</style>
