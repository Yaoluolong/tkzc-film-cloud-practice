<template>
  <div class="app-container">
    <el-steps
      :active="step"
      finish-status="success"
      process-status="wait"
      align-center
      style="margin-bottom:40px;"
    >
      <el-step title="销售基础信息" @click.native="stepButton(1)"></el-step>
      <el-step title="销售使用规则" @click.native="stepButton(2)"></el-step>
      <el-step title="销售发票信息" @click.native="stepButton(3)"></el-step>
      <el-step title="销售付款方式" @click.native="stepButton(4)"></el-step>
    </el-steps>
    <!-- 销售电影基础设置 -->
    <el-card v-show="step===1">
      <!-- v-if="couponInfoLoaded || !$route.query.orderNo" -->
      <div slot="header">
        <span>销售电影券基础信息，销售员：{{couponInfo.operator||name}}</span>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        :model="couponInfo"
        :rules="couponInfoRules"
        ref="couponInfoForm"
      >
        <el-form-item label="分销商客户名称:" prop="customer">
          <customer-selector
            v-model="couponInfo.customer"
            v-if="couponInfo.customer || !$route.query.orderNo"
            :isAddNew="false"
          ></customer-selector>
        </el-form-item>
        <el-form-item label="业务员所属公司:" prop="companyId">
          <zm-select class="vm w320" v-model="couponInfo.companyId" select-type="companyList" placeholder="请选择业务员所属公司"></zm-select>
        </el-form-item>
        <div>
          <el-form-item label="电影券种类:" prop="type" style="display:inline-block;width: 450px;">
            <remote-select
              v-model="couponInfo.type"
              clearable
              placeholder="请选择电影券种类"
              action="/systemApi/dict/getList"
              :query="{type:'couponType'}"
              style="width:230px;"
              @change="codeChangeFun"
            ></remote-select>
          </el-form-item>
          <el-form-item label="电影券类型:" prop="style" style="display:inline-block;width: 400px;">
            <remote-select
              v-model="couponInfo.style"
              clearable
              placeholder="请选择电影券类型"
              action="/systemApi/dict/getList"
              :query="{type:'couponStyle'}"
              style="width:230px;"
              @change="codeChangeFun"
            ></remote-select>
          </el-form-item>
        </div>
        <el-form-item label="业务类型:" prop="businessType">
          <el-radio v-model="couponInfo.businessType" label="1">团体票业务</el-radio>
          <el-radio v-model="couponInfo.businessType" label="2" disabled>营销票业务</el-radio>
        </el-form-item>
        <el-form-item label="电影券号:" prop="codeIdDetail" v-if="couponInfo.style==='Z'">
          <coupon-code-area
            :outCheckId="doGet"
            v-model="couponInfo.codeIdDetail"
            :orderNo="$route.query.orderNo"
            :couponType="couponInfo.type"
            :couponStyle="couponInfo.style"
          ></coupon-code-area>
        </el-form-item>
        <div v-if="couponInfo.type">
          <el-form-item label="销售数量:" prop="num">
            <el-input
              v-model.trim="couponInfo.num"
              placeholder="0"
              style="width:100px;"
              :disabled="couponInfo.style=='Z'||!couponInfo.style"
            ></el-input>张
            <span
              style="margin-left:20px;color:red"
              v-show="couponInfo.style==='Z'"
            >系统已根据您所填写的号码段自动统计出销售数量!</span>
            <span style="margin-left:20px;color:gray" v-show="couponInfo.style!=='Z'">只能是数值，且必须大于0</span>
          </el-form-item>
          <el-form-item label="销售总额:" prop="amount">
            <el-input v-model.trim="couponInfo.amount" placeholder="0.00" style="width:100px;"></el-input>元
            <span style="margin-left:20px;color:gray">只能是数值，且必须大于0</span>
          </el-form-item>
          <el-form-item label="销售单价:" prop="unitPrice">
            <el-input v-model.trim="couponInfo.unitPrice" placeholder="0.00" style="width:100px;"></el-input>元
            <span style="margin-left:20px;color:gray">只能是数值，限2位小数，如果销售单价未填写则最后系统将按照（销售总额除以销售数量）来计算</span>
          </el-form-item>
          <el-form-item label="电影券有效期:" prop="time">
            <el-date-picker
              v-model="couponInfo.time"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:320px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="兑换面值:"
            prop="priceRule"
            v-if="couponInfo.type=='1' || couponInfo.type=='3'"
          >
            <price-area v-model="couponInfo.priceRule"></price-area>
          </el-form-item>
          <el-form-item label="优惠方式:" prop="discountType" v-if="couponInfo.type=='2'">
            <el-radio v-model="couponInfo.discountType" label="1">不限额优惠</el-radio>
            <el-radio v-model="couponInfo.discountType" label="2" disabled>满减优惠</el-radio>
          </el-form-item>
          <el-form-item
            label="优惠影片面值:"
            prop="canFreePrice"
            v-if="couponInfo.type=='2' && couponInfo.discountType=='1'"
          >
            <el-input
              v-model.trim="couponInfo.canFreePrice"
              placeholder="0.00"
              style="width:100px;"
            ></el-input>元。
            <span style="margin-left:20px;color:gray">仅针对单个座位的面值进行优惠，一个订单只能使用优惠一次！</span>
          </el-form-item>
        </div>
        <el-form-item label="销售备注:" class="areaStyle">
          <el-input
            type="textarea"
            :row="5"
            v-model="couponInfo.remark"
            placeholder="请输入该销售单的销售备注信息,便于部门主管或者财务查看"
            style="height:60px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用说明:" class="areaStyle">
          <el-input
            type="textarea"
            :row="5"
            v-model="couponInfo.useExplain"
            placeholder="请输入该销售单内的电影券在使用的时候注意事项等信息"
            style="height:60px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button style="margin-top:20px;" type="primary" @click="couponInfoSave" v-if="!look">保存</el-button>
      <el-button
        style="margin-top:20px;"
        type="primary"
        @click="couponInfoNextStep"
        v-if="!look"
      >下一步</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-card>
    <!-- 使用规则设置 -->
    <el-card v-show="step===2">
      <div slot="header">
        <span>使用规则设置</span>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        :model="programInfo"
        :rules="programInfoRules"
        ref="programInfoForm"
      >
        <el-form-item label="选择规则模板" prop="templateId">
          <remote-select
            v-model="programInfo.templateId"
            action="/systemApi/couponProgram/getTemplateList"
            :query="{}"
            @change="AutoProgramImport"
          ></remote-select>
          <span style="margin-left:20px;color:gray">选择规则模版后下方配置项将自动填入，如果没有可在下方自定义编辑。</span>
        </el-form-item>
        <el-form-item label="模板规则名称" prop="name">
          <el-input
            v-model="programInfo.name"
            placeholder="输入电影券使用规则名称"
            style="width:320px;"
            :disabled="programInfoIsAllowEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="券不可用时段" class="dateTimeLimit" prop="dateLimitType">
          <el-select
            v-model="programInfo.dateLimitType"
            style="width:320px;"
            :disabled="programInfoIsAllowEdit"
          >
            <el-option label="不限制" value="1"></el-option>
            <el-option label="指定时间" value="2"></el-option>
          </el-select>
          <span style="margin-left:20px;color:gray">电影券不可用时段默认是“不限制”，代表都可用！</span>
        </el-form-item>
        <el-form-item label="不可用时段区间" prop="time" v-if="programInfo.dateLimitType==='2'">
          <el-date-picker
            v-model="programInfo.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:320px;"
            :disabled="programInfoIsAllowEdit"
          ></el-date-picker>
          <el-select
            v-model="programInfo.timeType"
            style="width:320px;margin-bottom:20px;"
            :disabled="programInfoIsAllowEdit"
          >
            <el-option label="每天" value="day"></el-option>
            <el-option label="每周" value="week"></el-option>
          </el-select>
          <date-selector
            clearable
            v-if="programInfo.timeType=='week'"
            type="week"
            v-model="programInfo.weekTime"
            style="width:320px"
            :disabled="programInfoIsAllowEdit"
          ></date-selector>
          <el-time-picker
            v-if="programInfo.timeType=='day'||programInfo.timeType=='week'"
            v-model="programInfo.limitTime"
            is-range
            value-format="HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width:320px;"
            :disabled="programInfoIsAllowEdit"
          ></el-time-picker>
        </el-form-item>
        <el-form-item
          label="券可用商家："
          prop="channelId"
          v-if="(!$route.query.orderNo&&channelCheckedStatus) || channelCheckedStatus || couponInfoLoaded"
        >
          <channel-form-selector
            ref="channelComponent"
            v-model="programInfo.channelList"
            type="1"
            :outDisabled="programInfoIsAllowEdit"
          ></channel-form-selector>
        </el-form-item>
        <el-form-item label="券可用影院：" prop="cinemaGroupId">
          <remote-select
            v-model="programInfo.cinemaGroupId"
            clearable
            placeholder="请选择券可用影院"
            action="/systemApi/cinemaGroup/getList"
            :query="{}"
            style="width:230px;"
            :disabled="programInfoIsAllowEdit"
          ></remote-select>
        </el-form-item>
        <div
          v-for="(rule,index) in programInfo.ruleList"
          :key="rule.key"
          v-if="programInfo.cinemaGroupId"
        >
          <el-form-item
            label="兑换方式："
            :prop="'ruleList.'+index+'.settlementType'"
            :rules="programInfoRules.settlementType"
          >
            <el-select
              v-model="rule.settlementType"
              @change="resetDiffRuleChange"
              :disabled="programInfoIsAllowEdit"
            >
              <el-option value="1" label="根据影厅"></el-option>
              <el-option value="2" label="根据制式"></el-option>
              <el-option value="3" label="根据影片"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="选择影厅："
            :prop="'ruleList.'+index+'.hallType'"
            :rules="programInfoRules.hallType"
            v-if="programInfo.cinemaGroupId && rule.settlementType === '1'"
            style="width:300px;"
          >
            <tip content="不同类型的影厅可以在影厅管理页面进行配置！">
              <remote-select
                v-model="rule.hallType"
                placeholder="请选择影厅"
                action="/systemApi/dict/getList"
                :query="{type:'hallType'}"
                :disabled="programInfoIsAllowEdit"
              ></remote-select>
            </tip>
          </el-form-item>
          <el-form-item
            label="选择制式："
            :prop="'ruleList.'+index+'.standard'"
            :rules="programInfoRules.standard"
            v-if="programInfo.cinemaGroupId && rule.settlementType === '2'"
          >
            <standard-selector
              ref="standard"
              v-model="rule.standard"
              :cinemaGroupId="programInfo.cinemaGroupId"
              :disabled.native="programInfoIsAllowEdit"
            ></standard-selector>
          </el-form-item>
          <el-form-item
            label="选择影片："
            :prop="'ruleList.'+index+'.filmId'"
            :rules="programInfoRules.filmId"
            v-if="rule.settlementType === '3'"
            class="filmTip"
          >
            <tip content="默认值是全部影片，可以指定进行选择在售影片！">
              <el-radio
                v-model="rule.filmType"
                label="-1"
                @change="filmTypeSelect"
                :disabled="programInfoIsAllowEdit"
              >全部影片</el-radio>
              <el-radio
                v-model="rule.filmType"
                label="1"
                @change="filmTypeSelect"
                :disabled="programInfoIsAllowEdit"
              >指定影片</el-radio>
            </tip>
            <film-selector
              :content-list="rule.filmList"
              v-if="rule.filmType === '1'"
              getFilmId
              v-model="rule.filmId"
              :disabled="programInfoIsAllowEdit"
            ></film-selector>
          </el-form-item>
          <div v-if="couponInfo.type==='3'">
            <el-form-item
              label="补差类型："
              v-if="rule.settlementType"
              :prop="'ruleList.'+index+'.diffType'"
              :rules="programInfoRules.diffType"
              style="width:350px;"
            >
              <tip content="默认值是固定补差，可以根据实际情况更改未差额补差！">
                <el-radio
                  v-model="rule.diffType"
                  label="2"
                  @change="complementChange(rule.diffType, rule.settlementType)"
                  :disabled="programInfoIsAllowEdit"
                >固定补差</el-radio>
                <el-radio v-model="rule.diffType" label="1" :disabled="programInfoIsAllowEdit">差额补差</el-radio>
              </tip>
            </el-form-item>

            <el-form-item label="设定补差：" v-if="rule.diffType==='2'&& rule.settlementType==='1'">
              <hall-complement
                v-model="rule.diffRule"
                ref="complementHallRef"
                getHall
                :outDataId="rule.hallType"
                @diffRuleChange="diffByValue"
                :outPriceRule="couponInfo.priceRule"
                :disabled="programInfoIsAllowEdit"
              ></hall-complement>
            </el-form-item>
            <el-form-item v-if="rule.diffType==='2' && rule.settlementType==='2'">
              <standard-complement
                v-model="rule.diffRule"
                ref="complementStandardRef"
                getStandard
                :outDataId="rule.standard"
                :cinemaGroupId="programInfo.cinemaGroupId"
                @diffRuleChange="diffByValue"
                :outPriceRule="couponInfo.priceRule"
                :disabled="programInfoIsAllowEdit"
              ></standard-complement>
            </el-form-item>
            <el-form-item v-if="rule.diffType==='2' && rule.settlementType==='3'">
              <film-complement
                v-model="rule.diffRule"
                ref="complementRef"
                getFilm
                :diffType="rule.diffType"
                :filmType="rule.filmType"
                :outDataId="rule.filmId"
                :outDataList="rule.filmList"
                @diffRuleChange="diffByValue"
                :outPriceRule="couponInfo.priceRule"
                :disabled="programInfoIsAllowEdit"
              ></film-complement>
            </el-form-item>
            <el-form-item
              v-if="rule.diffType==='1'"
            >影票价格范围{{couponInfo.priceRuleStr}}元可使用券，超出此范围需补差额根据影票价格减去电影券最大可兑换价值。</el-form-item>
          </div>
        </div>
        <el-form-item label="将规则存为模板" prop="isSaveTemplate" style="width:250px;">
          <tip content="默认值都是不另存为模版，在存储过程中规则名称是不能重复的！">
            <el-radio v-model="programInfo.isSaveTemplate" label="1">是</el-radio>
            <el-radio v-model="programInfo.isSaveTemplate" label="0">否</el-radio>
          </tip>
        </el-form-item>
      </el-form>
      <el-button
        style="margin-top:20px;"
        type="primary"
        @click="programInfoPrevStep"
        v-if="!look"
      >上一步</el-button>
      <el-button style="margin-top:20px;" type="primary" @click="programInfoSave" v-if="!look">保存</el-button>
      <el-button
        style="margin-top:20px;"
        type="primary"
        @click="programInfoNextStep"
        v-if="!look"
      >下一步</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-card>
    <!-- 销售发票信息 -->
    <el-card v-show="step===3">
      <div slot="header">
        <span>销售发票信息</span>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        :model="invoiceInfo"
        :rules="invoiceInfoRules"
        ref="invoiceInfoForm"
      >
        <el-form-item label="发票类型:" prop="invoiceType">
          <el-select v-model="invoiceInfo.invoiceType" style="width:400px;">
            <el-option
              v-for="invoiceType in allInvoiceTypes"
              :key="invoiceType.value"
              :value="invoiceType.value"
              :label="invoiceType.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="invoiceInfo.invoiceType && invoiceInfo.invoiceType !== '1'">
          <el-form-item label="发票抬头:" prop="title">
            <el-input v-model.trim="invoiceInfo.title" placeholder="输入发票抬头的信息" style="width:200px;"></el-input>
          </el-form-item>
          <!-- 企业相关START -->
          <el-form-item
            label="税号:"
            prop="taxNo"
            v-if="invoiceInfo.invoiceType === '4' || invoiceInfo.invoiceType === '6' || invoiceInfo.invoiceType === '5'"
          >
            <el-input v-model.trim="invoiceInfo.taxNo" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="企业地址:" prop="companyAddress" v-if="invoiceInfo.invoiceType === '6'">
            <el-input
              v-model.trim="invoiceInfo.companyAddress"
              placeholder="请输入内容"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话号码:" prop="companyMobile" v-if="invoiceInfo.invoiceType === '6'">
            <el-input
              v-model.trim="invoiceInfo.companyMobile"
              placeholder="请输入内容"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户银行:" prop="bank" v-if="invoiceInfo.invoiceType === '6'">
            <el-input v-model.trim="invoiceInfo.bank" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="银行账号:" prop="bankNo" v-if="invoiceInfo.invoiceType === '6'">
            <el-input v-model.trim="invoiceInfo.bankNo" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <!-- 企业相关END -->
          <!-- 个人相关START -->
          <el-form-item
            label="身份证号:"
            prop="idNumber"
            v-if="invoiceInfo.invoiceType === '2' || invoiceInfo.invoiceType === '3'"
          >
            <el-input
              v-model.trim="invoiceInfo.idNumber"
              placeholder="输入索要发票人身份证号码"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <!-- 个人相关END -->
          <el-form-item
            label="电子邮箱:"
            prop="receiveEmail"
            v-if="invoiceInfo.invoiceType === '3' || invoiceInfo.invoiceType === '5'"
          >
            <el-input
              v-model.trim="invoiceInfo.receiveEmail"
              placeholder="输入索要发票人电子邮箱"
              style="width:200px;"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <el-button
        style="margin-top:20px;"
        type="primary"
        @click="invoiceInfoPrevStep"
        v-if="!look"
      >上一步</el-button>
      <el-button style="margin-top:20px;" type="primary" @click="invoiceInfoSave" v-if="!look">保存</el-button>
      <el-button
        style="margin-top:20px;"
        type="primary"
        @click="invoiceInfoNextStep"
        v-if="!look"
      >下一步</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-card>
    <!-- 销售付款方式 -->
    <el-card v-show="step===4">
      <div slot="header">
        <span>销售付款方式</span>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        :model="payInfo"
        :rules="payInfoRules"
        ref="payInfoForm"
      >
        <!-- 付款方式 -->
        <el-form-item label="付款方式:" prop="payType">
          <el-radio-group v-model="payInfo.payType">
            <el-radio label="1">银行收账</el-radio>
            <el-radio label="2">现金付款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转账银行:" prop="transferBank" v-if="payInfo.payType === '1'">
          <el-input
            v-model.trim="payInfo.transferBank"
            placeholder="请输入银行名称或账户"
            style="width:300px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="payInfo.payType==='1'?'转账金额:':'付款金额:'"
          prop="transferMoney"
          v-if="payInfo.payType"
        >
          <el-input v-model.trim="payInfo.transferMoney" placeholder="0.00" style="width:100px;"></el-input>元
        </el-form-item>
        <el-form-item
          :label="payInfo.payType==='1'?'转账人:':'付款人:'"
          prop="transferPeople"
          v-if="payInfo.payType"
        >
          <el-input
            v-model.trim="payInfo.transferPeople"
            placeholder="请输入转账人姓名"
            style="width:200px;"
          ></el-input>
        </el-form-item>
        <el-button style="margin-top:20px;" type="primary" @click="payInfoPrevStep" v-if="!look">上一步</el-button>
        <el-button style="margin-top:20px;" type="primary" @click="payInfoSave" v-if="!look">保存</el-button>
        <el-button style="margin-top:20px;" type="primary" @click="submitAudit" v-if="!look">提交审核</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import zmSelect from '@/components/isNeedComponents/zmSelect'
