<template>
  <div class="app-container">
    <region-plane ref="menuPlane1" title="省/自治区/直辖市" level="1" v-model="level2parentId" parent-id="0" @edit="editMenu"></region-plane>
    <div class="split"></div>
    <region-plane ref="menuPlane2" title="地级市" level="2" v-model="level3parentId" isNeedInitials :parent-id="level2parentId"   @edit="editMenu"></region-plane>
    <div class="split"></div>
    <region-plane ref="menuPlane3" title="市辖区/县/县级市" level="3" v-model="level4parentId" :parent-id="level3parentId"  @edit="editMenu"></region-plane>
    <div class="split"></div>
    <region-plane ref="menuPlane4" title="乡/镇/街道" level="4" :parent-id="level4parentId"  @edit="editMenu"></region-plane>
    <edit-region ref="editMenu" @after-save="refreshMenu"></edit-region>
  </div>
</template>

<script>
  import RegionPlane from './RegionPlane'
  import EditRegion from './EditRegion'
  export default {
    name: 'menu_mgr',
    components: { RegionPlane, EditRegion },
    data() {
      return {
        level2parentId: '-2',
        level3parentId: '-2',
        level4parentId: '-2'
      }
    },
    methods: {
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
