<template>
  <div class="app-container">
    <el-form label-width="120px"  label-position="left" style="width:650px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="电影券名称" prop="name" >
          <el-input clearable v-model="params.name" placeholder="请输入电影券名称,最多20个字"></el-input>
      </el-form-item>
      <el-form-item label="电影券类型" prop="type">
        <remote-select v-model="params.type" clearable placeholder="请选择电影券类型" action="/systemApi/dict/getList" :query="{type:'couponType'}" ></remote-select>
      </el-form-item>
      <el-form-item required label="消费对象" prop="consumeTarget">
        <el-radio v-model="params.consumeTarget" label="1" >电影</el-radio>
      </el-form-item>
      <el-form-item required label="消费方式" prop="consumeType">
        <el-radio v-model="params.consumeType" label="1" >线上电影券</el-radio>
        <el-radio v-model="params.consumeType" disabled label="2" >线下电影券</el-radio>
      </el-form-item>
      <el-form-item  label="适用商家" prop="channelList">
        <channel-selector v-model="params.channelList"></channel-selector>
      </el-form-item>
      <el-form-item label="兑换细则" prop="useExplain">
        <el-input clearable v-model="params.useExplain"  type="textarea"  :rows="4"  placeholder="请输入内容" ></el-input>
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
import { realDeepClone } from '@/utils'
import ChannelSelector from '@/components/ChannelSelector'
export default {
  name: 'edit_coupon_category',
  components: { ChannelSelector },
  data() {
    return {

      params: {
        channelList: [],
        consumeTarget: '1',
        consumeType: '1'
      },
      rules: {
        name: { required: true, max: 20, message: '请输入渠道商名称,最多20个字', trigger: 'blur' },
        channelList: { required: true, message: '请选择适用商家', trigger: ['change', 'blur'] },
        type: { required: true, message: '请选择电影券类型', trigger: ['blur', 'change'] }
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const request = realDeepClone(this.params)
          request.channelId = this.channelId
          delete request.channelList
          await (this.edit ? updateCouponType(request) : createCouponType(request))
          this.$message.success('保存成功')
          this.closeTab(true)
        }
      })
    }
  },
  computed: {
    channelId: function() {
      return this.params.channelList.map(e => e.value).join(',')
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
