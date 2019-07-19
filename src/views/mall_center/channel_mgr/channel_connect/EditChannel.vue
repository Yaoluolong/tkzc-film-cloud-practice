<template>
  <div class="app-container">

<el-card class="box-card">
  <div slot="header">
    <span>平台商家基础信息</span>
  </div>  
  <el-form label-width="120px" label-position="left"  style="width:1000px;" :model="params" :rules="rules" ref="form">
      <!-- <div class="form-item-row"> -->
        <el-form-item label="商家名称" prop="name" >
          <el-input v-model.trim="params.name" placeholder="请输入渠道商名称,最多20个字" style="width:320px"></el-input>
        </el-form-item>
        <el-form-item label="平台商家类型"  prop="type">
          <el-radio-group v-model="params.type" size="medium" @change="deviceChange">
            <el-radio label="1" :disabled="$route.query.id && params.type !== '1'">自营</el-radio>
            <el-radio label="2" :disabled="$route.query.id && params.type !== '2'">加盟</el-radio>
           </el-radio-group>
        </el-form-item>
      <!-- </div> -->
        <!-- <div class="form-item-row"> -->
          <!-- <el-form-item label="消费终端" prop="deviceCode">
            <remote-select v-model="params.deviceCode" placeholder="请选择消费终端" action="/systemApi/consumerTerminal/getList"  :query="{channelType:'1'}" style="width:320px"></remote-select>            
          </el-form-item> -->
          <el-form-item label="消费终端" prop="deviceCode"> 
            <el-select v-model="params.deviceCode" placeholder="请选择消费终端" style="width:320px">
              <el-option
                v-for="item in deviceCodeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>  
          <el-form-item label="请求平台接口" prop="requestUrl">
            <el-input v-model.trim="params.requestUrl"  type="textarea" style="width:620px" :rows="6"  placeholder="请输入该渠道商分配的接口地址以及请求参数,便于实施运维" ></el-input>
          </el-form-item>  
        <!-- </div> -->
      <!-- <div class="form-item-row"> -->
        <el-form-item label="获取退款通知" style="width:320px" prop="refundNotifyUrl" v-if="params.type==2">
          <el-input v-model.trim="params.refundNotifyUrl"  placeholder="输入用于获取退款消息通知的接口地址"  style="width:620px"></el-input>
        </el-form-item>
        <el-form-item label="渠道商账号" style="width:320px" prop="channelAccount">
          <el-input v-model.trim="params.channelAccount"  placeholder="请输入渠道商账号" ></el-input>
        </el-form-item>
        <el-form-item label="渠道商密码" style="width:320px" prop="password">
          <el-input v-model.trim="params.password"   placeholder="请输入渠道商密码" ></el-input>
        </el-form-item>
      <!-- </div> -->
    
    <div v-if="params.type === '2'">
        <el-form-item label="渠道停售时间" style="width:320px" prop="stopTime">
          <tip content="开映前影片排期停止售卖的时间限制，可不配置以影院为准" >
            <el-input v-model.trim="params.stopTime"  placeholder="请输入渠道停售时间" >
              <template slot="append">分钟</template>
            </el-input>
          </tip>
        </el-form-item>
        <el-form-item label="渠道退票时间" style="width:320px" prop="refundTime">
          <tip content="开映前允许退票时间限制！">
            <el-input v-model.trim="params.refundTime"   placeholder="请输入渠道退票时间" >
              <template slot="append">分钟</template>
            </el-input>
          </tip>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="请求超时时间" style="width:320px" prop="requestOverTime">
          <tip content="请求平台接口以及票务系统商超过设置的时间判断为请求超时，重新请求！" >
            <el-input v-model.trim="params.requestOverTime"  placeholder="请输入请求超时时间" >
              <template slot="append">秒</template>
            </el-input>
          </tip>
        </el-form-item>
        <el-form-item label="响应超时时间" style="width:320px" prop="responseOverTime">
          <tip content="平台接口响应以及票务系统商响应超过设置的时间判断为响应超时，重新发送响应请求！" >
            <el-input v-model.trim="params.responseOverTime"   placeholder="请输入响应超时时间" >
              <template slot="append">秒</template>
            </el-input>
          </tip>
        </el-form-item>
        <el-form-item label="更新排期场次" style="width:320px" prop="renewPlanTime">
          <tip content="根据填写的时间系统自动进行刷新商家的可售影院排期场次！" >
            <el-input v-model.trim="params.renewPlanTime"   placeholder="请输入排期场次时间" >
              <template slot="append">分钟</template>
            </el-input>
          </tip>
        </el-form-item>
        <el-form-item label="定价方式" style="width:320px" prop="pricingType">
          <el-radio-group v-model="params.pricingType">
            <el-radio v-for="(item,index) in CHANNEL_AUTO_PRICE_TYPES" :key="index" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="技术服务费" style="width:320px" prop="technicalServiceFee">
          <el-input v-model.trim="params.technicalServiceFee" placeholder="0.00"></el-input>
        </el-form-item>     
      </div>
      
      <el-form-item label="商家结算方式" prop="serviceSettled" style="width:430px" v-if="params.type === '2'">
        <tip content="涉及财务中心票务订单导出数据的展示，以及后期与商家结算时的依据。">
          <el-radio-group v-model="params.serviceSettled" size="medium">
            <el-radio  label="0">按平台方传送价格</el-radio>
            <el-radio  label="1">按商家方回传价格</el-radio>
          </el-radio-group>
        </tip>
      </el-form-item>

      <div v-if="params.type === '1'">
        <el-form-item label="客服电话" prop="servicePhone" required>         
            <div class="menu-checkbox-plane">
              <div class="header">
                <el-radio-group v-model="params.servicePhone.type" size="medium" style="margin-left:30px">
                  <el-radio  label="1">统一方式</el-radio>
                  <el-radio  label="2">分终端方式</el-radio>
                </el-radio-group>
              </div>
              <div class="content">
                <div class="check-item">
                  <div v-if="params.servicePhone.type === '1'">
                      <el-input v-model.trim="params.servicePhone.mobile1" placeholder="输入客服电话1" style="width:270px;margin-left:30px"></el-input>
                      <el-input v-model.trim="params.servicePhone.mobile2" placeholder="输入客服电话2" style="width:270px;margin-left:30px"></el-input>
                    </div>
                </div>
                <div class="check-item">  
                    <div v-if="params.servicePhone.type === '2'">
                       <span style="width:250px">微信H5</span>
                       <el-input v-model.trim="params.servicePhone.list.wap.mobile1" placeholder="输入客服电话1" style="width:270px;margin-left:30px"></el-input>
                       <el-input v-model.trim="params.servicePhone.list.wap.mobile2" placeholder="输入客服电话2" style="width:270px;margin-left:30px"></el-input>
                     </div>
                </div> 
                <div class="check-item">
                  <div v-if="params.servicePhone.type === '2'">
                   <span style="width:250px">移动app</span>
                   <el-input v-model.trim="params.servicePhone.list.app.mobile1" placeholder="输入客服电话1" style="width:270px;margin-left:30px"></el-input>
                   <el-input v-model.trim="params.servicePhone.list.app.mobile2" placeholder="输入客服电话2" style="width:270px;margin-left:30px"></el-input>
                 </div> 
                </div>
                <div class="check-item">
                  <div v-if="params.servicePhone.type === '2'">
                   <span style="width:250px">小程序</span>
                   <el-input v-model.trim="params.servicePhone.list.web.mobile1" placeholder="输入客服电话1" style="width:270px;margin-left:30px"></el-input>
                   <el-input v-model.trim="params.servicePhone.list.web.mobile2" placeholder="输入客服电话2" style="width:270px;margin-left:30px"></el-input>
                 </div> 
                </div>              
              </div>
            </div>
        </el-form-item>        
      </div>
      <div v-if="params.type === '1'">
        <el-form-item label="票价单位选择" prop="ticketPriceUnit"> 
              <el-radio-group v-model="params.ticketPriceUnit" size="medium" style="margin-left:30px" >
                <el-radio  label="2">点</el-radio>
                <el-radio  label="3">积分</el-radio>
                <el-radio  label="1">元</el-radio>
              </el-radio-group>
        </el-form-item>        
      </div>
      <div v-if="params.type === '1'">
        <el-form-item v-if="params.ticketPriceUnit !== '1'" label="电影票价转化" prop="ticketPriceMoney"> 
           <tip content="电影票价在页面展示的方式，例如：1元：10点，那么32元展示的就是320点" style="width:350px">
              <el-input  v-model.trim="params.ticketPriceMoney" placeholder="票价单位元金额" style="width:145px;"></el-input> &nbsp;  :   &nbsp;
              <el-input v-if="params.ticketPriceUnit === '2'" v-model.trim="params.ticketPriceChange" placeholder="票价单位点金额" style="width:145px;"></el-input>
              <el-input v-if="params.ticketPriceUnit === '3'" v-model.trim="params.ticketPriceChange" placeholder="票价单位积分金额" style="width:145px;"></el-input>
            </tip>
        </el-form-item>  
        <el-form-item label="上传商家图标"> 
            <tip content="该图标用户商家C端登入界面以及积分平台兑换界面使用！" style="width:310px">
              <pic-upload content="（比例1:1，尺寸：60*60）" v-model="params.logo"></pic-upload>
            </tip>
        </el-form-item>        
      </div>

 
      
    </el-form>
