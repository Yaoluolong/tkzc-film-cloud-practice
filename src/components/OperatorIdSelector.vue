<template>
    <div>      
      <el-select v-model="operator.id" @clear="options=[]" @change="handleChange" @focus="querySearch('', value)" clearable filterable remote :remote-method="querySearch" :placeholder="placeholder" :style="selectStyle" :loading="loading" >
          <el-option v-for="item in operator.options" :key="item.id" :label="item.realName" :value="item.id"></el-option>
      </el-select> 
    </div>
</template>

<script>

import { getMemberList } from '@/api/operationCenter'
export default {
  props: {
    value: String,
    isAddNew: {
      type: Boolean,
      default: true
    },
    accessType: String,
    placeholder: {
      type: String,
      default: ''
    },
    selectStyle: {
      type: String,
      default: 'width: 320px'
    }
  },
  data() {
    return {
      operator: {

      },
      addParam: {
        name: ''
      },
      loading: false,
      options: []
    }
  },
  methods: {
    async querySearch(val, operatorId) {
      console.log(this.accessType)
      if (val) {
        const options = await getMemberList({ realName: val, type: this.accessType })
        this.operator.options = options.filter(e => e.id)
        this.$forceUpdate()
      } else if (operatorId) {
        getMemberList({ name: '', type: this.accessType }).then(res => {
          this.operator.options = res
          this.operator.id = operatorId
          this.handleChange()
          this.$forceUpdate()
        })
      } else {
        const options = await getMemberList({ realName: val, type: this.accessType })
        this.operator.options = options
        this.$forceUpdate()
        // this.operator.options = []
      }
    },
    async handleChange(val) {
      this.$emit('input', this.operator.id)
    }
  },
  created() {
    if (this.value) {
      this.querySearch(undefined, this.value)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
