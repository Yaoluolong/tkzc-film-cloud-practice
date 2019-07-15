<template>
<div class="app-container">
  <div style="text-align: left; margin: 0;" >
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span class="sales">电影券销售信息</span>
                        </div>
                        <el-row>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>业务人员</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.saleName || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>客户名称</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.customerName || '- -'}}</div></el-col>
                            </el-col>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>销售单号</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.saleOrderNo || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">销售日期</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.saleTime || '- -'}}</div></el-col>
                            </el-col>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">激活状态</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.isActive || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">可兑换/优惠影片面值</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.couponValue || '- -'}}</div></el-col>
                            </el-col>
                        </el-row>
                    </el-card>
                   
                    <el-card style="margin-top:10px">
                        <div slot="header" class="clearfix">
                            <span class="sales">电影券信息</span>
                        </div>
                        <el-row>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>电影券来源</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.source || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>电影券批次号</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.batchNo || '- -'}}</div></el-col>
                            </el-col>
                            <el-col :span="24" class="kacard">                                
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">电影券号</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.couponCode || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>电影券密码</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.couponId || '- -'}}</div></el-col>
                            </el-col>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">电影券种类</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.type  || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">电影券类型</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.style  || '- -'}}</div></el-col>
                            </el-col>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">有效期</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.volidTime || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">过期状态</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.isOverdue || '- -'}}</div></el-col>                                
                            </el-col>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">作废状态</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.isVoid || '- -'}}</div></el-col>                                
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">冻结状态</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.isFrozen || '- -'}}</div></el-col>
                            </el-col>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">绑定状态</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.bindStatus || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">绑定会员ID</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.memberId || '- -'}}</div></el-col>
                            </el-col>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>会员昵称</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.memberInfo.nickName || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>会员绑定手机</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.memberInfo.bindingMobile || '- -'}}</div></el-col>                               
                                                               
                            </el-col>
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>绑定时间</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.bindTime || '- -'}}</div></el-col> 
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"><a>使用状态</a></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.isUse || '- -'}}</div></el-col>                                
                            </el-col>                            
                            <el-col :span="24" class="kacard">
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">使用时间</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.useTime || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">核销方式</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.useType || '- -'}}</div></el-col>
                            </el-col>
                            <el-col :span="24" class="kacard">                                                         
                                <el-col :span="4" class="business"><div class="grid-content bg-purple">购票订单号</div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light">{{data.useOrderNo || '- -'}}</div></el-col>
                                <el-col :span="4" class="business"><div class="grid-content bg-purple"></div></el-col>
                                <el-col :span="8" class="businessitem"><div class="grid-content bg-purple-light"></div></el-col>
                            </el-col>
                        </el-row>
                    </el-card>
                    
            </div>
    </div>
</template>

<script>
import { getSoldCouponInfo } from '@/api/operationCenter'
export default {
  name: 'card_detail',
  data() {
    return {
      data: {}
    }
  },
  watch: {
  },
  methods: {

  },
  async created() {
    if (this.$route.query.id) {
      this.data = await getSoldCouponInfo({ id: this.$route.query.id })
      console.log(this.data)
    }
  }
}
</script>

<style scoped lang="scss">
.el-row {
    margin-bottom: 0px;
    border-bottom: 1px solid #E4E4E4;
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
    border-top: 1px solid  #E4E4E4;
  }
.bg-purple-light {
    background: #ffffff;
  }
  .bg-purple {
    background: #F9FAFC;
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
    border-left: 1px solid  #E4E4E4;
    border-right: 1px solid #E4E4E4;
  }
  .businessitem{
    border-right: 1px solid #E4E4E4;
  }
</style>
