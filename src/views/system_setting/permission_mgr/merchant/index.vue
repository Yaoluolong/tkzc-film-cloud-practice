<template>
  <div class="app-container">
        <page-table index :fetch="fetchData">
            <el-table-column  label="商户名称" align="center" prop="name"></el-table-column>
            <el-table-column  label="商户状态" align="center" prop="statusName">
                <template slot-scope="{row}">        
                    <switch-confirm v-model="row.status" :id="row.id" action="/systemApi/channel/setStatus"></switch-confirm>
                </template>
            </el-table-column>
            <el-table-column  label="线上交易调试开关" align="center" prop="debug">
                <template slot-scope="{row}">
                    <switch-confirm v-model="row.debug" :id="row.id" valueName="debug" action="/systemApi/channel/setDebug"></switch-confirm>
                </template>
            </el-table-column>
        </page-table>
  </div>
</template>

<script>
import { getDebugPageList } from '@/api/systemSetting'
export default {
  name: 'merchant_mgr',
  data() {
    return {

    }
  },
  methods: {
    fetchData() {
      return getDebugPageList()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
