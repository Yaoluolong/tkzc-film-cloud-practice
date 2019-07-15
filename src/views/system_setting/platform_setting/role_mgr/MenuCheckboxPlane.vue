<template>
  <div class="menu-checkbox-plane">
    <div class="header">
      <el-checkbox v-if="selectAll" @change="doSelectAll" v-model="menu.checked" >{{menu.name}}</el-checkbox>
      <span v-else>{{menu.name}}</span>
    </div>
    <div class="content">
      <div class="check-item" v-for="(menu,index) in menu.children" :key="index">
        <el-checkbox v-model="menu.checked"  @change="doSelect($event,menu)">{{menu.name}}</el-checkbox>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      selectAll: Boolean,
      menu: {
        type: Object,
        default: function() {
          return {}
        }
      },
      selectedIds: Array,
      title: String
    },
    data() {
      return {
        isInit: false
      }
    },
    computed: {
      checkedIds() {
        const checkedmenu = this.menu.children.filter(e => e.checked)
        return checkedmenu.map(e => e.id)
      }
    },
    watch: {
      selectedIds() {
        this.init()
      },
      menu() {
        this.init()
      }
    },
    methods: {
      doSelectAll(val) {
        this.menu.children && this.menu.children.forEach(e => {
          this.$set(e, 'checked', val)
        })
        this.$nextTick(() => {
          this.$emit('change', this.checkedIds, val)
        })
      },
      doSelect(val, menu) {
        if (!val) {
          const index = this.selectedIds.findIndex(e => e === menu.id)
          if (index > -1) {
            this.selectedIds.splice(index, 1)
          }
        }
        if (val) {
          this.menu.checked = true
        }
        if (!val && !this.menu.children.find(e => e.checked)) {
          this.menu.checked = false
        }
        this.$nextTick(() => {
          this.$emit('change', this.checkedIds)
        })
      },
      init() {
        if (this.selectedIds) {
          if (this.selectedIds.indexOf(this.menu.id) > -1) {
            this.$set(this.menu, 'checked', true)
          }
          this.menu.children && this.menu.children.forEach(e => {
            const found = this.selectedIds.find(id => e.id === id)
            if (found) {
              this.$set(e, 'checked', true)
            }
          })
          // this.$emit('change', this.checkedIds)
        }
      }
    },
    created() {
      this.init()
    }
  }
</script>

<style scoped lang="scss">
.menu-checkbox-plane{
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
}
.header{
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #F2F6FC;
  padding: 0 20px;
  border-bottom:  1px solid #DCDFE6;
}
.content{
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  .check-item{
    width: auto;
    min-width: 120px;
    overflow: hidden;
    margin-bottom: 10px;
    margin-left: 20px;
  }
}
</style>
