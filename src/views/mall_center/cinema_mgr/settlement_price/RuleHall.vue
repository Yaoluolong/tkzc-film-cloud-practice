<template>
  <div>
    <el-form ref="form" :model="params" :rules="rules">
      <el-form-item label="影厅类型" prop="hallType" >
            <remote-select v-model="params.hallType"  placeholder="请选择影厅类型" action="/systemApi/settlementPrice/getHallTypeList" style="width:320px"></remote-select>
      </el-form-item> <br>
      <el-form-item required label="规则影厅">
              <hall-selector  ref="hallSelector" :cinemaList="cinemaList" :hallType="params.hallType" :hallId="params.hallId" :settlementType="params.settlementType" :money="params.money" :servicePrice="params.servicePrice"></hall-selector>
      </el-form-item> 
    </el-form>
  </div>
</template>

<script>
/**
 * 按影厅结算规则编辑
 */
import HallSelector from './HallSelector'
import { deepClone } from '@/utils'
export default {
  name: 'settlement_price_rule_hall',
  components: { HallSelector },
  props: {
    cinemaList: Array, // 父组件传过来的影院列表
    hallParam: Object // 父组件传过来的参数
  },
  data() {
    return {
      params: {
        hallType: this.hallParam.hallType, // 影厅类型,1、普通厅 2、巨幕厅 3、特殊厅
        hallId: this.hallParam.hallId, // 影厅id，多个以逗号隔开 结算规则为影厅时必传,
        settlementType: this.hallParam.settlementType ? this.hallParam.settlementType : '',
        money: this.hallParam.money,
        servicePrice: this.hallParam.servicePrice
      },
      rules: {
        hallType: { required: true, message: '请选择影厅类型', trigger: 'change' }
      }
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    // 生成返回结果
    getReturn() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(async(flag) => {
          if (flag) {
            const hallSelectorReturn = await this.$refs.hallSelector.getReturn()
            this.params = Object.assign(this.params, hallSelectorReturn)
            resolve(deepClone(this.params))
          } else {
            reject('err')
          }
        })
      })
    }
  },
  async created() {

  }
}
</script>

<style scoped lang="scss">
</style>
