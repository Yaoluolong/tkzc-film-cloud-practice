<template>
  <div class="app-container">
    <menu-plane ref="menuPlane1" title="一级菜单" level="1" v-model="level2parentId" parent-id="0" @create="createMenu"  @edit="editMenu"></menu-plane>
    <div class="split"></div>
    <menu-plane ref="menuPlane2" title="二级菜单" level="2" v-model="level3parentId" :parent-id="level2parentId" @create="createMenu"  @edit="editMenu"></menu-plane>
    <div class="split"></div>
    <menu-plane ref="menuPlane3" title="三级菜单" level="3" :parent-id="level3parentId" @create="createMenu"  @edit="editMenu"></menu-plane>
    <edit-menu ref="editMenu" @after-save="refreshMenu"></edit-menu>
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
        level2parentId: '-2',
        level3parentId: '-2'
      }
    },
    methods: {
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
      refreshMenu(level) {
        this.$refs['menuPlane' + level].fetchMenu()
      }
    }
  }
</script>

<style scoped lang="scss">
.app-container{
  display: flex;
}
.split{
  width: 1px;
  background-color: #E4E7ED;
}
</style>
