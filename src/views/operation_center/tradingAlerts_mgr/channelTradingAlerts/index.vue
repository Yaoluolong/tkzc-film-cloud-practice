<template>
    <div class="app-container">
    	<el-tabs  v-model="query.checkStatus" @tab-click="tabClick(query.checkStatus)">
         	<el-tab-pane label="预警管理" name="0"></el-tab-pane>
            <el-tab-pane label="交易对账" name="1"></el-tab-pane>
         </el-tabs>
        <el-form inline label-width="120px">
        	<el-form-item label="商家名称">            
            <el-input v-model="query.channelName" style="width:200px;" placeholder="输入商家名称模糊查询"></el-input>
          </el-form-item>
          <el-form-item label="预警状态" v-if="query.checkStatus ==='1'">
            <!-- <el-select v-model="query.warnStatus">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="未触警" value="1"></el-option>
              <el-option label="已触警" value="2"></el-option>
              <el-option label="关闭触警" value="3"></el-option>
            </el-select> -->
            <remote-select v-model="query.warnStatus" clearable showAllOption placeholder="请选择电影券类型" action="/systemApi/dict/getList" :query="{type:'platformWarnStatus'}" ></remote-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="refreshTable" v-if="query.checkStatus ==='0'">查询</el-button>
            <el-button type="primary" icon="el-icon-search" @click="refreshCheckAccountTable" v-if="query.checkStatus ==='1'">查询</el-button>
          </el-form-item>
        </el-form>
     	<page-table ref="table" index :query="query" :fetch="queryTable" v-show="query.checkStatus ==='0'">
        <el-table-column min-width="100"  label="商家名称" align="center" prop="name" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-button type="text" @click="$router.push({path:'/operation_center/paltform_trading_alerts_mgr/view_account_detail',query:{channelId:row.channelId}})">{{row.name}}</el-button>     
          </template>
        </el-table-column>
        <el-table-column min-width="120"  label="消费终端" align="center" prop="consumerDeviceType" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="180"  label="商家类型" align="center" prop="typeName"></el-table-column>
        <el-table-column min-width="100"  label="接入时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="100"  label="商家可售影院数" align="center" prop="cinemaNum"></el-table-column>
        <el-table-column width="80"  label="启用状态" align="center" prop="isWarning">
          <template slot-scope="{row}">
            <switch-confirm v-model="row.isWarning" confirm-text="是否进行此操作" valueName="isWarning" isRefreshTable idKey="channelId" :id="row.channelId" action="/systemApi/platformWarn/setStatus" @submitChange="refreshTable"></switch-confirm>
          </template>
        </el-table-column>
        <el-table-column min-width="250"  label="配置预警" align="center" prop="oper">
          <template slot-scope="{row}">
          	<el-button type="text" @click="isPass('1',row.channelId , {channelId:row.channelId}, 'channel_trading')" :disabled="row.isWarning==='1'">{{row.isSetWarning==='1'? '已设置':'未设置'}}</el-button>
          </template>
      	</el-table-column>
      </page-table>
      <page-table ref="checkAccountTable" index :query="query" :fetch="checkAccountTable" v-show="query.checkStatus ==='1'">
        <el-table-column min-width="100"  label="商家名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="120"  label="消费终端" align="center" prop="consumerDeviceType" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="180"  label="商家类型" align="center" prop="typeName"></el-table-column>
        <el-table-column min-width="100"  label="售票总数（张）" align="center" prop="sellTicketNum"></el-table-column>
        <el-table-column min-width="100"  label="售票总额（元）" align="center" prop="sellTicketAmount"></el-table-column>
        <el-table-column min-width="100"  label="预付金（元）" align="center" prop="prePayAmount"></el-table-column>
        <el-table-column min-width="100"  label="预警值%" align="center" prop="warnPercent"></el-table-column>
        <el-table-column min-width="100"  label="预警状态" align="center" prop="warnStatusName"></el-table-column>
        <el-table-column min-width="250"  label="操作" align="center" prop="oper" fixed="right">
          <template slot-scope="{row}">
            <el-button 
              type="text" 
              @click="isPass('2',row.channelId , {channelId:row.channelId}, 'not_in_force_trading')"
              v-if="row.warnStatus==='0'">
              {{row.warnStatus==='0'? '请确认':(row.warnStatus==='1'?'--':(row.warnStatus==='2'?'请对账':'--'))}}
            </el-button>
            <el-button 
              type="text" 
              @click="isPass('2',row.channelId , {channelId:row.channelId}, 'reach_alerts')"              
              v-if="row.warnStatus==='2'">
              {{row.warnStatus==='0'? '请确认':(row.warnStatus==='1'?'--':(row.warnStatus==='2'?'请对账':'--'))}}
            </el-button>
          </template>
        </el-table-column>
      </page-table>
    </div>
</template>
<script>
import { getPlatformWarnPageList, getCheckAccountPageList, checkPlatformWarnAuthority } from '@/api/operationCenter'
import { realDeepClone } from '@/utils'

export default{
  name: 'channel_trading_alerts',
  data() {
    return {
      query: {
        checkStatus: '0',
        channelId: '',
        warnStatus: '-1'
      }
    }
  },
  watch: {

  },
  methods: {
    queryTable(query) {
      const req = realDeepClone(query)
      return getPlatformWarnPageList(req)
    },
    checkAccountTable(query) {
      const req = realDeepClone(query)
      return getCheckAccountPageList(req)
    },
    tabClick(val) {
      if (val === '0') {
        this.refreshTable()
      } else {
        this.refreshCheckAccountTable()
      }
      window.sessionStorage.setItem(`query.alertsStatus`, this.query.alertsStatus)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    refreshCheckAccountTable() {
      this.$refs.checkAccountTable.refresh()
    },
    isPass(type, channelId, query, tableName) {
      checkPlatformWarnAuthority({ type: type, channelId: channelId }).then(res => {
        this.$router.push({ path: '/operation_center/paltform_trading_alerts_mgr/' + tableName, query: query })
      }).catch(e => {
        this.$message.warning('无权访问')
      })
    }
  }
}
</script>