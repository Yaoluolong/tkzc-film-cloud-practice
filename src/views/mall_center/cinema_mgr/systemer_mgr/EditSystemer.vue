<template>
  <div class="app-container">
    <el-form label-width="140px" label-position="left" style="width:650px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="系统商名称" prop="name" >
          <el-input v-model.trim="params.name" placeholder="请输入渠道商名称,最多20个字"></el-input>
      </el-form-item>
      <!-- <el-form-item label="定义版本" prop="version">
        <el-input v-model="params.version"  placeholder="输入系统商接口版本,如:DxV1_0" ></el-input>
      </el-form-item> -->
      <el-form-item label="选择版本类" prop="class">
        <remote-select v-model="params.class" clearable placeholder="请选择版本类" action="/systemApi/interfaceType/getInterfaceClassList" style="width:200px;"></remote-select>
      </el-form-item>
      <el-form-item label="选择系统商接入类型：">
        <el-radio-group v-model="params.dockType" prop="dockType">
          <el-radio v-for="(item,index) in CHANNEL_TYPES" :key="index" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请求系统商地址" prop="apiUrl">
        <el-input v-model.trim="params.apiUrl"  placeholder="请输入正确访问系统商地址" ></el-input>
      </el-form-item>
      <el-form-item label="请求账号" prop="apiAccount">
        <el-input v-model.trim="params.apiAccount"  placeholder="请输入系统商分发账号" ></el-input>
      </el-form-item>
      <el-form-item label="请求密码" prop="apiPassword">
        <el-input v-model.trim="params.apiPassword"  placeholder="请输入系统商分发密码" ></el-input>
      </el-form-item>
      <el-form-item label="请求系统商参数" prop="otherInfo">
        <!-- <el-input v-model="params.otherInfo"  type="textarea"  :rows="4"  placeholder="请输入内容" ></el-input> -->
        <arg-edit-plane-two  v-model="params.otherInfo" help="新增每次请求系统商时的键值，例如：ticketUrl，callBackUrl。"></arg-edit-plane-two>
      </el-form-item>
      <el-form-item label="关联平台服务器" prop="requestUrl">
        <el-input v-model.trim="params.requestUrl" placeholder="输入关联平台服务器" ></el-input>
      </el-form-item>
       <el-form-item label="请求平台账号" prop="planAccount">
        <el-input v-model.trim="params.planAccount" placeholder="输入请求平台账号" ></el-input>
      </el-form-item>
       <el-form-item label="请求平台密码" prop="password">
        <el-input v-model.trim="params.password" placeholder="输入请求平台密码" ></el-input>
      </el-form-item>
      <el-form-item label="请求超时" prop="requestOverTime">
        <tip content="每次请求系统商的超时时间设定，结合系统商接口文档来设定合理超时时间。" style="width:50%">
          <el-input v-model.trim="params.requestOverTime"   placeholder="请输入请求超时" >
              <template slot="append">秒</template>
          </el-input>
        </tip>
      </el-form-item>
      <el-form-item label="响应超时" prop="responseOverTime">
        <tip content="每次请求系统商后数据返回的超时时间设定，结合系统商接口文档来设定合理超时时间。" style="width:50%">
          <el-input v-model.trim="params.responseOverTime"   placeholder="请输入响应超时" >
            <template slot="append">秒</template>
          </el-input>
        </tip>
      </el-form-item>

      <el-form-item label="订单状态轮询时间" prop="orderRequestOverTime">
        <tip content="根据系统商要求填写订单支付成功后请求出票的过程时间，直到获取到返回订单成功的状态为止。" style="width:50%">
          <el-input v-model.trim="params.orderRequestOverTime"   placeholder="请输入轮询时间" >
            <template slot="append">分钟</template>
          </el-input>
        </tip>
      </el-form-item>
      <el-form-item label="订单状态轮询间隔" prop="sleepTime">
        <tip content="订单支付成功后请求出票的过程，间隔多长时间请求获取订单的状态。" style="width:50%">
          <el-input v-model.trim="params.sleepTime"   placeholder="请输入轮询间隔" >
            <template slot="append">秒</template>
          </el-input>
        </tip>
      </el-form-item>
      <el-form-item label="订单锁座时间" prop="unLockSeatTime">
        <tip content="订单锁座时间也就是订单支付的有效时长，超出配置的时间也就是订单超时。" style="width:50%">
          <el-input v-model.trim="params.unLockSeatTime"   placeholder="请输入锁座时间" >
            <template slot="append">分钟</template>
          </el-input>
        </tip>
      </el-form-item>

      <el-form-item style="text-align:center">
        <el-button type="primary" @click="save" v-if="!look">保存</el-button>
        <el-button @click="closeTab" >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createInterfaceType, updateInterfaceType, getInterfaceTypeInfo, getOpenCinema } from '@/api/mallCenter'
