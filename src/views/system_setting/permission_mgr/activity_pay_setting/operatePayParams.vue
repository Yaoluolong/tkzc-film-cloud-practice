<template>
  <div class="app-container">
        <!-- <el-container> -->
          <div  style="margin-left:5%;padding-left:20px;">
            <span style="font-weight:bold;">支付类型：</span><el-select v-model="activeIndex">
              <el-option
              v-for="item in menus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </div>  
                
          <el-main>               
              <!-- <alipay v-if="activeIndex === 'aliPay'"></alipay> -->
              <we-chat v-if="activeIndex === 'weixinPay'"></we-chat>
              <unionpay v-if="activeIndex === 'unionPay'"></unionpay>
              <!-- <cardpay v-if="activeIndex === 'cardPay'"></cardpay> -->
          </el-main>
        <!-- </el-container> -->
  </div>
</template>

<script>
// import Alipay from './Alipay'
import WeChat from './wechat/WeChat'
import Unionpay from './Unionpay'
// import Cardpay from './Cardpay'
import { getPayConfig } from '@/api/activitySetting'
export default {
  name: 'activity_pay_edit',
  // components: { Alipay, WeChat, Unionpay, Cardpay },
  components: { Unionpay, WeChat },
  data() {
    return {
      menus: [
      // {
      //   label: '支付宝支付参数',
      //   value: 'aliPay'
      // },
        {
          label: '微信支付参数',
          value: 'weixinPay'
        },
        {
          label: '银联支付参数',
          value: 'unionPay'
        }
      // , {
      //   label: '电影卡--点卡',
      //   value: 'cardPay'
      // }
      ],
      activeIndex: '',
      menuStyle: 'background-color:#ecf6fd'
    }
  },
  methods: {
    activeMenu(index) {
      this.activeIndex = index
    },
    activeIndexChange(val) {
      this.$set(this, 'activeIndex', val)
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
  },

  async created() {
    if (this.$route.query.id) {
      const temp = await getPayConfig(this.$route.query.id)
      if (temp) {
        this.$set(this, 'activeIndex', temp.type)
      }
    }
  }
}
</script>


