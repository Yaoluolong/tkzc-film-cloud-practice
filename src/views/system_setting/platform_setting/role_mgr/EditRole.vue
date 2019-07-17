<template>
  <div class="app-container">
    <el-form label-width="120px"  style="width:1000px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName" v-if="!isPermissionSetting&&!isUserPermission">
        <el-input v-model="params.roleName" placeholder="请输入角色名称,最多10个字"  style="width:320px"></el-input>
      </el-form-item>
      <el-form-item label="职能描述" prop="roleDesc" v-if="!isPermissionSetting&&!isUserPermission">
        <el-input v-model="params.roleDesc"  type="textarea"  :rows="4" maxlength="100"  placeholder="请输入内容" ></el-input>
      </el-form-item>
      <el-form-item label="开通模块">
        <menu-checkbox-plane  :menu="{name:'一级菜单',children:topMenus}" @change="fetchSubMenus"  :selected-ids="params.menuIds"></menu-checkbox-plane>
      </el-form-item>
      <el-form-item label="开通功能" >
        <menu-checkbox-plane :menu="{name:'选择全部',children:[]}" title="选择全部" select-all :selected-ids="[]" @change="selectAllSubMenus" class="select-all">
           <menu-checkbox-plane  class="sub-menu" :menu="subMenu" select-all :selected-ids="params.menuIds" v-for="(subMenu,index) in subMenus" :key="index"></menu-checkbox-plane>
        </menu-checkbox-plane>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="closeTab" >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MenuCheckboxPlane from './MenuCheckboxPlane'
import { getMenuListByParentIds, getMenuListByParentId, getRoleInfo, createRole, updateRole, getPermissionsInfo, updateUserPermission } from '@/api/systemSetting'
export default {
  name: 'edit_role',
  components: { MenuCheckboxPlane },
  data() {
    return {
      params: {
        menuIds: []
      },
      topMenus: [],
      subMenus: [],
      rules: {
        roleName: { required: true, max: 10, message: '请输入角色名称,最多10个字', trigger: 'blur' }
      },
      isPermissionSetting: false,
      isUserPermission: false
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const params = Object.assign({}, this.params)
          params.menuIds = this.topMenus.filter(e => e.checked).map(e => e.id)
          params.menuIds = params.menuIds.concat(this.subMenus.filter(e => e.checked).map(e => e.id))
          this.subMenus.forEach(e => {
            if (e.children) {
              params.menuIds = params.menuIds.concat(e.children.filter(e => e.checked).map(e => e.id))
            }
          })
          // console.log('kkk', params.menuIds)
          if (this.$refs.menu) {
            this.$refs.menu.forEach(e => {
              params.menuIds = params.menuIds.concat(e.checkedIds)
            })
          }
          params.menuIds = params.menuIds.join(',')
          delete params.updateTime // 删除非必要参数
          if (this.isUserPermission) {
            const temp = {}
            temp.menuIds = params.menuIds
            temp.userId = params.userId
            await updateUserPermission(temp)
          } else {
            await (params.id ? updateRole(params) : createRole(params))
          }
          this.$message.success('保存成功')
          // this.$refs.form.clearValidate()
          this.closeTab(true)
        }
      })
    },
    async fetchSubMenus() {
      const menuIds = this.topMenus.filter(e => e.checked).map(e => e.id)
      // console.log('ddfsf', menuIds)
      if (menuIds.length === 0) {
        this.subMenus = []
      } else {
        const subMenus = await getMenuListByParentIds(menuIds)
        let subIds = []
        subMenus.forEach(e => {
          if (e.children && e.children.length) {
            subIds = subIds.concat(e.children.map(k => k.id))
          }
        })
        const subMenus2 = await getMenuListByParentIds(subIds)
        let allSubMenu = []
        subMenus.forEach(e => {
          // 如果没有子菜单不会显示在列表中
          if (e.children && e.children.length) {
            e.children.forEach(k => {
              const foundMenu = subMenus2.find(p => p.id === k.id)
              if (foundMenu) {
                foundMenu.name = e.name + '---' + foundMenu.name
                allSubMenu.push(foundMenu)
              }
            })
          }
        })
        if (this.subMenus.length > allSubMenu.length) {
          // 在原子菜单中删除掉已经排除的子菜单
          this.subMenus = this.subMenus.filter(e => {
            let flag = false
            allSubMenu.forEach(el => {
              if (e.id === el.id) {
                flag = true
              }
            })
            return flag
          })
        } else { // 在原菜单的基础上新增菜单
          allSubMenu = allSubMenu.filter(e => {
            let flag = true
            this.subMenus.forEach(el => {
              if (e.id === el.id) {
                flag = false
              }
            })
            return flag
          })
          this.subMenus = [...(this.subMenus), ...allSubMenu]
        }
      }
    },
    selectAllSubMenus(ids, val) {
      this.subMenus.forEach(e => {
        this.$set(e, 'checked', val)
        e.children && e.children.forEach(k => {
          this.$set(k, 'checked', val)
        })
      })
    }
  },
  async created() {
    if (this.operType === 'permission_setting') {
      this.isPermissionSetting = true
    }
    if (this.$route.meta.isUserPermission) {
      this.isUserPermission = true
    }
    // 获取第一级菜单
    this.topMenus = await getMenuListByParentId({ parentId: '0', type: this.$route.query.type })
    // 编辑
    if (this.isUserPermission) {
      const params = await getPermissionsInfo(this.$route.query.id)
      params.menuIds = params.menuIds ? params.menuIds.split(',') : []
      params.userId = params.id
      this.params = params
      this.$nextTick(() => {
        this.fetchSubMenus()
      })
    } else if (this.$route.query.id) {
      const params = await getRoleInfo(this.$route.query.id)
      params.menuIds = params.menuIds ? params.menuIds.split(',') : []
      this.params = params
      this.$nextTick(() => {
        this.fetchSubMenus()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.sub-menu{
  margin: 10px;
}
</style>
<style lang="scss">
.select-all{
  >.content{
    flex-direction: column;
  }
}
</style>
