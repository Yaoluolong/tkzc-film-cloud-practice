<template>
    <div class="app-container">
        <el-form label-width="140px" label-position="left" style="width:1000px;" :model="query" ref="formCard">
            <el-form-item label="活动名称:">
                <span>{{query.name}}</span>
            </el-form-item>                  
            <el-form-item label="活动时间:">
              <span>{{query.activityPeriod}}</span>
            </el-form-item>
            <el-form-item label="上传活动图片:">
              <pic-upload outHeight="100px" outWidth="400px" v-model="query.image" disabled></pic-upload>
            </el-form-item>
            <el-form-item label="活动区域:">
                <span>{{query.regionStr||''}}</span>
            </el-form-item>
            <el-form-item label="活动对象:">
              <span>{{query.objects||'--'}}</span>
            </el-form-item>
            <!-- <el-form-item label="活动流程:">
              <span>{{query.process||'--'}}</span>
            </el-form-item> -->
            <el-form-item label="活动规则:">
              <span v-html="ruleJson"></span>
            </el-form-item>
            <el-form-item label="前端活动标签:">
              <span v-html="tagJson"></span>
            </el-form-item>
            <el-form-item label="活动类型:">
              <span>{{query.type==='1'?'抢购电影券活动':(query.type==='2'?'银行贴补活动':'平台补贴活动')}}</span>
            </el-form-item>
            <el-form-item label="投放终端:">
              <span>{{query.devicesStr}}</span>
            </el-form-item>
            <el-form-item label="投放位置:">
              <span>{{query.scopesStr}}</span>
            </el-form-item>
            <div v-if="query.type === '1'">
              <el-form-item label="活动链接:">
                <span>{{query.link}}</span>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item label="投放商家:">
                <span>{{query.channelStr}}</span>
              </el-form-item>
              <el-form-item label="活动影院:">
                <span>{{query.cinemaTypeStr}}</span>
              </el-form-item>
              <el-form-item label="活动可用制式:" v-if="query.type==='3'">
                <span>{{query.copyType||'--'}}</span>
              </el-form-item>
              <el-form-item label="活动执行影片:">
                <span>{{query.filmStr||'--'}}</span>
              </el-form-item>              
              <el-form-item label="活动补贴总金额:">
                <span>{{query.totalAmount||'--'}}</span>&emsp;元
              </el-form-item>
              <div v-if="query.type === '2'">
                <el-form-item label="活动白名单:">
                  <span>{{query.whiteListStr}}</span>
                </el-form-item>
                <el-form-item label="每笔订单最多可购座位数:" label-width="200px">
                  <span>{{query.orderSeatsStr}}</span>
                </el-form-item>
                <el-form-item label="每个活动日限购座位总张数:" label-width="200px">
                  <span>{{query.totalSeatsStr}}</span>
                </el-form-item>
                <el-form-item label="支付方式:">
                  <span>{{query.payTypeStr}}</span>
                </el-form-item>
                <div v-if="isWeixinPay">
                  <h3>微信支付配置</h3>
                  <el-form-item label="优惠方式:">
                    <span>{{query.weixinPay.discountTypeStr}}</span>
                  </el-form-item>
                  <div v-for="(item,index) in query.weixinPay.activityConfig">
                    <el-form-item label="活动优惠标记:">
                      <span>{{item.tag}}</span>
                    </el-form-item>
                    <el-form-item label="活动可用制式:">
                      <span>{{item.copyType}}</span>
                    </el-form-item>
                    <el-form-item label="使用门槛:">
                      <span>{{item.ruleText}}</span>
                    </el-form-item>
                    <el-form-item label="活动补贴消耗上限:">
                      <span>{{item.ceiling||'--'}}</span>&emsp;元
                    </el-form-item>
                  </div>              
                </div>
                <div v-if="isUnionPay">
                  <h3>银联支付配置</h3>
                  <el-form-item label="" label-width="0px">
                    <!-- <span>{{query.unionPay.customize}}</span> -->
                    <span>银联支付-自定义显示减价规则</span>
                  </el-form-item>
                  <el-form-item label="选择支付商户号:">
                    <span>{{query.unionPay.partnerId}}</span>
                  </el-form-item>
                  <el-form-item label="活动可用制式:">
                    <span>{{query.unionPay.copyType}}</span>
                  </el-form-item>
                  <el-form-item label="优惠方式:">
                    <span>{{query.unionPay.discountTypeStr}}</span>
                  </el-form-item>
                  <el-form-item label="使用门槛类型:">
                    <span>{{query.unionPay.useTypeStr}}</span>
                  </el-form-item>
                  <el-form-item label="使用门槛:">
                    <span>{{query.unionPay.ruleText}}</span>
                  </el-form-item>

                  <el-form-item label="减价规则:" v-if="query.unionPay.discountType==='1'">
                    <span>{{query.unionPay.ruleTypeStr}}</span>
                  </el-form-item>
                  <el-form-item label="单个座位固定售价:" v-if="query.unionPay.discountType==='1' && query.unionPay.ruleType==='1'">
                    <span>{{query.unionPay.money}}</span>&emsp;元
                  </el-form-item>
                  <el-form-item label="单个座位固定立减:" v-if="query.unionPay.discountType==='1' && query.unionPay.useType==='1' && query.unionPay.ruleType==='2'">
                    <span>{{query.unionPay.money}}</span>&emsp;元
                  </el-form-item>

                  <el-form-item label="总售价固定立减:" v-if="query.unionPay.discountType==='1' && query.unionPay.activityConfig.useType==='2' && query.unionPay.activityConfig.ruleType==='2'">
                    <span>{{query.unionPay.money}}</span>&emsp;元
                  </el-form-item>

                  <el-form-item label="随机减价区间:" v-if="query.unionPay.discountType==='2'">
                    <span>{{query.unionPay.interval1}}元至{{query.unionPay.interval2}}元</span>
                  </el-form-item>
                  
                  <el-form-item label="折扣比例:" v-if="query.unionPay.discountType==='3'">
                    <span>{{query.unionPay.scale}}</span>
                  </el-form-item>
                  <el-form-item label="单个座位优惠上限:" v-if="query.unionPay.discountType==='3' && query.unionPay.useType ==='1'">
                    <span>{{query.unionPay.limit}}</span>&emsp;元
                  </el-form-item>
                  <el-form-item label="单笔优惠上限:" v-if="query.unionPay.discountType==='3' && query.unionPay.useType ==='2'">
                    <span>{{query.unionPay.limit}}</span>&emsp;元
                  </el-form-item>

                  <el-form-item label="活动补贴消耗上限:">
                    <span>{{query.unionPay.ceiling||'--'}}</span>&emsp;元
                  </el-form-item>
                </div>
                <div  v-if="ruleConfig">
                  <el-form-item label="用户参与规则:">
                    单个用户参与总次数：<span>{{ruleConfig.allCount||'--'}}</span> 次
                  </el-form-item>
                  <el-form-item label=" ">
                    单个用户每日参与次数：<span>{{ruleConfig.dayCount||'--'}}</span> 次
                  </el-form-item>
                  <el-form-item label=" ">
                    单个用户每周参与次数：<span>{{ruleConfig.weekCount||'--'}}</span> 次
                  </el-form-item>
                  <el-form-item label=" ">
                    单个用户每月参与次数：<span>{{ruleConfig.monthCount||'--'}}</span> 次
                  </el-form-item>
                </div>
                
                <el-form-item label="退款返还参与次数:">
                  <span>{{query.refundAndReturnTimesStr}}</span>
                </el-form-item>
                <el-form-item label="放弃付款返还参与次数:" label-width="160px">
                  <span>{{query.backAndReturnTimesStr}}</span>
                </el-form-item>
              </div>
              <div v-if="query.type === '3'">
                <el-form-item label="影片活动售价:">
                  {{query.filmConfig.type==='1'?'活动规则范围内固定影片售价':'活动规则范围内影片售价立减'}}
                </el-form-item>
                <el-form-item v-if="query.filmConfig.type==='1'" label="影片固定售价:">
                  {{query.filmConfig.money}}
                </el-form-item>
                <el-form-item v-if="query.filmConfig.type==='2'" label="影片立减金额:">
                  {{query.filmConfig.interval1}}至{{query.filmConfig.interval2}}元
                </el-form-item>
                <el-form-item label="活动可用支付方式:">
                  <div v-for="(item,index) in query.payTypeDetail">
                    <span>{{index}}:{{item.join(',')}}</span>
                  </div>
                </el-form-item>
              </div>
            </div>           
            <div v-if="query.auditStatus==='4'">
              <div>=============================================</div> 
              <h3>审核环节:{{query.backContentStr.level==='1'?'一':'二'}}级审批</h3>
              <el-form-item label="审核意见：">
                {{query.backContentStr.comment||'无审核意见'}}
              </el-form-item>
              <el-form-item label="审核状态：">
                {{query.backContentStr.checkStr}}
              </el-form-item>
              <el-form-item label="审核人：">
                {{query.backContentStr.userName}}
              </el-form-item>
              <el-form-item label="审核时间：">
                {{query.backContentStr.createTime}}
              </el-form-item>
            </div>
            <div v-if="query.auditStatus==='2'||query.auditStatus==='3'">
              <div>=============================================</div> 
              <h3>审核环节:一级审批</h3>
              <el-form-item label="审核意见：">
                {{query.approvalLevel1.comment||'无审核意见'}}
              </el-form-item>
              <el-form-item label="审核状态：">
                {{query.approvalLevel1.checkStr}}
              </el-form-item>
              <el-form-item label="审核人：">
                {{query.approvalLevel1.userName}}
              </el-form-item>
              <el-form-item label="审核时间：">
                {{query.approvalLevel1.dateline}}
              </el-form-item>
            </div>

            <div v-if="query.approvalStep===2 && query.auditStatus==='3'">
              <div>=============================================</div> 
              <h3>审核环节:二级审批</h3>
              <el-form-item label="审核意见：">
                {{query.approvalLevel2.comment||'无审核意见'}}
              </el-form-item>
              <el-form-item label="审核状态：">
                {{query.approvalLevel2.checkStr}}
              </el-form-item>
              <el-form-item label="审核人：">
                {{query.approvalLevel2.userName}}
              </el-form-item>
              <el-form-item label="审核时间：">
                {{query.approvalLevel2.dateline}}
              </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import { getActivityInfo, checkActivity } from '@/api/activitySetting'
