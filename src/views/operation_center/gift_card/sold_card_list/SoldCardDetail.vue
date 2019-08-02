<template>
  <div class="app-container">
    <el-card>
      <div
        style="font-size:18px;font-weight:bold;"
      >销售订单号：{{$route.query.orderNo}}&emsp;&emsp;&emsp;客户名称：{{cardInfo.customerName}}</div>
    </el-card>
    <!-- <el-card style="margin-bottom:20px;">
        <el-steps :active="parseInt(params.checkStatus)" style="margin: 0px 100px 40px 100px">
          <el-step title="创建销售单" :description="description" :dates="date"></el-step>
          <el-step title="部门初审" :isShowMore="firstCheckInfo.count>1" more="查看更多" @button-enter="buttonFirst">
            <template slot="description" >
               <div class="step-row">
                 <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
                   <tr>
                      <td style="color:#98A6BE">
                        <div class="processing_content_detail" style="float:left;width:70%">
                          <span style="color:#219AFF">{{firstCheckInfo.checkName}}</span>&nbsp;&nbsp;
                          <span  v-if="params.checkStatus !=='1' && firstCheckInfo.isAgree">{{firstCheckInfo.isAgree==='1'?'同意':'退回'}}</span>
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
          <!-- <el-table-column min-width="180"  label="客户名称" align="center" prop="customerName" ></el-table-column> -->
          <el-table-column
            min-width="180"
            label="电影卡批次号"
            align="center"
            prop="batchNo"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column min-width="100" label="电影卡种类" align="center" prop="typeName"></el-table-column>
          <el-table-column min-width="180" label="电影卡类型" align="center" prop="styleName"></el-table-column>
          <el-table-column min-width="110" label="卡号" align="center" prop="cardCode"></el-table-column>
          <el-table-column min-width="180" label="有效日期" align="center" prop show-overflow-tooltip>
            <template slot-scope="{row}">
              <span prop="row.startTime">{{row.startTime.substr(0,10)}}</span>至
              <span prop="row.startTime">{{row.endTime.substr(0,10)}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="110" label="卡内点数" align="center" prop="point"></el-table-column>
        </page-table>
      </el-form>
    </el-card>
    <el-card style="margin-bottom:20px">
      <el-card shadow="never" style="margin-top:20px;margin-bottom:15px;">
        <el-form label-width="140px" label-position="right" style="width:1000px;">
          <el-form-item label="客户名称：">{{cardInfo.customerName}}</el-form-item>
          <el-form-item label="电影卡种类：">{{cardInfo.typeName}}</el-form-item>
          <el-form-item label="电影卡类型：">{{cardInfo.styleName}}</el-form-item>
          <el-form-item label="电影卡号：" v-if="cardInfo.codeIdDetail">{{cardInfo.codeIdDetail}}</el-form-item>
          <el-form-item label="销售数量：">{{cardInfo.num}} 张</el-form-item>
          <el-form-item label="销售总额：">{{cardInfo.amount}} 元</el-form-item>
          <el-form-item label="销售比例：">{{cardInfo.scalePrice}}:{{cardInfo.scalePoint}}</el-form-item>
          <el-form-item label="卡内金额：">{{cardInfo.amount}}元，折合卡内点数{{cardInfo.point}}点</el-form-item>
          <el-form-item label="电影卡有效期：">{{cardInfo.startTime}} -- {{cardInfo.endTime}}</el-form-item>
          <el-form-item label="销售备注：">{{cardInfo.remark}}</el-form-item>
          <el-form-item label="使用说明：">{{cardInfo.useExplain}}</el-form-item>
        </el-form>
      </el-card>
    </el-card>
    <el-card style="margin-bottom:20px">
      <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
        <el-form
          label-width="140px"
          label-position="right"
          style="width:1000px;"
          v-if="cardInfo.checkInfo"
        >
          <el-form-item label="审核意见1：">{{suggestion?suggestion:'无审核意见'}}</el-form-item>
          <el-form-item label="审核状态：">{{firstCheckInfo.isAgree==='1'?'通过':'退回'}}</el-form-item>
          <el-form-item label="审核人：">{{firstCheckInfo.checkName}}</el-form-item>
          <el-form-item label="审核时间：">{{firstCheckInfo.createTime?firstCheckInfo.createTime:'无'}}</el-form-item>
        </el-form>
        <el-form label-width="140px" label-position="right" class="wp100" v-else>
          <el-form-item label="审核状态：">未初审</el-form-item>
          <el-form-item label="审核人：">{{firstCheckInfo.checkName}}</el-form-item>
        </el-form>
      </el-card>
    </el-card>
    <el-card style="margin-bottom:20px">
      <receipt-detail
        type="coupon"
        :outData="payInfo"
        :isCollectName="firstcheckList.collectName"
        v-if="$route.query.isReceiveMoney || cardInfo.isReceiveMoney==='1'"
      ></receipt-detail>
      <el-form label-width="140px" label-position="right" class="wp100" v-else>
        <el-form-item label="收款状态：">未收款</el-form-item>
        <el-form-item label="审核人：">{{payInfo.checkName}}</el-form-item>
      </el-form>
    </el-card>
    <el-card
      style="margin-bottom:20px"
      v-if="cardInfo.invoiceType==='1' && cardInfo.isDrawInvoice==='0'"
    >
      <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
        <el-form label-width="140px" label-position="right" style="width:1000px;">
          <el-form-item label="是否提供发票：">无需开票</el-form-item>
        </el-form>
      </el-card>
    </el-card>
    <el-card style="margin-bottom:20px" v-if="+cardInfo.invoiceType===2 ">
      <invoice-detail
        :outData="invoiceInfo"
        :drawInvoiceName="firstcheckList.drawInvoiceName"
        v-if="+isDrawInvoice===1"
      ></invoice-detail>
      <el-form label-width="140px" label-position="right" class="wp100" v-else>
        <el-form-item label="开票状态：">未开票</el-form-item>
        <el-form-item label="审核人：">{{invoiceInfo.checkName}}</el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-card shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
        <el-form
          label-width="140px"
          label-position="right"
          style="width:1000px;"
          v-if="$route.query.isActive ||cardInfo.isActive === '1'"
        >
          <el-form-item label="激活说明：">
            <span v-if="cardInfo.isActive==='1'">{{cardInfo.setActiveExplain}}</span>
            <el-input
              clearable
              v-else
              v-model.trim="cardInfo.setActiveExplain"
              type="textarea"
              :rows="5"
              :disabled="cardInfo.isActive !== '0'"
              placeholder="请输入您对此销售单的审核意见"
              style="display:inline-block;width:600px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="激活状态：" v-if="cardInfo.isActive === '1'">{{params.activeName}}</el-form-item>
          <el-form-item
            label="激活人："
            v-if="cardInfo.isActive === '1'"
          >{{cardInfo.setActivePeople||'--'}}</el-form-item>
          <el-form-item
            label="激活时间："
            v-if="cardInfo.isActive === '1'"
          >{{cardInfo.setActiveTime||'--'}}</el-form-item>
          <!-- <el-button size="small" v-if="$route.query.isActive && cardInfo.isActive === '0'" @click="setActive(cardInfo)" type="primary">激活销售单</el-button> -->
        </el-form>
        <el-form label-width="140px" label-position="right" class="wp100" v-else>
          <el-form-item label="激活状态：">未激活</el-form-item>
          <el-form-item label="审核人：">{{cardInfo.activeCheckName}}</el-form-item>
        </el-form>
        <el-button
          size="small"
          v-if="$route.query.isActive && cardInfo.isActive === '0'"
          @click="setActive(cardInfo)"
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
      <el-card style="margin-bottom:20px" v-if="payInfo && payInfo.transferPeople">
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
              <span v-if="payInfo.transferPeople">{{payInfo.transferBank}}</span>
              <el-input clearable  v-else v-model.trim="payInfo.transferBank" placeholder="请输入银行名称或账户" style="width:300px;" disabled></el-input> 
            </el-form-item>
            <el-form-item :label="payInfo.payType==='1'?'转账金额:':'付款金额:'" prop="transferMoney">
              <span v-if="payInfo.transferPeople">{{payInfo.transferMoney}}</span>
                <el-input clearable  v-else v-model.trim="payInfo.transferMoney" placeholder="0.00" style="width:100px;" disabled></el-input> 元
            </el-form-item>
            <el-form-item  :label="payInfo.payType==='1'?'转账人:':'付款人:'" prop="transferPeople">
              <span v-if="payInfo.transferPeople">{{payInfo.transferPeople}}</span>
              <el-input clearable  v-else v-model.trim="payInfo.transferPeople" placeholder="请输入转账人姓名" style="width:200px;" disabled></el-input> 
            </el-form-item>
          </el-form>
    </el-card>-->

    <el-dialog title="初审审核详情" :visible.sync="dialogFormVisible" width="40%">
      <div class="step-row" v-for="(item,index) in firstcheckList" :key="index">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
          <tr>
            <td style="color:#98A6BE">
              <div class="processing_content_detail" style="float:left;width:70%">
                <span style="color:#219AFF">{{item.checkName}}</span>&nbsp;&nbsp;
                <span>{{item.isAgree==='1'?'通过':'退回'}}</span>
              </div>
              <div class="processing_content_detail" style="float:left;">
                <span>
                  <i class="el-icon-time" v-if="item.createTime"></i>
                  &nbsp;&nbsp;{{item.createTime}}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div
                class="processing_content_detail"
                style="float:left;width:70%;margin-bottom:20px;"
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
import ElStep from '@/views/operation_center/coupon_mgr/sold_coupon_list/elsteps'
import {
  GetSaleCardDetail,
  GetSoldCardCheckInfo,
  getCardOrderInfo,
  getCardFirstCheckList
} from '@/api/operationCenter'
import InvoiceDetail from '../../InvoiceDetail'
import ReceiptDetail from '../../ReceiptDetail'
export default {
  name: 'get_sale_card_list',
  components: { ElStep, InvoiceDetail, ReceiptDetail },
  data() {
    return {
      params: {
        checkStatus: '',
        operator: '',
        operatorId: '',
        saleTime: '',
        activeName: '',
        collectName: '',
        drawInvoiceName: ''
      },
      firstCheckInfo: {
        checkName: '',
        suggestion: '',
        createTime: '',
        isAgree: ''
      },
      suggestion: '',
      secondCheckList: [],
      status: '',
      description: '',
      date: '',
      // table
      query: {
        orderNo: this.$route.query.orderNo
      },
      cardInfo: {},
      invoiceInfo: {},
      payInfo: {},
      dialogFormVisible: false,
      firstcheckList: []
    }
  },
  watch: {
    'params.checkStatus'(val) {
      if (val === '3') this.status = '3'
    }
  },
  methods: {
    async buttonFirst() {
      const _this = this
      await getCardFirstCheckList({ orderNo: this.$route.query.orderNo }).then(
        res => {
          _this.firstcheckList = res
          this.dialogFormVisible = true
        }
      )
    },
    queryTable(query) {
      if (this.$route.query.orderNo) {
        return GetSaleCardDetail(query)
      }
    },
    refreshTable() {
      this.$refs.table.refresh()
    }
  },
  async created() {
    const _this = this
    GetSoldCardCheckInfo({ orderNo: this.$route.query.orderNo }).then(res => {
      _this.params = res
      _this.firstCheckInfo = res.firstCheckInfo
      _this.description = res.operator
      _this.date = res.saleTime
      if (res.checkStatus === '3') {
        _this.params.checkStatus = '4'
      } else if (res.checkStatus === '4') {
        _this.params.checkStatus = '1'
      }
    })
    this.detail = await getCardOrderInfo(this.$route.query.orderNo)
    this.cardInfo = this.detail.cardInfo
    this.programInfo = this.detail.programInfo
    this.invoiceInfo = this.detail.invoiceInfo
    this.payInfo = this.detail.payInfo

    if (
      this.cardInfo.checkInfo &&
      this.cardInfo.checkInfo.suggestion !== 'null'
    ) {
      _this.suggestion = this.cardInfo.checkInfo.suggestion
    } else {
      _this.suggestion = ''
    }
  }
}
</script>

<style scoped>
</style>
