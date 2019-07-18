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
              <operator-id-selector selectStyle="width:210px" :accessType="couponLimit" v-model="query.operatorId" placeholder="请输入业务人员名称"></operator-id-selector>
            </el-form-item>
            <el-form-item label="客户名称">
              <customer-selector v-model="query.customer" :accessType="couponLimit" :isAddNew="false" ></customer-selector>
            </el-form-item>
            <el-form-item label="电影券号码">
              <el-input v-model="query.couponStart" clearable placeholder="输入电影券编码区间查询" style="width:230px;"></el-input>&nbsp;--&nbsp;<el-input v-model="query.couponEnd" clearable placeholder="输入电影券编码区间查询" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="success" icon="el-icon-tickets" @click="$router.push({path:'/operation_center/coupon_mgr/sold_coupon_list/create',query:{}})">创建销售单</el-button>
            </el-form-item>
         </el-form>
         <el-tabs  v-model="query.checkStatus" @tab-click="tabClick">
          <el-tab-pane label="未提交审核" name="0"></el-tab-pane>
            <el-tab-pane label="已提交审核" name="1"></el-tab-pane>
         </el-tabs>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="250"   align="center" prop="oper" v-if="query.checkStatus !== '0'" :key="Math.random()">
              <template slot-scope="{row}">
                <div v-if="row.status !== '2'">
                  <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/sold_coupon_list/edit',query:{orderNo:row.orderNo}})" v-if="query.checkStatus === '0'">编辑/提交审核</el-button>
                  <el-button type="text" @click="cancelSoldCouponOrder(row.orderNo)" v-if="query.checkStatus === '0'">撤销订单</el-button>
                  <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/get_sale_coupon_list',query:{orderNo:row.orderNo}})"  v-if="query.checkStatus !== '0'">销售单明细</el-button>
                  <el-button type="text" @click="exportData(row)"  v-if="row.checkStatus === '2' && row.status === '0'">导出</el-button>
                  <el-button type="text" @click="cancelSoldCouponOrder(row.orderNo)" v-if="row.checkStatus === '1' && query.checkStatus === '1'">撤销销售</el-button>
                  <el-dropdown v-if="row.checkStatus === '4'">
                    <span class="el-dropdown-link">
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="row.checkStatus === '4'">
                        <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/sold_coupon_list/edit',query:{orderNo:row.orderNo}})">重新编辑/提交审核</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item  v-if="row.checkStatus === '4'">
                        <el-button type="text" @click="cancelSoldCouponOrder(row.orderNo)">撤销销售</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div v-else-if="row.status === '2'">
                  <span v-if="row.checkStatus==='0'">{{row.checkStatusName}}</span>
                </div>                            
              </template>
            </el-table-column>
            <el-table-column min-width="180"  label="销售订单号" align="center" prop="orderNo" ></el-table-column>
            <el-table-column min-width="120"  label="业务人员" align="center" prop="operator" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100"  label="客户名称" align="center" prop="customerName"></el-table-column>
            <el-table-column min-width="180"  label="销售时间" align="center" prop="saleTime"></el-table-column>
            <el-table-column min-width="110"  label="销售数量" align="center" prop="num"></el-table-column>
            <el-table-column min-width="180"  label="销售总额(元)" align="center" prop="amount"></el-table-column>
            <!-- <el-table-column min-width="110"  label="是否开票" align="center" prop="invoiceTypeName"></el-table-column> -->
            <el-table-column min-width="110"  label="业务类型" align="center" prop="invoiceTypeName"></el-table-column>
            <el-table-column min-width="110" v-if="query.checkStatus === '1'" label="审核状态" align="center" prop="checkStatusName" :key="Math.random()"></el-table-column>
            <el-table-column min-width="250" fixed="right"  label="操作" align="center" prop="oper" v-if="query.checkStatus === '0'" :key="Math.random()">
              <template slot-scope="{row}">
                <div v-if="row.status !== '2'">
                  <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/sold_coupon_list/edit',query:{orderNo:row.orderNo}})" v-if="query.checkStatus === '0'">编辑/提交审核</el-button>
                  <el-button type="text" @click="cancelSoldCouponOrder(row.orderNo)" v-if="query.checkStatus === '0'">撤销订单</el-button>
                  <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/get_sale_coupon_list',query:{orderNo:row.orderNo}})"  v-if="query.checkStatus !== '0'">销售单明细</el-button>                  
                  <el-button type="text" @click="cancelSoldCouponOrder(row.orderNo)" v-if="row.checkStatus === '1' && query.checkStatus == '1'">撤销销售</el-button>
                  <el-dropdown v-if="row.checkStatus === '4'">
                    <span class="el-dropdown-link">
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="row.checkStatus === '4'">
                        <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/sold_coupon_list/edit',query:{orderNo:row.orderNo}})">重新编辑/提交审核</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item  v-if="row.checkStatus === '4'">
                        <el-button type="text" @click="cancelSoldCouponOrder(row.orderNo)">撤销销售</el-button>
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
         <!-- 导出券 -->
        <el-dialog title="导出券" :visible.sync="exportFormVisible" width="50%" class="abow_dialog">
          <el-form label-width="140px" :model="agur" :rules="exportRules" ref="exportForm">
              <el-form-item label="电影券销售订单号" prop="batchNo">
                {{agur.orderNo||'--'}}
              </el-form-item>
              <el-form-item label="电影券数量" prop="num">
                {{agur.num||'--'}}张
              </el-form-item>
              <el-form-item label="客户名称" prop="customerName">
                {{agur.customerName||'--'}}                
              </el-form-item>
              <el-form-item label="导出字段" prop="fieldList">
                <div class="checkbox-plane">
                  <div class="header">
                    <el-checkbox v-model="selectAll" @change="doSelectAll">全选</el-checkbox>
                  </div>
                  <div class="content" id="content">
                    <div class="check-item" v-for="(field,index) in agur.fieldList" :key="field.value" style="width:30%;display:inline-block;">
                        <el-checkbox v-model="field.checked" @change="fieldChange">{{field.name}}</el-checkbox>
                    </div>
                    <!-- <el-checkbox-group v-model="selectFieldList">
                          <el-checkbox  
                            v-for="(field,index) in agur.fieldList" 
                            :label="field.name"   
                            :key="field.value"  
                            @change="fieldChange"
                            style="width:30%;display:inline-block;margin-left:0px;">{{field.name}}</el-checkbox>
                     </el-checkbox-group> -->
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="是否一券多码" prop="isMult">
                <el-radio v-model="agur.isMult" label="1" :disabled="agur.hasExport==='1'" @change="isMultChange">是</el-radio>
                <el-radio v-model="agur.isMult" label="0" :disabled="agur.hasExport==='1'" @change="isMultChange">否</el-radio>
                <div v-if="agur.isMult==='1'">
                  每&emsp;<el-input v-model="agur.couponNum" style="width:100px;" :disabled="agur.hasExport==='1'"></el-input>&emsp;张电影券合成一个新的电影券以及新的密码二维码。
                </div>
                <span  v-if="agur.isMult==='1'" style="color:#d6d5d5;margin-top:10px;line-height:20px;display: block;">导出券的时候在已选取导出字段基础上，额外自动也会导出每张券的新绑定密码以及新的密码二维码，根据填写的券数量这些券的新绑定密码以及新的密码二维码均一致，同时执行了一码多券并导出后，第二次就不可再进行修改，请慎重！</span>
              </el-form-item>
              <el-form-item label="导出方式" prop="exportType">
                <el-radio v-model="agur.exportType" label="1">直接导出</el-radio>
              </el-form-item>
              <el-form-item label="接收校验码" prop="mobile">
                <el-input v-model="agur.mobile" placeholder="输入用于接收文件校验码的手机号" style="width:350px"></el-input>
              </el-form-item>
              <el-form-item label="导出备注" prop="remark">
                <el-input type="textarea" :row="5" v-model="agur.remark" placeholder="请输入内容"></el-input>
              </el-form-item>           
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="resetExportForm">取 消</el-button>
              <el-button type="primary" @click="exportOrders(agur.orderNo)">导 出</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { realDeepClone } from '@/utils'
