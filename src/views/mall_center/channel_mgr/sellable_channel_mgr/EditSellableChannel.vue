<template>
  <div class="app-container">
    <el-form label-width="120px" label-position="left" style="width:1000px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="销售分组名称" prop="name" >
          <el-input v-model.trim="params.name" placeholder="请输入销售分组名称,最多10个字" style="width:420px;"></el-input>
      </el-form-item>
      <el-form-item required label="票务系统商">
        <remote-select v-model="params.interfaceTypeId" placeholder="请选择票务系统商" action="/systemApi/interfaceType/getList" style="width:200px;"></remote-select>
      </el-form-item>
      <el-form-item label="热门影院">
        <interface-cinema-form-selector ref="hotSelector" outNeedInterfaceTypeId :parantId="parantId" :outInterfaceTypeId="params.interfaceTypeId" v-model="params.hotCinemaList" :excludeData="params.cinemaList"></interface-cinema-form-selector>
      </el-form-item>
      <el-form-item label="其他影院">
        <interface-cinema-form-selector ref="otherSelector" outNeedInterfaceTypeId :outInterfaceTypeId="params.interfaceTypeId" v-model="params.cinemaList" :excludeData="params.hotCinemaList"></interface-cinema-form-selector>
      </el-form-item>
      <el-form-item label="适用商家" prop="channelList" v-if="ok || !$route.query.id">
        <channel-form-selector v-model="params.channelList" :changeFun="channelChange"></channel-form-selector>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="save" v-if="!look">保存</el-button>
        <el-button @click="closeTab" >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import InterfaceCinemaFormSelector from '@/components/InterfaceCinemaFormSelector'
import ChannelFormSelector from '@/components/ChannelFormSelector'
import { createChannelCinema, updateChannelCinema, getChannelCinemaInfo } from '@/api/mallCenter'
export default {
  name: 'edit_sellable_channel',
  components: { InterfaceCinemaFormSelector, ChannelFormSelector },
  data() {
    return {
      params: {
        hotCinemaIds: [], // 热门影院ID
        hotCinemaList: [], // 热门影院
        cinemaIds: [], // 其他影院ID
        cinemaList: [], // 其他影院
        channelList: [],
        interfaceTypeId: ''
      },
      parantId: '',
      rules: {
        name: { required: true, max: 10, message: '请输入销售分组名称,最多10个字', trigger: 'blur' },
        channelList: { required: true, message: '请选择适用渠道商', trigger: 'blur' }
      },
      ok: false
    }
  },
  watch: {
    'params.hotCinemaList'(val) {
      const hotList = this.$refs.hotSelector.getCinemaList()
      this.$refs.otherSelector.updateCinemaList(hotList)
      this.$refs.otherSelector.onlyOneAll = this.$refs.hotSelector.selectType === '1' // 热门选择所有 其他不能选择所有
      this.$refs.otherSelector.selectedCinemaList = this.$refs.hotSelector.selectType === '1' ? [] : this.$refs.otherSelector.selectedCinemaList
    },
    'params.cinemaList'(val) {
      const otherList = this.$refs.otherSelector.getCinemaList()
      this.$refs.hotSelector.updateCinemaList(otherList)
      this.$refs.hotSelector.selectedCinemaList = this.$refs.otherSelector.selectType === '1' ? [] : this.$refs.hotSelector.selectedCinemaList // 热门选择所有 其他不能选择所有
    }
  },
  methods: {
    channelChange() {

    },
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const params = Object.assign({}, this.params)
          params.cinemaIds = params.cinemaList.map(e => e.value).join(',')
          params.hotCinemaIds = params.hotCinemaList.map(e => e.value).join(',')
          params.channelIds = params.channelList.map(e => e.value).join(',')
          delete params.hotCinemaList // = JSON.stringify(params.hotCinemaList)
          delete params.cinemaList// = JSON.stringify(params.cinemaList)
          delete params.channelList // = JSON.stringify(params.channelList)
          await (this.params.id ? updateChannelCinema(params) : createChannelCinema(params))
          this.$message.success('保存成功')
          this.closeTab()
          this.$router.push('/mall_center/channel_mgr/sellable_channel_mgr')
        }
      })
    }
  },
  async created() {
    // 编辑
    if (this.$route.query.id) {
      this.parantId = this.$route.query.id
      this.params = await getChannelCinemaInfo(this.$route.query.id)
      this.ok = true
    }
  }
}
</script>

<style scoped lang="scss">
.sub-menu{
  margin: 10px;
}
</style>
