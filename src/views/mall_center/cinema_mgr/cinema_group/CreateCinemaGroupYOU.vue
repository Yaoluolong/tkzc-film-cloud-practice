<template>
  <div class="app-container">
    <el-form label-width="120px" label-position="left" style="width:1000px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="影院分组名称" prop="name" >
          <el-input clearable v-model.trim="params.name" placeholder="请输入影院分组名称,最多10个字" style="width:420px;"></el-input>
      </el-form-item>
      <el-form-item label="票务系统商">
        <remote-select-multiple  v-model="params.interfaceTypeIdArray" showAllOption placeholder="选择票务系统商" action="/systemApi/interfaceType/getList" style="width:300px" @change="interfaceTypeChange">
        </remote-select-multiple>
      </el-form-item>
      <el-form-item label="分组影院" prop="cinemaList" v-if="!$route.query.id || (ok && $route.query.id)">
        <dir-transfer v-model="selectedCinemaList" ref="dirTransfer" :interfaceTypeId="params.interfaceTypeId" filter-placeholder="请输入影城名称" :data="unSelectedCinemaList" :titles="titles" :cinemaType="params.cinemaType" :panelWidth="350" @cinemaChange="cinemaChange" @cinemaTypeChange="cinemaTypeChange"></dir-transfer>
      </el-form-item>   
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="save" v-if="!look">保存</el-button>
        <el-button @click="closeTab" >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import InterfaceAllCinemaSelector from '@/components/InterfaceAllCinemaSelector'
import DirTransfer from '@/components/TransferCinemaSelector'
import { createCinemaGroup, updateCinemaGroup, getCinemaGroupInfo } from '@/api/mallCenter'
import { getCinemaListForPage } from '@/api/systemSetting'
import { realDeepClone } from '@/utils'
export default {
  name: 'create_cinema_group',
  components: { InterfaceAllCinemaSelector, DirTransfer },
  data() {
    return {
      params: {
        name: '',
        cinemaType: '1',
        interfaceTypeIdArray: ['-1'],
        interfaceTypeId: '-1',
        cinemaList: [],
        cinemaId: '',
        page: 0
      },
      rules: {
        name: { required: true, max: 10, message: '请输入影院分组名称,最多10个字', trigger: 'blur' },
        selectedCinemaList: { required: true, message: '请选择分组影院', trigger: 'blur' }
      },
      unSelectedCinemaList: [],
      selectedCinemaList: [],
      titles: ['选择影院', '选中影院'],
      ok: false
    }
  },
  methods: {
    interfaceTypeChange() {
      this.params.interfaceTypeIdArray.forEach(e => {
        if (e === '-1') {
          this.params.interfaceTypeIdArray = ['-1']
          return false
        }
      })
      this.params.interfaceTypeId = this.params.interfaceTypeIdArray.filter(e => e).join(',')
      this.$set(this, 'selectedCinemaList', [])
      this.cinemaChange({ interfaceTypeId: this.params.interfaceTypeId, page: 1 })
    },
    async cinemaChange(object) {
      /* this.$set(this, 'unSelectedCinemaList', [])

      const request = realDeepClone(object)
      await getCinemaListForPage(request).then(res => {
        res.list.map(e => {
          this.unSelectedCinemaList.push({
            label: e.name,
            key: e.value
          })
        })
      })
      console.log(this.unSelectedCinemaList.map(e => { return e.key }).sort().toString() === this.selectedCinemaList.sort().toString())
      if (this.unSelectedCinemaList.length === 0 || this.unSelectedCinemaList.map(e => { return e.key }).sort().toString() === this.selectedCinemaList.sort().toString()) {
        request.page++
        console.log(request)
        this.$set(this, 'unSelectedCinemaList', [])
        await getCinemaListForPage(request).then(res => {
          res.list.map(e => {
            this.unSelectedCinemaList.push({
              label: e.name,
              key: e.value
            })
          })
        })
      }*/

      this.$set(this, 'unSelectedCinemaList', [])
      const request = realDeepClone(object)
      await getCinemaListForPage(request).then(res => {
        res.list.map(e => {
          this.unSelectedCinemaList.push({
            label: e.name,
            key: e.value
          })
        })
      })
    },
    cinemaTypeChange(val) { //  @cinemaTypeChange="cinemaTypeChange"接收子组件;子组件传cinemaType切换给父组件
      this.params.cinemaType = val
    },
    save() {
      const params = Object.assign({}, this.params)
      this.$route.query.id ? params.id = this.$route.query.id : ''
      params.cinemaId = this.selectedCinemaList.map(e => e).join(',')

      params.interfaceTypeId = this.params.interfaceTypeIdArray.filter(e => e).join(',')

      this.$refs.form.validate(async(valid) => {
        if (valid) {
          await (this.$route.query.id ? updateCinemaGroup(params) : createCinemaGroup(params))
          this.$message.success('保存成功')
          this.closeTab(true)
          this.$router.push('/mall_center/cinema_mgr/cinema_group')
        }
      })
    }
  },
  // mounted() {
  //   this.interfaceTypeChange()
  // },
  async created() {
    // 编辑
    if (this.$route.query.id) {
      const groupInfo = await getCinemaGroupInfo({ id: this.$route.query.id })
      this.$set(this.params, 'name', groupInfo.name)
      this.params = groupInfo
      if (groupInfo.interfaceTypeId) {
        this.params.interfaceTypeIdArray = groupInfo.interfaceTypeId.split(',').filter(e => e)
      }
      if (groupInfo.cinemaType === '2') {
        groupInfo.cinemaList.map(e => {
          this.selectedCinemaList.push(e.value)
        })
      }
      this.ok = true
    }
    this.cinemaChange({ interfaceTypeId: this.params.interfaceTypeId, page: 1 })
  }
}
</script>

<style scoped lang="scss">
.sub-menu{
  margin: 10px;
}
</style>
