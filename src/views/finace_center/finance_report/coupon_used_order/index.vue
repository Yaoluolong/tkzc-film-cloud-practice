<template>
  <div class="app-container">
    <el-form inline label-width="120px">
      <el-form-item label="电影券编码">
        <el-input
          clearable
          v-model="query.couponStart"
          style="width:200px;"
          placeholder="输入电影券编码区间"
        ></el-input>&emsp;--&emsp;
        <el-input clearable v-model="query.couponEnd" style="width:200px;" placeholder="输入电影券编码区间"></el-input>
      </el-form-item>
      <el-form-item label="分发渠道">
        <el-input clearable v-model="query.tag" style="width:200px;" placeholder="输入分发渠道"></el-input>
      </el-form-item>
      <el-form-item label="发行影片">
        <el-input clearable v-model="query.filmName" style="width:200px;" placeholder="选择影片名称查询"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshTable">查询</el-button>
        <el-button
          type="danger"
          icon="el-icon-plus"
          @click="exportData('getSaleCouponDetailList')"
        >导出</el-button>
      </el-form-item>
    </el-form>
    <page-table ref="table" index :query="query" :fetch="queryTable">
      <el-table-column min-width="50" type="selection" label="指定导出" align="center"></el-table-column>
      <el-table-column min-width="80" label="分发渠道" align="center" prop="oper">
        <template slot-scope="{row}">
          <el-button type="text" @click="openSign(row)">{{row.tag!=='--'?row.tag:'分发标记'}}</el-button>
        </template>
      </el-table-column>
      <el-table-column width="120" label="电影券总数" align="center" prop="num"></el-table-column>
      <el-table-column width="80" label="使用率" align="center" prop="usage"></el-table-column>
      <el-table-column width="80" label="结算总额" align="center" prop="amount"></el-table-column>
      <el-table-column width="100" label="电影券种类" align="center" prop="typeName"></el-table-column>
      <el-table-column width="120" label="操作" align="center" prop="oper" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" @click="openDetail(row)">查看明细</el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="150" label="发行影片" align="center" prop="filmNameAssign"></el-table-column>
      <el-table-column
        min-width="180"
        label="电影券销售订单号"
        align="center"
        prop="orderNo"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column width="180" label="销售时间" align="center" prop="saleTimeStr"></el-table-column>
    </page-table>
    <el-dialog title="电影券分发渠道标记" :visible.sync="dialogSignVisible" width="800px" height="400px">
      <el-form style="max-height:400px;overflow-y:auto;">
        <el-form-item
          label="销售订单号:"
          style="width:45%;display:inline-block;"
        >{{saleCouponSign.orderNo}}</el-form-item>
        <el-form-item
          label="销售时间:"
          style="width:45%;display:inline-block;"
        >{{saleCouponSign.saleTimeStr}}</el-form-item>
        <el-form-item
          label="电影券种类:"
          style="width:45%;display:inline-block;"
        >{{saleCouponSign.typeName}}</el-form-item>
        <el-form-item label="电影券总数:" style="width:45%;display:inline-block;">{{saleCouponSign.num}}</el-form-item>
        <el-form-item label="使用规则:">{{saleCouponSign.ruleText}}</el-form-item>
        <el-form-item label="电影券编码区间:">{{saleCouponSign.couponRange}}</el-form-item>
        <el-form-item label="电影券分发渠道:">{{saleCouponSign.tagStr || '无'}}</el-form-item>
        <el-form-item
          label
          label-width="0px"
          style="width:100%;border-top:1px solid #000;font-weight:bold;margin-top:40px"
        >
          <span style>分发渠道:&nbsp;</span>
          <el-input
            clearable
            v-model="tag"
            style="width:200px;margin-top:20px;"
            placeholder="输入电影券分发渠道"
            :disabled="isModify"
          ></el-input>
          <el-button type="text" :disabled="!isModify" @click="tagModifyFunc">修改</el-button>
        </el-form-item>
      </el-form>
      <div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save">确 认</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </span>
      </div>
    </el-dialog>
    <el-dialog
      title="电影券使用汇总"
      :visible.sync="dialogDetailVisible"
      width="600px"
      height="400px"
      class="dialogDetailVisible"
    >
      <el-form style="max-height:400px;overflow-y:auto;">
        <el-form-item label="销售订单号:">{{saleCouponDetail.saleOrderNo}}</el-form-item>
        <el-form-item label="销售时间:">{{saleCouponDetail.createTime}}</el-form-item>
        <el-form-item label="电影券种类:">{{saleCouponDetail.typeName}}</el-form-item>
        <el-form-item label="使用规则:">{{saleCouponDetail.ruleText}}</el-form-item>
        <el-form-item label="电影券总数:">{{saleCouponDetail.couponCount}}</el-form-item>
        <el-form-item label="总使用率:">
          {{saleCouponDetail.usage}}%
          <span style="color:blue;">(使用总数除以电影券总数)</span>
        </el-form-item>
        <el-form-item label="订单总额:">{{saleCouponDetail.couponCount}}</el-form-item>
        <el-form-item label="结算总额:">
          {{saleCouponDetail.payMoney}}
          <span style="color:blue;">(订单总额不包含补差现金支付部分)</span>
        </el-form-item>
        <el-form-item label="订单平均票价:">
          {{saleCouponDetail.priceAverage}}
          <span style="color:blue;">(实际交易总数除订单座位数)</span>
        </el-form-item>
      </el-form>
      <div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogDetailVisible = false">关 闭</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSaleCouponDetailList,
  getSaleCouponDetail,
  saleCouponSetTag,
  getSaleCouponDetailListExport
} from '@/api/financeCenter'
import { exportData, realDeepClone } from '@/utils'
export default {
  name: 'coupon_used_order',
  data() {
    return {
      query: {},
      dialogDetailVisible: false,
      saleCouponDetail: {},
      saleCouponSign: [],
      dialogSignVisible: false,
      isModify: false,
      tag: ''
    }
  },
  methods: {
    queryTable(query) {
      const req = realDeepClone(query)
      return getSaleCouponDetailList(req)
    },
    refreshTable() {
      const cStart = this.query.couponStart
        ? this.query.couponStart.substring(0, 3)
        : ''
      const cEnd = this.query.couponEnd
        ? this.query.couponEnd.substring(0, 3)
        : ''
      if (cStart !== cEnd && cStart && cEnd) {
        this.$message.warning('前三位号段不同，暂不支持查询！')
        return
      }
      this.$refs.table.refresh()
    },
    exportData(func) {
      const result = this.$refs.table
        .getSelection()
        .map(e => e.orderNo)
        .join(',')
      if (!result) {
        exportData(getSaleCouponDetailListExport, {
          couponStart: this.query.couponStart,
          couponEnd: this.query.couponEnd,
          tag: this.query.tag,
          filmName: this.query.filmName
        })
      } else {
        exportData(getSaleCouponDetailListExport, {
          couponStart: this.query.couponStart,
          couponEnd: this.query.couponEnd,
          tag: this.query.tag,
          filmName: this.query.filmName,
          ids: result
        })
      }
    },
    openDetail(row) {
      this.$router.push({
        path: '/finace_center/finance_report/coupon_used_order_detail',
        query: { orderNo: row.orderNo }
      })
      /* this.saleCouponDetail = []
          this.dialogDetailVisible = true
          getSaleCouponDetail({ orderNo: row.orderNo }).then(res => {
            this.saleCouponDetail = res
          })*/
    },
    openSign(row) {
      this.saleCouponSign = []
      this.dialogSignVisible = true
      getSaleCouponDetail({ orderNo: row.orderNo }).then(res => {
        this.saleCouponSign = res
        this.tag = this.saleCouponSign.tag
        this.isModify = !!this.saleCouponSign.tag
      })
    },
    tagModifyFunc() {
      this.isModify = false
    },
    save() {
      saleCouponSetTag({
        orderNo: this.saleCouponSign.orderNo,
        tag: this.tag
      }).then(res => {
        this.$message.success('修改成功')
        this.saleCouponSign.tag = this.tag
        this.isModify = !!this.saleCouponSign.tag
        // this.dialogSignVisible = false
      })
    },
    closeDialog() {
      this.dialogSignVisible = false
      this.refreshTable()
    }
  }
}
</script>

<style scoped>
.el-dialog-title {
  text-align: center;
  font-size: 15px;
  /* background-color:gray; */
  padding-top: 10px;
}
.el-dialog-footer {
  font-size: 15px;
  color: orangered;
}
.el-dialog__header {
  padding: 0px;
}
.el-dialog__body {
  background-color: gray;
}
.el-dialog__footer {
  background-color: gray;
}
.dialog-footer {
  margin-left: 30%;
}
.dialogDetailVisible .el-form-item {
  margin-bottom: 0px;
}
</style>
