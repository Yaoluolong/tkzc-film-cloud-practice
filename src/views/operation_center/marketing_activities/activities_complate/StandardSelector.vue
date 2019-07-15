<template>
  <div>
      <el-row>
        <el-col>
          <el-checkbox :label="'all'" v-model="selectAll" @change="selectAllStandards" :disabled="disabled">全部</el-checkbox>
        </el-col>
        <el-col>
          <el-checkbox-group v-model="selectedStandardsArray" >
            <el-checkbox v-for=" (standard,index) in standards" :key="standard" :label="standard" :disabled="disabled" @change="doSelect(standard,index)"></el-checkbox> 
          </el-checkbox-group>  
        </el-col>
      </el-row>      
  </div>
</template>

<script>
import { getDefaultCopyType } from '@/api/mallCenter'
export default {
  name: 'standard_selector',
  props: {
    cinemaGroupId: String,
    value: String, // 已经选中的制式   用,隔开
    disabled: {
      default: false,
      type: Boolean
    },
    forIndex: Number,
    forDisabled: Array
  },
  data() {
    return {
      selectAll: false, // 是否选中所有
      standards: [], // 所有制式
      copyTypeBak: [],
      selectedStandardsArray: this.value ? this.value.split(',').filter(e => e) : [], // 已经选中的制式数组

      selectedCount: 0
    }
  },
  computed: {
    // 已经选中的制式 字符串
    standardStr: function() {
      return this.selectedStandardsArray.join(',')
    },
    cinemaIds: function() {
      return this.cinemaGroupId
    }
  },
  mounted() {
  },
  watch: {
    cinemaIds: {
      handler: function(val, oldVal) {
        if (val && val !== oldVal) {
          this.getStandards()
        }
      },
      deep: true
    },
    standardStr: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('input', val)
        }
      },
      deep: true
    },
    value(val) {
      this.selectedStandardsArray = val ? val.split(',').filter(e => e) : []
    }
  },
  methods: {
    // 根据是否选中了全部,来设置是否选中所有制式  要排除掉已经禁用的选项
    selectAllStandards(val) {
      if (val) {
        if (this.forIndex >= 0) {
          const forDisabledTemp = this.forDisabled

          forDisabledTemp.forEach((e, k) => {
            const copyTypeTemp = forDisabledTemp[k].copyType
            console.log(copyTypeTemp.length)
            if (k !== this.forIndex && copyTypeTemp.length > 0) {
              this.selectedCount++
              return false
            }
          })
          if (this.selectedCount === 0) {
            this.selectedStandardsArray = [...this.standards]
          } else {
            this.selectAll = false
            this.selectedStandardsArray = []
            this.$message.warning('有制式已被选,无法全选')
            this.selectedCount = 0
          }
        } else {
          this.selectedStandardsArray = [...this.standards]
        }
      } else {
        this.selectedStandardsArray = []
      }
    },
    doSelect(val, index) {
      if (this.forIndex >= 0) {
        const forDisabledTemp = this.forDisabled
        forDisabledTemp.forEach((e, k) => {
          const copyTypeTemp = e.copyType.split(',')
          if (copyTypeTemp.indexOf(val) > -1 && k !== this.forIndex) {
            this.$message.warning('该制式已被选')
            this.selectedStandardsArray.splice(this.selectedStandardsArray.findIndex(item => item === val), 1)
          }
        })
      }
    },
    async getStandards() {
      // const cinemaIds = this.cinemaList.map(e => e.value).join(',')
      await getDefaultCopyType(this.cinemaGroupId).then(res => {
        this.standards = res
      })

      // this.standards = await getProgramCopyType(this.cinemaGroupId)
    }
  },
  created() {
    this.getStandards()
  }
}
</script>

<style scoped lang="scss">
</style>
