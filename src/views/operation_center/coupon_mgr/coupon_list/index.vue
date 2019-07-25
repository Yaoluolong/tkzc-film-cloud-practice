<template>
  <div class="app-container">
    <el-form inline label-width="120px">
      <el-form-item label="电影券批次号">
        <el-input v-model="query.batchNo" clearable placeholder="请输入电影券批次号" style="width:230px;"></el-input>
      </el-form-item>
      <el-form-item label="电影券号码">
        <el-input
          v-model="query.couponCodeLeft"
          clearable
          placeholder="输入优惠券号码查询"
          style="width:230px;"
        ></el-input>~~
        <el-input
          v-model="query.couponCodeRight"
          clearable
          placeholder="输入优惠券号码查询"
          style="width:230px;"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="电影券密码">
              <el-input v-model="query.couponId" clearable placeholder="请输入电影券密码" style="width:230px;"></el-input>
      </el-form-item>-->
      <el-form-item label="电影券种类">
        <remote-select
          v-model="query.type"
          showAllOption
          placeholder="请选择电影券种类"
          action="/systemApi/dict/getList"
          :query="{type:'couponType'}"
          style="width:230px;"
        ></remote-select>
      </el-form-item>
      <el-form-item label="电影券类型">
        <remote-select
          v-model="query.style"
          showAllOption
          placeholder="请选择电影券类型"
          action="/systemApi/dict/getList"
          :query="{type:'couponStyle'}"
          style="width:230px;"
        ></remote-select>
      </el-form-item>
      <el-form-item label="会员手机号">
        <el-input
          v-model="query.bindingMobile"
          clearable
          placeholder="请输入会员手机号"
          style="width:230px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshTable">查询</el-button>
        <el-button
          type="text"
          :icon="opened? 'el-icon-arrow-up':'el-icon-arrow-down'"
          @click="opened=!opened"
        >精准查询</el-button>
        <el-button type="success" icon="el-icon-upload2" @click="exportData">导出券</el-button>
        <el-button type="warning" @click="setCouponVoid">作废券</el-button>
        <el-button type="warning" @click="setCouponFrozen">冻结券</el-button>
        <el-button type="warning" @click="setCouponUnFrozen">解冻券</el-button>
        <el-button type="warning" @click="setCouponDelays">延期券</el-button>
      </el-form-item>
      <query-ext-plane :opened="opened">
        <el-form-item label="销售日期">
          <el-date-picker
            unlink-panels
            v-model="query.saleTime"
            style="width:230px;"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="业务人员">
          <operator-id-selector
            :accessType="couponLimit"
            v-model="query.operator"
            placeholder="请输入业务人员名称模糊查询"
          ></operator-id-selector>
        </el-form-item>
        <el-form-item label="客户名称">
          <customer-selector
            :accessType="couponLimit"
            v-model="query.customerName"
            :isAddNew="false"
          ></customer-selector>
          <!-- <el-input v-model="query.customerName" clearable placeholder="输入客户名称" style="width:230px;"></el-input> -->
        </el-form-item>
        <el-form-item label="销售单号">
          <el-input v-model="query.orderNo" clearable placeholder="输入销售单号" style="width:230px;"></el-input>
        </el-form-item>
        <el-form-item label="绑定日期">
          <el-date-picker
            unlink-panels
            v-model="query.bindTime"
            style="width: 300px;"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="生效日期">
          <el-date-picker
            unlink-panels
            v-model="query.validTime"
            style="width:230px;"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="失效日期">
          <el-date-picker
            unlink-panels
            v-model="query.invalidTime"
            style="width:230px;"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用日期">
          <el-date-picker
            unlink-panels
            v-model="query.useTime"
            style="width:230px;"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="电影券密码">
          <el-input v-model="query.couponId" clearable placeholder="输入优惠券密码查询" style="width:230px;"></el-input>
        </el-form-item>
        <el-form-item label="绑定状态">
          <el-select v-model="query.bindStatus" clearable placeholder="请选择状态" style="width:230px;">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="0" label="未绑定"></el-option>
            <el-option value="1" label="已绑定"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="query.isUse" clearable placeholder="请选择状态" style="width:230px;">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="1" label="已使用"></el-option>
            <el-option value="0" label="未使用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作废状态">
          <el-select v-model="query.isVoid" clearable placeholder="请选择状态" style="width:230px;">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="0" label="未作废"></el-option>
            <el-option value="1" label="已作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="冻结状态">
          <el-select v-model="query.isFrozen" clearable placeholder="请选择状态" style="width:230px;">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="0" label="未冻结"></el-option>
            <el-option value="1" label="已冻结"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="激活状态">
          <el-select v-model="query.isActive" clearable placeholder="请选择状态" style="width:230px;">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="0" label="未激活"></el-option>
            <el-option value="1" label="已激活"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="过期状态">
          <el-select v-model="query.isOverdue" clearable placeholder="请选择状态" style="width:230px;">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="0" label="未过期"></el-option>
            <el-option value="1" label="已过期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电影券来源">
          <el-select v-model="query.source" clearable placeholder="请选择来源" style="width:230px;">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="1" label="平台销售"></el-option>
            <el-option value="2" label="线上购买"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电影券核销方式">
          <remote-select
            v-model="query.useType"
            showAllOption
            placeholder="请选择电影券核销方式"
            action="/systemApi/dict/getList"
            :query="{type:'couponUseType'}"
            style="width:230px;"
          ></remote-select>
        </el-form-item>
      </query-ext-plane>
    </el-form>
    <page-table ref="table" index :query="queryTemp" :fetch="queryTable">
      <el-table-column
        min-width="180"
        label="电影券批次号"
        align="center"
        prop="batchNo"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="180"
        label="电影券号"
        align="center"
        prop="couponCode"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="80" label="电影券种类" align="center" prop="typeName"></el-table-column>
      <el-table-column min-width="80" label="电影券类型" align="center" prop="styleName"></el-table-column>
      <el-table-column min-width="80" label="激活状态" align="center" prop="isActive"></el-table-column>
      <el-table-column min-width="80" label="冻结状态" align="center" prop="isFrozen"></el-table-column>
      <el-table-column min-width="80" label="作废状态" align="center" prop="isVoid"></el-table-column>
      <el-table-column min-width="80" label="绑定状态" align="center" prop="bindStatus"></el-table-column>
      <el-table-column min-width="80" label="使用状态" align="center" prop="isUse"></el-table-column>
      <el-table-column min-width="80" label="过期状态" align="center" prop="isOverdue"></el-table-column>
      <el-table-column min-width="120" label="详情" align="center" prop="oper" fixed="right">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="$router.push({path:'/operation_center/coupon_mgr/coupon_detail',query:{id:row.id}})"
          >查看</el-button>
        </template>
      </el-table-column>
    </page-table>

    <el-dialog title="延期提示" :visible.sync="dialogDelaysFormVisible" width="550px">
      <el-form>
        <el-form-item label>
          <span>
            根据条件已筛选出
            <span v-text="count"></span>张电影券，将根据填写的延期时间来重新设定券的有效期！
          </span>
        </el-form-item>
        <el-form-item label="延期时间">
          <el-date-picker v-model="time" style="width:230px;" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelaysFormVisible = false;messageKeyBool = false">取 消</el-button>
        <el-button type="primary" @click="dialogDelaysForm(query)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CustomerSelector from '@/components/CustomerSelector'