import CommonSelect from '@/components/CommonSelect'
import CustomerSelector from '@/components/CustomerSelector'
import CouponTypeIdSelector from './CouponTypeIdSelector'
import PriceArea from './PriceArea'
import CouponCodeArea from './CouponCodeArea'

import StandardSelector from './StandardSelector'
import FilmSelector from '@/components/FilmSelector'
import DateSelector from '@/components/DateSelector'
import ChannelFormSelector from '@/components/ChannelFormSelector'

import InvoiceDetail from './InvoiceDetail'
import FilmComplement from '@/views/operation_center/FilmComplement'
import StandardComplement from '@/views/operation_center/StandardComplement'
import HallComplement from '@/views/operation_center/HallComplement'
import {
  getInvoiceTypeList,
  createCouponOrder,
  getCouponOrderInfo,
  updateCouponOrder,
  getCouponProgramInfo
} from '@/api/operationCenter'
export default {
  name: 'sold_coupon',
  components: {
    zmSelect,
    CommonSelect,
    CustomerSelector,
    CouponTypeIdSelector,
    PriceArea,
    CouponCodeArea,
    DateSelector,
    ChannelFormSelector,
    StandardSelector,
    FilmSelector,
    InvoiceDetail,
    FilmComplement,
    StandardComplement,
    HallComplement
  },
  data() {
    const checkTime = (rule, value, cb) => {
      if (!value || !value[0] || !value[1]) {
        cb(new Error('请选择电影券有效时间'))
      }
      cb()
    }
    const checkcanFreePrice = (rule, value, cb) => {
      const isInt = /^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)
      if (!isInt) {
        cb(new Error('必须是整数,可保留两位小数点'))
      }
      cb()
    }
    const checkArea = (rule, value, cb) => {
      value.map(e => {
        if (!e.left || !e.right) {
          cb(new Error('请填写完整电影券号区间'))
        }
      })
      cb()
    }
    const checkPriceArea = (rule, value, cb) => {
      Object.keys(value).forEach(function(key) {
        const isInt = /^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value[key])
        if (!value[key] || !isInt) {
          cb(new Error('请填写完整兑换面值'))
        }
      })
      cb()
    }
    const betweenInt = (type, min, max) => (rule, v, cb) => {
      let isBetween = false
      let isInt = false
      if (type === 1) {
        isBetween = v > min
        isInt = /^[0-9]+$/.test(v)
      } else if (type === 2) {
        isBetween = v >= min && v <= max
        isInt = true
      }
      if (isBetween && isInt) return cb()
      return cb(new Error())
    }
    return {
      step: 1,
      stepOfEdit: 0,
      orderNo: '',
      couponInfo: {
        customer: '',
        type: '',
        style: '',
        businessType: '1',
        // codeIdDetail: [],
        num: '',
        amount: '',
        unitPrice: '',
        time: [],
        priceRule: {},
        discountType: '1',
        canFreePrice: '',
        remark: '',
        useExplain: ''
      },
      programInfo: {
        id: '',
        templateId: '',
        channelId: '',
        channelList: [{ name: '', value: '' }],
        cinemaGroupId: '',
        dateLimitType: '',
        time: [],
        startTime: '',
        endTime: '',
        limitTime: [],
        stime: '',
        etime: '',
        weekTime: [],
        week: '',
        ruleList: [
          {
            filmId: '-1',
            hallType: '',
            settlementType: '',
            sort: '',
            standard: '',
            diffType: '2',
            diffRule: {}
          }
        ],
        isSaveTemplate: '0',
        couponType: ''
      },
      programInfoIsAllowEdit: false,
      invoiceInfo: {},
      allInvoiceTypes: [],
      payInfo: {
        payType: ''
      },
      priceRuleObj: {
        name: '',
        value: ''
      },
      couponInfoRules: {
        companyId: {
          required: true,
          message: '请选择业务员所属公司',
          trigger: 'change'
        },
        customer: {
          required: true,
          message: '请输入营销客户',
          trigger: 'change'
        },
        type: {
          required: true,
          message: '请选择电影券种类',
          trigger: 'change'
        },
        style: {
          required: true,
          message: '请选择电影券类型',
          trigger: 'change'
        },
        businessType: {
          required: true,
          message: '请输入业务类型',
          trigger: 'change'
        },
        num: { required: true, message: '请输入销售数量', trigger: 'blur' },
        amount: [
          { required: true, message: '请输入销售总额', trigger: 'blur' },
          {
            validator: betweenInt(2, 0, 100000000),
            message: '销售总额须大于0',
            trigger: 'blur'
          }
        ],
        time: { required: true, validator: checkTime, trigger: 'blur' },
        codeIdDetail: [
          {
            required: true,
            message: '请填写完整电影券号区间',
            trigger: 'blur'
          },
          {
            validator: checkArea,
            message: '请填写完整电影券号区间',
            trigger: 'blur'
          }
        ],
        priceRule: [
          { required: true, message: '请填写兑换面值', trigger: 'blur' },
          {
            validator: checkPriceArea,
            message: '请填写正确兑换面值,可保留两位小数',
            trigger: 'blur'
          }
        ],
        discountType: {
          required: true,
          message: '请选择优惠方式',
          trigger: 'change'
        },
        canFreePrice: [
          { required: true, message: '请输入优惠影片面值', trigger: 'blur' },
          {
            validator: checkcanFreePrice,
            message: '请填写正确优惠影片面值,可保留两位小数',
            trigger: 'blur'
          }
        ]
      },
      programInfoRules: {
        name: {
          required: true,
          message: '输入电影券使用规则名称',
          trigger: 'blur'
        },
        dateLimitType: {
          required: true,
          message: '请输入券不可用时段',
          trigger: 'blur'
        },
        time: { required: true, validator: checkTime, trigger: 'blur' },
        channelId: {
          required: true,
          message: '请选择券可用商家',
          trigger: 'blur'
        },
        cinemaGroupId: {
          required: true,
          message: '请选择券可用影院',
          trigger: 'blur'
        },
        settlementType: {
          required: true,
          message: '请选择兑换方式',
          trigger: 'blur'
        },
        hallType: { required: true, message: '请选择影厅', trigger: 'blur' },
        standard: { required: true, message: '请选择制式', trigger: 'blur' },
        filmId: { required: true, message: '请选择影片', trigger: 'blur' },
        diffType: { required: true, message: '请选择兑换方式', trigger: 'blur' }
      },
      invoiceInfoRules: {
        invoiceType: {
          required: true,
          message: '请输入发票类型',
          trigger: 'blur'
        },
        title: { required: true, message: '请输入发票抬头', trigger: 'blur' },
        taxNo: { required: true, message: '请输入税号', trigger: 'blur' },
        companyAddress: {
          required: true,
          message: '请输入企业地址',
          trigger: 'blur'
        },
        companyMobile: {
          required: true,
          message: '请输入电话号码',
          trigger: 'blur'
        },
        bank: { required: true, message: '请输入开户银行', trigger: 'blur' },
        bankNo: { required: true, message: '请输入银行账号', trigger: 'blur' }
      },
      payInfoRules: {
        payType: { required: true, message: '请选择付款方式', trigger: 'blur' }
      },
      couponInfoLoaded: false,
      channelCheckedStatus: false,
      channelShow: true
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {
    'couponInfo.type'(val) {
      this.$set(this.programInfo, 'couponType', val)
    },
    'programInfo.channelList'(val) {
      if (val.length > 0 && val[0].checked) {
        this.programInfo.channelId = val.map(e => e.value).join(',')
      }
    },
    'programInfo.templateId'(val) {
      if (val === undefined || val === null) { this.$set(this.programInfo, 'templateId', ' ') }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.couponInfoForm.clearValidate()
    })
  },
  methods: {
    codeChangeFun() {
      this.$set(this.couponInfo, 'codeIdDetail', [])
      this.couponInfo.codeIdDetail.push({ left: '', right: '' })
    },
    stepButton(thisStep) {
      if (this.$route.query.orderNo && thisStep <= this.stepOfEdit) {
        this.$set(this, 'step', thisStep)
      }
    },
    doGet(res) {
      this.$set(this.couponInfo, 'num', res)
    },
    stepApi(bool, step) {
      // 新增编辑接口
      const apiTemp = this.$route.query.orderNo
        ? updateCouponOrder
        : createCouponOrder
      let apiParamsTemp = {}
      switch (step) {
        case 1:
          apiParamsTemp = this.$route.query.orderNo
            ? {
              step: 1,
              couponInfo: this.couponInfo,
              orderNo: this.$route.query.orderNo
            }
            : { step: 1, couponInfo: this.couponInfo, orderNo: this.orderNo }
          break
        case 2:
          apiParamsTemp = this.$route.query.orderNo
            ? {
              step: 2,
              programInfo: this.programInfo,
              orderNo: this.$route.query.orderNo
            }
            : { step: 2, programInfo: this.programInfo, orderNo: this.orderNo }
          break
        case 3:
          apiParamsTemp = this.$route.query.orderNo
            ? {
              step: 3,
              invoiceInfo: this.invoiceInfo,
              orderNo: this.$route.query.orderNo
            }
            : { step: 3, invoiceInfo: this.invoiceInfo, orderNo: this.orderNo }
          break
        case 4:
          apiParamsTemp = this.$route.query.orderNo
            ? {
              step: 4,
              payInfo: this.payInfo,
              orderNo: this.$route.query.orderNo
            }
            : { step: 4, payInfo: this.payInfo, orderNo: this.orderNo }
          break
      }

      apiTemp(apiParamsTemp)
        .then(res => {
          if (step === 1) {
            this.orderNo = res
          }
          // 接口不接受boolean 转成string接口结束要返回boolean
          if (
            this.programInfo.channelList.length > 0 &&
            this.programInfo.channelList[0].value
          ) {
            this.programInfo.channelList.map(e => {
              e.checked = true
            })
          } else {
            this.programInfo.channelList = []
          }
          this.successBackTip(bool)
        })
        .catch(e => {
          if (
            this.programInfo.channelList.length > 0 &&
            this.programInfo.channelList[0].value
          ) {
            this.programInfo.channelList.map(e => {
              e.checked = true
            })
          } else {
            this.programInfo.channelList = []
          }
        })
    },
    successBackTip(bool) {
      // 保存和下一步 成功后输出的内容
      if (bool) {
        this.$message.success('保存成功')
        // this.closeTab(true)
        // this.$router.push('/operation_center/coupon_mgr/sold_coupon_list')
      } else {
        this.step++
      }
    },
    couponInfoSave() {
      this.$refs.couponInfoForm.validate(valid => {
        if (valid) {
          this.$set(this.couponInfo, 'startTime', this.couponInfo.time[0])
          this.$set(this.couponInfo, 'endTime', this.couponInfo.time[1])

          if (this.couponInfo.num) {
            this.couponInfo.num = this.couponInfo.num.toString()
          }
          this.stepApi(true, 1)
          /* Object.keys(this.couponInfo.priceRule).forEach(e => {
            // this.priceRuleObj.name = e
            this.priceRuleObj.value = this.couponInfo.priceRule[e]
          })*/
        }
      })
    },
    couponInfoNextStep() {
      this.$refs.couponInfoForm.validate(valid => {
        if (valid) {
          this.$set(this.couponInfo, 'startTime', this.couponInfo.time[0])
          this.$set(this.couponInfo, 'endTime', this.couponInfo.time[1])

          if (this.couponInfo.num) {
            this.couponInfo.num = this.couponInfo.num.toString()
          }
          this.stepApi(false, 1)
        }
      })
      this.channelCheckedStatus = true
      /* Object.keys(this.couponInfo.priceRule).forEach(e => {
        if (e === 'lt') {
          this.priceRuleObj.name = '小于' + this.couponInfo.priceRule[e]
          this.priceRuleObj.value = this.couponInfo.priceRule[e]
        } else {
          this.priceRuleObj.name = '小于等于' + this.couponInfo.priceRule[e]
          this.priceRuleObj.value = this.couponInfo.priceRule[e]
        }
      })*/
    },
    // 步骤2
    filmTypeSelect(val) {
      if (val === '-1') {
        this.$set(this.programInfo.ruleList[0], 'filmId', '-1')
      } else {
        // this.$set(this.programInfo.ruleList[0], 'filmId', '')
        // this.$set(this.programInfo.ruleList[0], 'filmType', '1')
        this.$set(this.programInfo.ruleList, 0, {
          filmType: '1',
          filmId: '',
          hallType: '',
          settlementType: '3',
          sort: '',
          standard: '',
          diffType: '2',
          diffRule: {}
        })
      }
    },
    async AutoProgramImport(val) {
      // 选择模板规则名称,自动填充销售规则内容
      const _this = this
      this.couponInfoLoaded = false
      this.channelCheckedStatus = false
      _this.$set(_this.programInfo, 'ruleList', []) // 规则ruleList
      await getCouponProgramInfo(val).then(res => {
        _this.$set(_this, 'programInfo', res)
        delete _this.programInfo.isTemplate

        _this.$set(_this.programInfo, 'templateId', res.id)
        _this.$set(_this.programInfo, 'time', [])
        _this.programInfo.time.push(res.startTime)
        _this.programInfo.time.push(res.endTime)
        if (_this.programInfo.timeType === 'day') {
          _this.$set(_this.programInfo, 'limitTime', [res.stime, res.etime])
        }
        if (_this.programInfo.timeType === 'week') {
          _this.$set(_this.programInfo, 'limitTime', [res.stime, res.etime])

          const weekTimeTemp = res.week.split(',')
          _this.programInfo.weekTime = weekTimeTemp.map(e => {
            return parseInt(e)
          })
        }
        // _this.$set(_this.programInfo, 'templateId', ' ')
        _this.$set(_this.programInfo, 'isSaveTemplate', '0')

        _this.programInfo.channelList.map(e => {
          return _this.$set(e, 'checked', true)
        })

        this.channelCheckedStatus = true

        if (_this.programInfo.ruleList[0].filmId !== '-1') {
          _this.$set(_this.programInfo.ruleList[0], 'filmType', '1')
        } else {
          _this.$set(_this.programInfo.ruleList[0], 'filmType', '-1')
        }

        _this.$set(_this.programInfo, 'couponType', _this.couponInfo.type)
        if (res.isAllowUpdate === '2') {
          _this.$set(_this, 'programInfoIsAllowEdit', true)
        } else {
          _this.$set(_this, 'programInfoIsAllowEdit', false)
        }
      })
    },
    programInfoPrevStep() {
      this.$set(this, 'step', 1)
    },
    programInfoSave() {
      this.$refs.programInfoForm.validate(valid => {
        if (valid) {
          if (this.programInfo.dateLimitType === '2') {
            this.programInfo.startTime = this.programInfo.time[0]
            this.programInfo.endTime = this.programInfo.time[1]
            if (
              this.programInfo.limitTime &&
              this.programInfo.limitTime.length > 0
            ) {
              this.programInfo.stime = this.programInfo.limitTime[0]
              this.programInfo.etime = this.programInfo.limitTime[1]
            }
            if (
              this.programInfo.weekTime &&
              this.programInfo.weekTime.length > 0
            ) {
              this.programInfo.week = this.programInfo.weekTime.join(',')
              delete this.programInfo.weekTime
            }
          }

          this.programInfo.channelList.map(e => {
            e.checked = 'true'
          })

          this.stepApi(true, 2)
        }
      })
    },
    programInfoNextStep() {
      this.$refs.programInfoForm.validate(valid => {
        if (valid) {
          if (this.programInfo.dateLimitType === '2') {
            this.programInfo.startTime = this.programInfo.time[0]
            this.programInfo.endTime = this.programInfo.time[1]
            if (
              this.programInfo.limitTime &&
              this.programInfo.limitTime.length > 0
            ) {
              this.programInfo.stime = this.programInfo.limitTime[0]
              this.programInfo.etime = this.programInfo.limitTime[1]
            }
            if (
              this.programInfo.weekTime &&
              this.programInfo.weekTime.length > 0
            ) {
              this.programInfo.week = this.programInfo.weekTime.join(',')
              delete this.programInfo.weekTime
            }
          }
          this.programInfo.channelList.map(e => {
            e.checked = 'true'
          })
          this.stepApi(false, 2)
        }
      })
    },

    invoiceInfoPrevStep() {
      this.$set(this, 'step', 2)
    },
    invoiceInfoSave() {
      this.$refs.invoiceInfoForm.validate(valid => {
        if (valid) {
          this.stepApi(true, 3)
        }
      })
    },
    invoiceInfoNextStep() {
      this.$refs.invoiceInfoForm.validate(valid => {
        if (valid) {
          this.stepApi(false, 3)
        }
      })
    },

    payInfoPrevStep() {
      this.$set(this, 'step', 3)
    },
    payInfoSave() {
      this.$refs.payInfoForm.validate(valid => {
        if (valid) {
          this.stepApi(true, 4)
        }
      })
    },
    submitAudit() {
      const orderNo = this.orderNo ? this.orderNo : this.$route.query.orderNo
      updateCouponOrder({
        step: 4,
        payInfo: this.payInfo,
        orderNo: orderNo,
        checkStatus: '1'
      }).then(res => {
        this.$message.success('提交审核成功')
        this.closeTab(true)
        this.$router.push('/operation_center/coupon_mgr/sold_coupon_list')
      })
    },
    cancel() {
      this.closeTab()
      this.$router.push('/operation_center/coupon_mgr/sold_coupon_list')
    },
    diffByValue(val) {
      this.$set(this.programInfo.ruleList[0], 'diffRule', val)
    },
    complementChange(val, settlementType) {
      this.$nextTick(e => {
        if (val === '2') {
          if (settlementType === '2') {
            this.$refs['complementStandardRef'][0].geDdataId()
          } else if (settlementType === '3') {
            this.$refs['complementRef'][0].geDdataId()
          } else if (settlementType === '1') {
            this.$refs['complementHallRef'][0].geDdataId()
          }
        }
      })
    },
    resetDiffRuleChange() {
      this.$set(this.programInfo.ruleList[0], 'diffRule', {})
      const settlementType = this.programInfo.ruleList[0].settlementType
      this.$set(this.programInfo, 'ruleList', [
        {
          filmId: '-1',
          filmType: '-1',
          hallType: '',
          settlementType: settlementType,
          sort: '',
          standard: '',
          diffType: '2',
          diffRule: {}
        }
      ])
      this.complementChange('2', settlementType)
    }
  },
  async created() {
    if (this.$route.query.orderNo) {
      const _this = this
      getCouponOrderInfo(this.$route.query.orderNo).then(res => {
        _this.step = parseInt(res.couponInfo.step)
        _this.stepOfEdit = parseInt(res.couponInfo.step)
        _this.$set(_this, 'couponInfo', res.couponInfo)

        _this.$set(_this.couponInfo, 'time', [])

        _this.couponInfo.time.push(res.couponInfo.startTime)
        _this.couponInfo.time.push(res.couponInfo.endTime)

        /* if (this.couponInfo.priceRule) {
          Object.keys(this.couponInfo.priceRule).forEach(e => {
            if (e === 'lt') {
              this.priceRuleObj.name = '小于' + this.couponInfo.priceRule[e]
              this.priceRuleObj.value = this.couponInfo.priceRule[e]
            } else {
              this.priceRuleObj.name = '小于等于' + this.couponInfo.priceRule[e]
              this.priceRuleObj.value = this.couponInfo.priceRule[e]
            }
          })
        }*/

        if (res.programInfo instanceof Array) {
          _this.$refs.programInfoForm.resetFields()
        } else {
          _this.$set(_this, 'programInfo', res.programInfo)

          if (res.programInfo.startTime && res.programInfo.endTime) {
            _this.$set(_this.programInfo, 'time', [])
            _this.programInfo.time.push(res.programInfo.startTime)
            _this.programInfo.time.push(res.programInfo.endTime)
          }

          if (_this.programInfo.timeType === 'day') {
            _this.$set(_this.programInfo, 'limitTime', [
              res.programInfo.stime,
              res.programInfo.etime
            ])
          }
          if (_this.programInfo.timeType === 'week') {
            _this.$set(_this.programInfo, 'limitTime', [
              res.programInfo.stime,
              res.programInfo.etime
            ])

            const weekTimeTemp = res.programInfo.week.split(',')
            _this.programInfo.weekTime = weekTimeTemp.map(e => {
              return parseInt(e)
            })
          }
          if (_this.programInfo.ruleList.length > 0) {
            if (
              _this.programInfo.ruleList &&
              _this.programInfo.ruleList[0] &&
              _this.programInfo.ruleList[0].filmId !== '-1'
            ) {
              delete _this.programInfo.ruleList[0].id
              delete _this.programInfo.ruleList[0].programId
              delete _this.programInfo.ruleList[0].ruleName
              delete _this.programInfo.ruleList[0].sort
              delete _this.programInfo.ruleList[0].priceRule
              delete _this.programInfo.ruleList[0].hallId
              _this.$set(_this.programInfo.ruleList[0], 'filmType', '1')
              _this.$set(
                _this.programInfo.ruleList[0],
                'filmId',
                res.programInfo.ruleList[0].filmId || ''
              )
              _this.$set(
                _this.programInfo.ruleList[0],
                'hallType',
                res.programInfo.ruleList[0].hallType || ''
              )
              _this.$set(
                _this.programInfo.ruleList[0],
                'settlementType',
                res.programInfo.ruleList[0].settlementType || ''
              )
              _this.$set(
                _this.programInfo.ruleList[0],
                'standard',
                res.programInfo.ruleList[0].standard || ''
              )
            } else {
              _this.$set(_this.programInfo.ruleList[0], 'filmType', '-1')
              delete _this.programInfo.ruleList[0].id
              delete _this.programInfo.ruleList[0].programId
              delete _this.programInfo.ruleList[0].ruleName
              delete _this.programInfo.ruleList[0].sort
              delete _this.programInfo.ruleList[0].priceRule
              delete _this.programInfo.ruleList[0].hallId
              delete _this.programInfo.ruleList[0].filmList
              _this.$set(_this.programInfo.ruleList[0], 'filmType', '-1')
              _this.$set(
                _this.programInfo.ruleList[0],
                'filmId',
                res.programInfo.ruleList[0].filmId || ''
              )
              _this.$set(
                _this.programInfo.ruleList[0],
                'hallType',
                res.programInfo.ruleList[0].hallType || ''
              )
              _this.$set(
                _this.programInfo.ruleList[0],
                'settlementType',
                res.programInfo.ruleList[0].settlementType || ''
              )
              _this.$set(
                _this.programInfo.ruleList[0],
                'standard',
                res.programInfo.ruleList[0].standard || ''
              )
            }
          }
          if (
            _this.programInfo.channelList.length > 0 &&
            _this.programInfo.channelList[0].value
          ) {
            _this.programInfo.channelList.map(e =>
              this.$set(e, 'checked', true)
            )
          }
        }

        !res.invoiceInfo || _this.$set(_this, 'invoiceInfo', res.invoiceInfo)
        res.payInfo.length === 0
          ? _this.$set(_this, 'payInfo', {})
          : _this.$set(_this, 'payInfo', res.payInfo)

        this.couponInfoLoaded = true
      })
    }

    this.allInvoiceTypes = await getInvoiceTypeList()
  }
}
</script>

<style>
.areaStyle {
  height: 95px;
}
.el-textarea__inner {
  height: 90px;
}
.filmTip .tip-box {
  width: 210px !important;
}
</style>

