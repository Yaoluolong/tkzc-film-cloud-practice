<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="600px"
    @close="resetFields('form')"
  >
    <el-form label-width="120px" :model="params" :rules="rules" ref="form">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input clearable  v-model.trim="params.menuName" placeholder="请输入菜单名称,最多9个字"></el-input>
      </el-form-item>
      <el-form-item label="菜单地址" prop="menuUrl">
        <el-input clearable  v-model.trim="params.menuUrl" placeholder="请输入菜单访问地址"></el-input>
      </el-form-item>
      <el-form-item label="菜单同级序号" prop="sort">
        <el-input-number clearable v-model.trim="params.sort"></el-input-number>
      </el-form-item>
      <el-form-item label="菜单状态" prop="status">
        <el-radio v-model="params.status" label="1">启用</el-radio>
        <el-radio v-model="params.status" label="2">停用</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
      <el-button @click="hide">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getMenuInfo, createMenu, updateMenu } from '@/api/systemSetting'
export default {
  name: 'edit-menu',
  props: {
    activeTab: String
  },
  data() {
    return {
      params: {
        status: '1'
      },
      dialogVisible: false,
      title: '',
      level: '',
      rules: {
        menuName: {
          required: true,
          max: 9,
          message: '请输入菜单名称,最多9个字',
          trigger: 'blur'
        },
        menuUrl: {
          required: true,
          message: '请输入菜单访问地址',
          trigger: 'blur'
        },
        sort: { required: true, message: '菜单同级序号', trigger: 'blur' },
        status: { required: true, message: '请选择菜单状态', trigger: 'blur' }
      }
    }
  },
  methods: {
    async show({ title, parentId, id, level }) {
      this.title = title
      this.level = level
      this.dialogVisible = true
      this.params = {
        status: '1',
        parentId,
        position: level,
        type: this.activeTab
      }
      if (id) {
        this.params = await getMenuInfo(id)
      }
    },
    hide() {
      this.dialogVisible = false
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await (this.params.id
            ? updateMenu(this.params)
            : createMenu(this.params))
          this.$message.success('保存成功')
          this.$emit('after-save', this.level)
          this.hide()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>

