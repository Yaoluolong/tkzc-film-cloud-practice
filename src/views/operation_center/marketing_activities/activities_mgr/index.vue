<template>
    <div class="app-container">
      <el-form inline label-width="120px">
        <el-form-item label="活动名称">
         <el-input v-model="query.name" style="width:200px;" placeholder="输入活动名称或ID查询"></el-input>
        </el-form-item>
        <el-form-item label="投放商家">
          <channel-id-selector v-model="query.channelIds" type="1"></channel-id-selector>
        </el-form-item>
        <el-form-item label="活动状态" v-if="query.approvalStatus==='1'">
          <el-select v-model="query.status" style="width:200px">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="1" label="未开始"></el-option>
            <el-option value="2" label="进行中"></el-option>
            <el-option value="3" label="暂停中"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态" v-if="query.approvalStatus==='3'">
          <el-select v-model="query.draftStatus" style="width:200px">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="0" label="未提交"></el-option>
            <el-option value="1" label="审核中"></el-option>
            <el-option value="2" label="被退回"></el-option>
            <!-- <el-option value="3" label="通过"></el-option>备份 --> 
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" v-if="query.approvalStatus==='2'">
          <el-date-picker v-model="time" style="width:230px;"  type="daterange" value-format="yyyy-MM-dd"  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动区域" prop="area">
          <city-cascader ref="city" v-model="area" :rang="2" showAllOptions :clearable="true" placeholder="请选择" style="width:320px;"></city-cascader>
        </el-form-item>             
        <el-form-item>
          <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
          <el-button type="danger" icon="el-icon-plus" v-if="query.approvalStatus!=='2'" @click="$router.push({path:'/operation_center/marketing_activities/activities_mgr/create'})">新增</el-button>
          <el-button type="success" icon="el-icon-download" v-if="query.approvalStatus!=='3'" @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="query.approvalStatus" @tab-click="handleTabChange">
        <el-tab-pane label="运行中" name="1"></el-tab-pane>
        <el-tab-pane label="已结束" name="2"></el-tab-pane>
        <el-tab-pane label="草稿箱" name="3"></el-tab-pane>            
      </el-tabs>
     <page-table ref="table" :query="query" :fetch="queryTable">
        <el-table-column min-width="80" label="活动ID" align="center" prop="id" ></el-table-column>
        <el-table-column min-width="140" label="活动名称" align="center" prop="name">
          <template slot-scope="{row}">
            <span v-if="row.isTop==='1'">(<span style="color:red">置顶</span>)&nbsp;</span>{{row.name}}
          </template>
        </el-table-column>
        <el-table-column min-width="180"  label="活动区域" align="center" prop="regionStr"></el-table-column>
        <el-table-column min-width="180"  label="活动时间" align="center" prop="vaildTime">          
        </el-table-column>
        <el-table-column width="180"  label="活动时段" align="center" prop="activityPeriod">
        </el-table-column>
        <el-table-column min-width="180"  label="投放商家" align="center" prop="channelStr"></el-table-column>
        <el-table-column min-width="120"  label="活动类型" align="center" prop="typeStr"></el-table-column>
        <el-table-column min-width="120"  label="活动状态" align="center" prop="statusStr" v-if="query.approvalStatus!=='3'"></el-table-column>           
        <el-table-column min-width="50"  label="点击量" align="center" prop="hit" v-if="query.approvalStatus!=='3'"></el-table-column>
        <el-table-column min-width="120"  label="审核状态" align="center" prop="auditStatusStr" v-if="query.approvalStatus==='3'"></el-table-column>
        <el-table-column min-width="160"  label="操作" align="center" prop="prev">
          <template slot-scope="{row}">
            <!-- 运行中 or 已结束 -->
            <el-button type="text" @click="$router.push({path:'/operation_center/marketing_activities/activities_Detail',query:{id:row.id}})" v-if="query.approvalStatus!=='3' && !row.canReturn">活动明细</el-button>
            <el-button type="text" @click="activitySetBack(row)" v-if="query.approvalStatus==='1' && row.canReturn">活动撤档</el-button>
            <el-button type="text" @click="gotoViewDetails(row)" v-if="query.approvalStatus==='2'">活动详情</el-button>
            <el-dropdown type="text" v-if="query.approvalStatus==='1'">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="createUrl(row)">生成活动链接</el-dropdown-item>
                <el-dropdown-item @click.native="fillUp(row)" v-if="row.canFeed">补充活动款</el-dropdown-item>
                <el-dropdown-item @click.native="gotoViewDetails(row)">查看详情</el-dropdown-item>
                <el-dropdown-item @click.native="isTopping(row)" v-if="row.unStart">{{row.isTop==='0'?'置顶':'取消置顶'}}</el-dropdown-item>
                <el-dropdown-item @click.native="isStopping(row)" v-if="row.unStart">{{row.isStop==='0'?'暂停':'恢复'}}</el-dropdown-item>
                <el-dropdown-item @click.native="activityDown(row)" v-if="row.unStart">下架</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 草稿箱 -->
            <span v-if="query.approvalStatus==='3' && row.showStatus===1">
              <el-button type="text" @click="gotoApproval(row)" v-if="row.auditStatus!=='1'">提交审核</el-button>&emsp;
              <el-dropdown type="text">
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="activitiesEdit(row)">编辑</el-dropdown-item>
                  <el-dropdown-item @click.native="activitiesDel(row)">删除</el-dropdown-item>
                  <el-dropdown-item @click.native="$router.push({path:'/operation_center/marketing_activities/view_activities_details',query:{id:row.id}})" v-if="row.auditStatus==='4'">退回原因</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> 
            </span>
            <span v-if="query.approvalStatus==='3' && row.showStatus===2">
              <el-button type="text" @click="$router.push({path:'/operation_center/marketing_activities/view_activities_details',query:{id:row.id}})">查看</el-button>
            </span>                 
          </template>
        </el-table-column>
      </page-table>

      <el-dialog :visible.sync="centerDialogVisible" width="500px" :show-close="false" center>
        <div slot="title">
          链接生成成功
        </div>
        <span style="width:450px">访问地址:{{showUrl}}</span>
        <span slot="footer">
          <el-button type="success" @click="copyUrl">复制链接</el-button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button @click="centerDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
      
      <!-- //补充活动款 -->
      <el-dialog title="补充活动款" :visible.sync="fillUpVisible" width="800px" :show-close="false" left>
        <el-form ref="fillUpForm" :model="fillUpParams" :rules="fullUpRules" class="fillUpForm" label-width="180px">
          <span style="color:#aba8a8;margin-bottom:10px;">请对补充活动款金额进行如实填写，由财务复核！</span>
          <el-form-item label="活动补贴总金额：">
            {{fillUpParams.activityInfo.totalAmount}}
          </el-form-item>
          <el-form-item label="当前剩余活动补贴金额：">
            {{fillUpParams.activityInfo.leftFee}}
          </el-form-item>
          <el-form-item label="补充活动款：" prop="activityInfo.addFee">
            <el-input v-model="fillUpParams.activityInfo.addFee" placeholder="填写补充活动款金额" style="width:300px"></el-input>
          </el-form-item>
          <div v-if="!(fillUpParams.weixinPay instanceof Array) && fillUpParams.weixinPay && fillUpParams.weixinPay.activityConfig">
            <h3>微信支付</h3>
            <div v-for="(item,index) in fillUpParams.weixinPay.activityConfig" :key="index">
              <el-form-item label="活动可用制式：">
                {{item.copyType}}
              </el-form-item>
              <el-form-item label="活动补贴消耗上限：" :prop="'weixinPay.activityConfig.'+index+'.ceiling'" :rules="fullUpRules.weixinCeiling" style="margin-bottom:20px;">
                <el-input v-model="item.ceiling" :placeholder="item.ceiling" style="width:300px"></el-input>
              </el-form-item>
            </div>
          </div>
          <div v-if="!(fillUpParams.unionPay instanceof Array)">
            <h3>银联支付</h3>
            <el-form-item label="活动可用制式：">
              {{fillUpParams.unionPay.copyType}}
            </el-form-item>
            <el-form-item label="活动补贴消耗上限：" prop="unionPay.ceiling" style="margin-bottom:20px;">
              <el-input v-model="fillUpParams.unionPay.ceiling" :placeholder="fillUpParams.unionPay.ceiling" style="width:300px"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="补充活动款金额说明：" prop="activityInfo.addFeeContent" class="addFeeContent">
              <el-input type="textarea" v-model="fillUpParams.activityInfo.addFeeContent" placeholder="请输入补充活动款金额说明" style="width:300px"></el-input>
            </el-form-item>
        </el-form>
        <el-button style="margin-top:22px;" type="primary" @click="submitAudit">确认</el-button>
        <el-button @click="cancel" >取消</el-button>
      </el-dialog>
    </div>
