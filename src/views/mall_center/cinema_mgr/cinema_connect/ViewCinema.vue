<template>
  <div class="app-container cinema-base-info-box">
    <el-collapse v-model="activeNames" class="form-collapse">
      <el-collapse-item name="1" title="基础信息">
        <el-form label-width="120px" label-position="left" style="width:1000px;">
          <el-form-item label="影院编码" prop="cinemaId">{{params.cinemaId}}</el-form-item>
          <el-form-item label="影院名称" prop="cinemaName">{{params.cinemaName}}</el-form-item>
          <div class="form-item-row">
            <el-form-item label="影院所在地区" prop="area">{{params.regionName}}</el-form-item>
            <el-form-item label="影院详细地址" prop="address">{{params.address}}</el-form-item>
          </div>
          <el-form-item
            label="地址经纬度"
            prop="longitudeAndlatitude"
          >{{params.longitude}},{{params.latitude}}</el-form-item>
          <el-form-item label="影院简介/公告" prop="summary">{{params.summary}}</el-form-item>
          <el-form-item label="接入有效期" prop="time">{{params.startTime}}--{{params.endTime}}</el-form-item>
          <div class="form-item-row">
            <el-form-item label="同步影院排期" prop="requestPlanDays">{{params.requestPlanDays}}天</el-form-item>
            <el-form-item label="同步排期间隔" prop="requestPlanTimes">{{params.requestPlanTimes}}分钟</el-form-item>
          </div>
          <div class="form-item-row">
            <el-form-item label="保留排期数据" prop="remainPlanDays">{{params.remainPlanDays}}天</el-form-item>
            <el-form-item label="排期停售时间" prop="stopTime">开映前{{params.stopTime}}分钟停止售卖</el-form-item>
          </div>
          <el-form-item label="影院客服电话" prop="serviceTelType">
            <title-plane class="baseInfo">
              <template slot="header">
                <el-radio v-model="params.serviceTelType" label="1" disabled>统一方式</el-radio>
                <el-radio v-model="params.serviceTelType" label="2" disabled>分终端方式</el-radio>
              </template>
              <template v-if="params.serviceTelType==2">
                <el-form-item label="微信H5" prop="wap1" class="inner-item">
                  <el-input clearable v-model.trim="params.wap1" disabled v-if="params.wap1"></el-input>
                  <el-input
                    clearable
                    v-model.trim="params.wap2"
                    style="margin-left:20px"
                    disabled
                    v-if="params.wap2"
                  ></el-input>
                </el-form-item>
                <el-form-item label="移动APP" prop="app1" class="inner-item">
                  <el-input clearable v-model="params.app1" disabled v-if="params.app1"></el-input>
                  <el-input
                    clearable
                    v-model="params.app2"
                    style="margin-left:20px"
                    disabled
                    v-if="params.app2"
                  ></el-input>
                </el-form-item>
                <el-form-item label="小程序" prop="web1" class="inner-item">
                  <el-input clearable v-model="params.web1" disabled v-if="params.web1"></el-input>
                  <el-input
                    clearable
                    v-model="params.web2"
                    style="margin-left:20px"
                    disabled
                    v-if="params.web2"
                  ></el-input>
                </el-form-item>
              </template>
              <el-form-item v-else prop="serviceTel1" class="inner-item">
                <el-input
                  clearable
                  v-model.trim="params.serviceTel1"
                  disabled
                  v-if="params.serviceTel1"
                ></el-input>
                <el-input
                  clearable
                  v-model.trim="params.serviceTel2"
                  style="margin-left:20px;"
                  disabled
                  v-if="params.serviceTel2"
                ></el-input>
              </el-form-item>
            </title-plane>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <span>票务系统商信息</span>
        </template>
        <el-form label-width="120px" label-position="left" style="width:1000px;">
          <el-form-item label="票务系统商" prop="interfaceId">{{params.interfaceName}}</el-form-item>
          <el-form-item label="定价权" prop="priceRight">{{params.priceRightName}}</el-form-item>
          <el-form-item label="购票接入">
            <title-plane>
              <template slot="header">
                <el-radio v-model="params.ticketConfigRadio" label="1" disabled>关闭</el-radio>
                <el-radio v-model="params.ticketConfigRadio" label="2" disabled>开启</el-radio>
              </template>
              <template v-if="params.ticketConfigRadio==2">
                <el-form-item label="接口请求地址" prop="ticketConfig.requestUrl" class="inner-item">
                  <el-input
                    clearable
                    disabled
                    v-model="params.ticketConfig.requestUrl"
                    placeholder="请输入正确访问系统商接口地址"
                  ></el-input>
                </el-form-item>
                <el-form-item label="请求账号" prop="ticketConfig.account" class="inner-item">
                  <el-input
                    clearable
                    disabled
                    v-model="params.ticketConfig.account"
                    placeholder="请输入系统商分发账号"
                  ></el-input>
                </el-form-item>
                <el-form-item label="请求密码" prop="ticketConfig.password" class="inner-item">
                  <el-input
                    clearable
                    disabled
                    v-model="params.ticketConfig.password"
                    placeholder="请输入系统商分发密码"
                  ></el-input>
                </el-form-item>
                <el-form-item label="调用接口参数" prop="ticketConfig.otherInfo" class="inner-item">
                  <el-form-item
                    :label="key"
                    v-for="(val,key) in params.ticketConfig.otherInfo"
                    :key="key"
                    class="inner-item"
                    width="60%"
                  >
                    <el-input clearable disabled v-model="params.ticketConfig.otherInfo[key]"></el-input>
                  </el-form-item>
                </el-form-item>
              </template>
            </title-plane>
          </el-form-item>
          <el-form-item label="退票限制">
            <title-plane>
              <template slot="header">
                <el-radio v-model="params.refundType" label="2" disabled>不可退票</el-radio>
                <el-radio v-model="params.refundType" label="1" disabled>可退票</el-radio>
              </template>
              <template v-if="params.refundType==1">
                <el-form-item prop="refundTime" class="inner-item">
                  <!-- <el-button type="primary" size="small" disabled style="margin-right:20px;">获取票务系统商</el-button> -->
                  <el-input
                    clearable
                    v-model="params.refundTime"
                    disabled
                    placeholder="请输入"
                    style="margin-right:20px;width:320px"
                  >
                    <template slot="prepend">影片开映前</template>
                    <template slot="append">分钟内不可退</template>
                  </el-input>
                </el-form-item>
              </template>
            </title-plane>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- <div style="text-align:center;margin-top:20px">
      <el-button @click="cancel" >取消</el-button>
    </div>-->
  </div>
