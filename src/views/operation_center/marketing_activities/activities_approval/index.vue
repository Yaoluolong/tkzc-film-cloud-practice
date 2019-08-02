<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="活动名称">
             <el-input clearable  v-model="query.name" style="width:200px;" placeholder="输入活动名称或ID查询"></el-input>
            </el-form-item>
            <el-form-item label="投放商家">
          		<channel-id-selector v-model="query.channelIds" type="1"></channel-id-selector>
        	  </el-form-item>
            <el-form-item label="发起人">
                <operator-id-selector selectStyle="width:210px" v-model="query.creatorId" placeholder="请输入发起人员名称"></operator-id-selector>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select clearable v-model="query.draftStatus" style="width:200px">
                <el-option value="all" label="全部"></el-option>
                <el-option value="1" label="未审核"></el-option>
                <el-option value="3" label="已审核"></el-option>
              </el-select>
            </el-form-item>                            
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="60"  label="活动ID" align="center" prop="id" show-overflow-tooltip></el-table-column>
            <el-table-column width="180"  label="活动名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column width="120"  label="投放商家" align="center" prop="channelStr"></el-table-column>
            <el-table-column min-width="120"  label="活动类型" align="center" prop="typeStr"></el-table-column>           
            <el-table-column width="100"  label="发起人" align="center" prop="creatorStr"></el-table-column>
            <el-table-column min-width="80"  label="一级审批" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/marketing_activities/activities_approval_edit',query:{id:row.id,level:'1'}})">{{row.check1||''}}</el-button>
              </template>
            </el-table-column>
            <el-table-column min-width="80"  label="二级审批" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="check2Method(row)">{{row.check2||''}}</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
	import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getCheckPageList } from '@/api/activitySetting'
export default {
  name: 'activities_approval',
  components: { OperatorIdSelector },
  data() {
    return {
      query: {}
    }
  },
  methods: {
    queryTable(query) {
      return getCheckPageList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    check2Method(row) {
      if (row.check1Status === 0) {
        this.$message.warning('请先执行一级审批')
        return
      }
      this.$router.push({ path: '/operation_center/marketing_activities/activities_approval_edit', query: { id: row.id, level: '2' }})
    }
  }
}
</script>

<style scoped>

</style>
