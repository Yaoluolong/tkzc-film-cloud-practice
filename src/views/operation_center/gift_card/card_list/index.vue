<template>
  <div class="app-container">
    <el-form inline label-width="100px">
        <el-form-item label="电影卡批次号">
          <el-input v-model.trim="query.batchNo" clearable placeholder="请输入卡批次号" style="width:240px;"></el-input>
        </el-form-item>
        <el-form-item label="电影卡号码">
          <el-input v-model="query.cardCodeLeft" clearable placeholder="输入优惠卡号码查询" style="width:230px;"></el-input>  ~~
          <el-input v-model="query.cardCodeRight" clearable placeholder="输入优惠卡号码查询" style="width:230px;"></el-input>
        </el-form-item>        
        <el-form-item label="电影卡种类">
         <remote-select v-model="query.type"  placeholder="请选择卡种类"  action="/systemApi/dict/getList" :query="{type:'cardType'}" style="width:250px" :showAllOption="true"></remote-select>
        </el-form-item>
        <el-form-item label="电影卡类型">
         <remote-select v-model="query.style"  placeholder="请选择卡类型"  action="/systemApi/dict/getList" :query="{type:'cardstyle'}" style="width:250px" :showAllOption="true"></remote-select>
        </el-form-item>
        <el-form-item label="绑定会员">
          <el-input v-model.trim="query.bindingMobile" clearable placeholder="请输入手机号" style="width:240px;"></el-input>
        </el-form-item>
        <el-form-item style="display: block;margin-left: 30px;">
          <el-button type="primary" @click="refreshTable">查询</el-button>
          <el-button type="primary" v-text="btnText" @click="showToggle">收起查询</el-button>
          <el-button type="success"  icon="el-icon-upload2" @click="exportData">导出数据</el-button>
          <el-button type="warning" @click="setCardVoid">作废卡</el-button>
          <el-button type="warning" @click="setCardFrozen">冻结卡</el-button>
          <el-button type="warning"  @click="setCardUnFrozen">解冻卡</el-button>
          <el-button type="warning"  @click="setCardDelays">延期卡</el-button>
        </el-form-item>
        <div v-show="isShow">
            <el-form inline label-width="120px">
                <el-form-item label="销售时间">
                    <el-date-picker v-model="query.saleTime" style="width: 300px;"  type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="业务人员">
                        <operator-id-selector :accessType="cardLimit" v-model="query.operatorId" placeholder="请输入业务人员名称"></operator-id-selector>
                </el-form-item>
                <el-form-item label="客户名称">
                    <customer-selector :accessType="cardLimit" v-model="query.customer" :isAddNew="false"></customer-selector>                    
                </el-form-item>
                <el-form-item label="销售订单号">
                    <el-input v-model.trim="query.orderNo" clearable placeholder="输入销售订单号" style="width:300px;"></el-input>
                </el-form-item>
                <!-- <el-form-item label="卡来源">
                    <el-select v-model="query.source" clearable placeholder="请选择状态" style="width:300px;">
                        <el-option value="1" label="全部"></el-option>
                        <el-option value="2" label="平台销售"></el-option>
                        <el-option value="2" label="线上购买"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="绑定日期">
                    <el-date-picker v-model="query.bindTime" style="width: 300px;"  type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="生效日期">
                    <el-date-picker v-model="query.validTime" style="width: 300px;"  type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="失效时间">
                    <el-date-picker v-model="query.invalidTime" style="width: 300px;"  type="daterange"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="绑定状态">
                    <el-select v-model="query.bindStatus" clearable placeholder="请选择状态" style="width:300px;">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="0" label="未绑定"></el-option>
                        <el-option value="1" label="已绑定"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作废状态">
                    <el-select v-model="query.isVoid" clearable placeholder="请选择状态" style="width:300px;">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="0" label="未作废"></el-option>
                        <el-option value="1" label="已作废"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="冻结状态">
                    <el-select v-model="query.isFrozen" clearable placeholder="请选择状态" style="width:300px;">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="0" label="未冻结"></el-option>
                        <el-option value="1" label="已冻结"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开卡状态">
                    <el-select v-model="query.isActive" clearable placeholder="请选择状态" style="width:300px;">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="0" label="未开卡"></el-option>
                        <el-option value="1" label="已开卡"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
    </el-form>
    <page-table ref="table" index :query="queryTemp" :fetch="queryTable">
        <el-table-column  label="电影卡批次号" align="center" prop="batchNo" ></el-table-column>
        <el-table-column   label="电影卡号码" width="180px" align="center" prop="cardCode" show-overflow-tooltip></el-table-column>
        <el-table-column   label="电影卡种" align="center" prop="typeName"></el-table-column>
        <el-table-column  label="电影卡类型" align="center" prop="styleName"></el-table-column>
        <el-table-column  label="卡内原点数" align="center" prop="oldPoint"></el-table-column>
        <el-table-column  label="卡内剩余点数" align="center" prop="point"></el-table-column>
        <el-table-column   label="激活状态" align="center" prop="isActive"></el-table-column>
        <el-table-column   label="冻结状态" align="center" prop="isFrozen"></el-table-column>
        <el-table-column   label="作废状态" align="center" prop="isVoid"></el-table-column>
        <el-table-column   label="绑定状态" align="center" prop="bindStatus"></el-table-column>
        <el-table-column   label="详情" align="center" prop="oper">
          <template slot-scope="{row}">
        <el-button type="text" @click="$router.push({path:'/operation_center/gift_card/card_detail',query:{id:row.id}})">查看</el-button>
          </template>
        </el-table-column>
    </page-table>
    
    <el-dialog title="延期提示" :visible.sync="dialogDelaysFormVisible" width="550px">
          <el-form>
            <el-form-item label="">
              <span>根据条件已筛选出<span v-text="count"></span>张电影卡，将根据填写的延期时间来重新设定卡的有效期！</span>
            </el-form-item>
              <el-form-item label="延期时间">
              <el-date-picker v-model="time" style="width:230px;"  type="date" value-format="yyyy-MM-dd"></el-date-picker>
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
import { getCardList, exportCardList, setCardVoid, setCardFrozen, setdelaysCard, getSaleCardCount } from '@/api/operationCenter'
import CustomerSelector from '@/components/CustomerSelector'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { realDeepClone, exportData } from '@/utils'
export default {
  name: 'card_list',
  components: { CustomerSelector, OperatorIdSelector },
  data() {
    return {
      cardLimit: 'cardLimit',
      query: {
        batchNo: '',
        cardCode: '',
        cardPassword: '',
        mobile: '',
        type: '-1',
        style: '-1',
        saleTime: [],
        bindTime: [],
        validTime: [],
        invalidTime: [],
        operatorId: '',
        customer: '',
        orderNo: '',
        bindStatus: '-1',
        isVoid: '-1',
        isFrozen: '-1',
        isActive: '-1'
      },
      btnText: '精准查询',
      isShow: false,
      radio: '',
      count: '',
      dialogDelaysFormVisible: false,
      time: '', // 延期时间
      messageKeyBool: false
    }
  },
  watch: {},
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

      if (!this.isShow) {
        if (temp.bindStatus === '-1') delete temp.bindStatus
        if (temp.isVoid === '-1') delete temp.isVoid
        if (temp.isFrozen === '-1') delete temp.isFrozen
        if (temp.isActive === '-1') delete temp.isActive
      }
      delete temp.saleTime
      delete temp.bindTime
      delete temp.validTime
      delete temp.invalidTime
      return temp
    }
  },
  methods: {
    exportData() {
      exportData(exportCardList, this.queryTemp)
    },
    queryTable(query) {
      return getCardList(query)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    viewEvent() {
      this.adapterSelected = this.radio
    },
    showToggle: function() {
      this.isShow = !this.isShow
      if (this.isShow) {
        this.btnText = '收起查询'
      } else {
        this.btnText = '精准查询'
      }
    },
    getCount() {
      const _this = this
      getSaleCardCount(this.query).then((res) => {
        _this.count = res
      })
    },
    setCardVoid() {
      this.messageKeyBool = false
      Object.keys(this.query).forEach(key => {
        if (this.query[key] && this.query[key].length > 0 && this.query[key] !== '-1') {
          this.messageKeyBool = true
          return false
        }
      })

      if (!this.messageKeyBool) {
        this.$message.warning('请使用查询条件来制定需要作废的电影卡！')
      } else {
        getSaleCardCount(this.query).then((res) => {
          this.$confirm('根据条件已筛选出' + res + '张电影卡,卡一旦作废就不可恢复,是否执行操作!', '作废提示', { type: 'warning' }).then(() => {
            const request = this.queryTemp
            request.status = 1
            setCardVoid(request).then(() => {
              this.$message.success('操作成功')
              this.refreshTable()
            })
          }).catch(() => {
          })
        })
      }
    },
    setCardFrozen() {
      this.messageKeyBool = false
      Object.keys(this.query).forEach(key => {
        if (this.query[key] && this.query[key].length > 0 && this.query[key] !== '-1') {
          this.messageKeyBool = true
          return false
        }
      })

      if (!this.messageKeyBool) {
        this.$message.warning('请使用查询条件来制定需要冻结的电影卡！')
      } else {
        getSaleCardCount(this.query).then((res) => {
          this.$confirm('根据条件已筛选出' + res + '张电影卡，卡一旦冻结就不可使用，可以通过解冻功能来解冻，是否执行冻结', '作废提示', { type: 'warning' }).then(() => {
            const request = this.queryTemp
            request.status = 1
            setCardFrozen(request).then(() => {
              this.$message.success('操作成功')
              this.refreshTable()
            })
          }).catch(() => {
          })
        })
      }
    },
    setCardUnFrozen() {
      this.messageKeyBool = false
      Object.keys(this.query).forEach(key => {
        if (this.query[key] && this.query[key].length > 0 && this.query[key] !== '-1') {
          this.messageKeyBool = true
          return false
        }
      })
      if (!this.messageKeyBool) {
        this.$message.warning('请使用查询条件来制定需要解冻的电影卡！')
      } else {
        getSaleCardCount(this.query).then((res) => {
          this.$confirm('根据条件已筛选出' + res + '张电影卡，卡一旦解冻及恢复使用，是否执行解冻！', '解冻提示', { type: 'warning' }).then(() => {
            const request = this.queryTemp
            request.status = '0'
            setCardFrozen(request).then(() => {
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
      if (this.time) {
        const request = this.queryTemp
        // request.delaysStartTime = this.time[0]
        request.delaysEndTime = this.time
        request.status = '1'
        setdelaysCard(request).then(() => {
          this.$message.success('操作成功')
          this.dialogDelaysFormVisible = false
          this.refreshTable()
        })
      } else {
        this.$message.warning('请选择延期区间')
        return
      }
    },
    setCardDelays() {
      Object.keys(this.query).forEach(key => {
        if (this.query[key] && this.query[key].length > 0 && this.query[key] !== '-1') {
          this.messageKeyBool = true
          return false
        }
      })

      if (!this.messageKeyBool) {
        this.$message.warning('请使用查询条件来制定需要延期的电影卡！')
      } else {
        this.getCount()
        this.dialogDelaysFormVisible = true
      }
    }

  },

  async created() {

  }
}
</script>

<style scoped lang="scss">
.el-row {
    margin-bottom: 0px;
    border-bottom: 1px solid #C0C0C0;
    &:last-child {
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }
  .el-col {
    border-radius: 0px;
  }
  .kacard{
    text-align: center;
    line-height: 35px;
    border-top: 1px solid  #C0C0C0;
  }
.bg-purple-light {
    background: #ffffff;
  }
  .bg-purple {
    background: #DCDCDC;
  }
.grid-content {
    border-radius: 0px;
    min-height: 36px;
  }
  .sales{
    font-size: 15px;
    font-weight: bold;
    color: #333333;
    }
  .business{
    border-left: 1px solid  #C0C0C0;
    border-right: 1px solid #C0C0C0;
  }
  .businessitem{
    border-right: 1px solid #C0C0C0;
  }
</style>