import ArgEditPlaneTwo from '@/components/ArgEditPlaneTwo'
import { CHANNEL_TYPES } from '@/model/type'
export default {
  name: 'edit_systemer',
  components: { ArgEditPlaneTwo },
  data() {
    return {
      CHANNEL_TYPES,
      params: {
        dockType: '1'
      },
      rules: {
        name: { required: true, max: 20, message: '请输入渠道商名称,最多20个字', trigger: 'blur' },
        version: { required: true, message: '输入系统商接口版本,如:DxV1_0', trigger: 'blur' },
        class: { required: true, message: '请选择关联类', trigger: 'change' },
        requestUrl: { required: true, message: '输入平台关联平台服务器', trigger: 'blur' },
        requestOverTime: { required: true, message: '请输入请求超时', trigger: 'blur' },
        responseOverTime: { required: true, message: '请输入响应超时', trigger: 'blur' },
        // otherInfo: { required: true, message: '请输入内容', trigger: ['change', 'blur'] },
        apiUrl: { required: true, message: '请输入正确访问系统商地址', trigger: 'blur' },
        apiAccount: { required: true, message: '请输入系统商分发账号', trigger: 'blur' },
        apiPassword: { required: true, message: '请输入系统商分发密码', trigger: 'blur' },
        planAccount: { required: true, message: '输入请求平台账号', trigger: 'blur' },
        password: { required: true, message: '输入请求平台密码', trigger: 'blur' },

        orderRequestOverTime: { required: true, message: '请输入轮询时间', trigger: 'blur' },
        sleepTime: { required: true, message: '请输入轮询间隔', trigger: 'blur' },
        unLockSeatTime: { required: true, message: '请输入锁座时间', trigger: 'blur' }
      },
      isEdit: false
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          let message = ''
          if (this.$route.query.id) {
            message = '确定修改该票务系统商的信息吗？'
          } else {
            message = '确定新增该票务系统商吗？同意新增票务系统商成功后系统将自动执行读取影院的操作！'
          }
          this.$confirm(message, '温馨提示', { type: 'warning' }).then(async() => {
            const params = Object.assign({}, this.params)
            // if (params.otherInfo) {
            //   params.otherInfo = JSON.stringify(params.otherInfo)
            // }
            if (this.isEdit) {
              await updateInterfaceType(params)
              this.$message.success('保存成功')
              this.closeTab(true)
            } else {
              const data = await createInterfaceType(params)
              const loading = this.$loading({
                lock: true,
                text: '正在同步影院信息',
                spinner: 'el-icon-loading'
              })
              try {
                await getOpenCinema(data)
                loading.close()
                this.$message.success('保存成功')
                this.closeTab(true)
              } catch (e) {
                loading.close()
                this.closeTab(true)
              }
            }
          })
        }
      })
    }
  },
  async created() {
    // 编辑
    if (this.$route.query.id) {
      this.isEdit = true
      const params = await getInterfaceTypeInfo(this.$route.query.id)
      // if (params.otherInfo) {
      //   params.otherInfo = JSON.parse(params.otherInfo)
      // } else {
      //   params.otherInfo = {}
      // }
      params.id = this.$route.query.id
      this.params = params
    }
  }
}
</script>

<style scoped lang="scss">
.sub-menu{
  margin: 10px;
}
</style>
