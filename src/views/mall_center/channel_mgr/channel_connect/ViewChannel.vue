<template>
  <div class="app-container">
	<el-card class="box-card">
	  <div slot="header">
	    <span>平台商家基础信息</span>
	  </div>  
	  <el-form label-width="120px" label-position="left"  style="width:1000px;">
	        <el-form-item label="商家名称" prop="name" >
	          {{params.name}}
	        </el-form-item>
	        <el-form-item label="平台商家类型"  prop="type">
	          	<el-radio-group v-model="params.type" size="medium">
	            	<el-radio label="1" disabled>自营</el-radio>
	            	<el-radio label="2" disabled>加盟</el-radio>
	           	</el-radio-group>
	        </el-form-item>
	        <el-form-item label="消费终端" prop="deviceCode">
	            {{params.deviceName}}
	          </el-form-item>   
	        <el-form-item label="请求平台接口" prop="requestUrl">
	            {{params.requestUrl ||'无'}}
	        </el-form-item>
	        <el-form-item label="获取退款通知" style="width:320px" prop="refundNotifyUrl" v-if="params.type==2">
	          {{params.refundNotifyUrl}}
	        </el-form-item>
	        <el-form-item label="渠道商账号" style="width:320px" prop="channelAccount">
	          {{params.channelAccount}}
	        </el-form-item>
	        <el-form-item label="渠道商密码" style="width:320px" prop="password">
	          {{params.password}}
	        </el-form-item>
	        <div v-if="params.type === '2'">
		        <el-form-item label="渠道停售时间" style="width:320px" prop="stopTime">
		          {{params.stopTime}}分钟
		        </el-form-item>
		        <el-form-item label="渠道退票时间" style="width:320px" prop="refundTime">
		          	{{params.refundTime}}分钟
		        </el-form-item>
		    </div>

		    <div>
		        <el-form-item label="请求超时时间" style="width:320px" prop="requestOverTime">
		          	{{params.requestOverTime}}秒
		        </el-form-item>
		        <el-form-item label="响应超时时间" style="width:320px" prop="responseOverTime">
		          	{{params.responseOverTime}}秒
		        </el-form-item>
		        <el-form-item label="更新排期场次" style="width:320px" prop="responseOverTime">
		          	{{params.responseOverTime}}分钟
		        </el-form-item>
		    </div>

		    <div v-if="params.type === '1'">
		        <el-form-item label="客服电话">         
		            <div class="menu-checkbox-plane">
		              <div class="header">
		                <el-radio-group v-model="params.servicePhone.type" size="medium" style="margin-left:30px">
		                  <el-radio  label="1" disabled>统一方式</el-radio>
		                  <el-radio  label="2" disabled>分终端方式</el-radio>
		                </el-radio-group>
		              </div>
		              <div class="content">
		                <div class="check-item">
		                  <div v-if="params.servicePhone.type === '1'">
		                      <el-input disabled v-model.trim="params.servicePhone.mobile1" placeholder="输入客服电话1" style="width:270px;margin-left:30px"></el-input>
		                      <el-input disabled v-model.trim="params.servicePhone.mobile2" placeholder="输入客服电话2" style="width:270px;margin-left:30px"></el-input>
		                    </div>
		                </div>
		                <div class="check-item">  
		                    <div v-if="params.servicePhone.type === '2'">
		                       <span style="width:250px">微信H5</span>
		                       <el-input disabled v-model.trim="params.servicePhone.list.wap.mobile1" placeholder="输入客服电话1" style="width:270px;margin-left:30px"></el-input>
		                       <el-input disabled v-model.trim="params.servicePhone.list.wap.mobile2" placeholder="输入客服电话2" style="width:270px;margin-left:30px"></el-input>
		                     </div>
		                </div> 
		                <div class="check-item">
		                  <div v-if="params.servicePhone.type === '2'">
		                   <span style="width:250px">移动app</span>
		                   <el-input disabled v-model.trim="params.servicePhone.list.wap.mobile1" placeholder="输入客服电话1" style="width:270px;margin-left:30px"></el-input>
		                   <el-input disabled v-model.trim="params.servicePhone.list.wap.mobile2" placeholder="输入客服电话2" style="width:270px;margin-left:30px"></el-input>
		                 </div> 
		                </div>
		                <div class="check-item">
		                  <div v-if="params.servicePhone.type === '2'">
		                   <span style="width:250px">小程序</span>
		                   <el-input disabled v-model.trim="params.servicePhone.list.wap.mobile1" placeholder="输入客服电话1" style="width:270px;margin-left:30px"></el-input>
		                   <el-input disabled v-model.trim="params.servicePhone.list.wap.mobile2" placeholder="输入客服电话2" style="width:270px;margin-left:30px"></el-input>
		                 </div> 
		                </div>              
		              </div>
		            </div>
		        </el-form-item>        
		    </div>
		    <div v-if="params.type === '1'">
		        <el-form-item label="票价单位选择" prop="ticketPriceUnit"> 
		              <el-radio-group v-model="params.ticketPriceUnit" size="medium" style="margin-left:30px" >
		                <el-radio  label="2" disabled>点</el-radio>
		                <el-radio  label="3" disabled>积分</el-radio>
		                <el-radio  label="1" disabled>元</el-radio>
		              </el-radio-group>
		        </el-form-item>        
		      </div>
		      <div v-if="params.type === '1'">
		        <el-form-item v-if="params.ticketPriceUnit !== '1'" label="电影票价转化" prop="ticketPriceMoney"> 
		            {{params.ticketPriceMoney}} : {{params.ticketPriceChange}}
		        </el-form-item>  
		        <el-form-item label="上传商家图标"> 
		            <pic-upload v-model="params.logo" disabled></pic-upload>
		        </el-form-item>        
		    </div>
	   </el-form>
	</el-card>

    <el-card v-if="params.type === '1'" style="margin-top:10px">
	    <div slot="header">
	        <span>商家功能开通</span>
	    </div>  
	      <el-form label-width="120px" label-position="left" style="width:1000px;" ref="form2">
	          <div class="form-item-row">
	            <el-form-item label="支持系统功能" prop="interfaceAction"> 
	              <div class="menu-checkbox-plane">              
	                  <div class="content">
	                    <div class="check-item">
	                        <el-checkbox-group class="el-checkbox-group" v-model="selectedInterfaceActionList">                      
	                          <ul class="ul">
	                            <li class="ul-li">
	                              <el-checkbox label="-1" disabled>全选</el-checkbox>
	                            </li>
	                            <li class="ul-li" v-for="(el,index) in interfaceActionList" :key="index">
	                              <el-checkbox :label="el.action" disabled>{{el.actionName}}
	                              </el-checkbox>
	                            </li>
	                          </ul>   
	                        </el-checkbox-group>
	                    </div>
	                  </div>
	                </div>
	            </el-form-item>        
	          </div>
	          
	          <div class="form-item-row navMenu">
	            <el-form-item label="导航菜单管理" prop="bottomMenu"> 
	              <el-card shadow="never">
	                  <div slot="header" style="height:20px;line-height: 20px;">
	                      <el-radio-group v-model="bottomMenu.type">
	                        <el-radio  label="1" disabled>文字+图标模式</el-radio>
	                        <el-radio label="2" disabled>大图标模式(仅显示菜单名字,推荐配合活动使用)</el-radio>
	                      </el-radio-group>
	                  </div> 
	                  <div>
	                     <el-container v-for="menu in bottomMenuList" :key="menu.action">
	                        <el-aside style="width:100px">
	                            <el-checkbox disabled v-model="menu.checked">{{menu.actionName}}</el-checkbox>
	                        </el-aside>
	                        <el-main style="padding:0">
	                            <el-row>
	                              <el-col v-if="bottomMenu.type === '1'">传导航图标：图片比例1:1 大小建议44*44</el-col>
	                              <el-col v-if="bottomMenu.type === '2'">传导航图标：图片比例1:1 大小建议60*60</el-col>
	                            </el-row>
	                            <el-row>
	                              <el-col style="width:30%">
	                                <span style="float:left;margin-right:20px;line-height: 40px;">未选中状态</span> 
	                                <pic-upload v-model="menu.unCheckImg" classSize="small" disabled></pic-upload>
	                              </el-col>
	                              <el-col style="width:30%">
	                                <span style="float:left;margin-right:20px;line-height: 40px;">选中状态</span> 
	                                <pic-upload v-model="menu.checkImg" classSize="small" disabled></pic-upload>
	                              </el-col>
	                            </el-row>
	                        </el-main>
	                      </el-container>
	                  </div>
	              </el-card>
	            </el-form-item>        
	          </div>
	      </el-form>
    </el-card>
	<el-card  v-if="params.type === '1'" style="margin-top:10px">
      <div slot="header">
          <span>商家收银台配置</span>
      </div>
      <!-- <el-button>微信H5</el-button> -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="微信H5" name="wap"></el-tab-pane>
        <el-tab-pane label="移动APP" name="app"></el-tab-pane>        
        <el-tab-pane label="小程序" name="minApp"></el-tab-pane>
      </el-tabs>
      <el-form label-width="0px" ref="form3">
        <el-form-item  style="width:1021px" prop="payTypeDetail" v-show="activeName==='app'">          
          <el-table border :data="payTypeList['app']" ref="appTable">
              <el-table-column width="150"  label="购物流程" align="center" prop="name" >
              </el-table-column>
              <el-table-column width="750"  label="支付方式" header-align="center" align="left" >
                 <template slot-scope="{row}">
                      <ul class="ul">
                        <el-checkbox-group v-model="params.payTypeDetail.app[row.value]">
                          <li class="ul-li">
                            <el-checkbox :label="'-1'" v-model="appCheckAll" disabled>全选</el-checkbox>
                          </li>
                          <li class="ul-li" v-for="payType in row.payTypeList" :key="payType.payCode">
                            <el-checkbox :label="payType.payCode" disabled>{{payType.payName}}</el-checkbox>
                          </li>
                        </el-checkbox-group>
                      </ul>
                 </template>
              </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item  style="width:1021px" prop="payTypeDetail" v-show="activeName==='wap'">
          <el-table border :data="payTypeList['wap']" ref="table">
              <el-table-column width="150"  label="购物流程" align="center" prop="name" ></el-table-column>
              <el-table-column width="750"  label="支付方式" header-align="center" align="left" >
                 <template slot-scope="{row}">
                      <ul class="ul">
                        <el-checkbox-group v-model="params.payTypeDetail.wap[row.value]">
                          <li class="ul-li">
                            <el-checkbox :label="'-1'" v-model="wapCheckAll" disabled>全选</el-checkbox>
                          </li>
                          <li class="ul-li" v-for="payType in row.payTypeList" :key="payType.payCode">
                            <el-checkbox :label="payType.payCode" disabled>{{payType.payName}}</el-checkbox>
                          </li>
                        </el-checkbox-group>
                      </ul>
                 </template>
              </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item  style="width:1021px" prop="payTypeDetail" v-show="activeName==='minApp'">
          <el-table border :data="payTypeList['minApp']" ref="table">
              <el-table-column width="150"  label="购物流程" align="center" prop="name" ></el-table-column>
              <el-table-column width="750"  label="支付方式" header-align="center" align="left" >
                 <template slot-scope="{row}">
                      <ul class="ul">
                        <el-checkbox-group v-model="params.payTypeDetail.minApp[row.value]">
                          <li class="ul-li">
                            <el-checkbox :label="'-1'" v-model="minAppCheckAll" disabled>全选</el-checkbox>
                          </li>
                          <li class="ul-li" v-for="payType in row.payTypeList" :key="payType.payCode">
                            <el-checkbox :label="payType.payCode" disabled>{{payType.payName}}</el-checkbox>
                          </li>
                        </el-checkbox-group>
                      </ul>
                 </template>
              </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <div style="margin-left:30%;margin-top:20px;">
      <el-button @click="closeTab" >取消</el-button>
    </div> -->
  </div>
