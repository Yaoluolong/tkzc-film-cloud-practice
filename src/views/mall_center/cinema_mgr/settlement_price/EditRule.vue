<template>
  <div>
    <el-card shadow="never">
      <el-form inline ref="form" :model="params" :rules="rules">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model.trim="params.name" style="width:200px" placeholder="输入影院结算价方案名称"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="规则时间" prop="time" required>
          <el-date-picker
            unlink-panels
            v-model="params.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:320px;"
          ></el-date-picker>
        </el-form-item>
        <br />
        <el-form-item label="结算规则" prop="type">
          <el-select @change="checkCinemaList" v-model="params.type">
            <el-option :label="'按影厅'" :value="'1'"></el-option>
            <el-option :label="'按制式'" :value="'2'"></el-option>
          </el-select>
        </el-form-item>
        <rule-hall
          ref="ruleHall"
          :hallParam="hallParam"
          v-if="params.type === '1'"
          :cinemaList="cinemaList"
        ></rule-hall>
        <rule-standard
          ref="ruleStandard"
          :standardParam="standardParam"
          v-if="params.type === '2'"
          :cinemaList="cinemaList"
        ></rule-standard>
        <br />
        <el-form-item label="特殊结算价" required>
          <tip content="特殊结算价是说再特殊时期在原有结算价基础上加价结算！">
            <el-radio-group v-model="params.isSpecialPrice">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </tip>
        </el-form-item>
        <br />
        <el-form-item
          v-if="params.isSpecialPrice === '1'"
          label="特殊规则时间"
          required
          prop="specialTime"
        >
          <el-date-picker
            unlink-panels
            v-model="params.specialTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:320px;"
          ></el-date-picker>
        </el-form-item>
        <br />

        <el-form-item
          v-if="params.isSpecialPrice === '1'"
          label="规则结算规则"
          prop="specialType_specialMoney"
        >
          <span style="display:flex">
            结算价: &nbsp;
            <!-- <el-from-item prop="specialType"> -->
            <el-select v-model="params.specialType" style="width:100px">
              <el-option :value="'1'" label="增加"></el-option>
              <el-option :value="'2'" label="减少"></el-option>
            </el-select>&nbsp;&nbsp;&nbsp;
            <!-- </el-from-item> -->
            <!-- <el-from-item prop="specialMoney"> -->
            <el-input v-model.trim="params.specialMoney" style="width:100px" placeholder="0.00"></el-input>&nbsp;&nbsp;&nbsp;
            <!-- </el-from-item> -->
          </span>
        </el-form-item>
      </el-form>
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
import RuleHall from './RuleHall'
import RuleStandard from './RuleStandard'
import { deepClone } from '@/utils'

export default {
  name: 'settlement_price_rule_edit',
  components: { RuleHall, RuleStandard },
  props: {
    cinemaList: Array, // 父组件传过来的影院列表
    rule: Object // 父组件传过来的规则
  },
  data() {
    var checkTime = (rule, value, callback) => {
      if (!value || !value[0] || !value[1]) {
        callback(new Error('请选择规则时间'))
      }
      // const startDate = new Date(value[0]).getTime()
      // const endDate = new Date(value[0]).getTime()
      // const current = new Date().getTime()
      // if (current > endDate) {
      //   callback(new Error('当前设置的规则时间已过期,请重新选择'))
      // }
      callback()
    }
    var checkSpecialTypeSpecialMoney = (rule, value, callback) => {
      if (!this.params.specialType || !this.params.specialMoney) {
        callback(new Error('请设置规则结算规则'))
      }
      callback()
    }

    return {
      rules: {
        name: { required: true, message: '请输入规则名称', trigger: 'blur' },
        time: { validator: checkTime, trigger: 'blur' },
        type: { required: true, message: '请选择结算规则', trigger: 'blur' },
        specialTime: { validator: checkTime, trigger: 'blur' },
        specialType_specialMoney: {
          validator: checkSpecialTypeSpecialMoney,
          required: true,
          trigger: 'blur'
        }
        // specialType: { required: true, message: '请选择结算规则', trigger: 'blur' },
        // specialMoney: { required: true, message: '请输入结算价', trigger: 'blur' }
      },
      params: {
        name: '', // 规则名称
        time: [], // 规则时间
        type: '', // 结算规则   1按影厅  2按制式
        specialType: '', // 特殊结算类型 1、增加 2、减少（ruleList参数）
        isSpecialPrice: '0', // 特殊结算价   1、是 0、否
        specialMoney: '',
        specialTime: [] // 特殊结算价时间
      },
      hallParam: {}, // 结算规则为按影厅相关参数  用于传入组件中
      standardParam: {} // 结算规则为按制式相关参数  用于传入组件中
    }
  },
  mounted() {},
  computed: {},
  watch: {
    cinemaList: {
      handler: function(val, oldVal) {
        // 如果清空了影院则将结算规则清空
        if (!val || val.length === 0) {
          this.params.type = ''
        }
      },
      deep: true
    }
  },
  methods: {
    checkCinemaList(val) {
      // 如果选择了按制式,先判断有没有选择了影院,如果没有选中则给出提示
      if (val === '2') {
        if (!this.cinemaList || this.cinemaList.length === 0) {
          this.params.type = ''
          this.$message.warning('请先选择影院')
        }
      }
    },
    clearData() {
      // this.params = {}
      this.params.time = []
      this.params.type = ''
      this.params.specialTime = []
      this.params.name = ''
    },
    // 构建返回结果
    getReturn() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(async valid => {
          if (this.params.type === '1') {
            const hallParam = await this.$refs.ruleHall.getReturn() // 结算规则为按影厅相关参数
            // console.log('hallParam======', hallParam)
            this.params = Object.assign(this.params, hallParam)
            this.params.typeName = '按影厅结算'
          } else if (this.params.type === '2') {
            const standardParam = await this.$refs.ruleStandard.getReturn() // 结算规则为按制式相关参数
            this.params = Object.assign(this.params, standardParam)
            this.params.typeName = '按制式结算'
          }

          if (valid) {
            this.params.startTime = this.params.time[0] // 规则开始时间 2018-10-17
            this.params.endTime = this.params.time[1] // 规则结束时间 2018-10-20
            this.params.specialST = this.params.specialTime[0]
            this.params.specialET = this.params.specialTime[1]
            const temp = deepClone(this.params)
            delete temp.time
            delete temp.specialTime
            resolve(temp)
          } else {
            reject('err')
          }
        })
      })
    },
    initData() {
      // 根据传进来的rule显示页面
      if (this.rule) {
        this.params.time = []
        this.params.time[0] = this.rule.startTime
        this.params.time[1] = this.rule.endTime
        this.params.specialTime = []
        if (this.rule.specialST) {
          this.params.specialTime[0] = this.rule.specialST
        }
        if (this.rule.specialET) {
          this.params.specialTime[1] = this.rule.specialET
        }
        this.params = Object.assign(this.params, this.rule)
        if (this.params.type === '1') {
          this.hallParam.hallType = this.rule.hallType
          this.hallParam.hallId = this.rule.hallId
          this.hallParam.settlementType = this.rule.settlementType
          this.hallParam.money = this.rule.money
          this.hallParam.servicePrice = this.rule.servicePrice
        } else {
          this.standardParam.standard = this.rule.standard
          this.standardParam.settlementType = this.rule.settlementType
          this.standardParam.money = this.rule.money
          this.standardParam.servicePrice = this.rule.servicePrice
        }
      }
    }
  },

  created() {
    this.initData()
  }
}
</script>

<style scoped lang="scss">
</style>
