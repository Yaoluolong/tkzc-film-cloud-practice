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
  <el-form label-width="80px" :model="params" :rules="rules" ref='form' :validate-on-rule-change="false">
      <el-form-item label="公司名称" prop="name">
          <el-input v-model="params.name" placeholder="请输入公司名称" clearable class="w230"></el-input>
      </el-form-item>
  </el-form>
    <div slot="footer" class="dialog-footer tr">
      <el-button @click="closePanel">取消</el-button>
      <el-button type="primary" @click="onSaveClick">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import zmSelect from '@/components/isNeedComponents/zmSelect'
import { createCompany, updateCompany } from '@/api/systemSetting'
export default {
  components: { zmSelect },
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
          name: ''
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
        name: { required: true, message: '请输入公司名称', trigger: 'blur' }
      }
    }
  },
  created() {
    if (this.id) this.getInfo()
  },
  methods: {
    getInfo() {
      this.params.name = this.newParams.name
    },
    closePanel() {
      this.$emit('cancel')
    },
    async onSaveClick() {
      const valid = await this.$refs.form.validate()
      if (!valid) return
      const params = { ...this.params }
      if (this.id) params.id = this.id
      this.id ? await updateCompany(params) : createCompany(params)
      this.$message.success('保存成功')
      this.$emit('save-after')
    }
  }
}
</script>
