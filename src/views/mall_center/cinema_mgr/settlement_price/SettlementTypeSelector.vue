<template>
    <div>          
          <span style="display:flex">
            结算价 &nbsp;&nbsp;= &nbsp;&nbsp;<span v-if="params.settlementType"> 影院结算票价 &nbsp;</span><span v-if="params.settlementType === '4'"> +影院结算服务费 &nbsp;</span>
            <remote-select v-model="params.settlementType"  placeholder="请选择结算价类型" action="/systemApi/settlementPrice/getSettlementType" style="width:250px"></remote-select> &nbsp;&nbsp;&nbsp;
            <span v-if="params.settlementType !== '4' && params.settlementType">
              <el-input clearable v-model="params.money" style="width:100px" placeholder="0.00"></el-input> &nbsp;&nbsp;&nbsp;
                元 + 影院结算服务费 &nbsp;&nbsp;&nbsp;
              <el-input clearable v-model="params.servicePrice" placeholder="0.00" style="width:100px"></el-input>&nbsp;&nbsp;元
            </span>            
          </span>          
        </div>
</template>
<script>
export default {
  name: 'settlement_type_selector',
  props: {
    pParams: Object
  },
  data() {
    return {
      params: {
        settlementType: '',
        money: '',
        servicePrice: ''
      }
    }
  },
  watch: {
    // pParams: {
    //   handler: function(val, oldVal) {
    //     this.params = Object.assign(this.params, val)
    //   },
    //   deep: true
    // }
  },
  methods: {
    // 生成返回结果
    getReturn() {
      return new Promise((resolve, reject) => {
        if (!this.params.settlementType) {
          this.$message.warning('请选择结算价类型')
          reject('请选择结算价类型')
        }
        if (this.params.settlementType !== '4') {
          if (!this.params.servicePrice) {
            this.$message.warning('请输入影院结算服务费')
            reject('请输入影院结算服务费')
          }
          if (!this.params.money) {
            this.$message.warning('请输入影院结算票价')
            reject('请输入影院结算标价')
          }
        } else {
          delete this.params.money
          delete this.params.servicePrice
        }
        resolve(this.params)
      })
    }
  },
  mounted() {
    this.params = Object.assign(this.params, this.pParams)
  }
}
</script>