</el-card>
    <!-- =============================================商家功能开通================================================== -->

    <el-card v-if="params.type === '1'" style="margin-top:10px">
    <div slot="header">
        <span>商家功能开通</span>
    </div>  
      <el-form label-width="120px" label-position="left" style="width:1000px;" ref="form2">
          <!-- <div class="form-item-row">
            <el-form-item label="支持系统功能" prop="interfaceAction"> 
              <div class="menu-checkbox-plane">              
                  <div class="content">
                    <div class="check-item">
                        <el-checkbox-group class="el-checkbox-group" v-model="selectedInterfaceActionList" @change="selectchildInterfaceAction">                      
                          <ul class="ul">
                            <li class="ul-li">
                              <el-checkbox label="-1" @change="selectAllInterfaceAction">全选</el-checkbox>
                            </li>
                            <li class="ul-li" v-for="(el,index) in interfaceActionList" :key="index">
                              <el-checkbox :label="el.action">{{el.actionName}}
                              </el-checkbox>
                            </li>
                          </ul>   
                        </el-checkbox-group>
                    </div>
                  </div>
                </div>
            </el-form-item>        
          </div> -->
          
          <!-- <div class="form-item-row">
            <el-form-item label="选择积分平台" prop="integralPlatform"> 
              <div class="menu-checkbox-plane">              
                  <div class="content">
                    <div class="check-item">
                        <el-checkbox-group class="el-checkbox-group" v-model="selectedIntegralPlatform">                      
                          <ul class="ul">
                            <li class="ul-li">
                              <el-checkbox label="-1" @change="selectAllIntegralPlatform">全选</el-checkbox>
                            </li>
                            <li class="ul-li" v-for="(el,index) in integralPlatform" :key="index">
                              <el-checkbox :label="el.value">{{el.name}}
                              </el-checkbox>
                            </li>
                          </ul>   
                        </el-checkbox-group>
                    </div>
                  </div>
                </div>
            </el-form-item>        
          </div> -->

          <div class="form-item-row navMenu">
            <el-form-item label="导航菜单管理" prop="bottomMenu"> 
              <el-card shadow="never">
                  <div slot="header" style="height:20px;line-height: 20px;">
                      <el-radio-group v-model="bottomMenu.type">
                        <el-radio  label="1">文字+图标模式</el-radio>
                        <el-radio label="2">大图标模式(仅显示菜单名字,推荐配合活动使用)</el-radio>
                      </el-radio-group>
                  </div> 
                  <div>
                     <el-container v-for="menu in bottomMenuList" :key="menu.action">
                        <el-aside style="width:100px">
                            <el-checkbox @change="$forceUpdate()" :disabled="menu.disabled" v-model="menu.checked">{{menu.actionName}}</el-checkbox>
                        </el-aside>
                        <el-main style="padding:0">
                            <el-row>
                              <el-col v-if="bottomMenu.type === '1'">传导航图标：图片比例1:1 大小建议44*44</el-col>
                              <el-col v-if="bottomMenu.type === '2'">传导航图标：图片比例1:1 大小建议60*60</el-col>
                            </el-row>
                            <el-row>
                              <el-col style="width:30%">
                                <span style="float:left;margin-right:20px;line-height: 40px;">未选中状态</span> 
                                <pic-upload v-model="menu.unCheckImg" classSize="small"></pic-upload>
                              </el-col>
                              <el-col style="width:30%">
                                <span style="float:left;margin-right:20px;line-height: 40px;">选中状态</span> 
                                <pic-upload v-model="menu.checkImg" classSize="small"></pic-upload>
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
      <el-form label-width="120px" label-position="left" style="width:1000px;" ref="form4">
        <el-form-item label="收银台类型：" prop="cashierType"> 
          <el-radio-group v-model="params.cashierType" size="medium" :disabled="$route.query.id>0">
            <el-radio label="1">自由平台收银台</el-radio>
            <el-radio label="2">第三方平台收银台</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div v-if="params.cashierType==='1'">
        <el-form label-width="120px" label-position="left" style="width:1000px;" ref="form5">
          <div class="form-item-row">
            <el-form-item label="支持系统功能" prop="interfaceAction"> 
              <div class="menu-checkbox-plane">              
                  <div class="content">
                    <div class="check-item">
                        <el-checkbox-group class="el-checkbox-group" v-model="selectedInterfaceActionList" @change="selectchildInterfaceAction">                      
                          <ul class="ul">
                            <li class="ul-li">
                              <el-checkbox label="-1" @change="selectAllInterfaceAction">全选</el-checkbox>
                            </li>
                            <li class="ul-li" v-for="(el,index) in interfaceActionList" :key="index">
                              <el-checkbox :label="el.action">{{el.actionName}}
                              </el-checkbox>
                            </li>
                          </ul>   
                        </el-checkbox-group>
                    </div>
                  </div>
                </div>
            </el-form-item>        
          </div>
        </el-form>
        
        <!-- <el-button>微信H5</el-button> -->
        <el-tabs v-model="activeName" type="card" @tab-click="handleActiveClick" style="margin-left:120px;">
          <el-tab-pane label="微信H5" name="wap"></el-tab-pane>
          <el-tab-pane label="移动APP" name="app"></el-tab-pane>        
          <el-tab-pane label="小程序" name="minApp"></el-tab-pane>
        </el-tabs>
        <el-form label-width="120px" ref="form3">
          <el-form-item  style="width:1021px" prop="payTypeDetail" v-show="activeName==='app'">          
            <el-table border :data="payTypeList['app']" ref="appTable">
                <el-table-column width="150"  label="购物流程" align="center" prop="name" >
                </el-table-column>
                <el-table-column width="750"  label="支付方式" header-align="center" align="left" >
                   <template slot-scope="{row}">
                        <ul class="ul">
                          <el-checkbox-group v-model="params.payTypeDetail.app[row.value]" @change="checkedItemChange(row)">
                            <li class="ul-li">
                              <el-checkbox @change="slelectAllPayType(row)" :label="'-1'" v-model="appCheckAll">全选</el-checkbox>
                            </li>
                            <li class="ul-li" v-for="payType in row.payTypeList" :key="payType.payCode">
                              <el-checkbox :label="payType.payCode">{{payType.payName}}</el-checkbox>
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
                          <el-checkbox-group v-model="params.payTypeDetail.wap[row.value]" @change="checkedItemChange(row)">
                            <li class="ul-li">
                              <el-checkbox @change="slelectAllPayType(row)" :label="'-1'" v-model="wapCheckAll">全选</el-checkbox>
                            </li>
                            <li class="ul-li" v-for="payType in row.payTypeList" :key="payType.payCode">
                              <el-checkbox :label="payType.payCode">{{payType.payName}}</el-checkbox>
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
                          <el-checkbox-group v-model="params.payTypeDetail.minApp[row.value]" @change="checkedItemChange(row)">
                            <li class="ul-li">
                              <el-checkbox @change="slelectAllPayType(row)" :label="'-1'" v-model="minAppCheckAll">全选</el-checkbox>
                            </li>
                            <li class="ul-li" v-for="payType in row.payTypeList" :key="payType.payCode">
                              <el-checkbox :label="payType.payCode">{{payType.payName}}</el-checkbox>
                            </li>
                          </el-checkbox-group>
                        </ul>
                   </template>
                </el-table-column>
            </el-table>
          </el-form-item>
          <!-- <el-form-item label-width="165px" label="电影卡--点卡消费比例：" prop="rate">
              <el-input v-model="params.price" placeholder="票价金额单位元" style="width:140px;"></el-input>    比
              <el-input v-model="params.point" placeholder="卡内金额单位点" style="width:140px;"></el-input>
              <p style="color:#dddddd;">每次使用卡内金额点数的时候可以抵扣多少票价金额</p>
          </el-form-item>
          <el-form-item label-width="142px" label="是否支持叠加支付：" prop=""  style="width:310px;">
            <tip content="默认不支持，也就是所有的支付方式都是独立的！">
              <el-radio-group v-model="params.isFreePayType">
                <el-radio  label="1">不支持</el-radio>
                <el-radio label="2">支持</el-radio>
              </el-radio-group>
            </tip>
          </el-form-item>
          <el-form-item class="textStyle">
            <div>【关于叠加支付的说明】</div>
            <div class="textBule">支付优先级分层：</div>
            <div>第一级：券，优惠券和兑换券，优惠券优先级最高，一笔订单只能用一张优惠券，可以用多张兑换券，但优惠券和兑换券不能同时使用。</div>
            <div>第二级：电影卡/积分，这一层级属于预充值的抵扣，电影卡不足可选择充值，本期暂无积分暂不考虑</div>
            <div>第三级：现金支付，微信或银联，支付剩余座位的订单金额。</div>
            <div>消费时按这个优先级排序。</div>
            <div class="textBule">支付方式描述：</div>
            <div>针对订单中<span class="textBule">单张座位的票价（或1笔订单只有1张影票时）</span>进行判断，订单中<span class="textBule">单张座位票价的支付组合</span>只存在如下可能：</div>
            <div>A：优惠券+电影卡支付（单张票价-优惠券优惠金额）支付1张票价，余额不足可充值，不充值不能用电影卡；</div>
            <div>B：优惠券+现金支付（单张票价-优惠券优惠金额），支付1张票价；</div>
            <div>C：1张符合使用条件的兑换券直接兑换1张影票；</div>
            <div>D：电影卡全额支付1张票价，余额不足需充值，不充值不能用；</div>
            <div>E：现金全额支付1张票价。</div>
            <div>综上，<span class="textBule">1笔订单中影票数量为N张，N≥2，订单总金额支付</span>存在如下支付可能：</div>
            <div>前置条件：优惠券与兑换券不能再同一笔订单中同时使用；优先使用优惠券和兑换券。</div>
            <div>使用优惠券时，最终这笔订单存在<span class="textBule">A+D、A+E、A+D+E</span>三种叠加支付方式。</div>
            <div>使用兑换券时，最终这笔订单存在<span class="textBule">C、C+D、C+E、C+D+E</span>四中叠加支付方式。</div>
            <div>未使用任何券时，最终这笔订单存在<span class="textBule">D、E</span>两种支付方式。</div>
            <div>未使用券、卡，这笔订单只存在<span class="textBule">现金全额</span>支付的方式。</div>
            <div>系统<span class="textBule">默认选择好</span>优惠券及电影卡的优先组合，优惠券优先选择最优惠的券，兑换券优先选择快过期的券，卡优先选择余额充足的卡，用户可手动切换券卡或取消选择券卡。</div>
          
          </el-form-item> -->
        </el-form>
      </div>
      <div v-else>
        <el-form label-width="200px" label-position="left" style="width:1000px;" :model="form6Params" :rules="form6Rules" ref="form6">
          <el-form-item label="支持系统功能：" prop="supportContent">
            <el-radio label="1" checked disabled v-model="form6Params.supportContent">电影订单</el-radio>
          </el-form-item>
          <el-form-item label="第三方平台支付名称：" prop="thirdPlatformPayName">
            <el-input placeholder="输入支付名称,最多20个字符" :maxlength="20" style="width:300px;" v-model="form6Params.thirdPlatformPayName"></el-input>
          </el-form-item>
          <el-form-item label="第三方收银台类：" prop="thirdCashierType">
            <remote-select v-model="form6Params.thirdCashierType"  placeholder="请选择联名登录平台" action="systemApi/channel/getCashierList" :query="{}" style="width:200px;"></remote-select>
          </el-form-item>
          <el-form-item label="上传第三方平台支付图标：" prop="thirdPlatformPayLogo">
            <pic-upload content="（比例1:1，尺寸：44*44）" v-model="form6Params.thirdPlatformPayLogo"></pic-upload>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div style="margin-left:30%;margin-top:20px;">
      <el-button type="primary" @click="save" v-if="!look">保存</el-button>
      <el-button @click="closeTab" >取消</el-button>
    </div>
    
  </div>
