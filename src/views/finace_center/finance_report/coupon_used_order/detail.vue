<template>
    <div class="app-container">
        <el-tabs  v-model="query.isUse" @tab-click="tabClick">
          <el-tab-pane label="已使用" name="1"></el-tab-pane>
            <el-tab-pane label="未使用" name="0"></el-tab-pane>
         </el-tabs>
         <el-form inline label-width="120px">
            <el-form-item label="电影券号码" v-if="query.isUse==='0'">
              <el-input v-model="query.couponCodeLeft" style="width:200px;" placeholder="输入优惠券号码查询"></el-input>&nbsp;--&nbsp;<el-input v-model="query.couponCodeRight" style="width:200px;" placeholder="输入优惠券号码查询"></el-input>             
            </el-form-item>
            <el-form-item label="分发渠道">
              <el-input v-model="query.tag" style="width:200px;" placeholder="输入分发渠道"></el-input>              
            </el-form-item>
            <el-form-item label="购票影院" v-if="query.isUse==='1'">
              <el-input v-model="query.cinemaName" style="width:200px;" placeholder="输入影院名称模糊查询"></el-input>              
            </el-form-item>            
            <el-form-item label="影院城市" prop="area" v-if="query.isUse==='1'">
              <city-cascader ref="city" v-model="area" :rang="1" :clearable="true" placeholder="请选择" style="width:320px;"></city-cascader>
            </el-form-item>
            <el-form-item label="放映制式" v-if="query.isUse==='1'">
              <remote-select v-model="query.copyType" clearable placeholder="请选择放映制式" action="/systemApi/couponOrder/getCopyType" style="width:200px;"></remote-select>
            </el-form-item><br/>              
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="primary" @click="openDetail" v-if="query.isUse==='1'">使用汇总</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="exportData('getSaleCouponOrderDetailListExport')" v-if="query.isUse==='1'">导出</el-button>
              <el-button type="text" :icon="opened? 'el-icon-arrow-up':'el-icon-arrow-down'"  @click="opened=!opened"  v-if="query.isUse==='0'">精准查询</el-button>
              <el-button type="warning"  @click="setCouponVoid"  v-if="query.isUse==='0'">作废券</el-button>
              <el-button type="warning"  @click="setCouponFrozen"  v-if="query.isUse==='0'">冻结券</el-button>
              <el-button type="warning"  @click="setCouponUnFrozen"  v-if="query.isUse==='0'">解冻券</el-button>
              <el-button type="warning"  @click="setCouponDelays"  v-if="query.isUse==='0'">延期券</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="exportData('getCouponOrderUnUseExport')" v-if="query.isUse==='0'">导出</el-button>
            </el-form-item>
         
            <query-ext-plane :opened="opened" v-if="query.isUse==='0'">            
              <el-form-item label="激活状态">
                <el-select v-model="query.isActive" clearable placeholder="请选择状态" style="width:230px;">
                    <el-option value="-1" label="全部"></el-option>
                    <el-option value="0" label="未激活"></el-option>
                    <el-option value="1" label="已激活"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="冻结状态">
                <el-select v-model="query.isFrozen" clearable placeholder="请选择状态" style="width:230px;">
                    <el-option value="-1" label="全部"></el-option>
                    <el-option value="0" label="未冻结"></el-option>
                    <el-option value="1" label="已冻结"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="过期状态">
                <el-select v-model="query.isOver" clearable placeholder="请选择状态" style="width:230px;">
                    <el-option value="-1" label="全部"></el-option>
                    <el-option value="0" label="未过期"></el-option>
                    <el-option value="1" label="已过期"></el-option>
                </el-select>
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
            </query-ext-plane>
          </el-form>
         <page-table ref="table" :query="query" :fetch="queryTable">
            <el-table-column min-width="180" show-overflow-tooltip label="购票电影券" align="center" prop="couponCode" v-if="query.isUse==='1'"></el-table-column>
            <el-table-column min-width="120"  label="电影券分发渠道" align="center" prop="tag" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column min-width="160" show-overflow-tooltip label="购票时间" align="center" prop="orderTime" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column min-width="120"  label="购票影院" align="center" prop="cinemaName" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column width="120"  label="省份" align="center" prop="provinceName" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column width="120"  label="城市" align="center" prop="cityName" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column min-width="120"  label="购票影片" align="center" prop="filmName" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column width="120"  label="购票场次" align="center" prop="startTime" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column width="120"  label="放映制式" align="center" prop="copyType" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column width="120"  label="购票影厅" align="center" prop="hallName" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column width="120"  label="购票座位" align="center" prop="seatDescribe" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>
            <el-table-column width="120"  label="售价（元）" align="center" prop="channelTiceketSum" v-if="query.isUse==='1'" :key="Math.random()"></el-table-column>

            <el-table-column min-width="180" show-overflow-tooltip label="电影券编码" align="center" prop="couponCode" v-if="query.isUse==='0'"></el-table-column>
            <el-table-column min-width="180"  label="电影券种类" align="center" prop="typeName" v-if="query.isUse==='0'"></el-table-column>
            <el-table-column min-width="220"  label="有效期" align="center" prop="validTime" v-if="query.isUse==='0'"></el-table-column>
            <el-table-column min-width="100"  label="绑定状态" align="center" prop="bindStatus" v-if="query.isUse==='0'"></el-table-column>
            <el-table-column min-width="100"  label="冻结状态" align="center" prop="isFrozen" v-if="query.isUse==='0'"></el-table-column>
            <el-table-column min-width="100"  label="作废状态" align="center" prop="isVoid" v-if="query.isUse==='0'"></el-table-column>
            <el-table-column min-width="100"  label="激活状态" align="center" prop="isActive" v-if="query.isUse==='0'"></el-table-column>
            <el-table-column min-width="200"  label="使用规则" align="center" prop="ruleText" v-if="query.isUse==='0'"></el-table-column>
            <el-table-column min-width="200"  label="发行电影" align="center" prop="filmNameAssign" v-if="query.isUse==='0'"></el-table-column>
         </page-table>
         <el-dialog title="电影券使用汇总" :visible.sync="dialogDetailVisible" width="600px" height="400px" class="dialogDetailVisible">
          <el-form style="max-height:400px;overflow-y:auto;">
            <el-form-item label="销售订单号:">{{saleCouponDetail.orderNo}}</el-form-item>
            <el-form-item label="销售时间:">{{saleCouponDetail.saleTimeStr}}</el-form-item>
            <el-form-item label="电影券种类:">{{saleCouponDetail.typeName}}</el-form-item>
            <el-form-item label="使用规则:">{{saleCouponDetail.ruleText}}</el-form-item>
            <el-form-item label="电影券总数:">{{saleCouponDetail.num}}</el-form-item>
            <el-form-item label="总使用率:">{{saleCouponDetail.usage}}%<span style="color:blue;">(使用总数除以电影券总数)</span></el-form-item>
            <el-form-item label="订单总额:">{{saleCouponDetail.amount}}</el-form-item>
            <el-form-item label="结算总额:" v-if="saleCouponDetail.type!=='1'">{{saleCouponDetail.payMoney}}<span style="color:blue;">(结算总额不包含{{saleCouponDetail.type==='3'?'补差':'优惠'}}现金支付部分)</span></el-form-item>
            <el-form-item label="结算总额:" v-else>{{saleCouponDetail.payMoney}}</el-form-item>
            <el-form-item label="订单平均票价:">{{saleCouponDetail.priceAverage}}<span style="color:blue;">(实际交易总额除订单座位数)</span></el-form-item>
            
          </el-form>
          <div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogDetailVisible = false" >关 闭</el-button>
            </span>
          </div>
         </el-dialog>

         <el-dialog title="延期提示" :visible.sync="dialogDelaysFormVisible" width="550px">
          <el-form>
            <el-form-item label="">
              <span>根据条件已筛选出<span v-text="count"></span>张电影券，将根据填写的延期时间来重新设定券的有效期！</span>
            </el-form-item>
              <el-form-item label="延期时间">
              <el-date-picker v-model="time" style="width:230px;" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
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
    import { getSaleCouponOrderDetailList, getSaleCouponDetail, getSaleCouponOrderDetailListExport, getCouponOrderUnUseExport } from '@/api/financeCenter'
    import { setCouponVoid, setCouponFrozen, getSaleCouponCount, setdelaysCoupon } from '@/api/operationCenter'
    import CityCascader from '@/components/CityCascader'
    import QueryExtPlane from '@/components/QueryExtPlane'
    import { exportData } from '@/utils'
    export default {
      name: 'coupon_used_order_detail',
      components: { CityCascader, QueryExtPlane },
      data() {
        return {
          query: {
            isUse: '1',
            couponCodeLeft: '',
            couponCodeRight: '',
            tag: '',
            cinemaName: '',
            copyType: '',
            isActive: '-1',
            isFrozen: '-1',
            isOver: '-1',
            bindStatus: '-1',
            isVoid: '-1'
          },
          area: ['', ''],
          dialogDetailVisible: false,
          saleCouponDetail: {},
          saleCouponSign: [],
          opened: false,
          messageKeyBool: false,
          dialogDelaysFormVisible: false,
          time: '',
          count: ''
        }
      },
      methods: {
        queryTable(query) {
          /* if (query.isUse === '0') {
            query.cinemaName = ''
            query.copyType = ''
            query.orderNo = this.$route.query.orderNo
            return getSaleCouponOrderDetailList(query)
          } else {
            const request = {}
            request.tag = query.tag
            request.cinemaName = query.cinemaName
            request.provinceId = this.area[0]
            request.cityId = this.area[1]

            request.orderNo = this.$route.query.orderNo
            request.isUse = query.isUse
            request.copyType = query.copyType

            return getSaleCouponOrderDetailList(request)
          }*/
          query.orderNo = this.$route.query.orderNo
          return getSaleCouponOrderDetailList(query)
        },
        refreshTable() {
          const cLeft = this.query.couponCodeLeft ? this.query.couponCodeLeft.substring(0, 3) : ''
          const cRight = this.query.couponCodeRight ? this.query.couponCodeRight.substring(0, 3) : ''
          if (cLeft !== cRight && cLeft && cRight) {
            this.$message.warning('前三位号段不同，暂不支持查询！')
            return
          }
          this.$refs.table.refresh()
        },
        tabClick(val) {
          this.$set(this, 'area', ['', ''])

          this.$set(this.query, 'tag', '')
          this.$set(this.query, 'couponCodeLeft', '')
          this.$set(this.query, 'couponCodeRight', '')
          this.$set(this.query, 'copyType', '')
          this.$set(this.query, 'cinemaName', '')
          this.$set(this.query, 'bindStatus', '-1')
          this.$set(this.query, 'isActive', '-1')
          this.$set(this.query, 'isFrozen', '-1')
          this.$set(this.query, 'isOver', '-1')
          this.$set(this.query, 'isVoid', '-1')

          window.sessionStorage.setItem(`query.couponUseCheckDetail`, this.query.isUse)
          this.refreshTable()
        },
        exportData(func) {
          if (func === 'getSaleCouponOrderDetailListExport') {
            exportData(getSaleCouponOrderDetailListExport, { tag: this.query.tag,
              cinemaName: this.query.cinemaName,
              provinceId: this.area[0],
              cityId: this.area[1],
              copyType: this.query.copyType,
              orderNo: this.$route.query.orderNo })
          } else if (func === 'getCouponOrderUnUseExport') {
            exportData(getCouponOrderUnUseExport, { tag: this.query.tag,
              couponCodeLeft: this.query.couponCodeLeft,
              couponCodeRight: this.query.couponCodeRight,
              orderNo: this.$route.query.orderNo })
          }
        },
        openDetail(row) {
          this.saleCouponDetail = []
          this.dialogDetailVisible = true
          getSaleCouponDetail({ orderNo: this.$route.query.orderNo }).then(res => {
            this.saleCouponDetail = res
          })
        },
        getCount() {
          const _this = this
          getSaleCouponCount(this.query).then((res) => {
            _this.count = res
          })
        },
        setCouponVoid() {
          this.messageKeyBool = false
          const paramsTemp = {
            couponCodeLeft: this.query.couponCodeLeft,
            couponCodeRight: this.query.couponCodeRight,
            tag: this.query.tag
          }
          Object.keys(paramsTemp).forEach(key => {
            if (paramsTemp[key] && paramsTemp[key].length > 0 && paramsTemp[key] !== '-1') {
              this.messageKeyBool = true
              return false
            }
          })

          if (!this.messageKeyBool) {
            this.$message.warning('请使用查询条件来制定需要作废的电影券！')
          } else {
            getSaleCouponCount(this.query).then((res) => {
              this.$confirm('根据条件已筛选出' + res + '张电影券,券一旦作废就不可恢复,是否执行操作!', '作废提示', { type: 'warning' }).then(() => {
                const request = paramsTemp
                request.status = 1
    
                setCouponVoid(request).then(() => {
                  this.$message.success('操作成功')
                  this.refreshTable()
                })
              }).catch(() => {
                this.$message.success('操作失败')
              })
            })
          }
        },
        setCouponFrozen() {
          this.messageKeyBool = false
          const paramsTemp = {
            couponCodeLeft: this.query.couponCodeLeft,
            couponCodeRight: this.query.couponCodeRight,
            tag: this.query.tag
          }
          Object.keys(paramsTemp).forEach(key => {
            console.log(paramsTemp[key])
            if (paramsTemp[key] && paramsTemp[key].length > 0 && paramsTemp[key] !== '-1') {
              this.messageKeyBool = true
              return false
            }
          })

          if (!this.messageKeyBool) {
            this.$message.warning('请使用查询条件来制定需要冻结的电影券！')
          } else {
            getSaleCouponCount(this.query).then((res) => {
              this.$confirm('根据条件已筛选出' + res + '张电影券，券一旦冻结就不可使用，可以通过解冻功能来解冻，是否执行冻结', '作废提示', { type: 'warning' }).then(() => {
                const request = paramsTemp
                request.status = 1
                setCouponFrozen(request).then(() => {
                  this.$message.success('操作成功')
                  this.refreshTable()
                })
              }).catch(() => {
              })
            })
          }
        },
        setCouponUnFrozen() {
          this.messageKeyBool = false
          const paramsTemp = {
            couponCodeLeft: this.query.couponCodeLeft,
            couponCodeRight: this.query.couponCodeRight,
            tag: this.query.tag
          }
          Object.keys(paramsTemp).forEach(key => {
            if (paramsTemp[key] && paramsTemp[key].length > 0 && paramsTemp[key] !== '-1') {
              this.messageKeyBool = true
              return false
            }
          })
          if (!this.messageKeyBool) {
            this.$message.warning('请使用查询条件来制定需要解冻的电影券！')
          } else {
            getSaleCouponCount(this.query).then((res) => {
              this.$confirm('根据条件已筛选出' + res + '张电影券，券一旦解冻及恢复使用，是否执行解冻！', '解冻提示', { type: 'warning' }).then(() => {
                const request = paramsTemp
                request.status = '0'
                setCouponFrozen(request).then(() => {
                  this.$message.success('操作成功')
                  this.refreshTable()
                })
              }).catch(() => {
              })
            })
          }
        },
        dialogDelaysForm() {
          this.messageKeyBool = false
          console.log(this.time)
          const paramsTemp = {
            couponCodeLeft: this.query.couponCodeLeft,
            couponCodeRight: this.query.couponCodeRight,
            tag: this.query.tag,
            delaysEndTime: this.time.substring(0, 10)
          }
          if (this.time) {
            const request = paramsTemp
    
            request.status = '1'
            console.log(request)
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
          const paramsTemp = {
            couponCodeLeft: this.query.couponCodeLeft,
            couponCodeRight: this.query.couponCodeRight,
            tag: this.query.tag,
            delaysEndTime: this.time
          }
          Object.keys(paramsTemp).forEach(key => {
            if (paramsTemp[key] && paramsTemp[key].length > 0 && paramsTemp[key] !== '-1') {
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
    .dialogDetailVisible .el-form-item {
      margin-bottom:0px;
    }
</style>
