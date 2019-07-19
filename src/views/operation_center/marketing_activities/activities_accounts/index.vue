<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="活动名称">
             <el-input v-model="query.name" style="width:200px;" placeholder="输入活动名称或ID查询"></el-input>
            </el-form-item>
            <el-form-item label="投放商家">
          		<channel-id-selector v-model="query.channelIds" type="1"></channel-id-selector>
        	  </el-form-item>
            <el-form-item label="发起人">
                <operator-id-selector selectStyle="width:210px" v-model="query.creatorId" placeholder="请输入发起人员名称"></operator-id-selector>
            </el-form-item>                            
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" :query="query" :fetch="queryTable">
            <el-table-column width="100"  label="活动ID" align="center" prop="id" show-overflow-tooltip></el-table-column>
            <el-table-column width="180"  label="活动名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column width="120"  label="投放商家" align="center" prop="channelStr"></el-table-column>
            <el-table-column min-width="120"  label="活动类型" align="center" prop="typeStr"></el-table-column>           
            <el-table-column width="100"  label="发起人" align="center" prop="creatorStr"></el-table-column>
            <el-table-column width="140"  label="触发时预警值(%)" align="center" prop="warnPercent"></el-table-column>
            <el-table-column width="140"  label="触警时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column width="180"  label="活动已使用金额(元)" align="center" prop="useFee"></el-table-column>
            <el-table-column min-width="80"  label="对账状态" align="center" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" v-if="row.type!=='2'" @click="$router.push({path:'/operation_center/marketing_activities/check_accounts',query:{id:row.warnAccountId}})">请对账</el-button>
                <el-button type="text" v-if="row.type!=='2'" @click="exportData(row)">导出明细</el-button>
                <el-button type="text" v-if="row.type==='2'" @click="$router.push({path:'/operation_center/marketing_activities/suppl_advance_pay',query:{id:row.warnAccountId}})">补充活动款对账</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
	import OperatorIdSelector from '@/components/OperatorIdSelector'
import { activityWarnAccountList, getActivityOrderExport } from '@/api/activitySetting'
// import { exportData } from '@/utils'
export default {
  name: 'activities_accounts',
  components: { OperatorIdSelector },
  data() {
    return {
      query: {}
    }
  },
  methods: {
    queryTable(query) {
      return activityWarnAccountList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    exportData(row) {
      const loading = this.$loading({
        lock: true,
        text: '正在导出',
        spinner: 'el-icon-loading'
      })
      getActivityOrderExport({ discountOrderId: row.discountOrderId, activityId: row.id }).then(res => {
        console.log(res)
        loading.close()
        location.href = res.url
      }).catch(e => {
        loading.close()
      })
    }
  }
}
</script>

<style scoped>

</style>
