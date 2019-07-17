<template>
  <div class="app-container">
    <el-form label-width="120px" style="width:600px;" :model="params" :rules="rules" ref="form">
      <div style="margin:4% 0;">运营中心--电影券管理</div>
      <div style="color:grey;font-size:12px;margin-bottom: 20px;">用于用户可以查看哪些电影券销售单的数据！</div>

      <el-form-item label="读取业务员：" prop="couponSaler">
        <el-radio v-model="couponLimit.account" label="-1" @change="couponLimitAccountChange">全部</el-radio>
        <el-radio v-model="couponLimit.account" label="1" @change="couponLimitAccountChange">仅本人</el-radio>
      </el-form-item>
      <el-form-item label="读取用户：" prop="couponCustomer" v-if="ok && couponLimit.account==='-1'">
        <customer-form-selector v-model="couponCustomer" style="width:100%"></customer-form-selector>
      </el-form-item>

      <div class="elform"></div>
      <div style="margin:4% 0;">运营中心--电影卡管理</div>
      <div style="color:grey;font-size:12px;margin-bottom: 20px;">用于用户可以查看哪些电影卡销售单的数据！</div>

      <el-form-item label="读取业务员：" prop="cardSaler">
        <el-radio v-model="cardLimit.account" label="-1" @change="cardLimitAccountChange">全部</el-radio>
        <el-radio v-model="cardLimit.account" label="1" @change="cardLimitAccountChange">仅本人</el-radio>
      </el-form-item>
      <el-form-item label="读取用户：" prop="channelList" v-if="ok && cardLimit.account==='-1'">
        <customer-form-selector v-model="cardCustomer" style="width:100%"></customer-form-selector>
      </el-form-item>

      <div class="elform"></div>

      <div style="margin:4% 0;">平台商家交易预警处理权限</div>
      <div style="color:grey;font-size:12px;margin-bottom: 20px;">用于平台商家交易预警处理的权限开通！</div>
      <el-form-item label="平台商家交易预警配置权限：" label-width="200px" prop="setWarning">
        <el-radio v-model="params.setWarning" label="2">关闭</el-radio>
        <el-radio v-model="params.setWarning" label="1">开启</el-radio>
      </el-form-item>
      <el-form-item label="平台商家交易预警对账权限：" label-width="200px" prop="checkAccount">
        <el-radio v-model="params.checkAccount" label="2">关闭</el-radio>
        <el-radio v-model="params.checkAccount" label="1">开启</el-radio>
      </el-form-item>

      <div class="elform"></div>

      <div style="margin:4% 0;">运营中心--营销活动管理</div>
      <div style="color:grey;font-size:12px;margin-bottom: 20px;">用于用户可以查看哪些营销活动的数据！</div>
      <el-form-item label="读取业务员：" prop="checkActivity">
        <el-radio v-model="params.checkActivity" label="-1">全部</el-radio>
        <el-radio v-model="params.checkActivity" label="1">仅本人</el-radio>
      </el-form-item>

      <div class="elform"></div>

      <div style="margin:4% 0;">财务中心--票务订单</div>
      <div style="color:grey;font-size:12px;margin-bottom: 20px;">分配用户可以看到哪些平台商家下哪些票务系统商下的交易类型的数据！</div>
      <el-form-item label="可看商家：" prop="channelList" v-if="ok">
        <channel-access-form-selector ref="channelComponent" v-model="channelList" type></channel-access-form-selector>
      </el-form-item>
      <el-form-item label="可看系统商：" prop="interfaceTypeList" v-if="ok">
        <interface-access-form-selector v-model="interfaceTypeList" style="width:100%"></interface-access-form-selector>
      </el-form-item>

      <div class="elform"></div>

      <div style="margin:4% 0;">财务中心--券销售订单报表</div>
      <div style="color:grey;font-size:12px;margin-bottom: 20px;">用于用户可以查看哪些电影券销售单的数据！</div>

      <el-form-item label="读取业务员：" prop="saler">
        <el-radio v-model="couponOrderLimit.account" label="-1" @change="couponOrderLimitChange">全部</el-radio>
        <el-radio v-model="couponOrderLimit.account" label="1" @change="couponOrderLimitChange">仅本人</el-radio>
      </el-form-item>
      <el-form-item label="读取用户：" prop="channelList" v-if="ok && couponOrderLimit.account==='-1'">
        <customer-form-selector v-model="couponOrderLimitMan" style="width:100%"></customer-form-selector>
      </el-form-item>

      <div class="elform"></div>

      <div style="margin:4% 0;">财务中心--卡销售订单报表</div>
      <div style="color:grey;font-size:12px;margin-bottom: 20px;">用于用户可以查看哪些电影卡销售单的数据！</div>

      <el-form-item label="读取业务员：" prop="saler">
        <el-radio v-model="cardOrderLimit.account" label="-1" @change="cardOrderLimitChange">全部</el-radio>
        <el-radio v-model="cardOrderLimit.account" label="1" @change="cardOrderLimitChange">仅本人</el-radio>
      </el-form-item>
      <el-form-item label="读取用户：" prop="channelList" v-if="ok && cardOrderLimit.account==='-1'">
        <customer-form-selector v-model="cardOrderLimitMan" style="width:100%"></customer-form-selector>
      </el-form-item>
      <div class="elform"></div>

      <div style="margin:4% 0;">
        财务中心-发行活动券报表&emsp;
        <el-radio v-model="params.setView" label="2">关闭</el-radio>
        <el-radio v-model="params.setView" label="1">开启</el-radio>
      </div>
      <div style="color:grey;font-size:12px;margin-bottom: 20px;">用于登录用户可以查看哪些销售订单下电影券的使用明细！</div>
      <el-form-item label label-width="0px" v-if="params.setView==='1'" prop="couponSaleDetail">
        <coupon-sale-detail-selector
          :outSearchData="params.couponOrderConditions"
          :dataList="couponOrderList"
          v-model="params.couponOrderIds"
          @couponOrderConditionsFunc="couponOrderConditionsFunc"
        ></coupon-sale-detail-selector>
      </el-form-item>
      <div class="elform"></div>

      <div style="margin:4% 0;">平台管理--平台用户管理</div>
      <div style="color:grey;font-size:12px;margin-bottom: 20px;">用于用户可以管理哪些平台职员的权限！</div>

      <el-form-item label="读取业务员：" prop="saler">
        <el-radio v-model="params.accountLimit" label="-1">全部</el-radio>
        <el-radio v-model="params.accountLimit" label="1">仅本人创建的职员</el-radio>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="save">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>
