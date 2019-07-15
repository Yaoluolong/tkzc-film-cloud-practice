<template>
    <div class="app-container">
         <el-form class="title" :inline="true">
            <div>
              <el-form-item label="影院名称：" style="margin-right:110px;"><span>{{manage.cinemaName}}</span></el-form-item>
              <el-form-item label="商家名称："><span>{{manage.channelName}}</span></el-form-item>
            </div>
            <div class="filter-container">
              <el-form-item label="影片名称">
                <el-input v-model="query.filmName" clearable placeholder="请输入影片名称" style="width:200px;"></el-input>
              </el-form-item>
              <el-form-item label="放映时间">
                <el-date-picker v-model="query.time" type="daterange"  value-format="yyyy-MM-dd"   start-placeholder="放映开始日期" end-placeholder="放映结束日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="影厅">
                <remote-select v-model="query.hallId" clearable placeholder="请选择影厅" :action="'/systemApi/cinemaHall/getList'" :query="{ cinemaId: manage.cinemaId }"></remote-select>
              </el-form-item>
              <el-form-item label="排期编码">
                <el-input v-model="query.featureAppNo" clearable placeholder="请输入排期编码" style="width:200px;"></el-input>
              </el-form-item>
            </div>
         </el-form>
         <div class="buttons">
            <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
            <el-button type="warning" icon="el-icon-download"  @click="batchUpdateStatus('2')">批量下架</el-button>
            <el-button type="warning" icon="el-icon-upload2"  @click="batchUpdateStatus('1')">批量上架</el-button>
            <el-button type="warning" icon="el-icon-edit"  @click="selectSubmit()">排期价格调整</el-button>
         </div>
         <page-table ref="table" index :query="query" :fetch="queryTable"  row-key="featureAppNo" >
            <el-table-column type="selection" :selectable="selectable" align="center" reserve-selection width="40"></el-table-column>
            <el-table-column min-width="120"  label="还可调价范围" align="center" prop="modifyRange" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="180"  label="影片名称" align="center" prop="filmName" show-overflow-tooltip></el-table-column>
            <el-table-column width="80"  label="排期编码" align="center" prop="featureAppNo"></el-table-column>
            <el-table-column width="140"  label="放映时间" align="center" prop="startTime"></el-table-column>
            <el-table-column min-width="120"  label="放映影厅" align="center" prop="hallName" show-overflow-tooltip></el-table-column>
            <el-table-column width="80"  label="放映制式" align="center" prop="copyType"></el-table-column>
            <el-table-column width="120"  label="影片最低价" align="center" prop="lowestPrice" :formatter="priceFormatter"></el-table-column>
            <el-table-column width="120"  label="影院结算票价" align="center" prop="cinemaSettleTicketPrice"  :formatter="priceFormatter"></el-table-column>
            <el-table-column width="120"  label="影院结算服务费" align="center" prop="cinemaSettleServicePrice"  :formatter="priceFormatter"></el-table-column>
            <!-- <el-table-column width="120"  label="营收票价" align="center" prop="revenueTicketPrice"  :formatter="priceFormatter"></el-table-column>
            <el-table-column width="120"  label="营收服务费" align="center" prop="revenueServiceFee"  :formatter="priceFormatter"></el-table-column>
            <el-table-column min-width="100"  label="调整价格" align="center" prop="modifyStr" show-overflow-tooltip></el-table-column>
            <el-table-column width="120"  label="当前影院票价" align="center" prop="settlementPrice" :formatter="priceFormatter"></el-table-column>
            <el-table-column width="120"  label="当前影院服务费" align="center" prop="servicePrice"  :formatter="priceFormatter"></el-table-column> -->
            <el-table-column width="120"  label="价格方案内票价" align="center" prop="settlementTicketPrice"  :formatter="priceFormatter"></el-table-column>
            <el-table-column width="120"  label="价格方案内影院服务费" align="center" prop="revenueServiceFee"  :formatter="priceFormatter"></el-table-column>
            <el-table-column width="120"  label="票价调整额" align="center" prop="modifyTicketPrice"  :formatter="priceFormatter"></el-table-column>
            <el-table-column width="120"  label="服务费调整额" align="center" prop="mobifyServicePrice"  :formatter="priceFormatter"></el-table-column>
            
            <el-table-column width="100"  label="销售状态" align="center" prop="statusName">
              <template  slot-scope="{row}"><el-tag :type="row.status=='1'? 'success':'danger'">{{row.status=='1'? '已上架':'已下架'}}</el-tag></template>
            </el-table-column>
            
         </page-table>

         <el-dialog title="排期价格调整" :visible.sync="dialogVisible" width="550px">
           <el-form class="dialog-content" :model="form" ref="form" :rules="rules" :inline="true">
             <div v-if="priceRight == '1' || priceRight == '2' || priceRight == '3' || priceRight == '5'">
                <span class="tip"><span>{{selectNum == 'all' ? '当前影院下的所有排期，' : '已选择的影院排期 '+selectNum+' 条，'}}</span>进行调整平台票价：</span>
                <div class="form-item-row">
                  <el-form-item prop="ticketFloatType">
                    <el-select v-model="form.ticketFloatType" placeholder="请选择调整方式" style="width:200px;margin-right:10px;">
                      <el-option value="add" label="增加"></el-option>
                      <el-option value="sub" label="减少"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="ticketPrice">
                    <el-input v-model="form.ticketPrice"  placeholder="0.00" style="width:200px;">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </div>
             </div>
             <div v-if="priceRight == '1' || priceRight == '2' || priceRight == '4' || priceRight == '6'">
                <span class="tip"><span v-if="priceRight != '1' && priceRight != '2'">{{selectNum == 'all' ? '当前影院下的所有排期，' : '已选择的影院排期 '+selectNum+' 条，'}}</span>进行调整影院服务费：</span>
                <div class="form-item-row">
                  <el-form-item prop="serviceFloatType">
                    <el-select v-model="form.serviceFloatType" placeholder="请选择调整方式" style="width:200px;margin-right:10px;">
                      <el-option value="add" label="增加"></el-option>
                      <el-option value="sub" label="减少"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="servicePrice">
                    <el-input v-model="form.servicePrice"  placeholder="0.00" style="width:200px;">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </div>
             </div>
             <el-form-item>
               <span class="dialog-footer" style="text-align:center">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="modifySubmit">保 存</el-button>
               </span>
             </el-form-item>
           </el-form>
         </el-dialog>

         <el-dialog class="dialog-two" :visible.sync="dialogVisibleTwo" width="550px" center>
           <div slot="title" class="title"><i class="el-icon-warning"></i> 温馨提示</div>
           <div class="row">
             <div>
               <span>{{selectNum == 'all' ? '当前影院下的所有排期，' : '已选择的影院排期'+selectNum+'条，'}}</span>
               <span v-if="priceRight == '1' || priceRight == '2' || priceRight == '3' || priceRight == '5'">
                  进行调整平台票价：{{ (modifyData.ticketFloatType == 'add' ? '增加' : '减少') + modifyData.ticketPrice }}元{{priceRight == '1' || priceRight == '2' ? '，' : '。'}}
               </span>
               <span v-if="priceRight == '1' || priceRight == '2' || priceRight == '4' || priceRight == '6'">进行调整影院服务费：{{ (modifyData.serviceFloatType == 'add' ? '增加' : '减少') + modifyData.servicePrice }}元。</span>
             </div>
           </div>
           <div class="row" style="line-height:24px;">
             其中 {{dialogTwoData.modifyNum}} 条影院排期可执行调价，{{dialogTwoData.filterNum ? dialogTwoData.filterNum + '条由于放映时间过期不可调价，' : '' }}剩余 {{dialogTwoData.cnotNum}} 条影院排期由于可调价范围不一致无法执行调价！
           </div>
           <div class="row">无法执行此调价的排期有：</div>
           <el-table class="dialog-table" :data="dialogTwoData.errorData" max-height="270" stripe>
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column min-width="120"  label="影片名称" prop="filmName" show-overflow-tooltip></el-table-column>
              <el-table-column width="80" align="center"  label="排期编码" prop="featureAppNo"></el-table-column>
              <el-table-column width="140" align="center"  label="放映时间" prop="startTime"></el-table-column>
              <el-table-column min-width="100"  label="放映影厅" prop="hallName" show-overflow-tooltip></el-table-column>
           </el-table>
           <span class="dialog-footer">
             <el-button @click="endSubmit" :disabled="saveStatus">直接保存</el-button>
             <el-button type="primary" @click="dialogVisibleTwo = false">重新调整</el-button>
           </span>
         </el-dialog>
    </div>
