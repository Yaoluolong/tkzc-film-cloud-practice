<template>
   <el-dialog
    width="500px"
    append-to-body
    :title="title+'公司'"
    :close-on-click-modal="false"
    :visible="value"
    class="dialogContainer"
    @close="closePanel"
  >
  <el-form label-width="80px" :model="params" :rules="rules" ref='form'>
      <el-form-item label="客户名称" prop="name">
          <el-input v-model="params.name" placeholder="请输入客户名称" clearable class="w230"></el-input>
      </el-form-item>
      <el-form-item label="上传图标" prop="logoImg">
         <pic-upload  v-model="params.logoImg"></pic-upload>
      </el-form-item>
  </el-form>
    <div slot="footer" class="dialog-footer tr">
      <el-button @click="closePanel">取消</el-button>
      <el-button type="primary" @click="onSaveClick">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createCustomer, updateCustomer } from '@/api/systemSetting'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: [String, Number],
    newParams: {
      type: Object,
      default() {
        return {
          name: '',
          logoImg: ''
        }
      }
    }
  },
  computed: {
    title() {
      return this.id ? '编辑' : '新建'
    }
  },
  data() {
    return {
      params: {
        name: ''
      },
      rules: {
        name: { required: true, message: '请输入客户名称', trigger: 'blur' }
      }
    }
  },
  created() {
    if (this.id) this.getInfo()
  },
  methods: {
    getInfo() {
      this.params = Object.assign({}, this.params, this.newParams)
    },
    closePanel() {
      this.$emit('cancel')
    },
    async onSaveClick() {
      const valid = await this.$refs.form.validate()
      if (!valid) return
      const params = { ...this.params }
      params.id = this.id || ''
      this.id ? await updateCustomer(params) : createCustomer(params)
      this.$message.success('保存成功')
      this.$emit('save-after')
    }
  }
}
</script>
