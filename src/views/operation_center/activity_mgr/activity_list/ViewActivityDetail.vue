<template>
    <div class="app-container">
         <el-form inline label-width="120px">
           <el-form-item label="购买影城">
             <el-input v-model="query.cinema_code" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>
            </el-form-item>
            <!-- <el-form-item label="投放影院">
              <cinema-id-selector v-model="query.cinemaId" clearable style="width:200px"></cinema-id-selector>
            </el-form-item> -->
            <el-form-item label="手机号">
              <el-input v-model="query.mobile" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>              
            </el-form-item>
            <el-form-item label="支付订单">
                 <el-input v-model="query.trade_no" style="width:200px;" placeholder="请输入支付订单单号"></el-input>
            </el-form-item>              
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="exportData('getActivityOrderList')">导出</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="150"  label="购买影片" align="center" prop="film_name" ></el-table-column>
            <el-table-column width="180"  label="购买影城" align="center" prop="cinema_name"></el-table-column>
            <el-table-column width="120"  label="购票手机号" align="center" prop="mobile"></el-table-column>
            <el-table-column min-width="120"  label="购票时间" align="center" prop="create_time"></el-table-column>           
            <el-table-column width="160"  label="座位数" align="center" prop="seats"></el-table-column>
            <el-table-column width="160"  label="订单金额" align="center" prop="total_fee"></el-table-column>
            <el-table-column width="160"  label="购票订单号" align="center" prop="ticket_order_no"></el-table-column>
            <el-table-column width="160"  label="操作结果" align="center" prop="order_status"></el-table-column>
            <el-table-column min-width="180"  label="操作" align="center" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" @click="openDetail(row)">查看详情</el-button>
                <el-button type="text" @click="orderOperateFunc(row)">订单操作</el-button>
              </template>
            </el-table-column>
         </page-table>
         <el-dialog title="活动订单详情" :visible.sync="dialogDetailVisible" width="600px">
          <el-form style="max-height:400px;overflow-y:auto;">
         		<el-form-item label="1.发行方活动ID:">{{activityOrderDetail.activity_id}}</el-form-item>
         		<el-form-item label="2.发行方活动名称:">{{activityOrderDetail.activity_subject}}</el-form-item>
         		<el-form-item label="3.发行方活动时间:">{{activityOrderDetail.activity_time}}</el-form-item>
         		<el-form-item label="4.发行方活动平台:">{{activityOrderDetail.merchant}}</el-form-item>
         		<el-form-item label="5.发行方活动影院:">{{activityOrderDetail.cinema_name}}</el-form-item>
         		<el-form-item label="6.发行方活动影片:">{{activityOrderDetail.activity_films}}</el-form-item>
         		<el-form-item label="7.发行方活动直贴类型:">{{activityOrderDetail.discount_type}}</el-form-item>
         		<el-form-item label="8.参与用户支付类型:">{{activityOrderDetail.activity_payment}}</el-form-item>
         		<el-form-item label="9.活动支付方式:">{{activityOrderDetail.activity_payment}}</el-form-item>
         		<el-form-item label="10.活动支付订单号:">{{activityOrderDetail.trade_no}}</el-form-item>
         		<el-form-item label="11.购买影片名称:">{{activityOrderDetail.film_name}}</el-form-item>
         		<el-form-item label="12.购买影片制式:">{{activityOrderDetail.film_copy}}</el-form-item>
         		<el-form-item label="13.购买时间:">{{activityOrderDetail.create_time}}</el-form-item>
         		<el-form-item label="14.购票数量:">{{activityOrderDetail.seats}}</el-form-item>
         		<el-form-item label="15.购票座位:">{{activityOrderDetail.seat_info}}</el-form-item>
         		<el-form-item label="16.购票场次:">{{activityOrderDetail.showtime}}</el-form-item>
         		<el-form-item label="17.购票订单号:">{{activityOrderDetail.ticket_order_no}}</el-form-item>
         		<el-form-item label="18.购票结算金额:">{{activityOrderDetail.total_fee}}</el-form-item>
         		<el-form-item label="19.优惠金额:">{{activityOrderDetail.discount_fee}}</el-form-item>
         		<el-form-item label="20.订单状态:">{{activityOrderDetail.order_status}}</el-form-item>         			
         	</el-form>
          <div>
            <span slot="footer" class="dialog-footer">
              <!-- <el-button type="primary" @click="exportData('getOrderById')" >导出明细</el-button> -->
              <el-button @click="dialogDetailVisible = false" >取 消</el-button>
            </span>
          </div>
         </el-dialog>
         <el-dialog title="订单操作" :visible.sync="dialogOrderVisible" width="400px" height="400px">
            <el-form ref="resetOrderStatusFom" :model="resetOrderStatus" :rules="resetOrderStatusRules">
              <el-form-item prop="action">
                <el-checkbox-group v-model="resetOrderStatus.action">
                  <el-checkbox label="refund">订单退款</el-checkbox>
                  <el-checkbox label="restore">订单恢复资格</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="操作备注：" prop="comment">
                 <el-input type="textarea" rows="3" width="160" v-model="resetOrderStatus.comment"></el-input>
              </el-form-item>
            </el-form>
            <div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="orderOperateCheck" >确 定</el-button>
                <el-button @click="dialogOrderVisible = false" >取 消</el-button>
              </span>
            </div>
         </el-dialog>
    </div>