</template>

<script>
import { createChannel, updateChannel, getChannelInfo, getInterfaceActionList, getIntegralPlatformEditionList, getBottomMenuList, getPayTypeList, deviceChange } from '@/api/mallCenter'
import { realDeepClone, objectMerge } from '@/utils'
import { CHANNEL_AUTO_PRICE_TYPES } from '@/model/type'
import { STRING_NUMBER } from '@/utils/validate'
export default {
  name: 'edit_channel',
  data() {
    // const checkServicePhone = (rule, value, cb) => {
    //   if (this.params.servicePhone.type === '1') {
    //     if (!this.params.servicePhone.mobile1 && !this.params.servicePhone.mobile2) {
    //       cb(new Error('请输入客服电话'))
    //     }
    //   }
    //   if (this.params.servicePhone.type === '2') {
    //     if (!this.params.servicePhone.list.wap.mobile1 && !this.params.servicePhone.list.wap.mobile2) {
    //       cb(new Error('请输入客服电话'))
    //     }
    //   }
    //   cb()
    // }
    const checkTicketPriceMoney = (rule, value, cb) => {
      if (this.params.ticketPriceUnit !== '1') {
        if (!this.params.ticketPriceMoney || !this.params.ticketPriceChange) {
          cb(new Error('请设置电影票价转化'))
        }
      }
      cb()
    }
    const checkInterfaceAction = (rule, value, cb) => {
      if (!this.selectedInterfaceActionList || this.selectedInterfaceActionList.length === 0) {
        cb(new Error('请设置支持系统功能'))
      }
      cb()
    }
    const checkIntegralPlatform = (rule, value, cb) => {
      if (!this.selectedIntegralPlatform || this.selectedIntegralPlatform.length === 0) {
        cb(new Error('请选择积分平台'))
      }
      cb()
    }
    return {
      CHANNEL_AUTO_PRICE_TYPES,
      params: {
        name: '',
        deviceCode: '',
        requestUrl: '',
        refundMsg: '',
        channelAccount: '',
        password: '',
        stopTime: '',
        refundTime: '',
        requestOverTime: '',
        responseOverTime: '',
        ticketPriceMoney: '',
        logo: '',
        type: '1',
        servicePhone: {
          type: '1',
          list: {
            wap: {},
            app: {},
            web: {}
          }
        },
        ticketPriceUnit: '1',
        debug: '2',
        payTypeDetail: {
          app: {
            payTicket: [],
            payCoupon: [],
            cardRecharge: []
          },
          wap: {
            payTicket: [],
            payCoupon: [],
            cardRecharge: []
          },
          minApp: {
            payTicket: [],
            payCoupon: [],
            cardRecharge: []
          }
        },
        renewPlanTime: '',
        price: '',
        point: '',
        isFreePayType: '1',
        serviceSettled: '0',
        cashierType: '1',
        pricingType: '1',
        technicalServiceFee: '0.00'
      },
      form6Params: {
        supportContent: '1',
        thirdPlatformPayName: '',
        thirdCashierType: '',
        thirdPlatformPayLogo: ''
      },
      bottomMenu: {
        type: '1'
      },
      interfaceActionList: [], // 支持系统功能
      selectedInterfaceActionList: [], // 已选的系统功能
      integralPlatform: [], // 所有积分平台
      selectedIntegralPlatform: [], // 已经选择的积分平台
      bottomMenuList: [], // 所有导航菜单
      selectedNottomMenuList: [], // 已经选择的导航菜单
      payTypeList: [],
      selectedPayTypeList: [],
      activeName: 'wap',
      appCheckAll: false,
      wapCheckAll: '',
      minAppCheckAll: false,
      deviceCodeOptions: [],
      rules: {
        name: { required: true, max: 20, message: '请输入渠道商名称,最多20个字', trigger: 'blur' },
        type: { required: true, message: '请选择渠道类型', trigger: 'change' },
        deviceCode: { required: true, message: '请选择消费终端', trigger: 'change' },
        channelAccount: { required: true, message: '请输入渠道商账号', trigger: 'blur' },
        password: { required: true, message: '请输入渠道商密码', trigger: 'blur' },
        requestOverTime: { required: true, message: '请输入请求超时时间', trigger: 'blur' },
        responseOverTime: { required: true, message: '请输入响应超时时间', trigger: 'blur' },
        // servicePhone: { validator: checkServicePhone, trigger: 'blur' }, // 需要自己验证方法
        ticketPriceUnit: { required: true, message: '请选择票价单位选择', trigger: 'change' },

        ticketPriceMoney: { validator: checkTicketPriceMoney, trigger: 'blur' }, // 需要自己验证方法
        requestUrl: { required: true, message: '请输入内容', trigger: 'blur' },
        interfaceAction: { validator: checkInterfaceAction, trigger: 'blur' },
        integralPlatform: { validator: checkIntegralPlatform, trigger: 'blur' },
        // bottomMenu: { validator: checkBottomMenu, trigger: 'blur' },
        // payTypeDetail: { validator: checkServicePhone, trigger: 'blur' },
        stopTime: { required: true, message: '请输入渠道停售时间', trigger: 'blur' },
        refundTime: { required: true, message: '请输入渠道退票时间', trigger: 'blur' },
        renewPlanTime: { required: true, message: '请输入更新排期场次', trigger: 'blur' },
        cashierType: { required: true, message: '请选择收银台类型', trigger: 'blur' },
        pricingType: { required: true, message: '请选择定价方式', trigger: 'change' },
        technicalServiceFee: [
          { validator: STRING_NUMBER, trigger: 'blur' }
        ]

      },
      form6Rules: {

        supportContent: { required: true, message: '请选择支持系统功能', trigger: 'blur' },
        thirdPlatformPayName: { required: true, message: '请输入第三方平台支付名称', trigger: 'blur' },
        thirdCashierType: { required: true, message: '请选择第三方收银台类', trigger: 'blur' },
        thirdPlatformPayLogo: { required: true, message: '请上传第三方平台支付图标', trigger: 'blur' }
      },
      isEdit: false
    }
  },
  methods: {
    deviceChange(val) {
      deviceChange({ channelType: val }).then(res => {
        this.params.deviceCode = ''
        this.deviceCodeOptions = res
      })
    },
    selectAllInterfaceAction(val) {
      if (val) {
        this.selectedInterfaceActionList = this.interfaceActionList.map(e => e.action)
        this.selectedInterfaceActionList.push('-1')
      } else {
        this.selectedInterfaceActionList = []
      }
    },
    selectchildInterfaceAction(val) {
      if (this.selectedInterfaceActionList.findIndex(el => el === '-1') === -1 && this.selectedInterfaceActionList.length === this.interfaceActionList.length) {
        this.selectedInterfaceActionList.push('-1')
      } else if (this.selectedInterfaceActionList.findIndex(el => el === '-1') !== -1 && this.selectedInterfaceActionList.length === this.interfaceActionList.length) {
        this.selectedInterfaceActionList.splice(this.selectedInterfaceActionList.findIndex(el => el === '-1'), 1)
      }
    },
    selectAllIntegralPlatform(val) {
      if (val) {
        this.selectedIntegralPlatform = this.integralPlatform.map(e => e.value)
        this.selectedIntegralPlatform.push('-1')
      } else {
        this.selectedIntegralPlatform = []
      }
    },
    slelectAllPayType(row) {
      if (this.activeName === 'app') {
        const temp = this.params.payTypeDetail.app[row.value]
        if (temp.find(e => e === '-1')) {
          this.params.payTypeDetail.app[row.value] = row.payTypeList.map(e => e.payCode)
          this.params.payTypeDetail.app[row.value].push('-1')
        } else {
          this.params.payTypeDetail.app[row.value] = []
        }
      } else if (this.activeName === 'wap') {
        const temp = this.params.payTypeDetail.wap[row.value]
        if (temp.find(e => e === '-1') < 0) {
          this.params.payTypeDetail.wap[row.value] = row.payTypeList.map(e => e.payCode)
          this.params.payTypeDetail.wap[row.value].push('-1')
        } else {
          this.params.payTypeDetail.wap[row.value] = []
        }
      } else if (this.activeName === 'minApp') {
        const temp = this.params.payTypeDetail.minApp[row.value]
        if (temp.find(e => e === '-1')) {
          this.params.payTypeDetail.minApp[row.value] = row.payTypeList.map(e => e.payCode)
          this.params.payTypeDetail.minApp[row.value].push('-1')
        } else {
          this.params.payTypeDetail.minApp[row.value] = []
        }
      }
    },
    handleActiveClick(tab, event) {
      this.$set(this, 'activeName', tab.name)
    },
    checkedItemChange(row) {
      const appValue = this.params.payTypeDetail.app[row.value]
      const wapValue = this.params.payTypeDetail.wap[row.value]
      const minAppValue = this.params.payTypeDetail.minApp[row.value]

      if (this.activeName === 'app' && appValue.findIndex(el => el === '-1') === -1 && appValue.length === row.payTypeList.length) {
        this.params.payTypeDetail.app[row.value].push('-1')
      } else if (this.activeName === 'app' && appValue.findIndex(el => el === '-1') !== -1 && appValue.length === row.payTypeList.length) {
        this.params.payTypeDetail.app[row.value].splice(this.params.payTypeDetail.app[row.value].findIndex(el => el === '-1'), 1)
      }

      if (this.activeName === 'wap' && wapValue.findIndex(el => el === '-1') === -1 && wapValue.length === row.payTypeList.length) {
        this.params.payTypeDetail.wap[row.value].push('-1')
      } else if (this.activeName === 'wap' && wapValue.findIndex(el => el === '-1') !== -1 && wapValue.length === row.payTypeList.length) {
        this.params.payTypeDetail.wap[row.value].splice(this.params.payTypeDetail.wap[row.value].findIndex(el => el === '-1'), 1)
      }

      if (this.activeName === 'minApp' && minAppValue.findIndex(el => el === '-1') === -1 && minAppValue.length === row.payTypeList.length) {
        this.params.payTypeDetail.minApp[row.value].push('-1')
      } else if (this.activeName === 'minApp' && minAppValue.findIndex(el => el === '-1') !== -1 && minAppValue.length === row.payTypeList.length) {
        this.params.payTypeDetail.minApp[row.value].splice(this.params.payTypeDetail.minApp[row.value].findIndex(el => el === '-1'), 1)
      }
    },
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          // 验证是否有选了bottomMenuList(导航菜单管理)
          const request = realDeepClone(this.params)

          if (this.params.type === '1') {
            if (this.selectedInterfaceActionList.findIndex(e => e === '-1') !== -1) {
              const actionArr = this.selectedInterfaceActionList.filter((e) => e !== '-1')
              request.interfaceAction = actionArr.join(',')
            } else {
              request.interfaceAction = this.selectedInterfaceActionList.join(',')
            }

            request.integralPlatform = this.selectedIntegralPlatform.join(',')
            request.bottomMenu = {}
            request.bottomMenu.type = this.bottomMenu.type
            request.bottomMenu.list = {}
            let flag = false
            this.bottomMenuList.forEach(e => {
              if (e.checked) {
                request.bottomMenu.list[e.action] = {}
                if (!e.checkImg || !e.unCheckImg) {
                  flag = true
                }
                request.bottomMenu.list[e.action].checkImg = e.checkImg
                request.bottomMenu.list[e.action].unCheckImg = e.unCheckImg
              }
            })
            if (flag) {
              this.$message.warning('请完善导航菜单')
              return
            }
            for (const key in request.payTypeDetail.app) {
              const appVal = request.payTypeDetail.app[key]
              if (appVal.length === 0 || appVal === 'null') {
                delete request.payTypeDetail.app[key]
              }
            }
            for (const key in request.payTypeDetail.wap) {
              const wapVal = request.payTypeDetail.wap[key]
              if (wapVal.length === 0 || wapVal === 'null') {
                delete request.payTypeDetail.wap[key]
              }
            }
            for (const key in request.payTypeDetail.minApp) {
              const minAppVal = request.payTypeDetail.minApp[key]
              console.log(minAppVal)
              // minAppVal.splice(minAppVal.findIndex(item => item === null), 1)
              /* if (minAppVal.length === 0) {
                delete request.payTypeDetail.minApp[key]
              } else {
                console.log(minAppVal)
                minAppVal.splice(minAppVal.findIndex(item => item === null), 1)
              }*/
            }
            if (request.servicePhone.type === '1') {
              delete request.servicePhone.list
            } else if (request.servicePhone.type === '2') {
              delete request.servicePhone.list.mobile1
              delete request.servicePhone.list.mobile2
            }

            // 清除全选后数组中的-1值
            Object.keys(request.payTypeDetail).forEach(item => {
              Object.keys(request.payTypeDetail[item]).map((e, key) => {
                if (Object.keys(request.payTypeDetail[item][e]).length > 0 && request.payTypeDetail[item][e].findIndex(el => el === '-1') > 0) {
                  request.payTypeDetail[item][e].splice(request.payTypeDetail[item][e].findIndex(el => el === '-1'), 1)
                }
              })
            })
          } else {
            delete request.servicePhone
            delete request.payTypeDetail
          }
          if (request.cashierType === '2') {
            this.$refs.form6.validate(async(valid6) => {
              if (valid6) {
                request.supportContent = this.form6Params.supportContent
                request.thirdPlatformPayName = this.form6Params.thirdPlatformPayName
                request.thirdCashierType = this.form6Params.thirdCashierType
                request.thirdPlatformPayLogo = this.form6Params.thirdPlatformPayLogo
                await (this.params.id ? updateChannel(request) : createChannel(request))
                this.$message.success('保存成功')
                // this.$refs.form.clearValidate()
                this.closeTab(true)
              }
            })
          } else {
            await (this.params.id ? updateChannel(request) : createChannel(request))
            this.$message.success('保存成功')
            // this.$refs.form.clearValidate()
            this.closeTab(true)
          }
        }
      })
    }
  },
  async created() {
    this.interfaceActionList = await getInterfaceActionList()
    // 积分平台商户
    this.integralPlatform = await getIntegralPlatformEditionList()

    this.bottomMenuList = await getBottomMenuList()

    this.payTypeList = await getPayTypeList()

    // 编辑
    if (this.$route.query.id) {
      this.isEdit = true
      const paramTemp = await getChannelInfo(this.$route.query.id)
      this.params = objectMerge(this.params, paramTemp)
      this.selectedInterfaceActionList = this.params.interfaceAction.split(',').filter(e => e)
      this.selectedIntegralPlatform = this.params.integralPlatform.split(',').filter(e => e)
      this.$nextTick(() => {
        if (this.params.cashierType === '2') {
          this.$set(this.form6Params, 'supportContent', this.params.supportContent)
          this.$set(this.form6Params, 'thirdPlatformPayName', this.params.thirdPlatformPayName)
          this.$set(this.form6Params, 'thirdCashierType', this.params.thirdCashierType)
          this.$set(this.form6Params, 'thirdPlatformPayLogo', this.params.thirdPlatformPayLogo)
          /* this.form6Params.supportContent = this.params.supportContent
          this.form6Params.thirdPlatformPayName = this.params.thirdPlatformPayName
          this.form6Params.thirdCashierType = this.params.thirdCashierType
          this.form6Params.thirdPlatformPayLogo = this.params.thirdPlatformPayLogo*/
          console.log(this.params.thirdPlatformPayLogo, 77)
          /* delete this.params.supportContent
          delete this.params.thirdPlatformPayName
          delete this.params.thirdCashierType
          delete this.params.thirdPlatformPayLogo*/
        }
      })

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
      Object.keys(this.params.payTypeDetail).forEach(item => {
        Object.keys(this.params.payTypeDetail[item]).forEach(e => {
          if (this.params.payTypeDetail[item][e].length > 0) {
            this.params.payTypeDetail[item][e].forEach(el => {
              console.log(el)
            })
          }
        })
      })
      // console.log(this.params.payTypeDetail)
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
    }
    // 导航菜单管理中：电影、影院、我的，这三个是固定默认已经勾选上且不能取消勾选的
    this.bottomMenuList.forEach(e => {
      if (e.action === 'film' || e.action === 'cinema' || e.action === 'member') {
        e.checked = true
        e.disabled = true
      }
    })

    if (this.params.type) { this.deviceCodeOptions = await deviceChange({ channelType: this.params.type }) }
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