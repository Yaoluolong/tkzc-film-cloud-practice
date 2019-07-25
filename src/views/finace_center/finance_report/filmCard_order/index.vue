<template>
  <div class="app-container">
    <el-form inline label-width="120px">
      <el-form-item label="销售日期">
        <el-date-picker
          unlink-panels
          v-model="query.time"
          style="width:230px;"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="销售单号">
        <el-input v-model="query.orderNo" clearable placeholder="请输入销售订单号" style="width:230px;"></el-input>
      </el-form-item>

      <el-form-item label="业务人员">
        <operator-id-selector
          selectStyle="width:210px"
          :accessType="cardOrderLimit"
          v-model="query.operatorId"
          placeholder="请输入业务人员名称"
        ></operator-id-selector>
      </el-form-item>
      <el-form-item label="客户名称">
        <customer-selector :accessType="cardOrderLimit" v-model="query.customer" :isAddNew="false"></customer-selector>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshTable">查询</el-button>
        <el-button type="success" icon="el-icon-upload2" @click="exportData">导出汇总</el-button>
        <el-button type="success" icon="el-icon-upload2" @click="exportDetail">导出明细</el-button>
      </el-form-item>
    </el-form>
    <page-table ref="table" :query="query" :fetch="queryTable">
      <el-table-column
        min-width="120"
        label="业务人员"
        align="center"
        prop="operator"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="120" label="客户名称" align="center" prop="customerName"></el-table-column>
      <el-table-column min-width="110" label="销售总额" align="center" prop="amount"></el-table-column>
      <el-table-column min-width="110" label="卡内总点数" align="center" prop="point"></el-table-column>
      <el-table-column min-width="110" label="消费总点数" align="center" prop="useTotalPoint"></el-table-column>
      <el-table-column min-width="110" label="剩余总点数" align="center" prop="surplusPoint"></el-table-column>
      <el-table-column min-width="110" label="抵扣票务总额" align="center" prop="useCardPrice"></el-table-column>
      <el-table-column min-width="110" label="抵扣增值费总额" align="center" prop="cardServicePrice"></el-table-column>
      <el-table-column min-width="100" label="使用率(%)" align="center" prop="usePercet"></el-table-column>
      <el-table-column min-width="100" label="兑付率(%)" align="center" prop="exchangePercet"></el-table-column>

      <el-table-column min-width="100" label="激活数" align="center" prop="activeNum"></el-table-column>
      <el-table-column min-width="100" label="冻结数" align="center" prop="frozenNum"></el-table-column>
      <el-table-column min-width="100" label="作废数" align="center" prop="voidNum"></el-table-column>
      <el-table-column min-width="100" label="过期数" align="center" prop="overNum"></el-table-column>

      <!-- <el-table-column min-width="100"  label="销售总数" align="center" prop="num"></el-table-column>
      <el-table-column min-width="100"  label="订单状态" align="center" prop="orderStatusName"></el-table-column>-->
      <el-table-column min-width="100" label="操作" align="center" prop="oper" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" @click="openDetail({orderNo:row.orderNo})">查看</el-button>
        </template>
      </el-table-column>
    </page-table>
    <el-dialog
      title="电影卡销售订单详情"
      class="sum-info"
      :visible.sync="detailDialogVisible"
      width="700px"
      @close="resetFields('form')"
    >
      <div class="item">
        <span>销售订单号：</span>
        <span>{{params.orderNo}}</span>
      </div>
      <div class="item">
        <span>销售时间：</span>
        <span>{{params.saleTime}}</span>
      </div>
      <div class="item">
        <span>业务人员：</span>
        <span>{{params.operator}}</span>
      </div>
      <div class="item">
        <span>客户名称：</span>
        <span>{{params.customerName}}</span>
      </div>
      <div class="item">
        <span>电影卡种类：</span>
        <span>{{params.typeName}}</span>
      </div>
      <div class="item">
        <span>销售总数：</span>
        <span>{{params.num}}张</span>
      </div>
      <div class="item">
        <span>已激活：</span>
        <span>{{params.countActive}}张</span>
      </div>
      <div class="item">
        <span>已绑定：</span>
        <span>{{params.bindNum}}张</span>
      </div>
      <div class="item">
        <span>已使用：</span>
        <span>{{params.useNum}}张</span>
      </div>
      <div class="item">
        <span>已作废：</span>
        <span>{{params.voidNum}}张</span>
      </div>
      <div class="item">
        <span>已冻结：</span>
        <span>{{params.frozenNum}}张</span>
      </div>
      <div class="item">
        <span>已过期：</span>
        <span>{{params.overNum}}张</span>
      </div>
      <div class="item">
        <span>使用率：</span>
        <span>
          {{params.usePercet}}（
          <span style="color:blue;">消费总数除以销售总数）</span>
        </span>
      </div>
      <div class="item">
        <span>兑付率：</span>
        <span>
          {{params.exchangePercet}}（
          <span style="color:blue;">电影卡实际作用在影片面值上的总额除以销售总额）</span>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exportOrderData(params.ordeNo)">导出明细</el-button>
        <el-button @click="hide">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { realDeepClone, exportData } from '@/utils'
import CustomerSelector from '@/components/CustomerSelector'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import {
  getCardOrderPageList,
  exportCardOrder,
  getCardOrderInfo,
  exportCardOrderDetail
} from '@/api/financeCenter'
export default {
  components: { CustomerSelector, OperatorIdSelector },
  name: 'card_sales_order',
  data() {
    return {
      cardOrderLimit: 'cardOrderLimit',
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
      return getCardOrderPageList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    exportData() {
      exportData(exportCardOrder, realDeepClone(this.query))
    },
    exportDetail() {
      exportData(exportCardOrderDetail, realDeepClone(this.query))
    },
    exportOrderData() {
      exportData(
        exportCardOrderDetail,
        realDeepClone({ orderNo: this.orderNo })
      )
    },
    hide() {
      this.detailDialogVisible = false
    },
    openDetail(agur) {
      this.ruleText = ''
      getCardOrderInfo(agur).then(res => {
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
.sum-info {
  .item {
    font-size: 16px;
    padding: 10px;
    font-weight: bold;
  }
}
</style>
<style scoped lang="scss">
.el-dialog__body {
  height: 50vh !important;
  max-height: 50vh;
  overflow: auto !important;
}
</style>