</template>

<script>
	import { getChannelInfo, getInterfaceActionList, getIntegralPlatformEditionList, getBottomMenuList, getPayTypeList } from '@/api/mallCenter'
export default {
  name: 'view_channel',
  data() {
    return {
      params: {

      },
      servicePhone: {
        type: '1',
        list: {
          wap: {}
        }
      },
      bottomMenu: {
        type: '1'
      },
      activeName: 'wap',
      appCheckAll: false,
      wapCheckAll: false,
      minAppCheckAll: false,
      interfaceActionList: [],
      integralPlatform: [],
      bottomMenuList: [],
      payTypeList: [],
      selectedInterfaceActionList: []
    }
  },
  async created() {
    this.params = await getChannelInfo(this.$route.query.id)

    this.interfaceActionList = await getInterfaceActionList()
    // 积分平台商户
    this.integralPlatform = await getIntegralPlatformEditionList()

    this.bottomMenuList = await getBottomMenuList()

    this.payTypeList = await getPayTypeList()

    this.selectedInterfaceActionList = this.params.interfaceAction.split(',').filter(e => e)
    this.selectedIntegralPlatform = this.params.integralPlatform.split(',').filter(e => e)
    if (!this.params.payTypeDetail) {
      this.$set(this.params, 'payTypeDetail', {
        wap: {
          payTicket: [],
          payCoupon: [],
          payRecharge: []
        },
        app: {
          payTicket: [],
          payCoupon: [],
          payRecharge: []
        },
        minApp: {
          payTicket: [],
          payCoupon: [],
          payRecharge: []
        }
      })
    }
    if (!this.params.payTypeDetail.wap) {
      this.$set(this.params.payTypeDetail, 'wap', {
        payTicket: [],
        payCoupon: [],
        cardRecharge: []
      })
    }
    if (!this.params.payTypeDetail.app) {
      this.$set(this.params.payTypeDetail, 'app', {
        payTicket: [],
        payCoupon: [],
        cardRecharge: []
      })
    }
    if (!this.params.payTypeDetail.minApp) {
      this.$set(this.params.payTypeDetail, 'minApp', {
        payTicket: [],
        payCoupon: [],
        cardRecharge: []
      })
    }

    if (this.params.bottomMenu.list) {
      this.bottomMenuList.forEach(e => {
        const temp = this.params.bottomMenu.list[e.action]
        if (temp) {
          e.checked = true
          e.checkImg = this.params.bottomMenu.list[e.action].checkImg
          e.unCheckImg = this.params.bottomMenu.list[e.action].unCheckImg
        } else {
          e.checked = false
        }
      })
    }
    // 导航菜单管理中：电影、影院、我的，这三个是固定默认已经勾选上且不能取消勾选的
    this.bottomMenuList.forEach(e => {
      if (e.action === 'film' || e.action === 'cinema' || e.action === 'member') {
        e.checked = true
        e.disabled = true
      }
    })
  }
}
</script>

<style scoped lang="scss">
.el-checkbox-group{
  width: 100%
}
//没有点的List
.no-point-li{
  list-style:none;
}
.ul{
display:block;
  width:100%;
  padding:0;
}
.ul-li{
  width:25%;
  display:inline-block
}

.menu-checkbox-plane{
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
}
.header{
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #F2F6FC;
  padding: 0 20px;
  border-bottom:  1px solid #DCDFE6;
}
.content{
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  .check-item{
    display: flex;
    width: 120px;
    margin-bottom: 10px;
    margin-left: 20px;
    width: 100%
  }
}
.avatar-uploader-icon{
  font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.textStyle {
  font-size:12px;
  color:#dddddd;
  div{
    line-height:18px !important;
  }
}
.textBule{
  color:#888888;
  font-weight:600;
}

</style>

<style>
  /* .inner-item{
    margin-bottom: 20px !important;
    display: block;
  }
  .inner-item .el-form-item__content{
      display: flex;
    } */
</style>