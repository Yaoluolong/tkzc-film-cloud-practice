<template>
    <div class="app-container">
      <el-form inline index label-width="120px">
        <el-form-item label="参与用户:">
         <el-input v-model="query.bindingMobile" style="width:200px;" placeholder="输入参与手机号"></el-input>
        </el-form-item>
        <el-form-item label="购票订单号:">
          <el-input v-model="query.orderNo" style="width:200px;" placeholder="输入购票订单号"></el-input>
        </el-form-item>                 
        <el-form-item>
          <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
          <el-button type="success" icon="el-icon-download"  @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>

     <page-table ref="table" :query="query" :fetch="queryTable">
        <el-table-column min-width="80"  label="投放商家" align="center" prop="channelStr" ></el-table-column>
        <el-table-column min-width="120"  label="下单时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="180"  label="参与用户" align="center" prop="bindingMobile"></el-table-column>
        <el-table-column min-width="180"  label="购票订单号" align="center" prop="orderNo" show-overflow-tooltip>          
        </el-table-column>
        <el-table-column min-width="180"  label="订单金额(元)" align="center" prop="totalFee"></el-table-column>
        <el-table-column min-width="120"  label="售价(元)" align="center" prop="settlementTotalFee"></el-table-column>
        <el-table-column min-width="120"  label="支付方式" align="center" prop="payTypeStr"></el-table-column>           
        <el-table-column min-width="50"  label="活动订单状态" align="center" prop="StatusStr"></el-table-column>
        <el-table-column min-width="160"  label="操作" align="center" prop="prev" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" @click="dialogShow(row)">查看详情</el-button>          
          </template>
        </el-table-column>
      </page-table>
      <el-dialog title="活动订单详情" class="sum-info" :visible.sync="detailDialogVisible" width="700px" @close="resetFields('form')">
           <div class="item"><span>活动ID：</span><span>{{params.activityId}}</span></div>
           <div class="item"><span>活动名称：</span><span>{{params.name}}</span></div>
           <div class="item"><span>活动时间：</span><span>{{params.activityPeriod}}</span></div>
           <div class="item"><span>活动平台：</span><span>{{params.channelStr}}</span></div>
           <div class="item"><span>活动影院：</span><span>{{params.cinemaStr}}</span></div>
           
           <div class="item"><span>活动影片：</span><span>{{params.filmStr}}</span></div>
           <div class="item"><span>活动类型：</span><span>{{params.typeStr}}</span></div>
           <div class="item"><span>参与用户：</span><span>{{params.bindingMobile}}</span></div>
           <div class="item"><span>购票手机号：</span><span>{{params.mobile}}</span></div>
           <div class="item"><span>购票影片名称：</span><span>{{params.filmName}}</span></div>
           <div class="item"><span>下单时间：</span><span>{{params.createTime}}</span></div>
           <div class="item"><span>购买数量：</span><span>{{params.seats}}</span></div>
           <div class="item"><span>购买座位：</span><span>{{params.seatInfo}}</span></div>
           <div class="item"><span>购买场次：</span><span>{{params.showTime}}</span></div>
           <div class="item"><span>购买订单号：</span><span>{{params.orderNo}}</span></div>
           <div class="item"><span>购买订单金额：</span><span>{{params.totalFee}}</span></div>
           <div class="item"><span>活动优惠金额：</span><span>{{params.discountFee}}</span></div>
           <div class="item"><span>支付商户订单号：</span><span>{{params.tradeNo}}</span></div>
           <div class="item"><span>活动订单状态：</span><span>{{params.orderStatusStr}}</span></div>
           <div class="item"><span>结算金额：</span><span>{{params.settlementTotalFee}}</span></div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="detailDialogVisible=false" >取 消</el-button>
            </span>
          </el-dialog>
    </div>
</template>

<script>
import { getActivityOrderPageList, getActivityOrderExport, getActivityOrderInfo } from '@/api/activitySetting'
import { realDeepClone } from '@/utils'
export default {
  name: 'activities_detail',
  components: { },
  data() {
    return {
      query: {
        id: '',
        mobile: '',
        orderNo: ''
      },
      params: {

      },
      detailDialogVisible: false
    }
  },
  methods: {
    queryTable(query) {
      query = Object.assign(query, { id: this.$route.query.id })
      const req = realDeepClone(query)
      return getActivityOrderPageList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    async dialogShow(row) {
      this.detailDialogVisible = true
      this.params = await getActivityOrderInfo({ id: row.id })
    },
    exportData() {
      const arrTemp = Object.assign(this.query, { id: this.$route.query.id })
      const loading = this.$loading({
        lock: true,
        text: '正在导出',
        spinner: 'el-icon-loading'
      })
      getActivityOrderExport(arrTemp).then(res => {
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

<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .sum-info .item {
    margin-bottom:20px;
  }
</style>
