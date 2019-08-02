<template>
  <div class="app-container">
    <div style="text-align: left; margin: 0;">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="sales">卡销售信息</span>
        </div>
        <el-row>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>业务人员</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.saleName || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>客户名称</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.customerName || '- -'}}</div>
            </el-col>
          </el-col>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>销售订单号</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.saleOrderNo || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">销售日期</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.saleTime || '- -'}}</div>
            </el-col>
          </el-col>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">激活状态</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.isActive || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">卡内点数</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.oldPoint || '- -'}}</div>
            </el-col>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-top:10px">
        <div slot="header" class="clearfix">
          <span class="sales">卡信息</span>
        </div>
        <el-row>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>电影卡来源</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.source || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>电影卡批次号</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.batchNo || '- -'}}</div>
            </el-col>
          </el-col>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>电影卡号</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.cardCode || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>电影卡密码</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.cardPassword || '- -'}}</div>
            </el-col>
          </el-col>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">电影卡种类</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.type || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">电影卡类型</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.style || '- -'}}</div>
            </el-col>
          </el-col>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">有效期</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.volidTime || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">作废状态</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.isVoid || '- -'}}</div>
            </el-col>
          </el-col>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">冻结状态</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.isFrozen || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">绑定状态</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.bindStatus || '- -'}}</div>
            </el-col>
          </el-col>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">绑定会员ID</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.memberInfo.id || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>会员昵称</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.memberInfo.nickName || '- -'}}</div>
            </el-col>
          </el-col>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>会员手机号</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.memberInfo.bindingMobile || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a>绑定时间</a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.bindTime || '- -'}}</div>
            </el-col>
          </el-col>
          <el-col :span="24" class="kacard">
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">卡内剩余点数</div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light">{{data.point || '- -'}}</div>
            </el-col>
            <el-col :span="4" class="business">
              <div class="grid-content bg-purple">
                <a></a>
              </div>
            </el-col>
            <el-col :span="8" class="businessitem">
              <div class="grid-content bg-purple-light"></div>
            </el-col>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSoldCardInfo } from '@/api/operationCenter'
export default {
  name: 'card_detail',
  data() {
    return {
      data: {
        memberInfo: {}
      }
    }
  },
  watch: {},
  methods: {},

  async created() {
    if (this.$route.query.id) {
      this.data = await getSoldCardInfo({ id: this.$route.query.id })
    }
  }
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 0px;
  border-bottom: 1px solid #e4e4e4;
  &:last-child {
    margin-bottom: 10px;
    margin-top: 10px;
  }
}
.el-col {
  border-radius: 0px;
}
.kacard {
  text-align: center;
  line-height: 35px;
  border-top: 1px solid #e4e4e4;
}
.bg-purple-light {
  background: #ffffff;
}
.bg-purple {
  background: #f9fafc;
}
.grid-content {
  border-radius: 0px;
  min-height: 36px;
}
.sales {
  font-size: 15px;
  font-weight: bold;
  color: #333333;
}
.business {
  border-left: 1px solid #e4e4e4;
  border-right: 1px solid #e4e4e4;
}
.businessitem {
  border-right: 1px solid #e4e4e4;
}
</style>
