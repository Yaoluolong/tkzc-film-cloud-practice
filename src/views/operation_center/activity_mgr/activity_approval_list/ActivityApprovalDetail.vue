<template>
    <div class="app-container">
        <el-card style="margin-bottom:20px">
            <div slot="header">
                <span>活动详情信息，创建人：{{workflow.creator}} &emsp;&emsp;
                <span>创建时间：{{workflow.create_time}}</span></span>
            </div>
            <el-form label-width="140px" label-position="left" style="width:1000px;" :model="activityInfo" ref="formCard">
                <el-form-item label="活动名称:">
                    <span>{{activityInfo.activity_subject}}</span>
                </el-form-item>                  
                <el-form-item label="投放商家:">
                  <span>{{activityInfo.merchant}}</span>
                </el-form-item>
                <el-form-item label="活动地区:">
                    <span>{{activityInfo.city}}</span>
                </el-form-item>
                <el-form-item label="活动时间:">
                  <span>{{activityInfo.showtime_start_boundary}}--{{activityInfo.showtime_end_boundary}}</span>
                </el-form-item>
                <el-form-item label="活动范围:">
                  <span>{{activityInfo.scopes}}</span>
                </el-form-item>
                <el-form-item label="活动排序:">
                  <span>{{activityInfo.page_rank}}</span>
                </el-form-item>
                <el-form-item label="广告图片:">
                  <!-- <span><a v-src="activityInfo.activity_banner"></a>{{activityInfo.activity_banner}}</span> -->
                  <pic-upload outHeight="100px" outWidth="400px" content="上传App或微信端Banner图（尺寸比例2:1，建议大小800*400）" v-model="activityInfo.activity_banner" disabled></pic-upload>
                </el-form-item>
                <el-form-item label="活动说明:">
                  <span>{{activityInfo.description}}</span>
                </el-form-item>                              
            </el-form>
        </el-card>
        <el-card style="margin-bottom:20px">
          <div slot="header">
              <span>配置规则信息</span>
          </div>
          <el-form label-width="140px" label-position="left" style="width:1000px;" :model="activityInfo">
            <div v-if="activityInfo.settings.activity_type==='cash'">  
              <el-form-item label="活动类型:">
                <span>{{activityInfo.settings.activity_type_str}}</span>
              </el-form-item>
              <el-form-item label="活动影院:">
                  <span>{{activityInfo.settings.cinema}}</span>
              </el-form-item>
              <el-form-item label="活动可用影片:">
                <span>{{activityInfo.settings.film_codes}}</span>
              </el-form-item>
              <el-form-item label="活动可用制式:">
                <span>{{activityInfo.settings.film_copies}}</span>
              </el-form-item>
              <el-form-item label="活动可用时段:">
                <span>{{activityInfo.settings.activity_start_boundary}}--{{activityInfo.settings.activity_end_boundary}}&emsp;{{activityInfo.settings.activity_cycle}}&emsp;{{activityInfo.settings.activity_days}}&emsp;{{activityInfo.settings.activity_begin}}--{{activityInfo.settings.activity_end}}</span>
              </el-form-item>
              <el-form-item label="支付方式:">
                <span>{{activityInfo.settings.activity_payment}}</span>
              </el-form-item>
            </div>
            <div v-if="activityInfo.settings.activity_type==='coupon'">
              <el-form-item label="活动类型:">
                {{activityInfo.settings.activity_type==='coupon'?'抢券活动':'现金支付活动'}}
              </el-form-item>
              <el-form-item label="活动网址:">
                {{activityInfo.settings.external_link}}
              </el-form-item>
            </div>
            <div v-else v-for="(item,index) in activityInfo.settings.rules" :key="index">
              <h3>第{{index+1}}优先级:</h3>
              <el-form-item label="优惠方式:">
                {{item.rule_discount_type}}
              </el-form-item>
              <el-form-item label="活动标签:">
                {{item.rule_discount_tag}}
              </el-form-item>
              <el-form-item label="使用门槛:">
                {{item.rule_mininum}}元及以上金额订单可用
              </el-form-item>
              <el-form-item label="折扣比例:" v-if="item.rule_discount_type==='打折优惠'">
                {{item.rule_min_unit}}
              </el-form-item>
              <el-form-item label="优惠上限:" v-if="item.rule_discount_type==='打折优惠'">
                {{item.rule_max_unit}}
              </el-form-item>
              <el-form-item label="减价金额:" v-if="item.rule_discount_type==='定额立减'">
                {{item.rule_min_unit}}
              </el-form-item>
              <el-form-item label="减价区间:" v-if="item.rule_discount_type==='随机立减'">
                {{item.rule_min_unit}}至{{item.rule_max_unit}}元
              </el-form-item>
              <el-form-item label="发放金额:">
                {{item.rule_total_amount}}
              </el-form-item>
              <el-form-item label="日参与次数:">
                每人每天可参与{{item.rule_chances_per_day||''}}次
              </el-form-item>
              <el-form-item label="周参与次数:">
                每人每周可参与{{item.rule_chances_per_week||''}}次
              </el-form-item>
              <el-form-item label="月参与次数:">
                每人每月可参与{{item.rule_chances_per_month||''}}次
              </el-form-item>
              <el-form-item label="" label-width="0px">
                活动期间最多参与{{item.rule_total_chances}}次，每笔订单最多有{{item.rule_seats_per_order}}个座位
              </el-form-item>
            </div>       
          </el-form>
        </el-card>
        <el-card style="margin-bottom:20px">
          <el-form ref="form" :params="params">
            <div v-if="activityInfo.settings.activity_type==='cash'">
              <el-form-item label="前端标签:">
                {{activityInfo.settings.activity_tag}}
              </el-form-item>
              <el-form-item label="结算方式:">
                {{activityInfo.settings.activity_settlement_type==='order'?'按订单金额结算':''}}
              </el-form-item>
            </div>
            
            <div v-for="(item,index) in workflow.log" :key="index">            
              <div v-if="item.work_status!=='待审批'">
                <el-form-item label="审批环节:" >
                  {{item.work_level}}
                </el-form-item>
                <el-form-item label="审核人:" >
                  {{item.user}}
                </el-form-item>
                <el-form-item label="审核结果:" >
                  {{item.work_status}}
                </el-form-item>
                <el-form-item label="审核意见:" >
                  {{item.comment}}
                </el-form-item>
              </div>
            </div>
            <div v-if="$route.query.status==='1'">
              <el-form-item label="审核意见:" prop="comment">
                <el-input clearable v-model="params.comment" type="textarea" rows="5" style="width:400px;"></el-input>
              </el-form-item>
            </div>         
          </el-form>
          <el-button style="margin-top:20px;" type="primary" @click="save('accept')" v-if="$route.query.status==='1'">同意</el-button>
          <el-button style="margin-top:20px;" type="primary" @click="save('reject')" v-if="$route.query.status==='1'">退回</el-button>
          <el-button @click="closeTab" v-if="$route.query.status==='1'">取消</el-button>
        </el-card>                
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInfoById, processById } from '@/api/activitySetting'
export default {
  name: 'activity_approval_detail',
  data() {
    return {
      activityInfo: {
        settings: {}
      },
      settings: {

      },
      workflow: {
        user: '',
        log: []
      },
      params: {
        comment: ''
      }
    }
  },
  methods: {
    async queryInitTable() {
      const temp = await getInfoById({ activity_id: this.$route.query.activity_id })
      this.activityInfo = temp
      this.activityInfo.settings = temp.settings
      this.settings = temp.settings
      // const logTemp = temp.workflow.log[temp.workflow.log.length - 1]

      this.workflow = temp.workflow
      // this.$set(this.workflow, 'log', [])
      // this.workflow.log.push(logTemp)
    },
    save(val) {
      const result = {
        activity_id: this.$route.query.activity_id,
        action: val,
        comment: this.params.comment
      }
      processById(result).then(e => {
        this.$message.success(val === 'accept' ? '审核成功' : '退回成功')
        this.closeTab(true)
        this.$router.push({ path: '/operation_center/activity_mgr/activity_approval_list' })
      }).catch(e => {
        this.$message.warning(e.content)
      })
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  async created() {
    this.queryInitTable()
  }

}
</script>

<style scoped>
  .headerContainer{
    font-size: 18px;
    font-weight: bold;
  }
  .headerContainer span {
    display: inline-block;
    width: 350px;
  }
</style>
