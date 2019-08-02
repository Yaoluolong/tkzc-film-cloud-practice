<template>
  <div class="app-container">
    <el-card>
      <el-form label-position="left" label-width="120px"  style="width:1000px;" :model="params" :rules="rules" ref="form">
        <el-form-item label="方案名称" prop="name" >
            <el-input clearable v-model.trim="params.name" placeholder="请输入策略分组名称，最多20个字" style="width:320px"></el-input>
        </el-form-item>

          <el-form-item label="票务系统商" prop="interfaceTypeId" >
        <remote-select v-model="params.interfaceTypeId" clearable placeholder="请选择票务系统商" action="/systemApi/interfaceType/getList" style="width:200px;"></remote-select>
        </el-form-item>
        
        <el-form-item label="方案影院" prop="cinemaIds" >
          <cinema-selector outNeedInterfaceTypeId :outInterfaceTypeId="params.interfaceTypeId" :changeFun="delCinemaConfirmTwo" :delFun="delCinemaConfirm"  ref="cinemaComponent" v-model="params.cinemaList"></cinema-selector>
        </el-form-item>   
        <el-form-item label-width="450px" label="影院结算价小于影片最低限价时是否按照影片最低限价结算给影院" prop="isUseLowest" >
            <el-radio-group v-model="params.isUseLowest">
                <el-radio :label="'1'">是</el-radio>
                <el-radio :label="'0'">否</el-radio>
              </el-radio-group>
        </el-form-item> 
        
      </el-form>
      
     </el-card>
    <rule-list :outRuleList="params.ruleList" ref="ruleList" :cinemaList="params.cinemaList"></rule-list>   <!-- 规则列表 -->
    <div style="margin-left:600px">
        <el-button style="margin-top:20px;" type="primary" @click="save"  v-if="!look">保存</el-button>
        <el-button @click="closeTab" >取消</el-button>
    </div>
    
  </div>
</template>

<script>
import { createSettlementPrice, getSettlementInfo, updateSettlementPrice } from '@/api/mallCenter'
import CinemaSelector from '@/components/CinemaSelector'
import RuleList from './RuleList'
import EditRule from './EditRule'
export default {
  name: 'edit_settlement_price',
  components: { CinemaSelector, RuleList, EditRule },
  data() {
    const checkCinemaList = (rule, value, callBack) => {
      if (!this.params.cinemaList || this.params.cinemaList.length === 0) {
        callBack(new Error('请选择影院'))
      }
      callBack()
    }
    return {
      rules: {
        name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }, {
          max: 20, message: '最多20个字符', trigger: 'blur'
        }],
        interfaceTypeId: { required: true, message: '请选择票务系统商', trigger: 'change' },
        cinemaIds: { required: true, validator: checkCinemaList, trigger: 'change' }

      }, // 用来验证表彰的规则
      editRuleShow: false, // 是否显示规则编辑组件
      params: {
        interfaceTypeId: '',
        name: '', // 方案名称
        cinemaList: [], // 影院列表
        cinemaId: '',
        isUseLowest: '1', // 影院结算价小于影片最低限价时是否按照影片最低限价结算给影院
        ruleList: [] // 结算规则列表
      }
    }
  },
  watch: {
    // 在方案内新增规则成功后，当对方案影院进行删除正好已经新增的规则中有关联此影院的影厅，那么此时在删除方案影院的时候需要给出提示
    'params.cinemaList': function(newVal, oldVal) {
      // const ruleListTemp = this.$refs.ruleList.ruleList
      // if (ruleListTemp && ruleListTemp.length > 0) {
      //   this.$confirm('在已有规则情况下改变影院将会清空规则重新编辑,是否执行此操作', '提示', { type: 'warning' }).then(() => {
      //     this.$refs.ruleList.ruleList = []
      //   }).catch(() => {
      //     this.params.cinemaList = oldVal
      //   })
      // }
      // this.query.cinemaId = this.cinemaId
      // this.query.hallType = this.hallType
      // const cinemaHallData = await getSettlementPriceCinemaHallList(this.query)
      // let temparray = []
      //   cinemaHallData.forEach(e => {
      //     temparray = [...temparray, ...e.hallList]
      //   })
      // console.log('ruleListTemp', ruleListTemp)
    }
    // 'params.interfaceTypeId': function(val) {
    //   this.params.cinemaList = []
    // }
  },
  methods: {
    delCinemaConfirmTwo(cinema, callBack) {
      if (!cinema.checked) {
        this.$confirm('确定要删除此方案影院？删除后将导致已经新增的规则内关联的此影院影厅数据自动删除，是否执行次操作？', '提示', { type: 'warning' }).then(() => {
        }).catch(() => {
          cinema.checked = true
          callBack()
        })
      }
    },
    delCinemaConfirm(index) {
      const ruleListTemp = this.$refs.ruleList.ruleList
      if (ruleListTemp && ruleListTemp.length > 0) {
        this.$confirm('在已有规则情况下改变影院将会清空规则重新编辑,是否执行此操作', '提示', { type: 'warning' }).then(() => {
          this.$refs.cinemaComponent.handleClose(index)
          this.$refs.ruleList.ruleList = []
        }).catch(() => {

        })
      } else {
        this.$refs.cinemaComponent.handleClose(index)
      }
    },
    changeCinemConfirm(val) {
      // if(!val){

      // }
    },
    showEditRule() {
      this.editRuleShow = true
    },
    hideEditRule() {
      this.editRuleShow = false
    },
    // 处理要提交的数据
    handleSubmitData() {

    },
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const submitData = {}
          submitData.name = this.params.name
          const cinemaId = this.params.cinemaList.map(e => e.value).join(',')
          submitData.cinemaId = cinemaId
          submitData.interfaceTypeId = this.params.interfaceTypeId
          submitData.isUseLowest = this.params.isUseLowest
          if (this.$refs.ruleList) {
            submitData.ruleList = await this.$refs.ruleList.getReturn()
          }
          if (this.$route.query.id) {
            this.$confirm(`影院结算价涉及平台与影院的结算，确定修改该条影院结算价方案吗？`, '删除提示', { type: 'warning' }).then(async() => {
              submitData.id = this.$route.query.id
              updateSettlementPrice(submitData).then(res => {
                this.$message.success('保存成功')
                this.closeTab(true)
              })
            })
          } else {
            createSettlementPrice(submitData).then(res => {
              this.$message.success('保存成功')
              this.closeTab(true)
            })
          }
        }
      })
    }
  },

  async created() {
    // 编辑
    if (this.$route.query.id) {
      this.params = await getSettlementInfo(this.$route.query.id)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
