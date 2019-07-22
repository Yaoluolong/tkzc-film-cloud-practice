<template>
  <div class="app-container">
    <!-- <el-card>
        <div style="font-size:18px;font-weight:bold;">销售订单号：{{$route.query.orderNo}}&emsp;&emsp;&emsp;客户名称：{{couponInfo.customerName}}</div>
      </el-card>
      <el-card style="margin-bottom:20px;">      
        <el-steps :active="parseInt(params.checkStatus)" style="margin: 0px 100px 40px 100px">
          <el-step title="创建销售单" :description="description" :dates="date"></el-step>
          <el-step title="部门初审" :isShowMore="firstCheckInfo.count>1" more="查看更多" @button-enter="buttonFirst" 
            >
            :description="firstCheckInfo.checkName" 
            :dates="firstCheckInfo.createTime" 
            :suggestion="firstCheckInfo.suggestion"
            :approvalRes="firstCheckInfo.isAgree"
            <template slot="description">
               <div class="step-row">
                 <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
                   <tr>
                      <td style="color:#98A6BE">
                        <div class="processing_content_detail" style="float:left;width:70%">
                          <span style="color:#219AFF">{{firstCheckInfo.checkName}}</span>&nbsp;&nbsp;
                          <span v-if="params.checkStatus !=='1' && firstCheckInfo.isAgree">{{firstCheckInfo.isAgree==='1'?'通过':'退回'}}</span>
                        </div> 
                        <div class="processing_content_detail" style="float:left;">
                          <span ><i class="el-icon-time" v-if="firstCheckInfo.createTime"></i>&nbsp;&nbsp;{{firstCheckInfo.createTime}}</span> 
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="processing_content_detail" style="float:left;width:70%" v-if="firstCheckInfo.suggestion">
                          <span style="color:#919FB8">审核意见：{{firstCheckInfo.suggestion}}</span>
                        </div> 
                      </td>
                    </tr>
                  </table>
             </div>
            </template>
          </el-step>
          <el-step title="财务复审" :approvalStatus="params.activeName+'/'+params.collectName+'/'+params.drawInvoiceName"> 
             <template slot="description" >
                <div class="step-row" v-for="item in params.secondCheckList">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
                    <tr>
                       <td style="color:#98A6BE">
                         <div class="processing_content_detail" style="float:left;width:70%">
                           <span style="color:#219AFF">{{item.checkName}}</span>&nbsp;&nbsp;
                           <span>{{item.type}}</span>
                         </div> 
                         <div class="processing_content_detail" style="float:left;">
                           <span ><i class="el-icon-time" v-if="item.createTime"></i>&nbsp;&nbsp;{{item.createTime}}</span> 
                         </div>
                       </td>
                     </tr>
                     <tr>
                       <td>
                         <div class="processing_content_detail" style="float:left;width:70%" v-if="item.suggestion">
                           <span style="color:#919FB8">审核意见：{{item.suggestion}}</span>
                         </div> 
                       </td>
                     </tr>
                   </table>
              </div>
            </template>             
          </el-step>
          <el-step title="完成" :status="status" description=""></el-step>
        </el-steps>
    </el-card>-->
    <el-card style="margin-bottom:20px;">
      <el-form>
        <page-table ref="table" index :query="query" :fetch="queryTable">
          <el-table-column
            min-width="100"
            label="客户名称"
            align="center"
            prop="customerName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            min-width="140"
            label="电影券批次号"
            align="center"
            prop="batchNo"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column min-width="100" label="电影券种类" align="center" prop="typeName" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="100" label="电影券类型" align="center" prop="styleName" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="140" label="券号" align="center" prop="couponCode" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="190" label="有效日期" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span prop="row.startTime">{{row.startTime.substr(0,10)}}</span>至
              <span prop="row.startTime">{{row.endTime.substr(0,10)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="180"
            label="兑换/优惠影片面值"
            align="center"
            prop="priceRule"
            show-overflow-tooltip
          ></el-table-column>
        </page-table>
      </el-form>
    </el-card>
    <!-- 使用规则设置 -->
    <el-card class="mb20">
      <div slot="header">
        <span>使用规则</span>
        <span
          v-if="programInfo.statusName"
          class="dib pl10 pr10 ml20"
          style="background:#f39800;height: 28px;line-height: 28px;border-radius: 4px;color: #FFF;"
        >{{programInfo.statusName}}</span>
      </div>
      <el-card shadow="never" class="mt20 mb15">
        <el-form
          label-width="140px"
          label-position="right"
          class="wp100"
          :model="programInfo"
        >
          <el-form-item label="规则名称:">
            <span>{{programInfo.name}}</span>
          </el-form-item>
          <el-form-item label="不可用时段:">
            <span>{{programInfo.dateLimitType==='1'?'不限制':'指定时间'}}</span>
          </el-form-item>
          <el-form-item label="不可用时段区间:" v-if="programInfo.dateLimitType==='2'">
            <span>{{programInfo.startTime}} -- {{programInfo.endTime}}</span>&emsp;
            <span v-if="programInfo.timeType==='day'">每天</span>
            <span v-else-if="programInfo.timeType==='week'">每周</span>
            <span v-else>不限制</span>
            <span v-if="programInfo.timeType==='week'">{{week}}</span>&emsp;
            <span>{{programInfo.stime}} -- {{programInfo.etime}}</span>
          </el-form-item>
          <el-form-item label="可用商家:">
            <div v-for="(channel,index) in programInfo.channelList" :key="index">
              <!-- <el-checkbox disabled checked v-model="channel.checked">{{channel.name}}</el-checkbox> -->
              <div>{{channel.name}}</div>
            </div>
          </el-form-item>
          <el-form-item label="可用影院" prop="cinemaGroupId">
            <div>{{programInfo.cinemaGroupName}}</div>
          </el-form-item>
          <div v-for="(rule,index) in programInfo.ruleList" :key="rule.key">
            <el-form-item label="兑换方式：" :prop="'ruleList.'+index+'.settlementType'">
              <span v-if="rule.settlementType==='1'">根据影厅</span>
              <span v-else-if="rule.settlementType==='2'">根据制式</span>
              <span v-else-if="rule.settlementType==='3'">根据影片</span>
            </el-form-item>
            <el-form-item
              label="选择影厅："
              :prop="'ruleList.'+index+'.hallType'"
              v-if="programInfo.cinemaGroupId && rule.settlementType === '1'"
              style="width:300px;"
            >
              <span>{{rule.hallTypeName}}</span>
            </el-form-item>
            <el-form-item
              label="选择制式："
              :prop="'ruleList.'+index+'.standard'"
              v-if="programInfo.cinemaGroupId && rule.settlementType === '2'"
            >
              <span>{{rule.standard}}</span>
              <!-- <standard-selector ref="standard" v-model="rule.standard" :cinemaGroupId="programInfo.cinemaGroupId" disabled></standard-selector> -->
            </el-form-item>
            <el-form-item
              label="影片名称："
              :prop="'ruleList.'+index+'.filmId'"
              v-if="rule.settlementType === '3'"
            >
              <el-radio v-model="rule.filmType" label="-1" disabled>全部影片</el-radio>
              <el-radio v-model="rule.filmType" label="1" disabled>指定影片</el-radio>
              <div
                style="border:1px solid #ebeef5;width:800px;padding: 10px 20px;"
                v-if="rule.filmType === '1'"
              >
                <div v-for="(v,index) in rule.filmList" :key="index">
                  影片名称：
                  <span>{{v.name}}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="补差类型："
              v-if="couponInfo.type==='3'"
            >{{rule.diffType==='1'?'差额补差':'固定补差'}}</el-form-item>
            <el-form-item
              label="设定补差："
              v-if="rule.diffType==='1'"
            >影票价格{{couponInfo.priceRuleStr}}元时，需补差价=影票价格-{{couponInfo.priceRuleMoney}}元</el-form-item>
            <!-- 根据影厅 补差类型:固定补差 -->
            <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '1'">
              <div
                v-for="(item,value) in diffRuleArr"
                :key="value"
              >影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元</div>
            </el-form-item>
            <!-- 根据制式 补差类型:固定补差 -->
            <el-form-item label="设定补差：" v-if="rule.diffType==='2' && rule.settlementType === '2'">
              <div v-for="(item,value) in diffRuleArr" :key="value">
                <div>{{item.name}}影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元</div>
              </div>
            </el-form-item>
            <!-- 根据影片 补差类型:固定补差 -->
            <el-form-item label="设定补差：" v-if="rule.diffType=='2' && rule.settlementType === '3'">
              <div v-for="(item,value) in diffRuleArr" :key="value">
                <div>
                  {{item.name}}
                  <span v-if="item.name">&emsp;&emsp;</span>
                  影票价格范围{{couponInfo.priceRuleStr}}元可使用券，需补差价{{item.value}}元
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </el-card>

    <el-card class="mb20" >
      <el-card shadow="never" class="w800 mt20 mb15">
        <el-form label-width="140px" label-position="right" class="wp100" v-if="couponInfo.checkInfo">
          <el-form-item label="审核意见：">{{suggestion?suggestion:'无审核意见'}}</el-form-item>
          <el-form-item label="审核状态：">{{firstCheckInfo.isAgree==='1'?'通过':'退回'}}</el-form-item>
          <el-form-item label="审核人：">{{firstCheckInfo.checkName}}</el-form-item>
          <el-form-item label="审核时间：">{{firstCheckInfo.createTime?firstCheckInfo.createTime:'无'}}</el-form-item>
        </el-form>
        <el-form label-width="140px" label-position="right" class="wp100" v-else>
          <el-form-item label="审核状态：">未审核</el-form-item>
          <el-form-item label="审核人：">测试数据1、测试数据2</el-form-item>
        </el-form>
      </el-card>
    </el-card>
    <el-card
      class="mb20"
      v-if="$route.query.isReceiveMoney || couponInfo.isReceiveMoney==='1'"
    >
      <receipt-detail type="coupon" :outData="payInfo" :isCollectName="params.collectName"></receipt-detail>
    </el-card>
    <el-card
      class="mb20"
    >
      <el-card shadow="never" class="w800 mt20 mb15">
        <el-form label-width="140px" label-position="right" class="wp100" v-if="couponInfo.invoiceType==='1' && couponInfo.isDrawInvoice==='0'">
          <el-form-item label="是否提供发票：">无需开票</el-form-item>
        </el-form>
        <el-form label-width="140px" label-position="right" class="wp100" v-else>
          <el-form-item label="开票状态：">未开票</el-form-item>
          <el-form-item label="审核人：">测试数据1、测试数据2</el-form-item>
        </el-form>
      </el-card>
    </el-card>
    <el-card
      class="mb20"
      v-if="couponInfo.invoiceType!=='1' && couponInfo.isDrawInvoice!=='0'"
    >
      <invoice-detail :outData="invoiceInfo" :drawInvoiceName="params.drawInvoiceName"></invoice-detail>
    </el-card>
    <el-card v-if="$route.query.isActive || couponInfo.isActive==='1'">
      <el-card shadow="never" class="w800 mt20 mb15">
        <el-form
          label-width="140px"
          label-position="right"
          class="wp100"
          v-if="couponInfo.isActive === '1'"
        >
          <el-form-item label="激活说明：">
            <span v-if="couponInfo.isActive==='1'">{{couponInfo.setActiveExplain}}</span>
            <el-input
              v-else
              v-model.trim="couponInfo.setActiveExplain"
              type="textarea"
              :rows="5"
              :disabled="couponInfo.isActive !== '0'"
              placeholder="请输入您对此销售单的审核意见"
              style="display:inline-block;width:600px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="激活状态：" v-if="couponInfo.isActive === '1'">{{params.activeName}}</el-form-item>
          <el-form-item
            label="激活人："
            v-if="couponInfo.isActive === '1'"
          >{{couponInfo.setActivePeople||'--'}}</el-form-item>
          <el-form-item
            label="激活时间："
            v-if="couponInfo.isActive === '1'"
          >{{couponInfo.setActiveTime||'--'}}</el-form-item>
          <!-- <el-button size="small" v-if="$route.query.isActive && couponInfo.isActive === '0'" @click="setActive(couponInfo)" type="primary">激活销售单</el-button> -->
        </el-form>

        <el-button
          size="small"
          v-if="$route.query.isActive && couponInfo.isActive === '0'"
          @click="setActive(couponInfo)"
          type="primary"
        >激活销售单</el-button>
      </el-card>
    </el-card>

    <!-- <el-card style="margin-bottom:20px">
          <div slot="header">
              <span>销售发票信息</span>
          </div>
          <el-form label-width="140px" label-position="right" style="width:1000px;" :model="invoiceInfo" ref="formInvoiceInfo">
              <el-form-item label="发票类型:" prop="invoiceType">
                  <span>{{invoiceInfo.invoiceTypeName}}</span>
              </el-form-item>
              <template v-if="invoiceInfo.invoiceType && invoiceInfo.invoiceType !== '1'">
                  <el-form-item label="发票抬头:" prop="title">
                      <span>{{invoiceInfo.title}}</span> 
                  </el-form-item>
                  
                  <el-form-item label="税号:" prop="taxNo" v-if="invoiceInfo.invoiceType === '4' || invoiceInfo.invoiceType === '6' || invoiceInfo.invoiceType === '5'">
                      <span>{{invoiceInfo.taxNo}}</span> 
                  </el-form-item>
                  <el-form-item label="企业地址:" prop="companyAddress" v-if="invoiceInfo.invoiceType === '6'">
                      <span>{{invoiceInfo.companyAddress}}</span> 
                  </el-form-item>
                  <el-form-item label="电话号码:" prop="companyMobile" v-if="invoiceInfo.invoiceType === '6'">
                      <span>{{invoiceInfo.companyMobile}}</span> 
                  </el-form-item>
                  <el-form-item label="开户银行:" prop="bank" v-if="invoiceInfo.invoiceType === '6'">
                      <span>{{invoiceInfo.bank}}</span>
                  </el-form-item>
                  <el-form-item label="银行账号:" prop="bankNo" v-if="invoiceInfo.invoiceType === '6'">
                      <span>{{invoiceInfo.bankNo}}</span>
                  </el-form-item>
                  
                  <el-form-item label="身份证号:" prop="idNumber" v-if="invoiceInfo.invoiceType === '2' || invoiceInfo.invoiceType === '3'">
                      <span>{{invoiceInfo.idNumber}}</span> 
                  </el-form-item>                   
                  
                  <el-form-item label="电子邮箱:" prop="receiveEmail" v-if="invoiceInfo.invoiceType === '3' || invoiceInfo.invoiceType === '5'">
                      <span>{{invoiceInfo.receiveEmail}}</span> 
                  </el-form-item>                   
              </template>
          </el-form>
      </el-card>
      <el-card style="margin-bottom:20px" v-if="payInfo &&  payInfo.collectTime">
          <div slot="header">
              <span>销售付款方式</span>
          </div>
          <el-form label-width="140px" label-position="right" style="width:1000px;" :model="payInfo">
            <el-form-item label="付款方式:" prop="payType">
                <el-radio-group v-model="payInfo.payType">
                    <el-radio label="1" disabled>银行收账</el-radio>
                    <el-radio label="2" disabled>现金付款</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="转账银行:" prop="transferBank" v-if="payInfo.payType === '1'">
              <span>{{payInfo.transferBank}}</span> 
            </el-form-item>
            <el-form-item :label="payInfo.payType==='1'?'转账金额:':'付款金额:'">
              <span>{{payInfo.transferMoney}}元</span>
            </el-form-item>
            <el-form-item  :label="payInfo.payType==='1'?'转账人:':'付款人:'">
              <span>{{payInfo.transferPeople}}</span>
            </el-form-item>
          </el-form>
    </el-card>-->

    <el-dialog title="初审审核详情" :visible.sync="dialogFormVisible" width="40%">
      <div class="step-row" v-for="(item,index) in firstcheckList" :key="index">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
          <tr>
            <td style="color:#98A6BE">
              <div class="processing_content_detail" style="float:left;width:70%">
                <span style="color:#219AFF" class="mr5">{{item.checkName}}</span>
                <span>{{item.isAgree==='1'?'通过':'退回'}}</span>
              </div>
              <div class="processing_content_detail" style="float:left;">
                <span>
                  <i class="el-icon-time mr5" v-if="item.createTime"></i>
                  {{item.createTime}}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div
                class="processing_content_detail"
                style="float:left;width:70%;margin-bttom:20px;"
                v-if="item.suggestion"
              >
                <span style="color:#919FB8">审核意见：{{item.suggestion}}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ElStep from './elsteps'
import StandardSelector from '@/views/operation_center/coupon_mgr/sold_coupon_list/StandardSelector'
import FilmSelector from '@/components/FilmSelector'
import InvoiceDetail from '../../InvoiceDetail'
import ReceiptDetail from '../../ReceiptDetail'
import {
  GetSoldCouponCheckInfo,
  GetSaleCouponDetail,
  getCouponOrderInfo,
  getCouponFirstCheckList
} from '@/api/operationCenter'
export default {
  name: 'sold_coupon_detail',
  components: {
    ElStep,
    StandardSelector,
    FilmSelector,
    InvoiceDetail,
    ReceiptDetail
  },
  data() {
    return {
      params: {
        checkStatus: '',
        operator: '',
        operatorId: '',
        saleTime: '',
        activeName: '',
        collectName: '',
        drawInvoiceName: '',
        firstCheckInfo: {
          checkName: '',
          suggestion: '',
          createTime: '',
          isAgree: ''
        }
      },
      firstCheckInfo: {
        checkName: '',
        suggestion: '',
        createTime: '',
        isAgree: ''
      },
      secondCheckList: [],
      status: '',
      description: '',
      firstCheckApproval: '',
      date: '',
      // table
      query: {
        orderNo: this.$route.query.orderNo
      },
      couponInfo: {},
      programInfo: {},
      invoiceInfo: {},
      payInfo: {},
      week: '',
      dialogFormVisible: false,
      firstcheckList: [],
      diffRuleArr: [],
      suggestion: ''
    }
  },
  watch: {
    'params.checkStatus'(val) {
      if (val === '3') this.status = '3'
    }
  },
  methods: {
    buttonFirst() {
      const _this = this
      getCouponFirstCheckList({ orderNo: this.$route.query.orderNo }).then(
        res => {
          _this.firstcheckList = res
          this.dialogFormVisible = true
        }
      )
    },

    queryTable(query) {
      if (this.$route.query.orderNo) {
        return GetSaleCouponDetail(query)
      }
    },
    refreshTable() {
      this.$refs.table.refresh()
    }
  },
  async created() {
    const _this = this
    GetSoldCouponCheckInfo({ orderNo: this.$route.query.orderNo }).then(res => {
      _this.params = res
      /* _this.firstCheckInfo.checkName = res.firstCheckInfo.checkName || ''
      _this.firstCheckInfo.createTime = res.firstCheckInfo.createTime || ''
      _this.firstCheckInfo.suggestion = res.firstCheckInfo.suggestion || ''*/
      _this.firstCheckInfo = res.firstCheckInfo
      _this.description = res.operator
      _this.date = res.saleTime
      if (res.checkStatus === '3') {
        _this.params.checkStatus = '4'
      } else if (res.checkStatus === '4') {
        _this.params.checkStatus = '1'
      }
    })
    this.detail = await getCouponOrderInfo(this.$route.query.orderNo)
    this.couponInfo = this.detail.couponInfo
    this.programInfo = this.detail.programInfo
    this.invoiceInfo = this.detail.invoiceInfo
    this.payInfo = this.detail.payInfo
    if (this.programInfo.week.length > 0) {
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
          case '7':
            this.week += '周日' + ','
            break
        }
      })
    }
    if (
      this.couponInfo.checkInfo &&
      this.couponInfo.checkInfo.suggestion !== 'null'
    ) {
      _this.suggestion = this.couponInfo.checkInfo.suggestion
    } else {
      _this.suggestion = ''
    }

    this.week = this.week.substr(0, this.week.length - 1)

    if (
      _this.programInfo.ruleList[0] &&
      _this.programInfo.ruleList[0].filmId !== '-1'
    ) {
      _this.$set(_this.programInfo.ruleList[0], 'filmType', '1')
    } else {
      _this.$set(_this.programInfo.ruleList[0], 'filmType', '-1')
    }

    if (
      (_this.programInfo.ruleList[0].settlementType === '1' ||
        _this.programInfo.ruleList[0].settlementType === '2') &&
      _this.programInfo.ruleList[0].diffType === '2'
    ) {
      Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
        console.log(e)
        this.diffRuleArr.push({
          name: e,
          value: _this.programInfo.ruleList[0].diffRule[e]
        })
      })
    } else if (
      _this.programInfo.ruleList[0].settlementType === '3' &&
      _this.programInfo.ruleList[0].diffType === '2' &&
      _this.programInfo.ruleList[0].filmId !== '-1'
    ) {
      _this.programInfo.ruleList[0].filmList.forEach(el => {
        Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
          if (el.value === e) {
            this.diffRuleArr.push({
              name: el.name,
              value: _this.programInfo.ruleList[0].diffRule[e]
            })
          }
        })
      })
    } else if (
      _this.programInfo.ruleList[0].settlementType === '3' &&
      _this.programInfo.ruleList[0].diffType === '2' &&
      _this.programInfo.ruleList[0].filmId === '-1'
    ) {
      Object.keys(_this.programInfo.ruleList[0].diffRule).forEach(e => {
        this.diffRuleArr.push({
          name: '',
          value: _this.programInfo.ruleList[0].diffRule[e]
        })
      })
    }
  }
}
</script>

<style scoped>
.approvalProcess {
  color: #9eadc4;
  font-size: 14px;
  /* width: 100%; */
  background: #dfebff;
  margin-left: 20px;
  margin-right: 0px;
  margin-top: 10px;
}
/* .processing_content{ 
      background-color: #D9E5F9;
   } */
.processing_content_detail {
  margin-left: 10px;
  margin-top: 3.5px;
  margin-bottom: 3.5px;
  width: 150px;
  display: inline-block;
}
.step-row {
  margin-bottom: 12px;
  margin-top: 12px;
}
</style>