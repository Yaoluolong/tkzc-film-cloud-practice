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

      <el-tabs  v-model="query.isSetWarn" @tab-click="tabClick">
        <el-tab-pane label="已设置" name="1"></el-tab-pane>
        <el-tab-pane label="未设置" name="0"></el-tab-pane>
      </el-tabs>
      <page-table ref="table" :query="query" :fetch="queryTable">
        <el-table-column width="90" label="活动ID" align="center" prop="id" ></el-table-column>
        <el-table-column width="180" label="活动名称" align="center" v-if="query.isSetWarn==='1'" :key="Math.random()" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-button type="text" @click="$router.push({path:'/operation_center/marketing_activities/view_check_account',query:{id:row.id}})">{{row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column width="180" label="活动名称" align="center" prop="name" v-if="query.isSetWarn==='0'" :key="Math.random()"></el-table-column>
        <el-table-column width="120"  label="投放商家" align="center" prop="channelStr"></el-table-column>
        <el-table-column min-width="120"  label="活动类型" align="center" prop="typeStr" show-overflow-tooltip></el-table-column>           
        <el-table-column width="100"  label="发起人" align="center" prop="operator" v-if="query.isSetWarn==='1'" :key="Math.random()"></el-table-column>
        <el-table-column width="100"  label="发起人" align="center" prop="creatorStr" v-if="query.isSetWarn==='0'" :key="Math.random()"></el-table-column>
        <el-table-column width="120"  label="当前预警值(%)" align="center" prop="warningRatio" v-if="query.isSetWarn==='1'" :key="Math.random()"></el-table-column>
        <el-table-column width="120"  label="活动已用金额" align="center" prop="useActivityFee" v-if="query.isSetWarn==='1'" :key="Math.random()"></el-table-column>
        <el-table-column width="120"  label="预警状态" align="center" prop="warnStatusStr" v-if="query.isSetWarn==='1'" :key="Math.random()"></el-table-column>
        <!-- 预警状态 0、未开始  1、已生效  2、已触警  3、已关停 -->
        <el-table-column min-width="180"  label="预警操作" align="center" prop="oper" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text"  v-if="query.isSetWarn ==='1' && row.warnStatus==='3'" @click="$router.push({path:'/operation_center/marketing_activities/activities_warn_setting',query:{id:row.id,entrance:'edit'}})">编辑预警</el-button>
            <el-button type="text"  v-if="query.isSetWarn ==='1' && row.warnStatus==='3'" @click="advanceRecovery(row)">恢复预警</el-button>
            <el-button type="text"  v-if="query.isSetWarn ==='1' && row.warnStatus==='1'" @click="advanceRecord(row)">提前对账</el-button>
            <el-button type="text"  v-if="query.isSetWarn ==='1' && (row.warnStatus==='1'||row.warnStatus==='2')" @click="downWarning(row)">关停预警</el-button>
            <el-button type="text" v-if="query.isSetWarn ==='0'" @click="$router.push({path:'/operation_center/marketing_activities/activities_warn_setting',query:{id:row.id}})">设置预警</el-button>
          </template>
        </el-table-column>
      </page-table>      
    </div>
</template>

<script>
	import OperatorIdSelector from '@/components/OperatorIdSelector'
import { activityWarnList, activitySetWarnStatus, activityWarnAccountSendAccount } from '@/api/activitySetting'
export default {
  name: 'activities_warning',
  components: { OperatorIdSelector },
  data() {
    return {
      query: {
        name: '',
        channelIds: '',
        creatorId: '',
        isSetWarn: '1'
      },
      formRule: {
        amount: { required: true, message: '请输入补充预付款', trigger: 'blur' }
      }
    }
  },
  methods: {
    tabClick() {
      window.sessionStorage.setItem(`query.isSetWarn`, this.query.isSetWarn)
      this.refreshTable()
    },
    queryTable(query) {
      return activityWarnList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    advanceRecovery(row) { // 恢复预警
      this.$confirm(`恢复预警后预警将生效，如超过预警值将会自动生成对账单，是否恢复预警`, '执行提示', { type: 'warning' }).then(async() => {
        await activitySetWarnStatus({ id: row.id, warnStatus: '1' }).then(res => {
          this.$message({
            type: 'success',
            message: '恢复成功!'
          })
          this.refreshTable()
        }).catch(e => {
          this.$message({
            type: 'warning',
            message: e.content
          })
        })
      })
    },
    advanceRecord(row) { // 提前对账
      this.$confirm(`提前对账将根据当前预警值生成一条对账单，请提醒财务前往对账`, '执行提示', { type: 'warning' }).then(async() => {
        await activityWarnAccountSendAccount({ id: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '申请提前对账成功!'
          })
          this.refreshTable()
        }).catch(e => {
          this.$message({
            type: 'warning',
            message: e.content
          })
        })
      })
    },
    downWarning(row) { // 关停预警
      this.$confirm(`关停预警后预警将失效，确定关闭预警？`, '执行提示', { type: 'warning' }).then(async() => {
        await activitySetWarnStatus({ id: row.id, warnStatus: '3' }).then(res => {
          this.$message({
            type: 'success',
            message: '关停成功!'
          })
          this.refreshTable()
        }).catch(e => {
          this.$message({
            type: 'warning',
            message: e.content
          })
        })
      })
    }
  }
}
</script>

<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
