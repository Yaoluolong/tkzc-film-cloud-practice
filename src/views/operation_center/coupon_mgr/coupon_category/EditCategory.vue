<template>
  <div class="app-container">
    <el-form label-width="120px"  style="width:650px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="电影券名称" prop="name" >
          <el-input clearable v-model="params.name" placeholder="请输入电影券名称,最多20个字"></el-input>
      </el-form-item>
      <el-form-item label="电影券类型" prop="type">
        <remote-select v-model="params.type" clearable placeholder="请选择电影券类型" action="/systemApi/dict/getList" :query="{type:'couponType'}" ></remote-select>
      </el-form-item>
      <el-form-item label="消费对象" prop="consumeTarget">
        <el-radio v-model="params.consumeTarget" label="1" >电影</el-radio>
      </el-form-item>
      <el-form-item label="消费方式" prop="consumeType">
        <el-radio v-model="params.consumeType" label="1" >线上电影券</el-radio>
        <el-radio v-model="params.consumeType" label="2" >线下电影券</el-radio>
      </el-form-item>
      <el-form-item label="适用商家" prop="apiPassword">

      </el-form-item>
      <el-form-item label="兑换细则" prop="otherInfo">
        <el-input clearable v-model="params.otherInfo"  type="textarea"  :rows="4"  placeholder="请输入内容" ></el-input>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="save" v-if="!look">保存</el-button>
        <el-button @click="closeTab" >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createCouponType, updateCouponType, getCouponTypeInfo } from '@/api/operationCenter'
export default {
  name: 'edit_category',
  components: { },
  data() {
    return {
      params: {
        consumeTarget: '1',
        consumeType: '1'
      },
      rules: {
        name: { required: true, max: 20, message: '请输入渠道商名称,最多20个字', trigger: 'blur' },
        type: { required: true, message: '请选择电影券类型', trigger: ['blur', 'change'] }
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          await (this.edit ? updateCouponType(this.params) : createCouponType(this.params))
          this.$message.success('保存成功')
          this.closeTab(true)
        }
      })
    }
  },
  async created() {
    // 编辑
    if (this.$route.query.id) {
      this.params = await getCouponTypeInfo(this.$route.query.id)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
