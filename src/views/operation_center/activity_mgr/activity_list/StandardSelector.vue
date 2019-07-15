<template>
  <div>
      <el-row>
        <el-col>
          <el-checkbox :label="'all'" v-model="selectAll" @change="selectAllStandards" :disabled="disabled">全部</el-checkbox>
        </el-col>
        <el-col>
          <el-checkbox-group v-model="selectedStandardsArray" >
            <el-checkbox v-for=" standard in standards" :key="standard" :label="standard" :disabled="disabled"></el-checkbox> 
          </el-checkbox-group>  
        </el-col>
      </el-row>      
  </div>
</template>

<script>
import { getProgramCopyType } from '@/api/mallCenter'
export default {
  name: 'standard_selector',
  props: {
    cinemaGroupId: String,
    value: String, // 已经选中的制式   用,隔开
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      selectAll: false, // 是否选中所有
      standards: [], // 所有制式
      selectedStandardsArray: this.value ? this.value.split(',').filter(e => e) : [] // 已经选中的制式数组
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
        console.log('val', val)

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
        this.selectedStandardsArray = [...this.standards]
      } else {
        this.selectedStandardsArray = []
      }
    },
    async getStandards() {
      // const cinemaIds = this.cinemaList.map(e => e.value).join(',')
      this.standards = await getProgramCopyType(this.cinemaGroupId)
    }
  },
  created() {
    this.getStandards()
  }
}
</script>

<style scoped lang="scss">
</style>
