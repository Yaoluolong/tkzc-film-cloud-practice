<template>
  <div>
      <el-row>
        <el-col>
        <el-checkbox :label="'all'" v-model="selectAll" @change="selectAllStandards">全部</el-checkbox>
        </el-col>
        <el-col>
        <el-checkbox-group v-model="selectedStandardsArray" >
            <el-checkbox v-for=" standard in standards" :disabled="(disableStandards.find(n=> standard === n))!==undefined" :key="standard" :label="standard"></el-checkbox> 
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
    cinemaList: Array,
    value: String, // 已经选中的制式   用,隔开
    disableStandards: {// 需要禁用的制式
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selectAll: false, // 是否选中所有
      standards: [], // 所有制式
      selectedStandardsArray: this.value ? this.value.split(',') : [] // 已经选中的制式数组
    }
  },
  computed: {
    // 已经选中的制式 字符串
    standardStr: function() {
      return this.selectedStandardsArray.join(',')
    },
    cinemaIds: function() {
      return this.cinemaList.map(e => e.value).join(',')
    }
  },
  mounted() {
  },
  watch: {
    // disableStandards: function(val, oldval) {
    //   if (val !== oldval) {
    //     this.disableStandards = val
    //     this.setHallDisable()
    //     this.$forceUpdate()
    //     // 如果被禁用的选项的选项被改变了且选择的是所有影厅 那么重新返回所有影厅
    //     if (this.selectAll) {
    //       this.selectedStandardsArray = [...(this.standards.filter(e => !this.disableStandards.find(n => n === e)))]
    //     }
    //   }
    // },
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
    }
  },
  methods: {
    // 根据是否选中了全部,来设置是否选中所有制式  要排除掉已经禁用的选项
    selectAllStandards(val) {
      if (val) {
        this.selectedStandardsArray = [...(this.standards.filter(e => !this.disableStandards.find(n => n === e)))]
      } else {
        this.selectedStandardsArray = []
      }
    },
    async getStandards() {
      // const cinemaIds = this.cinemaList.map(e => e.value).join(',')
      this.standards = await getProgramCopyType(this.cinemaIds)
    }
  },
  created() {
    this.getStandards()
  }
}
</script>

<style scoped lang="scss">
</style>