</template>

<script>
  import { realDeepClone } from '@/utils'
  import { getChannelCinemaPlanPageList, updateChannelPlan, modifyChannelPrice } from '@/api/mallCenter'
  export default {
    name: 'channel_management',
    data() {
      const priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
      const ticketPriceValidator = (rule, value, cb) => {
        if (!value || value === '') {
          cb(new Error('请输入平台票价'))
        } else {
          if (!priceReg.test(value)) {
            cb(new Error('请输入正确的价格'))
          }
        }
        cb()
      }
      const servicePriceValidator = (rule, value, cb) => {
        if (!value || value === '') {
          cb(new Error('请输入影院服务费'))
        } else {
          if (!priceReg.test(value)) {
            cb(new Error('请输入正确的价格'))
          }
        }
        cb()
      }
      return {
        query: {},
        form: {},
        params: {
          modifyPrice: []
        },
        priceRight: '',
        manage: {},
        dialogVisible: false,
        dialogVisibleTwo: false,
        dialogTwoData: {},
        modifyData: {},
        selectNum: 0,
        page: '',
        curPage: 1,
        saveStatus: false,
        modifyKey: '',
        rules: {
          ticketFloatType: { required: true, message: '请选择调整方式', trigger: 'change' },
          serviceFloatType: { required: true, message: '请选择调整方式', trigger: 'change' },
          ticketPrice: { required: true, validator: ticketPriceValidator, trigger: ['blur', 'change'] },
          servicePrice: { required: true, validator: servicePriceValidator, trigger: ['blur', 'change'] }
        }
      }
    },

    methods: {
      queryTable(query) {
        if (query.time) {
          query.startTime = query.time[0]
          query.endTime = query.time[1]
        } else {
          query.startTime = undefined
          query.endTime = undefined
        }
        query.cinemaId = this.manage.cinemaId
        query.channelId = this.manage.channelId
        const request = realDeepClone(query)
        delete request.time
        return getChannelCinemaPlanPageList(request)
      },
      refreshTable() {
        this.$refs.table.refresh()
      },
      priceFormatter(row, column, cellValue, index) {
        return cellValue + '元'
      },
      async batchUpdateStatus(status) {
        this.modifyPrice(status)
      },
      selectable(row, i) {
        // return row.status === '1'
        return true
      },
      modifySubmit() {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            this.params.modifyPrice = JSON.stringify(this.form)
            await modifyChannelPrice(this.params).then(res => {
              this.$message.success('调价成功')
              this.dialogVisible = false
              this.refreshTable()
            }).catch(res => {
              if (res.status === 2) {
                this.dialogTwoData = res.data
                this.modifyData = res.data.modifyPrice
                this.modifyKey = res.data.modifyKey
                this.dialogVisible = false
                this.dialogVisibleTwo = true
                if (res.data.modifyNum === 0) {
                  this.saveStatus = true
                } else {
                  this.saveStatus = false
                }
              }
            })
          }
        })
      },
      async endSubmit() {
        if (this.modifyKey) {
          await modifyChannelPrice({ modifyKey: this.modifyKey }).then(res => {
            this.dialogVisibleTwo = false
            this.$message.success('保存成功')
            this.refreshTable()
          })
        }
      },
      selectSubmit() {
        this.$message.warning('功能正在整改中')
        // if (this.priceRight === '7') {
        //   this.$message.warning('抱歉！当前影院无权对票价、服务费进行调整。')
        // } else {
        //   this.modifyPrice()
        // }
      },
      async modifyPrice(status) {
        const selectData = this.$refs.table.getSelection()
        const params = {
          cinemaId: this.manage.cinemaId,
          channelId: this.manage.channelId
        }
  
        if (selectData.length === 0) {
          this.$message.warning('请选择排期')
          return
          // if (JSON.stringify(this.query) === '{}') {
          //   status ? this.allModify(status) : this.allModify()
          // } else {
          //   status ? this.queryModify(params, status) : this.queryModify(params)
          // }
        } else {
          params.featureAppNo = selectData.map(e => e.featureAppNo).join(',')
          this.selectNum = selectData.length
          if (status) {
            params.status = status
            let msg = ''
            if (status === '2') {
              msg = '确定对已选择的影院排期在商家：' + this.manage.channelName + '上进行下架操作吗？'
            } else {
              msg = '确定对已选择的影院排期在商家：' + this.manage.channelName + '上进行上架操作吗？'
            }
            this.$confirm(msg, '温馨提示', { type: 'warngin' }).then(async() => {
              await updateChannelPlan(params).then(res => {
                this.$message.success('处理成功')
                this.refreshTable()
              })
            })
          } else {
            this.dialogVisible = true
          }
        }
        this.params = params
      },
      allModify(status) {
        // let text = ''
        // if (status) {
        //   text = status === '1' ? '批量上架' : '批量下架'
        // } else {
        //   text = '进行价格调整'
        // }
        let msg = ''
        if (status === '2') {
          msg = '确定对已选择的影院排期在商家：' + this.manage.channelName + '上进行下架操作吗？'
        } else {
          msg = '确定对已选择的影院排期在商家：' + this.manage.channelName + '上进行上架操作吗？'
        }

        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.selectNum = 'all'
          if (!status) {
            this.dialogVisible = true
          } else {
            this.params.status = status
            await updateChannelPlan(this.params).then(res => {
              this.$message.success('处理成功')
              this.refreshTable()
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      queryModify(params, status) {
        let text = ''
        if (status) {
          text = status === '1' ? '批量上架' : '批量下架'
        } else {
          text = '进行价格调整'
        }
        this.$confirm('是否对当前查询条件下所有的影片排期' + text + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          if (this.query.filmName) {
            params.filmName = this.query.filmName
          }
          if (this.query.time) {
            params.startTime = this.query.time[0]
            params.endTime = this.query.time[1]
          }
          if (this.query.hallId) {
            params.hallId = this.query.hallId
          }
          this.selectNum = 'all'
          if (!status) {
            this.dialogVisible = true
          } else {
            await updateChannelPlan(this.params).then(res => {
              this.$message.success('处理成功')
              this.refreshTable()
            })
          }
          return params
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    created() {
      const manageData = JSON.parse(sessionStorage.getItem('manage'))
      if (manageData) {
        this.manage = manageData
        this.priceRight = manageData.priceRight
      }
    }
  }
</script>

<style scoped lang="scss">
.buttons {
  padding-bottom: 20px;
}
.dialog-content {
  text-align: center;
  padding: 0 48px;
  .tip {
    display: inline-block;
    width: 100%;
    text-align: left;
  }
}
.dialog-two {
  color: #66b1ff;
  font-size: 18px;
  .dialog-footer {
    display: inline-block;
    width: 100%;
    text-align: center;
    padding-top: 50px;
  }
}
.row {
  font-size: 14px;
  margin-bottom: 20px;
  span {
    line-height: 24px;
  }
}
.form-item-row {
  padding: 20px 0;
}
.form-item-row > :not(:first-child){
  margin: 0 !important;
}
.dialog-table {
  border: 1px solid #f1f1f1
}

</style>