</template>
<script>
import { getCinemaInfo } from '@/api/mallCenter'
import { getInterfaceOtherInfo } from '@/api/mallCenter'
import { realDeepClone } from '@/utils'
export default {
  name: 'view_cinema',
  components: {},
  data() {
    return {
      activeNames: ['1', '2'],
      params: {
        time: []
      },
      paramsTwo: {}
    }
  },
  methods: {
    setTelStr(params, type) {
      if (params.serviceTel) {
        const arr =
          type === 'serviceTel'
            ? params.serviceTel.split(',')
            : params.serviceTel[type].split(',')
        if (arr[0]) {
          params[type + '1'] = arr[0]
        }
        if (arr[1]) {
          params[type + '2'] = arr[1]
        }
      }
    },
    cancel() {
      this.closeTab()
      this.$route.push({ path: '/mallCenter/cinema_mgr/cinema_connect' })
    }
  },
  async mounted() {
    // 编辑
    if (this.$route.query.id) {
      this.params = await getCinemaInfo(this.$route.query.id)

      if (this.params.serviceTelType === '2') {
        this.setTelStr(this.params, 'wap')
        this.setTelStr(this.params, 'app')
        this.setTelStr(this.params, 'web')
      } else {
        this.setTelStr(this.params, 'serviceTel')
      }

      this.params.ticketConfigRadio = this.params.ticketConfig ? '2' : '1'
      this.params.memberConfigRadio = this.params.memberConfig ? '2' : '1'
      this.params.saleConfigRadio = this.params.saleConfig ? '2' : '1'

      this.otherInfoList = await getInterfaceOtherInfo(this.params.interfaceId)

      this.paramsTwo.ticketConfig = {}
      this.paramsTwo.ticketConfig.requestUrl = this.otherInfoList.requestUrl
      this.paramsTwo.ticketConfig.account = this.otherInfoList.account
      this.paramsTwo.ticketConfig.password = this.otherInfoList.password
      this.paramsTwo.ticketConfig.otherInfo = realDeepClone(
        this.otherInfoList.otherInfo
      )

      if (!this.params.ticketConfig) {
        this.params.ticketConfig = {}
      }
      this.params.ticketConfig.requestUrl = this.otherInfoList.requestUrl
      this.params.ticketConfig.account = this.otherInfoList.account
      this.params.ticketConfig.password = this.otherInfoList.password
      if (!this.params.ticketConfig.otherInfo) {
        this.params.ticketConfig.otherInfo = Object.assign(
          {},
          this.otherInfoList.otherInfo
        )
      } else {
        this.params.ticketConfig.otherInfo = Object.assign(
          this.otherInfoList.otherInfo,
          this.params.ticketConfig.otherInfo
        )
      }
    }
  }
}
</script>

<style scoped lang="scss">
.header-icon {
  font-size: 16px;
}
.title {
  margin-left: 10px;
  font-size: 16px;
  color: #303133;
  font-weight: bold;
  // font-weight: bold;
}
.subtitle {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
  margin-left: 20px;
}

.cinema-base-info-box {
  .inner-item {
    margin-bottom: 20px !important;
    .el-form-item__content {
      display: flex;
    }
  }
}
</style>
<style>
.baseInfo .inner-item .el-form-item__content {
  display: flex;
}
.baseInfo .inner-item .el-input__inner {
  width: 400px;
}
</style>