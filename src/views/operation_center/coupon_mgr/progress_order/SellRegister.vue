<template>
    <div class="app-container">
        <!-- <el-card style="margin-bottom:20px">
          <div slot="header">
            <p class="headerContainer"> 
              <span>销售订单号:{{$route.query.orderNo}}</span>
              <span>销售时间：{{couponInfo.saleTime}}</span>
              <span>业务人员：{{name}}</span>
              <span>客户名称：{{couponInfo.customerName}}</span>
            </p>
            <p class="headerContainer">
              <span>销售数量（张）：{{couponInfo.num}}</span>
              <span>销售单价（元）：{{couponInfo.unitPrice}}</span>
              <span>销售总额：{{couponInfo.amount}}</span>
            </p>
            <p class="headerContainer">
              <span>初审人员：{{couponInfo.checkInfo?couponInfo.checkInfo.checkName:'--'}}</span>
              <span>初审时间：{{couponInfo.checkInfo?couponInfo.checkInfo.createTime:'--'}}</span>
              <span v-if="$route.query.isReceiveMoney">开票状态：{{invoiceInfo.invoiceType === '1'?'无需发票': (invoiceInfo.isDrawInvoice === '1'? '已开票' : '未开票')}}</span>
              <span v-if="$route.query.invoiceType || $route.query.isActive">收款状态：{{invoiceInfo.isReceiveMoney === '1'?'已收款':'未收款'}}</span>
              <span>激活状态：{{couponInfo.isActive === '1'?'已激活':'未激活'}}</span>
            </p>
          </div>    
          <el-table ref="table" index :data="data">         
            <el-table-column label="电影券批次号" label-width="180" align="center" prop="batchNo"></el-table-column>
            <el-table-column label="电影券种类" align="center" prop="typeName"></el-table-column>
            <el-table-column label="电影券类型" align="center" prop="styleName"></el-table-column>
            <el-table-column label="销售券区间号"  label-width="180" align="center" prop="codeIdDetail"></el-table-column>
            <el-table-column label="兑换/优惠面值"  label-width="180" align="center" prop="priceRuleStr"></el-table-column>
          </el-table>
        </el-card> -->
        <el-card style="margin-bottom:20px">
            <div slot="header">
                <span>销售电影券基础信息，销售员：{{couponInfo.operator}}</span>
            </div>
            <el-form label-width="160px" label-position="right" style="width:1000px;" :model="couponInfo" ref="formCard">
                <el-form-item label="客户名称:" prop="customer">
                    <span>{{couponInfo.customerName}}</span>
                </el-form-item>
                <div>
                  <el-form-item label="电影券种类" prop="type"  style="display:inline-block;width: 450px;">
                    <span>{{couponInfo.typeName}}</span>
                  </el-form-item>
                  <el-form-item label="电影券类型" prop="style"  style="display:inline-block;width: 450px;">
                    <span>{{couponInfo.styleName}}</span>
                  </el-form-item>
                </div>
                <el-form-item label="电影券号" v-if="couponInfo.style==='Z'">
                  <div v-for="(item,index) in couponInfo.codeIdDetail" :key="index">
                    <span>{{item.left}}</span>
                    <span> －－ </span>
                    <span>{{item.right}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="销售数量:" prop="num">
                    <span>{{couponInfo.num}}</span>
                     张  
                    <!-- <span style="margin-left:20px;color:red">系统已根据您所填写的号码段自动统计出销售数量!</span> -->
                </el-form-item>
                <el-form-item label="销售总额:" prop="amount">
                    <span>{{couponInfo.amount}}</span> 元
                    <!-- <span style="margin-left:20px;color:gray">只能是数值，且必须大于0</span>  -->
                </el-form-item>
                <el-form-item label="销售单价:" prop="unitPrice">
                    <span>{{couponInfo.unitPrice|| '--'}}</span> 元 
                </el-form-item>
                <el-form-item label="电影券有效期:" prop="time" >
                    {{couponInfo.startTime}} 至 {{couponInfo.endTime}}
                </el-form-item>
                <el-form-item label="兑换面值:" v-if="couponInfo.type==='1' || couponInfo.type==='3'">
                  <span>{{couponInfo.priceRuleStr}}</span>
                </el-form-item>
                <el-form-item label="优惠方式:" prop="discountType"  v-if="couponInfo.type==='2'">            
                  <!-- <el-radio-group v-model="couponInfo.discountType">
                      <el-radio label="1" disabled>不限额优惠</el-radio>
                      <el-radio label="2" disabled>满减优惠</el-radio>
                  </el-radio-group> -->
                  <span v-if="couponInfo.discountType==='1'">不限额优惠</span>
                  <span v-else>满减优惠</span>
                </el-form-item>
                <el-form-item label="优惠影片面值:" prop="canFreePrice" v-if="couponInfo.type=='2' && couponInfo.discountType=='1'">
                <span>{{couponInfo.canFreePrice}}</span>元
                </el-form-item>
                <el-form-item label="销售备注:">
                  <!-- <el-input clearable type="textarea" :row="5" v-model="couponInfo.remark" disabled></el-input> -->
                  <span>{{couponInfo.remark}}</span>
                </el-form-item>
                <el-form-item label="使用说明:">
                  <!-- <el-input clearable type="textarea" :row="5" v-model="couponInfo.useExplain" disabled></el-input> -->
                  <span>{{couponInfo.useExplain}}</span>
                </el-form-item>                
            </el-form>
        </el-card>
        <el-card style="margin-bottom:20px">
          <div slot="header">
              <span>使用规则</span>
          </div>
          <el-form label-width="160px" label-position="right" style="width:1000px;" :model="programInfo">
            <el-form-item label="规则名称:">
              <span>{{programInfo.name}}</span>
            </el-form-item>
            <el-form-item label="不可用场次时段:">
              <span>{{programInfo.dateLimitType==='1'?'不限制':'指定时间'}}</span>
            </el-form-item>
            <el-form-item label="不可用场次时段区间:" v-if="programInfo.dateLimitType==='2'">
              <span>{{programInfo.startTime}} -- {{programInfo.endTime}}</span>&emsp;
              <span v-if="programInfo.timeType==='day'">每天</span>
              <span v-else-if="programInfo.timeType==='week'">每周</span>
              <span v-else>不限制</span>
              <span v-if="programInfo.timeType==='week'">{{week}}</span>&emsp;
              <span>{{programInfo.stime}} -- {{programInfo.etime}}</span>
            </el-form-item>
            <el-form-item label="可用商家:">
              <div v-for="(channel,index) in programInfo.channelList" :key="index">
                <div>{{channel.name}}</div>
              </div>
            </el-form-item>
            <el-form-item label="可用影院:" prop="cinemaGroupId" >
              <div>{{programInfo.cinemaGroupName}}</div>
            </el-form-item>
            <div v-for="(rule,index) in programInfo.ruleList" :key="rule.key">
              <el-form-item label="兑换方式："  :prop="'ruleList.'+index+'.settlementType'">
                 <span v-if="rule.settlementType==='1'">根据影厅</span>
                 <span v-else-if="rule.settlementType==='2'">根据制式</span>
                 <span v-else-if="rule.settlementType==='3'">根据影片</span>
              </el-form-item>
              <el-form-item label="选择影厅："  :prop="'ruleList.'+index+'.hallType'" v-if="programInfo.cinemaGroupId && rule.settlementType === '1'" style="width:300px;">
                 <span>{{rule.hallTypeName}}</span>
              </el-form-item>
              <el-form-item label="选择制式：" :prop="'ruleList.'+index+'.standard'" v-if="programInfo.cinemaGroupId && rule.settlementType === '2'">
                  <span>{{rule.standard}}</span>
              </el-form-item>
              <el-form-item label="选择影片：" :prop="'ruleList.'+index+'.filmId'" v-if="rule.settlementType === '3'">
                <el-radio v-model="rule.filmType" label="-1" disabled>全部影片</el-radio>
                <el-radio v-model="rule.filmType" label="1" disabled>指定影片</el-radio>
                <div style="border:1px solid #ebeef5;width:800px;padding: 10px 20px;" v-if="rule.filmType === '1'">
                  <div v-for="(v,i) in rule.filmList" :key="i">
                    影片名称：<span>{{v.name}}</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="补差类型：" v-if="couponInfo.type === '3'">
                {{rule.diffType==='1'?'差额补差':'固定补差'}}
              </el-form-item>
              <!-- <el-form-item label="设定补差：" v-if="rule.diffType==='1'">
                影票价格{{couponInfo.priceRuleStr}}元时，需补差价=影票价格-{{couponInfo.priceRuleMoney}}元
              </el-form-item> -->
              <!-- 根据影厅 补差类型:固定补差 -->
              <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '1'"> 
                <div v-for="(item,value) in diffRuleArr" :key="value"> 
                  影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元
                </div>
              </el-form-item>
              <!-- 根据制式 补差类型:固定补差 -->
              <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '2'" >
                <div v-for="(item,value) in diffRuleArr" :key="value">
                  <div>{{item.name}}影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元</div>
                </div>                  
              </el-form-item>
              <!-- 根据影片 补差类型:固定补差 -->
              <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '3'" >
                <div v-for="(item,value) in diffRuleArr" :key="value">
                  <div>{{item.name}}<span v-if="item.name">&emsp;&emsp;</span>影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元</div>
                </div>
              </el-form-item>      
            </div>
          </el-form>
        </el-card>
        <el-card style="margin-bottom:20px" v-if="couponInfo.checkInfo">
          <!-- <span style="font-size:14px;line-height:1;vertical-align:top;">审核意见：</span>
          <span style="font-size:14px;line-height:1;vertical-align:top;">{{suggestion?suggestion:'无审核意见'}}</span> -->
          <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
            <el-form label-width="140px" label-position="right" style="width:1000px;">
              <el-form-item label="审核意见：">
                {{suggestion?suggestion:'无审核意见'}}
              </el-form-item>
              <el-form-item label="审核状态：">
                {{couponInfo.checkInfo.isAgree==='1'?'通过':'退回'}}
              </el-form-item>
              <el-form-item label="审核人：">
                {{couponInfo.checkInfo?couponInfo.checkInfo.checkName:'--'}}
              </el-form-item>
              <el-form-item label="审核时间：">
                {{couponInfo.checkInfo.createTime?couponInfo.checkInfo.createTime:'--'}}
              </el-form-item>
            </el-form>
          </el-card>
        </el-card>
        <el-card style="margin-bottom:20px" v-if="$route.query.isReceiveMoney || couponInfo.isReceiveMoney==='1'">
          <receipt-detail type="coupon" :outData="payInfo" @refresh="queryInitTable"></receipt-detail>
          <!--  v-if="$route.query.isReceiveMoney" -->
        </el-card>
        <el-card style="margin-bottom:20px" v-if="$route.query.invoiceType">
          <span v-if="couponInfo.invoiceType==='1'">是否提供发票：无需开票</span>
          <invoice-detail v-else type="coupon" :outData="invoiceInfo" @refresh="queryInitTable"></invoice-detail>
           <!-- v-if="$route.query.invoiceType && $route.query.invoiceType!=='1' " -->
        </el-card>        
        <el-card v-if="$route.query.isActive || couponInfo.isActive==='1'">
          <!-- <div style="margin:20px 0;">
            <span style="font-size:14px;line-height:1;vertical-align:top;">激活说明：</span>
            <span v-if="couponInfo.isActive==='1'">{{couponInfo.setActiveExplain}}</span>
            <el-input clearable v-else v-model.trim="couponInfo.setActiveExplain" type="textarea" :rows="5" :disabled="couponInfo.isActive !== '0'" placeholder="请输入您对此销售单的审核意见" style="display:inline-block;width:600px;"></el-input>
          </div>
          <div style="margin:20px 0;" v-if="couponInfo.isActive === '1'">
            <span style="font-size:14px;vertical-align:top;">激活人：{{couponInfo.setActivePeople}}</span>
          </div> -->
          <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
            <el-form label-width="140px" label-position="right" style="width:1000px;">
              <el-form-item label="激活说明：">
                <span v-if="couponInfo.isActive==='1'">{{couponInfo.setActiveExplain}}</span>
                <el-input clearable  v-else v-model.trim="couponInfo.setActiveExplain" type="textarea" :rows="5" :disabled="couponInfo.isActive !== '0'" placeholder="请输入您对此销售单的审核意见" style="display:inline-block;width:600px;"></el-input>
              </el-form-item>
              <el-form-item label="激活状态：" v-if="couponInfo.isActive === '1'">
                {{couponInfo.activeName}}
              </el-form-item>
              <el-form-item label="激活人：" v-if="couponInfo.isActive === '1'">
                {{couponInfo.setActivePeople}}
              </el-form-item>
              <el-form-item label="激活时间：" v-if="couponInfo.isActive === '1'">
                {{couponInfo.setActiveTime}}
              </el-form-item>
              <!-- <el-button size="small" v-if="$route.query.isActive && couponInfo.isActive === '0'" @click="setActive(couponInfo)" type="primary">激活销售单</el-button> -->
            </el-form>
            <el-button size="small" v-if="$route.query.isActive && couponInfo.isActive === '0'" @click="setActive(couponInfo)" type="primary">激活销售单</el-button>
          </el-card>
       </el-card>        
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCouponOrderInfo, setCouponOrderActive } from '@/api/operationCenter'
import InvoiceDetail from '../../InvoiceDetail'
import ReceiptDetail from '../../ReceiptDetail'
export default {
  name: 'coupon_sell_register',
  components: { InvoiceDetail, ReceiptDetail },
  data() {
    return {
      data: [],
      /* couponInfo: {
        checkInfo: {}
      },*/
      couponInfo: {
        checkInfo: {},
        amount: '',
        codeIdDetail: {},
        customerName: '',
        endTime: '',
        num: '',
        operator: '',
        orderNo: '',
        priceRuleStr: '',
        saleTime: '',
        startTime: '',
        styleName: '',
        typeName: '',
        unitPrice: '',
        remark: '',
        useExplain: ''
      },
      programInfo: {

      },
      week: '',
      invoiceInfo: {},
      payInfo: {},
      query: {},
      diffRuleArr: [],
      suggestion: ''
    }
  },
  methods: {
    async queryInitTable() {
      const temp = await getCouponOrderInfo(this.$route.query.orderNo)
      this.couponInfo = temp.couponInfo
      this.data = temp.list
      this.invoiceInfo = temp.invoiceInfo
      this.payInfo = temp.payInfo.length !== 0 ? temp.payInfo : {}

      const _this = this
      _this.programInfo = temp.programInfo

      if (_this.programInfo.week.length > 0) {
        const weekTemp = _this.programInfo.week.split(',')
        weekTemp.map(e => {
          switch (e) {
            case '1':
              this.week += '周一' + ','
              break
            case '2':
              this.week += '周二' + ','
              break
            case '3':
              this.week += '周三' + ','
              break
            case '4':
              this.week += '周四' + ','
              break
            case '5':
              this.week += '周五' + ','
              break
            case '6':
              this.week += '周六' + ','
              break
            case '0':
              this.week += '周日' + ','
              break
          }
        })
      }

      if (temp.couponInfo.checkInfo && temp.couponInfo.checkInfo.suggestion !== 'null') {
        _this.suggestion = temp.couponInfo.checkInfo.suggestion
      } else {
        _this.suggestion = ''
      }

      this.week = this.week.substr(0, this.week.length - 1)

      if (_this.programInfo.ruleList[0] && _this.programInfo.ruleList[0].filmId !== '-1') {
        _this.$set(_this.programInfo.ruleList[0], 'filmType', '1')
      } else {
        _this.$set(_this.programInfo.ruleList[0], 'filmType', '-1')
      }

      if ((_this.programInfo.ruleList[0].settlementType === '1' || _this.programInfo.ruleList[0].settlementType === '2') && _this.programInfo.ruleList[0].diffType === '2') {
        Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
          this.diffRuleArr.push({ name: e, value: _this.programInfo.ruleList[0].diffRule[e] })
        })
      } else if (_this.programInfo.ruleList[0].settlementType === '3' && _this.programInfo.ruleList[0].diffType === '2' && _this.programInfo.ruleList[0].filmId !== '-1') {
        _this.programInfo.ruleList[0].filmList.forEach(el => {
          Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
            if (el.value === e) {
              this.diffRuleArr.push({ name: el.name, value: _this.programInfo.ruleList[0].diffRule[e] })
            }
          })
        })
      } else if (_this.programInfo.ruleList[0].settlementType === '3' && _this.programInfo.ruleList[0].diffType === '2' && _this.programInfo.ruleList[0].filmId !== '-1') {
        Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
          this.diffRuleArr.push({ name: '', value: _this.programInfo.ruleList[0].diffRule[e] })
        })
      } else if (_this.programInfo.ruleList[0].settlementType === '3' && _this.programInfo.ruleList[0].diffType === '2' && _this.programInfo.ruleList[0].filmId === '-1') {
        Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
          this.diffRuleArr.push({ name: '', value: _this.programInfo.ruleList[0].diffRule[e] })
        })
      }
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    setActive(row) {
      if (row.isReceiveMoney === '0') {
        this.$confirm('激活销售订单中的电影券建议销售订单的销售款已收回后再进行操作，是否立即执行激活电影券操作？', '温馨提示', { type: 'warning' }).then(() => {
          {
            const isActive = row.isActive === '1' ? '0' : '1'
            const param = { orderNo: row.orderNo, isActive, setActiveExplain: row.setActiveExplain }
            setCouponOrderActive(param).then(res => {
              this.$message.success('激活成功')
              row.setActivePeople = res
              row.isActive = isActive
              this.$nextTick(() => {
                this.queryInitTable()
              })
            })
          }
        })
      } else {
        const isActive = row.isActive === '1' ? '0' : '1'
        const param = { orderNo: row.orderNo, isActive, setActiveExplain: row.setActiveExplain }
        setCouponOrderActive(param).then(res => {
          this.$message.success('激活成功')
          row.setActivePeople = res
          row.isActive = isActive
          this.$nextTick(() => {
            this.queryInitTable()
          })
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  async created() {
    this.queryInitTable()
  }

}
</script>

<style scoped>
  .headerContainer{
    font-size: 18px;
    font-weight: bold;
  }
  .headerContainer span {
    display: inline-block;
    width: 350px;
  }
</style>
