<template>
    <div class="app-container">
         <el-form inline label-width="120px">            
            <el-form-item label="充值订单号">
              <el-input v-model="query.orderNo" clearable placeholder="请输入销售订单号" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="充值电影卡号">
              <el-input v-model="query.cardCode" clearable placeholder="请输入充值电影卡号" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <remote-select v-model="query.orderStatus" showAllOption clearable placeholder="请输入订单状态" action="/systemApi/dict/getList" :query="{type:'cardRechargeOrderStatus'}" style="width:230px;"></remote-select>
            </el-form-item>
            <el-form-item label="充值时间">
              <el-date-picker v-model="query.time" style="width:230px;"  type="daterange" value-format="yyyy-MM-dd"  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="平台商家">
              <remote-select v-model="query.channelId" showAllOption clearable placeholder="请选择平台商家" action="/systemApi/channel/getList" style="width:200px;"></remote-select>
            </el-form-item>
            <el-form-item label="消费终端">
              <remote-select v-model="query.deviceType" showAllOption clearable placeholder="请输入消费终端" action="/systemApi/dict/getList" :query="{type:'deviceType'}" style="width:230px;"></remote-select>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="success" @click="exportOrders">导出订单</el-button>
              <el-button type="primary" @click="syncStatus">同步订单状态</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="150"  label="充值订单号" align="center" prop="orderNo" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="150"  label="充值电影卡号" align="center" prop="cardCode" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100"  label="充值点数" align="center" prop="point"></el-table-column>
            <el-table-column min-width="80"  label="充值总额" align="center" prop="price"></el-table-column>
            <el-table-column min-width="110"  label="平台商家" align="center" prop="channelName"></el-table-column>
            <el-table-column min-width="110"  label="消费终端" align="center" prop="deviceType"></el-table-column>
            <el-table-column min-width="130"  label="充值时间" align="center" prop="createTime"></el-table-column>
            <el-table-column min-width="100"  label="订单状态" align="center" prop="orderStatusName"></el-table-column>
            <el-table-column min-width="250"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/finace_center/finance_report/card_recharge_order/order_detail', query:{orderId:row.id}})">查看详情</el-button>
                <el-button type="text" @click="getOrderStatus(row)">同步订单状态</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
import { exportData, realDeepClone } from '@/utils'
import CustomerSelector from '@/components/CustomerSelector'
import ChannelSelector from '@/components/ChannelSelector'
import { getCardRechargeOrderPageList, getCardRechargeBatchOrderStatus, getSyncOrderCardRechargeStatus, exportOrderRechargeData } from '@/api/financeCenter'
export default {
  components: { CustomerSelector, ChannelSelector },
  name: 'card_recharge_order',
  data() {
    return {
      query: {
        orderNo: '',
        cardCode: '',
        orderStatus: '-1',
        time: [],
        channelId: '-1',
        deviceType: '-1'
      }
    }
  },
  methods: {
    queryTable(outQuery) {
      const req = realDeepClone(outQuery)
      if (req.time && req.time.length === 2) {
        req.stime = req.time[0]
        req.etime = req.time[1]
      }
      // delete req.time
      return getCardRechargeOrderPageList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    exportOrders() {
      const req = realDeepClone(this.query)
      if (req.time && req.time.length === 2) {
        req.stime = req.time[0]
        req.etime = req.time[1]
      }
      exportData(exportOrderRechargeData, req)
    },
    async getOrderStatus(row) {
      await getSyncOrderCardRechargeStatus({ orderId: row.id })
      this.$message.success('获取成功')
      this.refreshTable()
    },
    syncStatus() {
      this.$confirm(`由于更新订单状态比较耗时，默认只更新近两周内的订单状态，如果需要更新更长时间的订单状态可自行选择自定义时间进行查询更新，所需时间也会相应增加！`, '温馨提示', { type: 'warning' }).then(async() => {
        const loading = this.$loading({
          lock: true,
          text: '正在同步订单状态',
          spinner: 'el-icon-loading'
        })
        const query = Object.assign({}, this.query)
        query.page = 1
        query.pageSize = 10
        const func = async() => {
          try {
            await getCardRechargeBatchOrderStatus(query)
            this.$message.success('同步成功')
            loading.close()
          } catch (error) {
            if (error.status === 30001) {
              query.page += 1
              func()
            } else {
              loading.close()
            }
          }
        }
        func()
      })
    }
  },
  create() {
    console.log(this.$store.state)
  }
}
</script>

<style scoped>

</style>