import { isPositiveInteger } from '@/utils/validate'
import CustomerSelector from '@/components/CustomerSelector'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getCouponOrderPageList, cancelSoldCouponOrder, couponOrderExportCouponDetail, getUnsoldExportCouponField } from '@/api/operationCenter'
export default {
  components: { CustomerSelector, OperatorIdSelector },
  name: 'sold_coupon_list',
  data() {
    const checkPhoneNum = (rule, value, cb) => {
      const reg = /^1(3|4|5|7|8)\d{9}$/
      if (!reg.test(value)) {
        cb(new Error('请填写正确手机号码'))
      }
      cb()
    }
    const checkCheckedBox = (rule, value, cb) => {
      let num = 0
      value.forEach(e => {
        if (e.checked) {
          num++
        }
      })
      if (num === 0) {
        cb(new Error('请选择导出字段'))
      }
      cb()
    }
    const checkMoreCode = (rule, value, cb) => {
      if (this.agur.isMult === '1' && !isPositiveInteger(this.agur.couponNum)) {
        cb(new Error('请填写正确多码券数,且券数不能大于电影券数量'))
      }
      cb()
    }
    return {
      couponLimit: 'couponLimit',
      query: {
        time: [],
        checkStatus: ''
      },
      exportFormVisible: false,
      selectAll: false,
      agur: {
        orderNo: '',
        fieldList: [],
        num: '',
        isMult: '0',
        couponNum: '',
        exportType: '1',
        mobile: '',
        remark: '',
        hasExport: ''
      },
      exportRules: {
        fieldList: [
          { required: true, message: '请选择导出字段', trigger: 'change' },
          { validator: checkCheckedBox, message: '请选择导出字段', trigger: 'blur' }
        ],
        isMult: [
          // { required: true, message: '请填写多码券数', trigger: 'change' },
          { validator: checkMoreCode, message: '请填写正确多码券数,且券数不能大于电影券数量', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入接收文件校验码的手机号', trigger: 'blur' },
          { validator: checkPhoneNum, message: '请填写正确手机号', trigger: 'blur' }
        ]
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
      return getCouponOrderPageList(req)
    },
    tabClick() {
      window.sessionStorage.setItem(`query.checkStatus`, this.query.checkStatus)
      this.refreshTable()
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    cancelSoldCouponOrder(orderNo) {
      this.$confirm(`撤销销售将对电影券销售订单进行撤单操作,并将销售订单中电影券还原回未销售状态,是否开始执行?`, '温馨提示', { type: 'warning' }).then(async() => {
        await cancelSoldCouponOrder({ orderNo: orderNo })
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
    },
    /* resetParams() {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
    },*/
    resetExportForm() {
      this.exportFormVisible = false
      this.$set(this.agur, 'orderNo', '')
      this.agur.fieldList.map(e => {
        e.checked = false
      })
      this.$set(this.agur, 'mobile', '')
      this.$set(this.agur, 'remark', '')
      // this.$refs['exportForm'].resetFields()
    },
    doSelectAll(val) {
      this.agur.fieldList.map(e => {
        this.$set(e, 'checked', val)
      })
    },
    fieldChange(val) {
      this.selectedFieldList = this.agur.fieldList.filter(e => {
        return e.checked
      })
      this.selectAll = this.selectedFieldList.length === this.agur.fieldList.length
    },
    exportData(row) {
      this.exportFormVisible = true
      this.$nextTick(() => {
        this.$refs.exportForm.resetFields()
        this.agur.orderNo = row.orderNo
        this.agur.customerName = row.customerName
        this.agur.num = row.num
        this.agur.hasExport = row.hasExport
        if (row.hasExport === '1') {
          this.agur.mergeNum = row.mergeNum
          this.agur.couponNum = row.couponNum
          this.agur.isMult = '1'
        }
      })
    },
    exportOrders(orderNo) {
      console.log(this.agur)
      this.$refs.exportForm.validate(flag => {
        if (flag) {
          const temp = this.agur
          this.$set(temp, 'fields', [])
          this.agur.fieldList.map(e => {
            if (e.checked) {
              temp.fields.push(e.value)
            }
          })
          /* delete temp.fieldList
          delete temp.batchNo
          delete temp.num*/
          console.log(+temp.couponNum, +this.agur.num)
          if (temp.isMult === '1' && +temp.couponNum > +this.agur.num) {
            this.$message.warning('券数不能大于电影券数量')
            return false
          }
          if (temp.isMult === '1' && +this.agur.num % +temp.couponNum > 0) {
            this.$confirm('当前填写的数值与电影券销售总量存在不整除的情况，如果继续则最后剩多少就整合一起转。', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({ value }) => {
              couponOrderExportCouponDetail({ orderNo: orderNo, fields: temp.fields, isMult: temp.isMult, couponNum: temp.couponNum, mobile: temp.mobile, remark: temp.remark }).then(e => {
                this.exportFormVisible = false
                this.$refs.exportForm.resetFields()
                this.agur.fieldList.map(e => { e.checked = false })
                this.selectAll = false
                this.$router.push({ path: '/system_setting/task_mgr/task_mgr', query: { id: orderNo }})
              })
            }).catch(() => {

            })
          } else {
            couponOrderExportCouponDetail({ orderNo: orderNo, fields: temp.fields, isMult: temp.isMult, couponNum: temp.couponNum, mobile: temp.mobile, remark: temp.remark }).then(e => {
              this.exportFormVisible = false
              this.$refs.exportForm.resetFields()
              this.agur.fieldList.map(e => { e.checked = false })
              this.selectAll = false
              this.$router.push({ path: '/system_setting/task_mgr/task_mgr', query: { id: orderNo }})
            })
          }
        }
      })
    },
    isMultChange() {
      this.$set(this.agur, 'couponNum', '')
    }
  },
  async created() {
    this.agur.fieldList = await getUnsoldExportCouponField()
  }
}
</script>

<style>
.abow_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;
  }
  .abow_dialog   .el-dialog {
    margin: 0 auto !important;
    height: 70%;
    overflow: hidden;
  }
.abow_dialog   .el-dialog  .el-dialog__body {
  position: absolute;
  left: 0;
  top: 54px;
  bottom: 66px;
  right: 0;
  padding: 0;
  z-index: 1; 
  overflow: hidden;
  overflow-y: auto;
}
.abow_dialog   .el-dialog  .el-dialog__footer{
  position: absolute;
    bottom: 0;
}
</style>
