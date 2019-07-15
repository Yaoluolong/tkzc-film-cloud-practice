<template>
  <div>
   <el-form-item label="规则制式">        
      <el-row>
        <el-col>
        <el-checkbox :label="'all'" @change="selectAllStandards">全部</el-checkbox>
        </el-col>
        <el-col>
        <el-checkbox-group v-model="selectedStandards" >
            <el-checkbox v-for=" standard in standards" :key="standard" :label="standard"></el-checkbox> 
          </el-checkbox-group>   
        </el-col>
      </el-row>  
      <el-row>
           <div style="margin-top:2%">
              <el-card style="width:900px">                
                <!-- 选择指定影厅并且至少已经选择一个影厅后显示 -->
                <div slot="header" class="clearfix">
                  <!-- <span>指定{{hallTypeName}}</span> <br> -->
                  <span>
                    <span>制式:</span>
                    <span v-for="selectedStandard in selectedStandards" :key="selectedStandard">{{selectedStandard}}&nbsp; &nbsp; </span>   
                  </span>
                </div>
                  <settlement-type-selector :pParams="pParams" ref="settlementTypeSelector"></settlement-type-selector> 
              </el-card>
            </div>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
import { getProgramCopyType } from '@/api/mallCenter'
import SettlementTypeSelector from './SettlementTypeSelector'
export default {
  name: 'settlement_price_rule_standard',
  components: { SettlementTypeSelector },
  props: {
    cinemaList: Array,
    standardParam: Object
  },
  data() {
    return {
      standards: [], // 所有制式
      selectedStandards: this.standardParam.standard ? this.standardParam.standard.split(',') : [], // 已经选中的制式
      pParams: this.standardParam
    }
  },
  computed: {

  },
  mounted() {
  },
  watch: {
    cinemaList: function(val) {
      this.getStandards()
    }
  },
  methods: {
    getReturn() {
      return new Promise(async(resolve, reject) => {
        let result = {}
        if (this.selectedStandards.length === 0) {
          this.$message.warning('请选择制式')
          reject('请选择制式')
        } else {
          const settlementTypeSelectorResult = await this.$refs.settlementTypeSelector.getReturn()
          result = Object.assign(result, settlementTypeSelectorResult)
          result.standard = this.selectedStandards.join(',')
          resolve(result)
        }
      })
    },
    // 根据是否选中了全部,来设置是否选中所有制式
    selectAllStandards(val) {
      if (val) {
        this.selectedStandards = [...(this.standards)]
      } else {
        this.selectedStandards = []
      }
    },
    async getStandards() {
      const cinemaIds = this.cinemaList.map(e => e.value).join(',')
      this.standards = await getProgramCopyType(cinemaIds)
    }
  },
  created() {
    this.getStandards()
  }
}
</script>

<style scoped lang="scss">
</style>
