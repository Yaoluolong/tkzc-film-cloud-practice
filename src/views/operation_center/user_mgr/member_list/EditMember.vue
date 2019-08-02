<template>
  <div class="app-container">
    <el-form label-width="120px" style="width:600px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="手机号码" prop="userName">
        <el-input clearable v-model="params.mobile" placeholder="请输入手机号码" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="realName">
        <!-- <el-radio v-model="params.sex" label="" >保密</el-radio> -->
        <el-radio v-model="params.sex" label="1">男</el-radio>
        <el-radio v-model="params.sex" label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="生日" prop="email">
        <el-date-picker
          v-model="params.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="城市" prop="roleId">
        <city-cascader v-model="area" :rang="1" :clearable="true" style="width:220px"></city-cascader>
      </el-form-item>
      <el-form-item label="新密码" prop="passWord">
        <el-input
          clearable
          v-model.trim="params.passWord"
          type="password"
          placeholder="请输入登录密码"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassWord">
        <el-input
          clearable
          v-model.trim="params.rePassWord"
          type="password"
          placeholder="请输入确认密码"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="账户启用状态" prop="remark">
        <el-switch v-model="params.status" active-value="1" inactive-value="2"></el-switch>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="closeTab">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CityCascader from '@/components/CityCascader'
import { getMemberInfo, updateMember } from '@/api/operationCenter'
export default {
  name: 'edit_member',
  components: { CityCascader },
  data() {
    return {
      params: {},
      area: [],
      rules: {}
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const params = Object.assign({}, this.params)
          if (this.area) {
            this.area[0] && (params.provinceId = this.area[0])
            this.area[1] && (params.cityId = this.area[1])
          }

          await updateMember(params)
          this.$message.success('保存成功')
          // this.$refs.form.clearValidate()
          this.closeTab(true)
        }
      })
    }
  },
  async created() {
    // 编辑
    if (this.$route.query.id) {
      this.params = await getMemberInfo(this.$route.query.id)
      this.area = [this.params.provinceId, this.params.cityId].filter(
        item => item
      )
    }
  }
}
</script>

<style scoped lang="scss">
.sub-menu {
  margin: 10px;
}
</style>
