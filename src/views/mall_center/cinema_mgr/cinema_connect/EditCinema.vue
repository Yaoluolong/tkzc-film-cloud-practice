<template>
  <div class="app-container">
    <el-collapse v-model="activeNames"  class="form-collapse">
      <el-collapse-item  name="1" title="基础信息">
        <base-info ref="baseInfo"></base-info>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <span >票务系统商信息<span class="subtitle">(以下信息需按合同如实填写，如填写错误将导致无法消费!)</span></span>
        </template>
        <systemer-info ref="systemerInfo"></systemer-info>
      </el-collapse-item>
    </el-collapse>
    <div style="text-align:center;margin-top:20px">
      <el-button type="primary" @click="save" v-if="!look">保存</el-button>
      <el-button @click="closeTab" >取消</el-button>
    </div>
  </div>
</template>

<script>
import { getCinemaInfo, createCinema, updateCinema } from '@/api/mallCenter'
import BaseInfo from './BaseInfo.vue'
import SystemerInfo from './SystemerInfo'
import { objectMerge } from '@/utils'
export default {
  name: 'edit_cinema',
  components: { BaseInfo, SystemerInfo },
  data() {
    return {
      activeNames: ['1']
    }
  },
  methods: {
    async save() {
      try {
        const params = await this.$refs.baseInfo.getResult()
        const params2 = await this.$refs.systemerInfo.getResult()
        console.log(params2)
        objectMerge(params, params2)
        params.cinemaId = this.$refs.baseInfo.cinemaId
        await (this.edit ? updateCinema(params) : createCinema(params))
        this.$message.success('操作成功')
        this.closeTab(true)
      } catch (error) {
        if (error === 'validError') {
          this.$message.warning('表单填写不完整,请检查!')
        }
      }
    }
  },
  async mounted() {
    // 编辑
    if (this.$route.query.id) {
      const params = await getCinemaInfo(this.$route.query.id)
      this.$refs.baseInfo.setResult(params)
      this.$refs.systemerInfo.setResult(params)
    }
  }
}
</script>

<style scoped lang="scss">
.header-icon{
  font-size: 16px;
}
.title{
  margin-left: 10px;
  font-size: 16px;
  color:#303133;
  font-weight: bold;
  // font-weight: bold;
}
.subtitle{
  font-size: 14px;
  color:#909399;
  font-weight: normal;
  margin-left: 20px;
}
</style>
