<template>
    <div class="app-container">
         <el-form inline label-width="120px">
           <el-form-item label="投放商家">
             <channel-id-selector v-model="query.merchant"  style="width:200px;" type="1"></channel-id-selector>
            </el-form-item>
            <el-form-item label="活动状态">
              <el-select clearable v-model="query.activity_status" style="width:200px">
                    <el-option value="all" label="全部"></el-option>
                    <el-option value="draft" label="未提交"></el-option>
                    <el-option value="pending" label="未开始"></el-option>
                    <el-option value="running" label="进行中"></el-option>
                    <el-option value="finished" label="已结束"></el-option>
                    <el-option value="processing" label="审批中"></el-option>
                    <el-option value="returned" label="退回"></el-option>
                    <el-option value="off" label="已下架"></el-option>
              </el-select>              
            </el-form-item>
            <el-form-item label="活动类型">
              <el-select clearable v-model="query.activity_type" style="width:200px">
                <el-option value="all" label="全部"></el-option>
                <el-option value="cash" label="现金支付"></el-option>
                <el-option value="coupon" label="抢券活动"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动名称">
             <el-input clearable v-model="query.activity_subject" style="width:200px;" placeholder="请输入活动名称"></el-input>
            </el-form-item>              
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push({path:'/operation_center/activity_mgr/activity_list/create',query:{setting:'1'}})">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="150"  label="投放商家" align="center" prop="merchant" ></el-table-column>
            <el-table-column width="180"  label="活动图" align="center" prop="activity_banner">
              <template slot-scope="{row}">
                <img :src="row.activity_banner"  style="width:150px;height:80px"/>
              </template>
            </el-table-column>
            <el-table-column width="120"  label="活动名称" align="center" prop="activity_subject"></el-table-column>
            <el-table-column min-width="120"  label="投放时间" align="center" prop="showtime">
            </el-table-column>           
            <el-table-column width="160"  label="前端标签" align="center" prop="activity_tag"></el-table-column>
            <el-table-column width="160"  label="活动类型" align="center" prop="activity_type"></el-table-column>
            <el-table-column width="160"  label="最后配置时间" align="center" prop="last_modified"></el-table-column>
            <el-table-column width="160"  label="活动状态" align="center" prop="status_str"></el-table-column>
            <el-table-column min-width="220"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/activity_mgr/view_activity_approval_detail',query:{activity_id:row.activity_id}})" v-if="row.status_code ==='running' || row.status_code ==='finished'|| row.status_code ==='processing'|| row.status_code ==='pending'">查看活动</el-button>
                <el-button type="text" @click="$router.push({path:'/operation_center/activity_mgr/view_activity_detail',query:{activity_id:row.activity_id}})" v-if="row.status_code ==='running' || row.status_code ==='finished'|| row.status_code ==='off'">活动明细</el-button>
                <el-button type="text" @click="obtainedActivity(row)" v-if="row.status_code ==='running' || row.status_code ==='finished' || row.status_code ==='pending'">下架</el-button>
                <el-button type="text" @click="$router.push({path:'/operation_center/activity_mgr/activity_list/edit',query:{activity_id:row.activity_id,setting:'1'}})" v-if="row.status_code ==='draft'||row.status_code ==='returned'">编辑</el-button>
                <el-button type="text" @click="$router.push({path:'/operation_center/activity_mgr/activity_list/edit',query:{activity_id:row.activity_id,setting: '2'}})" v-if="row.status_code ==='draft'||row.status_code ==='returned'">配置规则</el-button>
                <el-button type="text" @click="deleteActivity(row)" v-if="row.status_code ==='draft'||row.status_code ==='returned'">删除</el-button>
                <el-button type="text" @click="$router.push({path:'/operation_center/activity_mgr/view_activity_approval_detail',query:{activity_id:row.activity_id}})" v-if="row.status_code ==='returned'">退回原因</el-button>
              </template>
            </el-table-column>
            <!-- processing 审批中、returned 退回、draft 未提交、pending 未开始、finished 已结束、running 进行中 -->
         </page-table>
    </div>
</template>

<script>
    import { getActivityList, setActivityOffLine, delActivityById } from '@/api/activitySetting'
    export default {
      name: 'activity_list',
      data() {
        return {
          query: {
            mechant: '',
            activity_status: 'all',
            activity_type: 'all'
          }
        }
      },
      methods: {
        queryTable(query) {
          return getActivityList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        obtainedActivity(row) {
          this.$confirm(`活动下架后将从活动版块删除且无法重新上架，是否确认下架？`, '删除提示', { type: 'warning' }).then(async() => {
            await setActivityOffLine({ activity_id: row.activity_id })
            this.$message({
              type: 'success',
              message: '活动下架成功!'
            })
            this.refreshTable()
          })
        },
        deleteActivity(row) {
          this.$confirm(`活动删除后将从活动版块中删除，是否确认删除？`, '删除提示', { type: 'warning' }).then(async() => {
            await delActivityById({ activity_id: row.activity_id })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.refreshTable()
          })
        },
        returnedActivity(row) {

        }
      }
    }
</script>

<style scoped>

</style>
