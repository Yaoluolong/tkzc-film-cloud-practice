<template>
    <div>      
      <template v-if="!showAddNewCustom">
          <el-select v-model="custom.id" @clear="options=[]" @focus="querySearch('', value)" @change="handleChange" clearable filterable remote :remote-method="querySearch" placeholder="输入客户名称模糊查询" :style="selectStyle" :loading="loading">
              <el-option v-for="item in custom.options" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select> 
          <el-button type="text" v-if="isAddNew" @click="showAddNewCustom = true;addParam.name = ''">+添加平台新客户</el-button>    
      </template>
      <template v-if="showAddNewCustom">
        <el-input placeholder="请输入客户名称" v-model="addParam.name" style="width:250px"></el-input> 
        <el-button type="primary" @click="saveCustom">保存</el-button>
        <el-button @click="showAddNewCustom = false">取消</el-button>
      </template>
      
    </div>
</template>

<script>

import { createCustomer, getCustomerList } from '@/api/operationCenter'
export default {
  props: {
    value: String,
    isAddNew: {
      type: Boolean,
      default: true
    },
    accessType: String,
    selectStyle: {
      type: String,
      default: 'width:320px'
    }
  },
  data() {
    return {
      showAddNewCustom: false,
      custom: {

      },
      addParam: {
        name: ''
      },
      loading: false,
      options: []
    }
  },
  methods: {
    async querySearch(val, customId) {
      if (val) {
        const options = await getCustomerList({ name: val, type: this.accessType })
        this.custom.options = options.filter(e => e.value)
        this.$forceUpdate()
      } else if (customId) {
        getCustomerList({ name: '', type: this.accessType }).then(res => {
          this.$set(this.custom, 'options', res)
          this.$set(this.custom, 'id', customId)
          // this.custom.options = res
          // this.custom.id = customId
          this.handleChange()
          this.$forceUpdate()
        })
      } else {
        const options = await getCustomerList({ name: val, type: this.accessType })
        this.custom.options = options
        this.$forceUpdate()
        // this.custom.options = []
      }
    },
    async handleChange(val) {
      this.$emit('input', this.custom.id)
    },
    saveCustom() {
      if (this.addParam.name) {
        createCustomer({ name: this.addParam.name }).then((res) => {
          this.showAddNewCustom = false
          this.querySearch(undefined, res)
        })
      } else {
        this.$message.warning('请输入客户名称')
      }
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
