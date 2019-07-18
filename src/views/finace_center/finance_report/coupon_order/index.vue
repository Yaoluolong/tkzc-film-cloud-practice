<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="销售日期">
              <el-date-picker v-model="query.time" style="width:230px;"  type="daterange" value-format="yyyy-MM-dd"  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="销售单号">
              <el-input v-model="query.orderNo" clearable placeholder="请输入销售订单号" style="width:230px;"></el-input>
            </el-form-item>
            
            <el-form-item label="业务人员">
              <operator-id-selector selectStyle="width:210px" :accessType="couponOrderLimit" v-model="query.operatorId" placeholder="请输入业务人员名称"></operator-id-selector>
            </el-form-item>
            <el-form-item label="客户名称">
              <customer-selector :accessType="couponOrderLimit" v-model="query.customer" :isAddNew="false" ></customer-selector>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="success" icon="el-icon-upload2" @click="exportData">导出汇总</el-button>
              <el-button type="success" icon="el-icon-upload2" @click="exportDetail">导出明细</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" :query="query" :fetch="queryTable">
            <el-table-column min-width="120"  label="业务人员" align="center" prop="operator" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100"  label="客户名称" align="center" prop="customerName"></el-table-column>            
            <el-table-column min-width="100"  label="销售总额" align="center" prop="amount"></el-table-column>
            <!-- <el-table-column min-width="180"  label="兑付/优惠影片面值" align="center" prop="priceRule"></el-table-column>
            <el-table-column min-width="150"  label="实际兑付/优惠总额" align="center" prop="exchangeAmount"></el-table-column> -->
            <el-table-column min-width="110"  label="消费总数" align="center" prop="useNum"></el-table-column>
            <el-table-column min-width="110"  label="剩余总数" align="center" prop="surplus"></el-table-column>
            <el-table-column min-width="100"  label="使用率(%)" align="center" prop="usePercet"></el-table-column>
            <el-table-column min-width="100"  label="兑付率(%)" align="center" prop="exchangePercet"></el-table-column>

            <el-table-column min-width="100"  label="销售总数" align="center" prop="num"></el-table-column>                                             
            <el-table-column min-width="100"  label="激活数" align="center" prop="activeNum"></el-table-column>
            <el-table-column min-width="100"  label="冻结数" align="center" prop="frozenNum"></el-table-column>
            <el-table-column min-width="100"  label="作废数" align="center" prop="voidNum"></el-table-column>
            <el-table-column min-width="100"  label="过期数" align="center" prop="overNum"></el-table-column>
            <!-- <el-table-column min-width="100"  label="订单状态" align="center" prop="orderStatusName"></el-table-column> -->
            <el-table-column min-width="100"  label="操作" align="center" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" @click="openDetail({orderNo:row.orderNo})">查看</el-button>
              </template>
            </el-table-column>
         </page-table>
         <el-dialog title="电影券销售订单详情" class="sum-info" :visible.sync="detailDialogVisible" width="700px" @close="resetFields('form')">
           <div class="item"><span>销售订单号：</span><span>{{params.orderNo}}</span></div>
           <div class="item"><span>销售时间：</span><span>{{params.saleTime}}</span></div>
           <div class="item"><span>业务人员：</span><span>{{params.operator}}</span></div>
           <div class="item"><span>客户名称：</span><span>{{params.customerName}}</span></div>
           <div class="item"><span>电影券种类：</span><span>{{params.typeName}}</span></div>
           <div class="item" v-if="params.type!=='2'"><span>可兑付影片面值：</span><span>{{params.priceRule}}元</span></div>
           <div class="item" v-else=""><span>可优惠影片面值：</span><span>{{params.priceRule}}元</span></div>
           <div class="item" v-if="params.type==='3' && diffType==='1'"><span>补差金额：差额补差（影片售价-最大兑付影片面值）</span></div>
           <div class="item" v-if="params.type==='3' && diffType==='2'">
              
              <div v-for="(item, index) in ruleText">
                <span v-if="index===0">补差金额：{{item}}</span>
                <span v-else>&emsp;&emsp;&emsp;&emsp;&emsp;{{item}}</span>
                
              </div>
            </div>
           <div class="item"><span>销售总数：</span><span>{{params.num}}张</span></div>
           <div class="item"><span>已激活：</span><span>{{params.countActive}}张</span></div>
           <div class="item"><span>已绑定：</span><span>{{params.countBind}}张</span></div>
           <div class="item"><span>已使用：</span><span>{{params.countUse}}张</span></div>
           <div class="item"><span>已作废：</span><span>{{params.countVoid}}张</span></div>
           <div class="item"><span>已冻结：</span><span>{{params.countFrozen}}张</span></div>
           <div class="item"><span>已过期：</span><span>{{params.countVoid}}张</span></div>
           <div class="item"><span>使用率：</span><span>{{params.usePercet}}（<span style="color:blue;">消费总数除以销售总数）</span></span></div>
           <div class="item"><span>兑付率：</span><span>{{params.exchangePercet}}（<span style="color:blue;">电影券实际作用在影片面值上的总额除以销售总额）</span></span></div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="exportOrderData(params.ordeNo)">导出明细</el-button>
              <el-button @click="hide" >取 消</el-button>
            </span>
          </el-dialog>
    </div>
</template>

<script>
import { realDeepClone, exportData } from '@/utils'
import CustomerSelector from '@/components/CustomerSelector'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getCouponOrderPageList, exportCouponOrder, getCouponOrderInfo, exportCouponOrderDetail } from '@/api/financeCenter'
export default {
  components: { CustomerSelector, OperatorIdSelector },
  name: 'coupon_sales_order',
  data() {
    return {
      couponOrderLimit: 'couponOrderLimit',
      query: {
        time: []
      },
      detailDialogVisible: false,
      params: {},
      orderNo: '',
      diffType: '',
      ruleText: ''
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
      return getCouponOrderPageList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    exportData() {
      exportData(exportCouponOrder, realDeepClone(this.query))
    },
    exportDetail() {
      exportData(exportCouponOrderDetail, realDeepClone(this.query))
    },
    exportOrderData() {
      exportData(exportCouponOrderDetail, realDeepClone({ orderNo: this.orderNo }))
    },
    hide() {
      this.detailDialogVisible = false
    },
    openDetail(agur) {
      this.ruleText = ''
      getCouponOrderInfo(agur).then(res => {
        this.params = res
        this.$set(this, 'orderNo', this.params.orderNo)
        this.$set(this, 'diffType', this.params.ruleList[0].diffType)
        this.$set(this, 'ruleText', this.params.ruleList[0].ruleText)
      })
      this.detailDialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.sum-info{
  .item{
    font-size: 16px;
    padding: 10px;
    font-weight: bold;
  }
  
}
</style>
<style scoped lang="scss">
  .el-dialog__body{
    height:50vh !important;
    max-height:50vh;
    overflow:auto !important;
  }
</style>