import { getFilmIdList } from '@/api/priceCenter'
export default{
  name: 'view_activities_details',
  data() {
    return {
      query: {

      },
      // time: '',
      // weekTemp: '',
      filmsStr: '',
      params: {
        level: '',
        comment: '',
        status: ''
      },
      isWeixinPay: '',
      isUnionPay: '',
      ruleConfig: {},
      ruleJson: '',
      tagJson: ''
    }
  },
  methods: {
    save(level, status) {
      checkActivity({ level: level,
        comment: this.params.comment,
        status: status,
        id: this.$route.query.id }).then(res => {

      })
    }
  },
  async created() {
    this.query = await getActivityInfo({ id: this.$route.query.id })

    this.ruleJson = this.query.rule.replace(/\n|\r\n/g, '<br/>')
    this.tagJson = this.query.tag.replace(/\n|\r\n/g, '<br/>')

    this.isWeixinPay = this.query.payType && this.query.payType.includes('weixinPay')
    this.isUnionPay = this.query.payType && this.query.payType.includes('unionPay')

    this.ruleConfig = this.query.ruleConfig
    if (!this.ruleConfig) {
      this.$set(this, 'ruleConfig', { allCount: '--', dayCount: '--', weekCount: '--', monthCount: '--' })
    }
    // 影片
    if (this.query.films === '-1') {
      this.filmsStr = '全部'
    } else {
      getFilmIdList({}).then(res => {
        res.map(el => {
          this.query.films && this.query.films.split(',').map(e => {
            if (e === el.value) {
              this.filmsStr += el.name + ','
            }
          })
        })
      })
    }
  }
}
</script>