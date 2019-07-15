<template>
  <div class="menu-plane-box">
    <div class="header">
      <span>{{title}}</span>
      <div>
        <el-button type="primary" @click="$emit('create',{title,parentId,level})" v-if="!selectDel">新增</el-button>
        <el-button type="danger" @click="deleteMenu">{{selectDel? '确认删除':'删除'}}</el-button>
        <el-button type="warning" v-if="selectDel" @click="selectDel=false">取消</el-button>
      </div>
    </div>
    <div class="content">
      <div class="menu-item" :class="{active:selectMenuId==menu.id}" v-for="(menu,index) in menus" :key="index" title="单击选择" @click="selectMenu(menu)">
        <el-checkbox v-model="menu.checked" v-if="selectDel">{{menu.name}}</el-checkbox>
        <span v-else>{{menu.name}}</span>
        <div class="oper">
          <switch-confirm v-model="menu.status" v-if="!selectDel" :id="menu.id" action="/systemApi/systemMenu/setStatus"></switch-confirm>
          <i class="el-icon-edit-outline" title="编辑" v-if="!selectDel" @click="$emit('edit',{title,id:menu.id,level})"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getMenuListByParentId, deleteMenu } from '@/api/systemSetting'
  export default {
    props: {
      title: String,
      parentId: String,
      level: String,
      value: [String, Number]
    },
    data() {
      return {
        menus: [],
        selectMenuId: '',
        selectDel: false // 进入删除状态
      }
    },
    watch: {
      parentId(val) {
        if (val === '-2') {
          this.menus = []
          this.$emit('input', '-2')
        } else {
          this.fetchMenu(val)
          this.$emit('input', '-2')
        }
      }
    },
    methods: {
      async fetchMenu() {
        this.menus = await getMenuListByParentId({ parentId: this.parentId, type: 1 })
        if (!this.menus.find(e => e.id === this.selectMenuId)) {
          this.$emit('input', '-2')
          this.selectMenuId = ''
        }
      },
      selectMenu(menu) {
        this.$emit('input', menu.id)
        this.selectMenuId = menu.id
      },
      async deleteMenu() {
        if (this.selectDel) {
          const checked = this.menus.filter(e => e.checked)
          const checkedIds = checked.map(e => e.id)
          if (checkedIds.length <= 0) {
            this.$message.warning('请勾选要删除的菜单')
            return
          }
          await deleteMenu(checkedIds.join(','))
          this.$message.success('删除成功')
          this.selectDel = false
          this.fetchMenu()
        } else {
          this.selectDel = true
        }
      }
    },
    created() {
      if (this.parentId === '0') { this.fetchMenu() }
    }
  }
</script>

<style scoped lang="scss">
.menu-plane-box{
  flex:1;
  .header{
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #F2F6FC;
    span{
      font-size: 16px;
      font-weight: bold;
    }
  }
  .content{
    padding: 20px;
  }
  .menu-item{
    cursor: pointer;
    height: 48px;
    border-bottom: 1px solid #EBEEF5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      font-size: 14px;
    }
    .el-icon-edit-outline{
       font-size: 20px;
       display: none;
    }
    .oper{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row-reverse;
      width: 75px;
    }
    &.active{
      border-bottom: 1px solid #409EFF;
      span{
        color:#409EFF;
      }
    }
    &:hover{
      border-bottom: 1px solid #409EFF;
      span{
        color:#409EFF;
      }
      .el-icon-edit-outline{
        display: block;
      }
    }
  }
}
</style>
