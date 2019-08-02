<template>
  <div class="app-container">
    <el-form label-width="140px" ref="form" :rules="rules" :model="params">
      <el-form-item label="电影卡种类" prop="type">
        <el-radio-group v-model="params.type">
          <el-radio label="1" checked>电影卡--点卡</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="充值点数:" prop="point">
        <el-input clearable v-model="params.point" style="width:100px;"></el-input>点
        <span style="margin-left:20px;color:gray">只允许输入数值，必须大于等于0！</span>
      </el-form-item>
      <el-form-item label="充值原价:" prop="price">
        <el-input clearable v-model="params.price" style="width:100px;"></el-input>元
        <span style="margin-left:20px;color:gray">只允许输入数值，必须大于等于0！</span>
      </el-form-item>
      <el-form-item label="适用平台商家" prop="channelList" v-if="ok">
        <channel-form-selector
          ref="channelComponent"
          v-model="params.channelList"
          style="width:600px;"
          type="1"
          :changeFun="channelChangeFun"
        ></channel-form-selector>
      </el-form-item>
      <el-form-item label="充值点数存在独立有效期：" prop="idpdValidity" label-width="190px">
        <tip content="默认充值点数不存在独立的有效期，沿用卡的有效期！" style="width:260px;">
          <el-radio-group v-model="params.idpdValidity" disabled>
            <el-radio label="1" checked>不设独立有效期</el-radio>
            <el-radio label="2" checked>独立有效期</el-radio>
          </el-radio-group>
        </tip>
      </el-form-item>
      <el-form-item label="充值活动：" prop="isOpenActive" label-width="145px">
        <el-radio-group v-model="params.isOpenActive">
          <el-radio label="1" checked>开启</el-radio>
          <el-radio label="0" checked>关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="充值活动价:" prop="activePrice" v-if="params.isOpenActive==='1'">
        <el-input clearable v-model="params.activePrice" style="width:100px;" placeholder="0.00"></el-input>元
        <span style="margin-left:20px;color:gray">只允许输入数值，必须大于等于0！</span>
      </el-form-item>
      <el-form-item label="充值活动时间:" prop="time" v-if="params.isOpenActive==='1'">
        <el-date-picker
          unlink-panels
          v-model="params.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:320px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="每张电影卡--点卡可享受充值活动价:"
        prop="activeNum"
        label-width="250px"
        v-if="params.isOpenActive==='1'"
      >
        <el-input clearable v-model="params.activeNum" style="width:100px;"></el-input>次
        <span style="margin-left:20px;color:gray">只允许输入数值，必须大于等于0！</span>
      </el-form-item>
      <el-form-item
        label="充值活动时间结束后是否恢复充值原价:"
        prop="isRecovery"
        label-width="265px"
        placeholder="请选择用户类型"
        v-if="params.isOpenActive==='1'"
      >
        <tip content="默认充值活动价结束后恢复充值原价！" style="width:350px;">
          <el-radio-group v-model="params.isRecovery">
            <el-radio label="1" checked>恢复原价不下架</el-radio>
            <el-radio label="0" checked>不恢复原价并下架充值规则</el-radio>
          </el-radio-group>
        </tip>
      </el-form-item>

      <!-- <el-form-item label="充值点数有效时间:" prop="dayNum" v-if="params.validity === '2'"  label-width="140px">
        <tip content="有效期的开始时间是充值成功的那个时间！" style="width:130px;">
          <el-input clearable v-model="params.dayNum"  style="width:100px;"></el-input>  天
        </tip>
      </el-form-item>-->
    </el-form>
    <el-button type="primary" @click="save">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>
<script>
import ChannelFormSelector from '@/components/ChannelFormSelector'
import { isPositiveInteger, isInteger } from '@/utils/validate'
import {
  createCardRecharge,
  getCardRechargeInfo,
  updateCardRecharge
} from '@/api/operationCenter'
export default {
  name: 'card_recharge_create',
  components: { ChannelFormSelector },
  data() {
    const checkNum = (rule, value, cb) => {
      if (!isPositiveInteger(value)) {
        cb(new Error('请填写准确数值'))
      }
      cb()
    }
    const checkNum2 = (rule, value, cb) => {
      if (!isInteger(value)) {
        cb(new Error('数值为大于0,最多两位小数'))
      }
      cb()
    }
    const checkTime = (rule, value, cb) => {
      if (!value || !value[0] || !value[1]) {
        cb(new Error('请选择充值活动有效时间'))
      }
      cb()
    }
    return {
      params: {
        type: '1',
        point: '',
        price: '',
        isOpenActive: '0',
        activePrice: '',
        time: [],
        channelId: '',
        channelList: [],
        activeNum: '',
        isRecovery: '1',
        idpdValidity: '1'
        // dayNum: ''
      },
      rules: {
        point: { required: true, validator: checkNum, trigger: 'blur' },
        price: { required: true, validator: checkNum, trigger: 'blur' },
        isOpenActive: { required: true, trigger: 'blur' },
        activePrice: { required: true, validator: checkNum2, trigger: 'blur' },
        time: { required: true, validator: checkTime, trigger: 'blur' },
        channelList: [
          { required: true, message: '请选择适用平台商家', trigger: 'blur' }
        ],
        activeNum: { required: true, validator: checkNum, trigger: 'blur' },
        isRecovery: { required: true, trigger: 'blur' },
        idpdValidity: { required: true, trigger: 'blur' }
        // dayNum: { required: true, validator: checkNum, trigger: 'blur' }
      },
      ok: false
    }
  },
  methods: {
    channelChangeFun(val) {
      console.log(val, 9999)
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const params = this.params
          if (this.params.channelList) {
            params.channelId = this.params.channelList
              .map(e => e.value)
              .join(',')
          }
          if (this.params.time) {
            params.activeStime = this.params.time[0]
            params.activeEtime = this.params.time[1]
            params.time
          }
          params.channelList.map(e => {
            this.$set(e, 'checked', 'true')
          })
          const apiTemp = this.$route.query.id
            ? updateCardRecharge
            : createCardRecharge
          apiTemp(params)
            .then(res => {
              this.$message.success('保存成功')
              this.closeTab(true)
              this.$router.push(
                '/operation_center/gift_card/card_recharge_program'
              )
            })
            .catch(e => {
              params.channelList.map(e => {
                this.$set(e, 'checked', true)
              })
            })
        }
      })
    },
    cancel() {
      this.closeTab()
      this.$router.push('/operation_center/gift_card/card_recharge_program')
    }
  },
  async created() {
    if (this.$route.query.id) {
      const _this = this
      await getCardRechargeInfo({ id: this.$route.query.id }).then(res => {
        _this.params = res

        // _this.params.time = []
        /* _this.params.time[0] = res.activeStime
        _this.params.time[1] = res.activeEtime*/
        this.$set(_this.params, 'time', [])
        if (res.activeStime) {
          _this.params.time[0] = res.activeStime
          _this.params.time[1] = res.activeEtime
        }
        // this.$set(_this.params.time, 1, res.activeEtime)
        _this.ok = true
      })
    }
    console.log(this.params)
    this.ok = true
  }
}
</script>

<style scoped>
</style