<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="电影券批次号">
              <el-input v-model="query.batchNo" clearable placeholder="请输入电影券批次号" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="电影券号码">
              <el-input v-model="query.couponCode" clearable placeholder="请输入电影券号码" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="电影券ID号">
              <el-input v-model="query.couponId" clearable placeholder="请输入电影券ID号" style="width:230px;"></el-input>
              <!-- &nbsp;至&nbsp;
              <el-input v-model="query.name" clearable placeholder="结束ID号" style="width:230px;"></el-input> -->
            </el-form-item>
            <el-form-item label="电影券类型">
              <remote-select v-model="query.type" showAllOption clearable placeholder="请选择电影券类型" action="/systemApi/dict/getList" :query="{type:'couponType'}" style="width:230px;"></remote-select>
            </el-form-item>


            <!-- <el-form-item label="消费对象">
              <remote-select v-model="query.consumeTarget" showAllOption clearable placeholder="请选择电影券类型" action="/systemApi/dict/getList" :query="{type:'consumeTarget'}" style="width:230px;"></remote-select>
            </el-form-item>
             <el-form-item label="绑定会员">
              <el-input v-model="query.mobile" clearable placeholder="请输入绑定会员" style="width:230px;"></el-input>
            </el-form-item> -->


            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">生成电影券</el-button>
              <!-- <el-button type="text" :icon="opened? 'el-icon-arrow-up':'el-icon-arrow-down'"  @click="opened=!opened">精准查询</el-button> -->
              <el-button type="success" icon="el-icon-upload2" @click="exportData">导出电影券</el-button>
              <!-- <el-button type="warning"  @click="setCouponVoid">作废券</el-button>
              <el-button type="warning"   @click="setCouponFrozen">冻结券</el-button> -->
            </el-form-item>
            <query-ext-plane :opened="opened">
                <el-form-item label="销售日期">
                    <el-date-picker v-model="query.saleTime" style="width:230px;"  type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="业务人员">
                  <operator-id-selector v-model="query.operator" placeholder="请输入业务人员名称"></operator-id-selector>
                    <!-- <el-input v-model="query.operator" clearable placeholder="请输入业务员账号或名称" style="width:230px;"></el-input> -->
                </el-form-item>
                <el-form-item label="营销客户">
                  <customer-selector v-model="query.customerName" :isAddNew="false"></customer-selector>
                    <!-- <el-input v-model="query.customerName" clearable placeholder="输入客户名称" style="width:230px;"></el-input> -->
                </el-form-item>
                <el-form-item label="销售订单号">
                    <el-input v-model="query.orderNo" clearable placeholder="输入电影券名称模糊查询" style="width:230px;"></el-input>
                </el-form-item>
                <!-- <el-form-item label="电影券来源">
                    <el-select v-model="query.source" clearable placeholder="请选择状态" style="width:230px;">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="1" label="平台销售"></el-option>
                        <el-option value="2" label="线上购买"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="绑定日期">
                    <el-date-picker v-model="query.bindTime" style="width:230px;"  type="datetimerange"  value-format="yyyy-MM-dd HH:mm" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item> -->
                <el-form-item label="生效日期">
                    <el-date-picker v-model="query.validTime" style="width:230px;"  type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>

                </el-form-item>
                <el-form-item label="失效日期">
                    <el-date-picker v-model="query.invalidTime" style="width:230px;"  type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="使用日期">
                    <el-date-picker v-model="query.useTime" style="width:230px;"  type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="绑定状态">
                    <el-select v-model="query.bindStatus" clearable placeholder="请选择状态" style="width:230px;">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="0" label="未绑定"></el-option>
                        <el-option value="1" label="已绑定"></el-option>
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
                <el-form-item label="使用状态">
                    <el-select v-model="query.isUse" clearable placeholder="请选择状态" style="width:230px;">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="1" label="已使用"></el-option>
                        <el-option value="0" label="未使用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电影券核销方式">
                  <remote-select v-model="query.useType" showAllOption clearable placeholder="请选择电影券核销方式" action="/systemApi/dict/getList" :query="{type:'couponUseType'}" style="width:230px;"></remote-select>
                    <!-- <el-select v-model="query.useType" clearable placeholder="请选择状态" style="width:230px;">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="H5" label="H5应用终端核销"></el-option>
                        <el-option value="ios" label="ios应用终端核销 "></el-option>
                        <el-option value="android" label="安卓应用终端核销"></el-option>
                    </el-select> -->
                </el-form-item>
            </query-ext-plane>
         </el-form>
         <page-table ref="table" index :query="queryTemp" :fetch="queryTable">
            <el-table-column min-width="180"  label="电影券批次号" align="center" prop="batchNo" ></el-table-column>
            <el-table-column min-width="120"  label="电影券ID号" align="center" prop="couponId" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100"  label="电影券号码" align="center" prop="couponCode"></el-table-column>
            <el-table-column min-width="180"  label="电影券类型" align="center" prop="type"></el-table-column>
            <el-table-column min-width="180"  label="消费对象" align="center" prop="consumeTarget"></el-table-column>
            <el-table-column min-width="180"  label="电影券名称" align="center" prop="couponName"></el-table-column>
            <el-table-column min-width="180"  label="绑定状态" align="center" prop="bindStatus"></el-table-column>
            <el-table-column min-width="180"  label="使用状态" align="center" prop="isUse"></el-table-column>
            <el-table-column min-width="120"  label="操作" align="center" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/coupon_detail',query:{id:row.id}})">查看</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
import CustomerSelector from '@/components/CustomerSelector'
import { getCouponList, exportCouponList, setCouponVoid, setCouponFrozen } from '@/api/operationCenter'
import QueryExtPlane from '@/components/QueryExtPlane'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { realDeepClone, exportData } from '@/utils'
export default {
  name: 'coupon_list',
  components: { QueryExtPlane, CustomerSelector, OperatorIdSelector },
  data() {
    return {
      query: {
        useType: '-1',
        saleTime: [],
        bindTime: [],
        validTime: [],
        invalidTime: [],
        useTime: [],
        isUse: '-1',
        type: '-1',
        bindStatus: '-1',
        isVoid: '-1',
        isFrozen: '-1',
        isActive: '-1',
        consumeTarget: '-1'
      },
      opened: false
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
      exportData(exportCouponList, this.queryTemp)
    },
    queryTable(query) {
      return getCouponList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    setCouponVoid() {
      this.$confirm('是否要进行此操作', '作废提示', { type: 'warning' }).then(() => {
        if (!this.query.batchNo && !this.query.couponCode && !this.query.couponId) {
          this.$message.warning('作废电影券需先指定：电影券批次号、电影券号码、电影券ID号中的其中一种后方可执行作废操作！')
        } else {
          const request = this.queryTemp
          request.status = 1
          setCouponVoid(request).then(() => {
            this.$message.success('操作成功')
            this.refreshTable()
          })
        }
      })
    },
    setCouponFrozen() {
      this.$confirm('是否要进行此操作', '作废提示', { type: 'warning' }).then(() => {
        if (!this.query.batchNo && !this.query.couponCode && !this.query.couponId) {
          this.$message.warning('冻结电影券需先指定：电影券批次号、电影券号码、电影券ID号中的其中一种后方可执行冻结操作！')
        } else {
          const request = this.queryTemp
          request.status = 1
          setCouponFrozen(request).then(() => {
            this.$message.success('操作成功')
            this.refreshTable()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