</template>

<script>
    import { getActivityOrderList, getOrderById, refundOrder, exportTaskStauts } from '@/api/activitySetting'
    import { exportData, funDownload } from '@/utils'
    import { Loading } from 'element-ui'
    export default {
      name: 'view_activity_detail',
      data() {
        const checkActionList = (rule, value, cb) => {
          if (value.length === 0) {
            cb(new Error('请选择操作选项'))
          }
          cb()
        }
        return {
          query: {},
          dialogDetailVisible: false,
          dialogOrderVisible: false,
          orderOperate: '',
          activityOrderDetail: {},
          resetOrderStatus: {
            action: [],
            comment: ''
          },
          resetOrderStatusRules: {
            action: { required: true, validator: checkActionList, trigger: 'blur' },
            comment: { required: true, message: '请填写操作备注', trigger: 'blur' }
          }

        }
      },
      methods: {
        queryTable(query) {
          delete query.export_format
          const request = Object.assign(query, { activity_id: this.$route.query.activity_id })
          return getActivityOrderList(request)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        taskStatus(res) {
          exportTaskStauts(res).then(ress => {
            const loading = Loading.service({
              lock: true,
              text: '正在导出...',
              spinner: 'el-icon-loading'
            })
            if (ress.code === '1111') {
              this.taskStatus(res)
            } else if (ress.code === '0000') {
              loading.close()
              funDownload(ress.data.url)
            }
          })
        },
        exportData(func) {
          const result = Object.assign(this.query, { activity_id: this.$route.query.activity_id, export_format: 'xls' })
          if (func === 'getActivityOrderList') {
            getActivityOrderList(result).then(res => {
              this.taskStatus(res)
            })
          } else if (func === 'getOrderById') {
            getActivityOrderList({ order_id: this.activityOrderDetail.order_id, export_format: 'xls' }).then(res => {
              this.taskStatus(res)
            })
          }
        },
        openDetail(row) {
          this.activityOrderDetail = []
          this.dialogDetailVisible = true
          getOrderById({ order_id: row.order_id }).then(res => {
            this.activityOrderDetail = res
          })
        },
        exportFormVisible() {
          exportData(getOrderById, { order_id: this.activityOrderDetail.order_id })
        },
        orderOperateFunc(row) {
          this.$set(this, 'resetOrderStatus', {
            action: [],
            comment: ''
          })
          this.dialogOrderVisible = true
          this.resetOrderStatus.order_id = row.order_id
        },
        orderOperateCheck() {
          this.$refs.resetOrderStatusFom.validate((valid) => {
            if (valid) {
              refundOrder(this.resetOrderStatus).then(res => {
                this.$message.success('操作成功')
                this.dialogOrderVisible = false
                this.refreshTable()
              }).catch(e => {
                this.$message.success(e.content)
              })
            }
          })
        }
      }
    }
</script>

<style scoped>
.el-dialog-title{
    text-align:center;
    font-size:15px;
    /* background-color:gray; */
    padding-top:10px
    }
    .el-dialog-footer{
        font-size:15px;
        color:orangered;
    }
    .el-dialog__header{
        padding: 0px;
    }
    .el-dialog__body{
        background-color: gray;
    }
    .el-dialog__footer{
        background-color: gray;
    }
    .dialog-footer {
      margin-left: 30%;
    }
</style>