import {
  getSoldCouponList,
  exportSaleCouponList,
  setCouponVoid,
  setCouponFrozen,
  getSaleCouponCount,
  setdelaysCoupon
} from '@/api/operationCenter'
import QueryExtPlane from '@/components/QueryExtPlane'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { realDeepClone, exportData } from '@/utils'
export default {
  name: 'coupon_list',
  components: { QueryExtPlane, CustomerSelector, OperatorIdSelector },
  data() {
    return {
      couponLimit: 'couponLimit',
      query: {
        batchNo: '',
        couponCode: '',
        couponId: '',
        type: '-1',
        style: '-1',
        mobile: '',

        saleTime: [],
        operator: '',
        customerName: '',
        orderNo: '',
        bindTime: [],
        validTime: [],
        invalidTime: [],
        useTime: [],
        bindStatus: '-1',
        isUse: '-1',
        isVoid: '-1',
        isFrozen: '-1',
        isActive: '-1',
        isOverdue: '-1',
        source: '-1',
        useType: '-1'
      },
      time: '', // 延期时间
      opened: false,
      count: '',
      dialogDelaysFormVisible: false,
      messageKeyBool: false
    }
  },
  watch: {
    'query.type'(val) {
      if (val === undefined) {
        this.$set(this.query, 'type', '-1')
      }
    },
    'query.style'(val) {
      if (val === undefined) {
        this.$set(this.query, 'style', '-1')
      }
    },
    'query.useType'(val) {
      if (val === undefined) {
        this.$set(this.query, 'useType', '-1')
      }
    }
  },
  computed: {
    queryTemp: function() {
      const temp = realDeepClone(this.query)
      if (temp.saleTime && temp.saleTime.length === 2) {
        temp.saleTimeS = temp.saleTime[0]
        temp.saleTimeE = temp.saleTime[1]
      }
      if (temp.bindTime && temp.bindTime.length === 2) {
        temp.bindTimeS = temp.bindTime[0]
        temp.bindTimeE = temp.bindTime[1]
      }
      if (temp.validTime && temp.validTime.length === 2) {
        temp.validTimeS = temp.validTime[0]
        temp.validTimeE = temp.validTime[1]
      }
      if (temp.invalidTime && temp.invalidTime.length === 2) {
        temp.invalidTimeS = temp.invalidTime[0]
        temp.invalidTimeE = temp.invalidTime[1]
      }
      if (temp.useTime && temp.useTime.length === 2) {
        temp.useTimeS = temp.useTime[0]
        temp.useTimeE = temp.useTime[1]
      }

      if (!this.isShow) {
        if (temp.isUse === '-1') delete temp.isUse
      }

      delete temp.saleTime
      delete temp.bindTime
      delete temp.validTime
      delete temp.invalidTime
      delete temp.useTime

      return temp
    }
  },
  methods: {
    exportData() {
      exportData(exportSaleCouponList, this.queryTemp)
    },
    queryTable(query) {
      return getSoldCouponList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    getCount() {
      const _this = this
      getSaleCouponCount(this.query).then(res => {
        _this.count = res
      })
    },
    setCouponVoid() {
      this.messageKeyBool = false
      Object.keys(this.query).forEach(key => {
        if (
          this.query[key] &&
          this.query[key].length > 0 &&
          this.query[key] !== '-1'
        ) {
          this.messageKeyBool = true
          return false
        }
      })

      if (!this.messageKeyBool) {
        this.$message.warning('请使用查询条件来制定需要作废的电影券！')
      } else {
        getSaleCouponCount(this.query).then(res => {
          this.$confirm(
            '根据条件已筛选出' +
              res +
              '张电影券,券一旦作废就不可恢复,是否执行操作!',
            '作废提示',
            { type: 'warning' }
          )
            .then(() => {
              const request = this.queryTemp
              request.status = 1
              setCouponVoid(request).then(() => {
                this.$message.success('操作成功')
                this.refreshTable()
              })
            })
            .catch(() => {})
        })
      }
    },
    setCouponFrozen() {
      this.messageKeyBool = false
      Object.keys(this.query).forEach(key => {
        if (
          this.query[key] &&
          this.query[key].length > 0 &&
          this.query[key] !== '-1'
        ) {
          this.messageKeyBool = true
          return false
        }
      })

      if (!this.messageKeyBool) {
        this.$message.warning('请使用查询条件来制定需要冻结的电影券！')
      } else {
        getSaleCouponCount(this.query).then(res => {
          this.$confirm(
            '根据条件已筛选出' +
              res +
              '张电影券，券一旦冻结就不可使用，可以通过解冻功能来解冻，是否执行冻结',
            '作废提示',
            { type: 'warning' }
          )
            .then(() => {
              const request = this.queryTemp
              request.status = 1
              setCouponFrozen(request).then(() => {
                this.$message.success('操作成功')
                this.refreshTable()
              })
            })
            .catch(() => {})
        })
      }
    },
    setCouponUnFrozen() {
      this.messageKeyBool = false
      Object.keys(this.query).forEach(key => {
        if (
          this.query[key] &&
          this.query[key].length > 0 &&
          this.query[key] !== '-1'
        ) {
          this.messageKeyBool = true
          return false
        }
      })
      if (!this.messageKeyBool) {
        this.$message.warning('请使用查询条件来制定需要解冻的电影券！')
      } else {
        getSaleCouponCount(this.query).then(res => {
          this.$confirm(
            '根据条件已筛选出' +
              res +
              '张电影券，券一旦解冻及恢复使用，是否执行解冻！',
            '解冻提示',
            { type: 'warning' }
          )
            .then(() => {
              const request = this.queryTemp
              request.status = '0'
              setCouponFrozen(request).then(() => {
                this.$message.success('操作成功')
                this.refreshTable()
              })
            })
            .catch(() => {})
        })
      }
    },
    dialogDelaysForm() {
      this.messageKeyBool = false
      if (this.time) {
        const request = this.queryTemp
        // request.delaysStartTime = this.time[0]
        request.delaysEndTime = this.time
        request.status = '1'
        setdelaysCoupon(request).then(() => {
          this.$message.success('操作成功')
          this.dialogDelaysFormVisible = false
          this.refreshTable()
        })
      } else {
        this.$message.warning('请选择延期区间')
        return
      }
    },
    setCouponDelays() {
      Object.keys(this.query).forEach(key => {
        if (
          this.query[key] &&
          this.query[key].length > 0 &&
          this.query[key] !== '-1'
        ) {
          this.messageKeyBool = true
          return false
        }
      })

      if (!this.messageKeyBool) {
        this.$message.warning('请使用查询条件来制定需要延期的电影券！')
      } else {
        this.getCount()
        this.dialogDelaysFormVisible = true
      }
    }
  }
}
</script>

<style scoped>
</style>
