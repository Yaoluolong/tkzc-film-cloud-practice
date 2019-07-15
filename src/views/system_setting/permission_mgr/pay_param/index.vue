<template>
  <div class="app-container">
        <el-container>
            <el-aside style="width:15%">
                <el-menu :default-active="activeIndex">
                    <el-menu-item  @click="activeMenu(item.index)" v-for="item in menus" :index="item.index" :key="item.index" style="font-size:15px" :style="item.index === activeIndex ? menuStyle : ''">
                        <i></i>
                        <span slot="title">{{item.title}}</span>
                    </el-menu-item>                   
                </el-menu>
            </el-aside>    
            <el-main>               
                <alipay v-show="activeIndex === 'alipay'"></alipay>
                <we-chat v-show="activeIndex === 'weixinPay'"></we-chat>
                <unionpay v-show="activeIndex === 'union'"></unionpay>
                <cardpay v-show="activeIndex === 'cardpay'"></cardpay>
            </el-main>
        </el-container>
  </div>
</template>

<script>
import Alipay from './Alipay'
import WeChat from './wechat/WeChat'
import Unionpay from './Unionpay'
import Cardpay from './Cardpay'
export default {
  name: 'pay_param',
  components: { Alipay, WeChat, Unionpay, Cardpay },
  data() {
    return {
      menus: [{
        title: '支付宝支付参数',
        index: 'alipay'
      }, {
        title: '微信支付参数',
        index: 'weixinPay'
      }, {
        title: '银联支付参数',
        index: 'union'
      }, {
        title: '电影卡--点卡',
        index: 'cardpay'
      }],
      activeIndex: 'alipay',
      menuStyle: 'background-color:#ecf6fd'
    }
  },
  methods: {
    activeMenu(index) {
      this.activeIndex = index
    },
    fetchData() {
      return { data: [{
        name: '畅由',
        status: '1',
        statusName: '开启',
        trigger: '2'
      }, {
        name: '关爱通',
        status: '2',
        statusName: '关闭',
        trigger: '1'
      }] }
    }
  }
}
</script>

<style scoped lang="scss">
.app-container{
  display: flex;
}
.el-aside{   
  text-align: right;
  margin-top:25px;
}
.el-main{
    padding:0
}
.el-menu .el-menu-item.is-active {
    color: #3ca0ec;
    border-right: 1px solid #3ca0ec;
}
</style>
