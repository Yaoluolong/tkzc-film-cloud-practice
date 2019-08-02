<template>
  <div class="app-container">
    <el-form
      label-width="120px"
      label-position="left"
      style="width:1000px;"
      :model="params"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="分组名称" prop="name">
        <el-input clearable  v-model="params.name" placeholder="请输入策略分组名称，最多20个字" style="width:320px"></el-input>
      </el-form-item>
      <el-form-item label="定价类型" prop="priceRight">
        <remote-select
          v-model="params.priceRight"
          placeholder="请选择"
          action="/systemApi/cinema/getPriceRight"
          style="width:320px"
        ></remote-select>
      </el-form-item>
      <el-form-item label="票务系统商" prop="interfaceTypeId">
        <remote-select
          v-model="params.interfaceTypeId"
          clearable
          placeholder="请选择票务系统商"
          action="/systemApi/interfaceType/getList"
          style="width:200px;"
        ></remote-select>
      </el-form-item>
      <el-form-item label="分组影院" prop="cinemaIds">
        <cinema-selector
          outNeedInterfaceTypeId
          :outInterfaceTypeId="params.interfaceTypeId"
          v-model="params.cinemaList"
          outNeedPolicy
          :outPolicy="policy"
        ></cinema-selector>
      </el-form-item>
      <!-- 只有在有阈值的时候才陋 -->
      <el-form-item
        label="影院定价:"
        prop="yuzhi"
        v-if="params.priceRight === '2' || params.priceRight === '5' || params.priceRight ==='6'"
      >
        <div
          style="padding-left:42px"
          v-if="params.priceRight === '2' || params.priceRight === '5'"
        >
          <div style="float:left;">票价阈值=</div>
          <gl-input v-model="params.priceRightConfig.ticketPrice"></gl-input>
        </div>
        <div style="margin-top:5px" v-if="params.priceRight === '2' || params.priceRight ==='6'">
          <div style="float:left;">影院服务费阈值=</div>
          <gl-input v-model="params.priceRightConfig.servicePrice"></gl-input>
        </div>
      </el-form-item>
      <el-form-item style="text-align:center;padding-top:50px">
        <el-button type="primary" @click="save" v-if="!look">保存</el-button>
        <el-button @click="closeTab">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getPriceGroupInfo,
  createPriceGroup,
  updatePriceGroup
} from '@/api/priceCenter'
// import CinemaSelector from '@/views/price_center/common/CinemaSelector'
import CinemaSelector from '@/components/CinemaSelector'
import { deepClone } from '@/utils'
import GlInput from '@/components/GlInput'
export default {
  name: 'edit_policy_price_program',
  components: { CinemaSelector, GlInput },
  data() {
    const checkYuZhi = (rule, value, cb) => {
      if (this.params.priceRight === '2' || this.params.priceRight === '5') {
        if (!this.params.priceRightConfig.ticketPrice) {
          cb(new Error('请配置阈值'))
        }
      }
      if (this.params.priceRight === '2' || this.params.priceRight === '6') {
        if (!this.params.priceRightConfig.servicePrice) {
          cb(new Error('请配置阈值'))
        }
      }
      cb()
    }
    return {
      dialogVisble: false,
      policy: {
        priceRight: ''
      },
      params: {
        priceRightConfig: {
          ticketPrice: '',
          servicePrice: ''
        },
        cinemaList: [],
        interfaceTypeId: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入分组名称,最多20个中文字符',
            trigger: 'blur'
          },
          { max: 20, message: '最多输入20个字', trigger: 'blur' }
        ],
        priceRight: {
          required: true,
          message: '请选择策略类型',
          trigger: 'change'
        },
        yuzhi: {
          required: true,
          validator: checkYuZhi,
          message: '请设置阈值',
          trigger: 'blur'
        },
        interfaceTypeId: {
          required: true,
          message: '请选择票务系统商',
          trigger: 'change'
        }
        // cinemaIds: { required: true, message: '请选择分组影院' }
      },
      isEdit: false
    }
  },
  watch: {
    async 'params.priceRight'(val, oldValue) {
      if (oldValue) {
        this.params.cinemaIds = []
        this.params.cinemaList = []
      }
      if (val) {
        this.policy.priceRight = val
        this.policy.priceRightConfig = ''
      }
      if (this.params.priceRightConfig !== '') {
        this.policy.priceRightConfig = this.params.priceRightConfig
      }
    }
  },
  computed: {
    cinemaIds() {
      return this.params.cinemaList.map(e => e.value)
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.cinemaIds || this.cinemaIds.length === 0) {
            this.$message.error('请选择影院')
          } else {
            this.editSubmit()
          }
        }
      })
    },
    editSubmit() {
      // this.params.cinemaIds = this.params.cinemaIds.join(',')
      // this.params.priceRightConfig = this.policy.priceRightConfig
      const submitData = deepClone(this.params)
      submitData.cinemaIds = this.cinemaIds
      submitData.interfaceTypeId = this.params.interfaceTypeId
      // 如果没有阈值则删除 priceRightConfig
      if (submitData.priceRight === '5') {
        delete submitData.priceRightConfig.servicePrice
      }
      if (submitData.priceRight === '6') {
        delete submitData.priceRightConfig.ticketPrice
      }
      if (submitData.priceRight === '1') {
        delete submitData.priceRightConfig.ticketPrice
        delete submitData.priceRightConfig.servicePrice
      }
      delete submitData.cinemaList
      if (this.create) {
        createPriceGroup(submitData).then(res => {
          this.$message.success('新增成功')
          this.closeTab(true)
        })
      } else if (this.edit) {
        const editParams = {
          id: this.$route.query.id,
          name: submitData.name,
          priceRight: submitData.priceRight,
          cinemaIds: submitData.cinemaIds,
          priceRightConfig: submitData.priceRightConfig,
          interfaceTypeId: submitData.interfaceTypeId
        }
        updatePriceGroup(editParams)
          .then(res => {
            this.$message.success('保存成功')
            this.closeTab(true)
          })
          .catch(error => {
            // submitData.cinemaIds = submitData.cinemaIds.split(',')
            throw error
          })
      }
    }
  },

  async created() {
    // 查看

    // 编辑
    if (this.$route.query.id) {
      this.isEdit = true
      this.params = await getPriceGroupInfo(this.$route.query.id)

      this.policy.priceRightConfig = this.params.priceRightConfig

      if (!this.params.priceRightConfig) {
        this.params.priceRightConfig = {}
      }
      // if (!this.params.priceRightConfig.ticketPrice) {
      //   this.params.priceRightConfig.ticketPrice = {}
      // }
      // if (!this.params.priceRightConfig.servicePrice) {
      //   this.params.priceRightConfig.servicePrice = {}
      // }

      // this.policy.priceRight = this.params.priceRight   可能不需要
      // console.log(this.policy.priceRightConfig, 78)
    }
  }
}
</script>

<style scoped lang="scss">
.sub-menu {
  margin: 10px;
}
</style>