<script>
import { getPermissionsInfo, updatePermissions } from '@/api/systemSetting'
import customerFormSelector from '@/components/customerFormSelector'
import ChannelAccessFormSelector from '@/components/ChannelAccessFormSelector'
import interfaceAccessFormSelector from '@/components/InterfaceAccessFormSelector'
import CouponSaleDetailSelector from '@/components/CouponSaleDetailSelector'
export default {
  components: {
    customerFormSelector,
    ChannelAccessFormSelector,
    interfaceAccessFormSelector,
    CouponSaleDetailSelector
  },
  data() {
    return {
      params: {
        // 运营中心--电影券管理/电影卡管理
        couponLimit: { account: '-1', customer: '' },
        cardLimit: { account: '-1', customer: '' },

        // 运营中心--平台商家交易预警
        setWarning: '2',
        checkAccount: '2',

        // 运营中心--营销活动管理
        checkActivity: '-1',

        // 财务中心--票务订单
        ticketOrder: { channel: '', interface: '' },

        // 财务中心--券销售订单报表
        couponOrderLimit: { account: '-1', customer: '' },
        // 财务中心--卡销售订单报表
        cardOrderLimit: { account: '-1', customer: '' },

        // 财务中心-发行活动券报表
        setView: '2',
        couponOrderIds: '',
        couponOrderConditions: {
          orderNo: '',
          customerName: ''
        },

        // 平台管理-平台用户管理
        accountLimit: '-1'
      },
      couponLimit: { account: '-1', customer: '' },
      cardLimit: { account: '-1', customer: '' },
      couponOrderLimit: { account: '-1', customer: '' },
      cardOrderLimit: { account: '-1', customer: '' },

      couponCustomer: [],
      cardCustomer: [],

      channelList: [],
      interfaceTypeList: [],

      couponOrderLimitMan: [],
      cardOrderLimitMan: [],

      couponOrderList: [],

      ok: false,
      rules: {}
    }
  },
  methods: {
    couponLimitAccountChange() {
      this.couponCustomer = ['-1']
    },
    cardLimitAccountChange() {
      this.cardCustomer = ['-1']
    },
    couponOrderLimitChange() {
      this.couponOrderLimitMan = ['-1']
    },
    cardOrderLimitChange() {
      this.cardOrderLimitMan = ['-1']
    },
    couponOrderConditionsFunc(order) {
      this.params.couponOrderConditions = order
    },
    save() {
      this.params.id = this.$route.query.id

      this.$set(this.params.couponLimit, 'account', this.couponLimit.account)
      this.$set(this.params.cardLimit, 'account', this.cardLimit.account)
      this.$set(
        this.params.couponOrderLimit,
        'account',
        this.couponOrderLimit.account
      )
      this.$set(
        this.params.cardOrderLimit,
        'account',
        this.cardOrderLimit.account
      )

      this.params.couponLimit.customer =
        typeof this.couponCustomer === 'string'
          ? this.couponCustomer
          : this.couponCustomer.join(',')
      this.params.cardLimit.customer =
        typeof this.cardCustomer === 'string'
          ? this.cardCustomer
          : this.cardCustomer.join(',')

      this.params.ticketOrder.channel =
        typeof this.channelList === 'string'
          ? this.channelList
          : this.channelList.join(',')
      this.params.ticketOrder.interface =
        typeof this.interfaceTypeList === 'string'
          ? this.interfaceTypeList
          : this.interfaceTypeList.join(',')

      this.params.couponOrderLimit.customer =
        typeof this.couponOrderLimitMan === 'string'
          ? this.couponOrderLimitMan
          : this.couponOrderLimitMan.join(',')
      this.params.cardOrderLimit.customer =
        typeof this.cardOrderLimitMan === 'string'
          ? this.cardOrderLimitMan
          : this.cardOrderLimitMan.join(',')

      if (this.params.setView === '2') {
        this.$set(this.params, 'couponOrderIds', '')
        this.$set(this, 'couponOrderList', [])
      }

      // this.$refs.form.clearValidate()
      updatePermissions(this.params).then(res => {
        this.$message.success('保存成功')
        this.closeTab()
        this.$router.push('/system_setting/platform_setting/user_mgr')
      })
    },
    cancel() {
      this.closeTab()
      this.$router.push('/system_setting/platform_setting/user_mgr')
    }
  },
  created() {
    const _this = this
    getPermissionsInfo(this.$route.query.id).then(data => {
      this.params = data

      this.params.couponLimit.account === '1'
        ? _this.$set(this.couponLimit, 'account', '1')
        : _this.$set(this.couponLimit, 'account', '-1')

      this.couponCustomer = this.params.couponLimit.customer

      this.params.cardLimit.account === '1'
        ? _this.$set(this.cardLimit, 'account', '1')
        : this.$set(this.params.cardLimit, 'account', '-1')
      this.cardCustomer = this.params.cardLimit.customer

      this.params.checkActivity
        ? ''
        : this.$set(this.params, 'checkActivity', '-1')

      this.channelList = this.params.ticketOrder.channel
      this.interfaceTypeList = this.params.ticketOrder.interface

      this.params.couponOrderLimit.account === '1'
        ? this.$set(this.couponOrderLimit, 'account', '1')
        : this.$set(this.couponOrderLimit, 'account', '-1')

      this.couponOrderLimitMan = this.params.couponOrderLimit.customer

      this.params.cardOrderLimit.account === '1'
        ? this.$set(this.cardOrderLimit, 'account', '1')
        : this.$set(this.cardOrderLimit, 'account', '-1')
      this.cardOrderLimitMan = this.params.cardOrderLimit.customer

      this.params.couponOrderConditions = this.params.couponOrderConditions
        ? this.params.couponOrderConditions
        : { orderNo: '', customerName: '' }
      this.ok = true
    })
  }
}
</script>
<style scoped lang="scss">
.sub-menu {
  margin: 10px;
}
.elform {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
</style>