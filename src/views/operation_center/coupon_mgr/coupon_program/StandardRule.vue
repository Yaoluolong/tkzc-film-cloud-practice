<template>
  <div>
    <span class="danger" v-if="!cinemaId">请选择方案影院</span>
    <template v-else>
      <el-checkbox :label="'all'" @change="selectAllStandards">全部</el-checkbox>
      <el-checkbox-group v-model="selectedStandards" >
        <el-checkbox :disabled="disableStandards.find(e => standard === e) !== undefined" v-for=" standard in standards" :key="standard" :label="standard"></el-checkbox>
      </el-checkbox-group>
      <div class="tag-plane" v-if="selectedStandards.length>0">
        <div class="tag-title">
          制式: {{selectedStandards.join('、')}}
        </div>
        <slot></slot>
      </div>
    </template>

  </div>
</template>

<script>
import { getProgramCopyType } from '@/api/mallCenter'

export default {
  components: { },
  props: {
    cinemaId: String, // 多个用逗号隔开
    value: String, // 用逗号隔开的
    disableStandards: { // 需要排斥禁用的制式
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      standards: [], // 所有制式
      selectedStandards: [] // 已经选中的制式
    }
  },
  watch: {
    selectedStandards(val) {
      this.selectedStandardsToValue()
    },
    value(val, oldVal) {
      if (val !== oldVal) {
        this.selectedStandards = [...(val.split(','))]
      }
    },
    cinemaId() {
      this.getStandards()
    }
  },
  methods: {
    // setStandardsDisable(){

    // },
    selectAllStandards(val) {
      this.selectedStandards = val ? [...(this.standards)] : []
    },
    async getStandards() {
      this.standards = await getProgramCopyType(this.cinemaId)
    },
    selectedStandardsToValue() {
      const value = this.selectedStandards.join(',')
      if (value !== this.value) { this.$emit('input', this.selectedStandards.join(',')) }
    },
    valueToSelectedStandards() {
      if (this.value) {
        this.selectedStandards = this.value.split(',')
      }
    }
  },
  created() {
    if (this.cinemaId) {
      this.getStandards()
    }
    this.valueToSelectedStandards()
  }
}
</script>

<style scoped lang="scss">
.tag-plane{
   border: 1px solid #DCDFE6;
   border-radius: 4px;
   margin-top: 20px;
   .tag-title{
     padding: 5px 20px;
     border-bottom: 1px solid #DCDFE6;
   }
}
</style>
