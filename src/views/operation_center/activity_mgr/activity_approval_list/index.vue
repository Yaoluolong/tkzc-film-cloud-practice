<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="活动名称">
             <el-input v-model="query.activity_subject" style="width:200px;" placeholder="请输入活动名称"></el-input>
            </el-form-item>
            <el-form-item label="活动类型">
              <el-select v-model="query.activity_type" style="width:200px">
                <el-option value="all" label="全部"></el-option>
                <el-option value="cash" label="现金支付"></el-option>
                <el-option value="coupon" label="抢券活动"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建人">
              <operator-id-selector selectStyle="width:210px" v-model="query.creator_id" placeholder="请输入业务人员名称"></operator-id-selector>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select v-model="query.audit_status" style="width:200px">
                <el-option value="all" label="全部"></el-option>
                <el-option value="1" label="未审核"></el-option>
                <el-option value="3" label="已审核"></el-option>
                <el-option value="2" label="退回"></el-option>
              </el-select>
            </el-form-item>              
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="50"  label="活动名称" align="center" prop="activity_subject" ></el-table-column>
            <el-table-column width="180"  label="创建人" align="center" prop="creator"></el-table-column>
            <el-table-column width="120"  label="活动类型" align="center" prop="activity_type"></el-table-column>
            <el-table-column min-width="120"  label="活动时间" align="center" prop="showtime">
              <template slot-scope="{row}">
                {{row.activity_start_boundary}}--{{row.activity_end_boundary}}
              </template>
            </el-table-column>           
            <el-table-column width="160"  label="活动地区" align="center" prop="region_name"></el-table-column>
            <el-table-column width="160"  label="审核状态" align="center" prop="audit_status">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/activity_mgr/activity_approval_detail',query:{activity_id:row.activity_id,status:row.audit_code}})">{{row.audit_status}}</el-button>                
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
	import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getActivityApprovalList, setActivityOffLine, delActivityById } from '@/api/activitySetting'
export default {
  name: 'activity_approval_list',
  components: { OperatorIdSelector },
  data() {
    return {
      query: {
        activity_subject: '',
        activity_type: 'all',
        creator_id: '',
        audit_status: 'all'
      }
    }
  },
  methods: {
    queryTable(query) {
      return getActivityApprovalList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    obtainedActivity(row) {
      console.log(row)
      this.$confirm(`活动下架后将从活动版块中删除是否确认下架？`, '删除提示', { type: 'warning' }).then(async() => {
        await setActivityOffLine({ activity_id: row.activity_id })
        this.$message({
          type: 'success',
          message: '活动下架成功!'
        })
        this.refreshTable()
      })
    },
    deleteActivity(row) {
      this.$confirm(`活动删除后，将自动下架，是否执行？`, '删除提示', { type: 'warning' }).then(async() => {
        await delActivityById({ activity_id: row.activity_id })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.refreshTable()
      })
    }
  }
}
</script>

<style scoped>

</style>
