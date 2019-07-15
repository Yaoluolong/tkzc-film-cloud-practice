<template>
  <div class="app-container">
    <el-form label-width="120px"  style="width:1200px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="规则名称" prop="ruleName" >
          <el-input v-model="params.ruleName" placeholder="请输入规则名称" style="width:320px;"></el-input>
      </el-form-item>
      <el-form-item label="结算规则" prop="settlementType">
         <el-select v-model="params.settlementType" placeholder="请选择结算规则" style="width:320px;">
           <el-option label="影厅" value="1"></el-option>
           <el-option label="制式" value="2"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item v-if="params.settlementType === '1'" label="影厅类型" prop="hallType">
        <remote-select v-model="params.hallType"  clearable placeholder="请选择影厅类型" action="/systemApi/settlementPrice/getHallTypeList"></remote-select>
      </el-form-item>
      <el-form-item label="规则影厅" prop="hallId" v-if="params.settlementType==1">
        <hall-rule :cinema-id="cinemaId"  :hall-type="params.hallType" v-model="params.hallId" >
            <price-rule v-model="params.priceRule"></price-rule>
        </hall-rule>
      </el-form-item>
       <el-form-item label="规则制式" prop="standard"  v-else>
        <standard-rule :cinema-id="cinemaId" v-model="params.standard">
          <price-rule  v-model="params.priceRule"></price-rule>
        </standard-rule>
      </el-form-item>
      <el-form-item label="可兑时间段" prop="timeRule">
        <time-rule  v-model="params.timeRule" ></time-rule>
      </el-form-item>
      <el-form-item label="规则优先级" prop="sort">
        <el-input style="width:150px" v-model.trim="params.sort"></el-input> &nbsp;级
      </el-form-item>
      <div  style="margin-left:40px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancle" >取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import CouponSelector from './CouponSelector.vue'
import HallRule from './HallRule'
import PriceRule from './PriceRule'
import TimeRule from './TimeRule'
import StandardRule from './StandardRule'
import Bus from './bus.js'
export default {
  components: { CouponSelector, HallRule, TimeRule, StandardRule, PriceRule },
  props: {
    value: Object,
    cinemaId: String, // 多个逗号隔开
    saveFun: Function,
    disableHallIds: { // 需要排斥的影厅ID数组
      type: Array,
      default: []
    },
    disableStandards: { // 需要排斥的制式
      type: Array,
      default: []
    },
    disableSort: { // 需要排斥的优先级
      type: Array,
      default: []
    }
  },
  data() {
    const checkTimeRule = (rule, value, cb) => {
      if (!this.params.timeRule || this.params.timeRule.length === 0) {
        cb(new Error('请配置可兑换时间'))
      }
      this.params.timeRule.forEach(e => {
        if (!e.week) {
          cb(new Error('请配置可兑换时间'))
        } else if (!e.startTime) {
          cb(new Error('请配置可兑换时间'))
        } else if (!e.endTime) {
          cb(new Error('请配置可兑换时间'))
        }
      })

      cb()
    }
    return {
      params: this.value,
      rules: {
        ruleName: { required: true, max: 20, message: '请输入规则名称,最多20个字', trigger: 'blur' },
        settlementType: { required: true, message: '请选择结算规则', trigger: ['blur', 'change'] },
        hallType: { required: true, message: '请选择影厅类型', trigger: ['blur', 'change'] },
        hallId: { required: true, message: '请填写规则影厅', trigger: ['blur'] },
        standard: { required: true, message: '请填写规则制式', trigger: ['blur'] },
        priceRule: { required: true, message: '请填写电影售价', trigger: ['blur'] },
        timeRule: { validator: checkTimeRule, trigger: ['blur'] },
        sort: { required: true, message: '请填写规则优先级', trigger: ['blur'] }
      }
    }
  },
  watch: {
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.disableSort.find(e => e === this.params.sort)) {
            this.$message.warning('方案内规则优先级不可重复')
            return
          }

          this.params.unSave = false
          if (this.saveFun) {
            this.saveFun()
          }
        }
      })
    },
    cancle() {
      Bus.$emit('cancleRule', this.params)
    }
  },
  async created() {

  }
}
</script>

<style scoped lang="scss">
.app-container{
  margin: 0px;
}
</style>
