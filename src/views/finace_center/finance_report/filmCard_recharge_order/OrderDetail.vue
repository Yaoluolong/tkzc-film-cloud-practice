<template>
  <div class="app-container">
    <el-collapse v-model="activeNames" class="form-collapse">
      <el-collapse-item  name="1"  title="基础信息">
        <div class="item-wapper">
          <div class="item">充值订单号：{{orderInfo.orderNo}}</div>
          <div class="item">充值电影卡号：{{orderInfo.cardCode}}</div>
          <div class="item">充值点数：{{orderInfo.point}}</div>
          <div class="item">订单时间：{{orderInfo.createTime}}</div>
          <div class="item">充值金额：{{orderInfo.price}}</div>
          <div class="item">支付时间：{{orderInfo.payTime || '--'}}</div>
          <div class="item">充值点数有效期：--</div>
          <div class="item">平台商家：{{orderInfo.channelName}}</div>
          <div class="item">消费终端：{{orderInfo.deviceType}}</div>
          <div class="item danger">订单状态：{{orderInfo.orderStatusName}}</div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" title="用户付款信息"  v-if="orderInfo.orderStatus ==='4'">
        <div v-for="(info,index) in orderInfo.payInfo" :key="index">
          <div class="danger item-title">{{info.typeName}}</div>
          <div class="item-wapper">
            <div class="item" v-for="item in info.list" :key="item.name">{{item.name}}：{{item.value}}</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    </div>
</template>
<script>
import { getCardRechargeOrderInfo } from '@/api/financeCenter'
export default {
  name: 'order_detail',
  data() {
    return {
      activeNames: ['1', '2'],
      orderInfo: {}
    }
  },
  methods: {
    fetchData() {
      getCardRechargeOrderInfo({ orderId: this.$route.query.orderId }).then((res) => {
        this.orderInfo = res
      })
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style scoped lang="scss">
.header-icon{
  font-size: 16px;
}
.title{
  margin-left: 10px;
  font-size: 16px;
  color:#303133;
  font-weight: bold;
  // font-weight: bold;
}
.item-wapper{
  display: flex;
  flex-wrap: wrap;
  .item{
    font-size: 14px;
    margin: 10px 20px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 400px;
  }
}
.item-title{
    margin: 10px 20px;
}
</style>