</template>

<script>
import CityCascader from '@/components/CityCascader'
import { getActivityPageList, deleteActivity, activityCreateUrl, activitySetTop, activitySetStop, activitySetDown, activitySetApprovalStatus, getActivityOrderExport, activitySetBack, getActivityPayConfig, addActivityFee } from '@/api/activitySetting'
import { realDeepClone } from '@/utils'
import handleClipboard from '@/utils/clipboard'
export default {
  name: 'activities_mgr',
  components: { CityCascader },
  data() {
    return {
      query: {
        name: '',
        channelIds: '',
        status: '-1',
        draftStatus: '-1',
        provinceId: '',
        cityId: '',
        approvalStatus: '1'
      },
      approvalStatus: '1',
      area: ['', ''],
      time: [],
      showUrl: '',
      centerDialogVisible: false,
      fillUpVisible: false,
      fillUpParams: {
        activityInfo: {
          totalAmount: '',
          leftFee: '',
          addFee: '',
          id: ''
        },
        weixinPay: [{
          ceiling: '',
          copyType: '',
          id: ''
        }],
        unionPay: {
          ceiling: '',
          copyType: '',
          id: ''
        }
      },
      fullUpRules: {
        'activityInfo.addFee': { required: true, message: '请填写补充活动款', trigger: 'blur' },
        weixinCeiling: { required: true, message: '请填写活动补贴消耗上限', trigger: 'blur' },
        'unionPay.ceiling': { required: true, message: '请填写活动补贴消耗上限', trigger: 'blur' },
        'activityInfo.addFeeContent': { required: true, message: '请填写补充活动款金额说明', trigger: 'blur' }
      }
    }
  },
  methods: {
    handleTabChange(val) {
      this.$set(this.query, 'status', '-1')
      this.$set(this.query, 'draftStatus', '-1')
      this.$set(this, 'time', [])
      // this.query.approvalStatus = this.approvalStatus
      this.refreshTable()
    },
    queryTable(query) {
      if (query.approvalStatus === '2') {
        this.$set(query, 'startTime', this.time[0])
        this.$set(query, 'endTime', this.time[1])
        this.$set(query, 'status', '')
      } else {
        this.$set(query, 'startTime', '')
        this.$set(query, 'endTime', '')
      }
      query.provinceId = this.area[0]
      query.cityId = this.area[1]
      query.countryId = this.area[2]
      const req = realDeepClone(query)
      return getActivityPageList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    // 生成复制链接
    copyUrl(event) {
      handleClipboard(this.showUrl, event)
    },
    async createUrl(row) {
      this.showUrl = await activityCreateUrl({ id: row.id })
      this.centerDialogVisible = true
    },
    // 活动详情
    gotoViewDetails(row) {
      this.$router.push({ path: '/operation_center/marketing_activities/view_activities_details', query: { id: row.id }})
    },
    // 是否置顶
    isTopping(row) {
      const isTopTemp = row.isTop === '1' ? '0' : '1'
      activitySetTop({ id: row.id, isTop: isTopTemp }).then(res => {
        this.refreshTable()
      })
    },
    // 是否暂停
    isStopping(row) {
      const isStopTemp = row.isStop === '1' ? '0' : '1'
      const isStopTip1 = row.isStop === '0' ? '暂停' : '恢复'
      const isStopTip2 = row.isStop === '1' ? '活动恢复后将继续进行，确认恢复活动？' : '活动暂停将暂时停止活动，确认暂停活动？'
      this.$confirm(isStopTip2, '下架提示', { type: 'warning' }).then(async() => {
        await activitySetStop({ id: row.id, isStop: isStopTemp })
        this.$message({
          type: 'success',
          message: `活动` + isStopTip1 + `成功!`
        })
        this.refreshTable()
      })
    },
    // 提交审核
    gotoApproval(row) {
      activitySetApprovalStatus({ id: row.id, approvalStatus: '1' }).then(res => {
        this.$message({
          type: 'success',
          message: `提交审核成功!`
        })
        this.refreshTable()
      })
    },
    // 编辑
    activitiesEdit(row) {
      this.$router.push({ path: '/operation_center/marketing_activities/activities_mgr/edit', query: { id: row.id }})
    },
    // 删除
    activitiesDel(row) {
      this.$confirm(`删除后活动记录将从列表删除，确认删除活动？`, '删除提示', { type: 'warning' }).then(async() => {
        await deleteActivity({ id: row.id })
        this.$message({
          type: 'success',
          message: '活动下架成功!'
        })
        this.refreshTable()
      })
    },
    activityDown(row) { // 活动下架
      const isDownTemp = row.isDown === '1' ? '0' : '1'
      this.$confirm(`活动下架后不可恢复，确认下架活动？`, '下架提示', { type: 'warning' }).then(async() => {
        await activitySetDown({ id: row.id, isDown: isDownTemp })
        this.$message({
          type: 'success',
          message: '活动下架成功!'
        })
        this.refreshTable()
      })
    },
    activitySetBack(row) { // 活动撤档
      this.$confirm(`活动撤档后需要重新提交审核，确认撤档？`, '温馨提示', { type: 'warning' }).then(async() => {
        await activitySetBack({ id: row.id })
        this.$message({
          type: 'success',
          message: '活动撤档成功!'
        })
        this.refreshTable()
      })
    },
    async fillUp(row) { // 补充活动款
      this.fillUpVisible = true
      if (this.$refs.fillUpForm !== undefined) {
        this.$refs.fillUpForm.resetFields()
      }
      this.fillUpParams = await getActivityPayConfig({ id: row.id })
    },
    submitAudit() {
      console.log(this.fillUpParams)
      this.$refs.fillUpForm.validate(valid => {
        if (valid) {
          this.$confirm(`补充活动款完成后，请通知财务对进行确认收款的操作，收款后活动上限将根据设置金额生效并自动恢复活动`, '温馨提示', { type: 'warning' }).then(async() => {
            addActivityFee(this.fillUpParams).then(res => {
              this.$message({
                type: 'success',
                message: '补充完成'
              })
              this.fillUpVisible = false
              this.refreshTable()
            })
          })
        }
      })
    },
    cancel() {
      this.fillUpVisible = false
    },
    exportData() {
      const loading = this.$loading({
        lock: true,
        text: '正在导出',
        spinner: 'el-icon-loading'
      })
      const query = this.query
      if (query.approvalStatus === '2') {
        if (this.time) {
          this.$set(query, 'startTime', this.time[0])
          this.$set(query, 'endTime', this.time[1])
        }
        this.$set(query, 'status', '')
      } else {
        this.$set(query, 'startTime', '')
        this.$set(query, 'endTime', '')
      }
      query.provinceId = this.area[0]
      query.cityId = this.area[1]
      query.countryId = this.area[2]
      getActivityOrderExport(query).then(res => {
        loading.close()
        this.$message({
          type: 'success',
          message: '导出成功!'
        })
        location.href = res.url
      }).catch(e => {
        loading.close()
      })
    }
  }
}
</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .fillUpForm .el-form-item {
    margin-bottom: 10px;
  }
  .addFeeContent .el-textarea__inner {
    height: 100px !important;
  }
</style>
