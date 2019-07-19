<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="销售订单号">
              <el-input v-model="query.orderNo" clearable placeholder="输入销售订单号查询" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="销售时间">
              <el-date-picker v-model="query.time" style="width:230px;"  type="daterange" value-format="yyyy-MM-dd"  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="业务人员">
              <operator-id-selector selectStyle="width:210px" :accessType="cardLimit" v-model="query.operatorId" placeholder="请输入业务人员名称"></operator-id-selector>
            </el-form-item>
            <el-form-item label="客户名称">
              <customer-selector :accessType="cardLimit" v-model="query.customer" :isAddNew="false" ></customer-selector>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="success" icon="el-icon-tickets" @click="$router.push({path:'/operation_center/gift_card/sold_card_list/create',query:{}})">销售电影卡</el-button>
            </el-form-item>
         </el-form>
         <el-tabs  v-model="query.checkStatus" @tab-click="tabClick">
         	<el-tab-pane label="未提交审核" name="0"></el-tab-pane>
            <el-tab-pane label="已提交审核" name="1"></el-tab-pane>
         </el-tabs>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="250"  label="操作" align="center" prop="oper" v-if="query.checkStatus==='1'" :key="Math.random()">
              <template slot-scope="{row}">
                <div v-if="row.status !== '2'">
                  <el-button type="text" @click="$router.push({path:'/operation_center/gift_card/sold_card_list/edit',query:{orderNo:row.orderNo}})" v-if="query.checkStatus == '0'">编辑/提交审核</el-button>
                  <el-button type="text" @click="cancelSoldCardOrder(row.orderNo)" v-if="query.checkStatus == '0'">撤销订单</el-button>
                  <el-button type="text" @click="$router.push({path:'/operation_center/gift_card/get_sale_card_list',query:{orderNo:row.orderNo}})"  v-if="query.checkStatus !== '0'">销售单明细</el-button>
                  <el-button type="text" @click="cancelSoldCardOrder(row.orderNo)" v-if="row.checkStatus == '1' && query.checkStatus == '1'">撤销销售</el-button>

                  <el-dropdown v-if="row.checkStatus == '4'">
                    <span class="el-dropdown-link">
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="row.checkStatus == '4'">
                        <el-button type="text" @click="$router.push({path:'/operation_center/gift_card/sold_card_list/edit',query:{orderNo:row.orderNo}})">重新编辑/提交审核</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item  v-if="row.checkStatus == '4'">
                        <el-button type="text" @click="cancelSoldCardOrder(row.orderNo)">撤销销售</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div v-else-if="row.status === '2'">
                  <span v-if="row.checkStatus==='0'">{{row.checkStatusName}}</span>
                </div>                
              </template>
            </el-table-column>
            <el-table-column min-width="180"  label="销售订单号" align="center" prop="orderNo" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="120"  label="业务人员" align="center" prop="operator" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100"  label="客户名称" align="center" prop="customerName"></el-table-column>
            <el-table-column min-width="180"  label="销售时间" align="center" prop="saleTime" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="110"  label="销售数量" align="center" prop="num"></el-table-column>
            <el-table-column min-width="180"  label="销售总额(元)" align="center" prop="amount"></el-table-column>
            <el-table-column min-width="110"  label="是否开票" align="center" prop="invoiceTypeName" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="110" v-if="query.checkStatus === '1'"  label="审核状态" align="center" prop="checkStatusName"></el-table-column>
            <el-table-column min-width="250" fixed="right"  label="操作" align="center" prop="oper" v-if="query.checkStatus==='0'" :key="Math.random()">
              <template slot-scope="{row}">
                <div v-if="row.status !== '2'">
                  <el-button type="text" @click="$router.push({path:'/operation_center/gift_card/sold_card_list/edit',query:{orderNo:row.orderNo}})" v-if="query.checkStatus == '0'">编辑/提交审核</el-button>
                  <el-button type="text" @click="cancelSoldCardOrder(row.orderNo)" v-if="query.checkStatus == '0'">撤销订单</el-button>
                  <el-button type="text" @click="$router.push({path:'/operation_center/gift_card/get_sale_card_list',query:{orderNo:row.orderNo}})"  v-if="query.checkStatus !== '0'">销售单明细</el-button>
                  <el-button type="text" @click="cancelSoldCardOrder(row.orderNo)" v-if="row.checkStatus == '1' && query.checkStatus == '1'">撤销销售</el-button>

                  <el-dropdown v-if="row.checkStatus == '4'">
                    <span class="el-dropdown-link">
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="row.checkStatus == '4'">
                        <el-button type="text" @click="$router.push({path:'/operation_center/gift_card/sold_card_list/edit',query:{orderNo:row.orderNo}})">重新编辑/提交审核</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item  v-if="row.checkStatus == '4'">
                        <el-button type="text" @click="cancelSoldCardOrder(row.orderNo)">撤销销售</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div v-else-if="row.status === '2'">
                  <span v-if="row.checkStatus==='0'">{{row.checkStatusName}}</span>
                </div>                
              </template>
            </el-table-column>            
         </page-table>
    </div>
</template>

<script>
import { realDeepClone } from '@/utils'
import CustomerSelector from '@/components/CustomerSelector'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getCardOrderPageList, cancelSoldCardOrder } from '@/api/operationCenter'
export default {
  components: { CustomerSelector, OperatorIdSelector },
  name: 'gift_card_sold_card_list',
  data() {
    return {
      cardLimit: 'cardLimit',
      query: {
        time: [],
        checkStatus: ''
      }
    }
  },
  methods: {
    queryTable(query) {
      const req = realDeepClone(query)
      if (query.time && query.time.length === 2) {
        req.saleTimeS = query.time[0]
        req.saleTimeE = query.time[1]
      }
      delete req.time
      return getCardOrderPageList(req)
    },
    tabClick() {
      window.sessionStorage.setItem(`query.checkStatus`, this.query.checkStatus)
      this.refreshTable()
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    cancelSoldCardOrder(orderNo) {
      this.$confirm(`撤销销售将对电影卡销售订单进行撤单操作,并将销售订单中电影卡还原回未销售状态,是否开始执行?`, '温馨提示', { type: 'warning' }).then(async() => {
        await cancelSoldCardOrder({ orderNo: orderNo })
        this.$message({
          type: 'success',
          message: '撤销成功'
        })
        this.refreshTable()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '撤销失败'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
