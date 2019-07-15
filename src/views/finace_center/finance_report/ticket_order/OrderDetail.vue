<template>
  <div class="app-container">
    <el-collapse v-model="activeNames" class="form-collapse">
      <el-collapse-item name="1" title="订单信息">
        <div class="item-wapper">
          <div class="item wp100 fs16">
            订单状态：
            <span
              :class="+orderInfo.orderStatus===4?'primary':+orderInfo.orderStatus===0?'success':'danger'"
            >
              {{orderInfo.orderStatusName}}
              <i
                :class="{
              'el-icon-success':+orderInfo.orderStatus===4,
              'primary':+orderInfo.orderStatus===4,
              'el-icon-question':+orderInfo.orderStatus===0,
              'success':+orderInfo.orderStatus===0,
              'el-icon-info':+orderInfo.orderStatus!==4&&+orderInfo.orderStatus!==0,
              'danger':+orderInfo.orderStatus!==4&&+orderInfo.orderStatus!==0
            }"
              ></i>
            </span>
          </div>
          <div class="item">订单编号：{{orderInfo.orderId}}</div>
          <div class="item">系统商订单号：{{orderInfo.orderNo}}</div>
          <div
            class="item"
            v-for="item in orderInfo.ticketInfo"
            :key="item.name"
          >{{item.name}}：{{item.value}}</div>
          <div class="item">系统商类型：{{orderInfo.interfaceType}}</div>
          <div class="item">购票手机号：{{orderInfo.mobile}}</div>
          <div class="item">系统商手机号：{{orderInfo.mobile}}</div>
          <div class="item">退票时间：{{orderInfo.backTicketTime||''}}</div>
          <div class="item">订单时间：{{orderInfo.orderTime}}</div>
          <div class="item">支付时间：{{orderInfo.successTime}}</div>
          <div class="item">会员绑定手机号{{orderInfo.mobile}}</div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3" title="订单基础金额">
        <div class="item-wapper">
          <!-- <div class="item">上报总额：{{orderInfo.sellTicketSum}}</div>
          <div class="item">上报单价：{{orderInfo.sigleTicketPrice}}</div>
          <div class="item">消费金额：{{orderInfo.channelTiceketSum}}</div>-->
          <div class="item">订单总额：{{orderInfo.orderAmount}}元</div>
          <div class="item">销售单价：{{orderInfo.orderUnitPrice}}元</div>
          <div class="item">分账票款：{{orderInfo.ticketPrice}}元</div>
          <div class="item">影院服务费：{{orderInfo.cinemaServicePrice}}元</div>
          <div class="item">平台增值费：{{orderInfo.specialServicePrice}}元</div>
          <div class="item">平台调整票价：{{orderInfo.modifyTicketPrice}}元</div>
          <div class="item">平台服务费：{{orderInfo.modifyServicePrice}}元</div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" title="场次信息">
        <div class="item-wapper">
          <div class="item">交易渠道商：{{orderInfo.channelId}}</div>
          <div class="item">交易影院：{{orderInfo.cinemaName}}</div>
          <div class="item">影城省份：{{orderInfo.provinceStr}}</div>
          <div class="item">影城城市：{{orderInfo.cityStr}}</div>
          <div class="item">放映时间：{{orderInfo.startTime}}</div>
          <div class="item">购票数量：{{orderInfo.ticketNum}}</div>
          <div class="item">语言：{{orderInfo.copyLanguage}}</div>
          <div class="item">影片名称：{{orderInfo.filmName}}</div>
          <div class="item">影厅：{{orderInfo.hallName}}</div>
          <div class="item">座位明细：{{orderInfo.seatDescribe}}</div>
          <div class="item">排期编号：{{orderInfo.featureAppNo}}</div>
          <div class="item">影片制式：{{orderInfo.copyType}}</div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4" title="用户付款信息">
        <div v-for="(info,index) in orderInfo.payInfo" :key="index">
          <div class="item-wapper">
            <div class="item">支付方式：{{info.typeName}}</div>
            <div
              class="item"
              v-for="item in info.list"
              :key="item.name"
            >{{item.name}}：{{item.value}}</div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item
        name="5"
        title="退票退款备注"
        v-if="orderInfo.orderStatus==='6' ||orderInfo.orderStatus==='7' ||orderInfo.orderStatus==='8' ||orderInfo.orderStatus==='9'"
      >
        <div v-for="item in orderInfo.changeLog" class="changeLog">
          <div class="item" style="margin-bottom:20px;">{{item.backTicketContent}}</div>
          <div class="item" style="margin-bottom:20px;">操作人：{{item.realName}}</div>
          <div class="item" style="margin-bottom:20px;">操作时间：{{item.addTime}}</div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div style="text-align:center;margin-top:20px;">
      <el-button
        type="danger"
        @click="detailDialogVisible = true"
        v-if="orderInfo.orderStatus==='0' ||orderInfo.orderStatus==='2' ||orderInfo.orderStatus==='3' ||orderInfo.orderStatus==='4'||orderInfo.orderStatus==='9'"
      >退单退款</el-button>&nbsp;&nbsp;
      <!-- <el-button type="danger" @click="backOrder('backTicketAndMoney','使用退单退款时，会对订单发起退票操作的同时将所有支付是的款项进行退回！且将订单状态变更为“退票退款”，确定要退吗？')"  v-if="orderInfo.orderStatus==4">退 单 退 款</el-button>&nbsp;&nbsp;
      <el-button type="danger" @click="backOrder('backTicketAndMoney','使用退单退款时，会对订单发起退票操作的同时将所有支付是的款项进行退回！且将订单状态变更为“退票退款”，确定要退吗？')"  v-if="orderInfo.orderStatus==9">重 申 退 款</el-button>&nbsp;&nbsp;
      <el-button type="danger" @click="backOrder('backMoney','使用柜台退票时，需已在影院前台进行解座或退座操作！同意此操作会对订单发起退票操作的同时将所有支付是的款项进行退回！且将订单状态变更为“柜台退票”，确定要退吗？')"  v-if="orderInfo.orderStatus==4">柜 台 退 票</el-button>-->
      <el-button @click="closeTab">关 闭</el-button>
    </div>
    <el-dialog
      title="退票退款"
      class="sum-info"
      :visible.sync="detailDialogVisible"
      width="600px"
      @close="resetFields('form')"
    >
      <el-form ref="dialogForm" :rules="formRule" :model="params">
        <el-form-item label="选择退票退款方式：" prop="type">
          <el-select v-model="params.type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label label-width="0px">
          <template>
            <span
              v-if="params.type==='backMoney'"
              class="tipStyle"
            >使用柜台退票退款时，需已在影院前台进行解座或退座操作！同意此操作会对订单发起所有支付时的款项进行退回！且将订单状态变为“柜台退票退款”，确定要退吗？</span>
            <span
              v-if="params.type==='backTicketAndMoney1'"
              class="tipStyle"
            >使用线上退票退款时，同意此操作会对订单发起退票操作的同时将所有支付是的款项进行退回！且将订单状态变为“退票退款”，确定要退吗？</span>
            <span
              v-if="params.type==='onlyBackMoney'"
              class="tipStyle"
            >只有当订单状态是仅退票未退款时，才能使用此操作，其他订单状态下选择此退票退款方式无效。同意此操作只会对订单发起所有支付时的款项进行退回！且将订单状态变为“退票退款”，确定要退吗？</span>
          </template>
        </el-form-item>
        <el-form-item label label-width="0px" prop="remark">
          <el-input
            v-model="params.remark"
            type="textarea"
            :row="12"
            holdspace="请输入操作原因信息"
            class="remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checked(params.type)">确认</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderInfo, backOrder } from '@/api/financeCenter'
export default {
  inject: ['reload'], // 注入依赖
  name: 'order_detail',
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5'],
      orderInfo: {},
      params: {
        type: 'backMoney',
        remark: ''
      },
      detailDialogVisible: false,
      typeOptions: [
        {
          value: 'backMoney',
          label: '柜台已退票线上退款'
        },
        {
          value: 'backTicketAndMoney1',
          label: '线上退票退款'
        },
        {
          value: 'onlyBackMoney',
          label: '仅退款'
        }
      ],
      formRule: {
        remark: {
          required: true,
          message: '请输入操作原因信息',
          trigger: 'blur'
        }
      }
    }
  },
  methods: {
    /* async backOrder(type, warningText) {
        this.$confirm(warningText, '温馨提示', { type: 'warning' }).then(async() => {
          const loading = this.$loading({
            lock: true,
            text: '正在处理中请稍候...',
            spinner: 'el-icon-loading'
          })
          try {
            const params = {
              type: type,
              backTicketContent: this.params.remark,
              orderId: this.orderInfo.orderId,
              cinemaId: this.orderInfo.cinemaId
            }
            await backOrder(params)
            this.$message.success('操作成功')
            loading.close()
            this.closeTab()
          } catch (error) {
            loading.close()
          }
        })
      },*/
    async checked(type) {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在处理中请稍候...',
            spinner: 'el-icon-loading'
          })
          try {
            const params = {
              type: type,
              backTicketContent: this.params.remark,
              orderId: this.orderInfo.orderId,
              cinemaId: this.orderInfo.cinemaId
            }
            params.type =
              type === 'backTicketAndMoney1' ? 'backTicketAndMoney' : type
            await backOrder(params)
            this.$message.success('操作成功')
            loading.close()
            this.reload()
          } catch (error) {
            loading.close()
          }
        }
      })
    },
    cancel() {
      this.detailDialogVisible = false
      this.$refs.dialogForm.resetFields()
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.orderInfo = await getOrderInfo(this.$route.query.id)
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
.item-wapper {
  display: flex;
  flex-wrap: wrap;
  .item {
    font-size: 14px;
    margin: 10px 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 400px;
  }
}
.item-title {
  margin: 10px 20px;
}
.tipStyle {
  color: #a7a7a7;
}
</style>
<style>
.remark .el-textarea__inner {
  height: 120px;
}
.changeLog {
  margin-left: 20px;
  margin-top: 20px;
  border-bottom: 1px solid #cccccc;
}
.changeLog:last-child {
  border-bottom: 0px;
}
</style>
