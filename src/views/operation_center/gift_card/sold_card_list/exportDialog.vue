<template>
  <el-dialog title="导出卡" :visible="value" width="50%" @close="closeDialog" :close-on-click-modal="false">
    <el-form label-width="130px" :model="agur" :rules="exportRules" ref="exportForm">
      <el-form-item label="电影卡销售订单号" prop="orderNo">{{agur.orderNo||'--'}}</el-form-item>
      <el-form-item label="电影卡数量" prop="num">{{agur.num||'--'}}张</el-form-item>
      <el-form-item label="客户名称" prop="customerName">{{agur.customerName||'--'}}</el-form-item>
      <el-form-item label="导出字段" prop="fieldList">
        <zm-checkbox v-model="agur.fieldList" :list="fieldList" :option="{checkboxClass:'wp25'}">
            <template slot-scope="msg">
              <div>
                <span>{{msg.item.name}}</span>
              </div>
            </template>
          </zm-checkbox>
      </el-form-item>
      <el-form-item label="导出方式" prop="exportType">
        <el-radio v-model="agur.exportType" label="1">直接导出</el-radio>
      </el-form-item>
      <el-form-item label="接收校验码" prop="mobile">
        <el-input v-model="agur.mobile" placeholder="输入接收校验码" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="导出备注" prop="remark">
        <el-input type="textarea" :row="5" v-model="agur.remark" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="exportOrders(agur.orderNo)">导 出</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { exportCardDetail, getUnsoldExportCardField } from '@/api/operationCenter'
import zmCheckbox from '@/components/isNeedComponents/zmCheckbox'
export default {
  components: { zmCheckbox },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    exportParams: {
      type: Object,
      default: {
        num: '',
        orderNo: ''
      }
    }
  },
  data() {
    return {
      fieldList: [],
      agur: {
        orderNo: '',
        fieldList: '',
        exportType: '1',
        mobile: '',
        remark: ''
      },
      exportRules: {
        fieldList: [
          {
            required: true,
            message: '请选择导出字段',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入接收文件校验码的手机号',
            trigger: 'blur'
          },
          { min: 11, max: 11, message: '手机号码必须是11位', trigger: 'blur' },
          { pattern: /^1\d{10}/, message: '请填写正确手机号', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.exportForm.clearValidate()
    })
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      this.agur = Object.assign({}, this.agur, this.exportParams)
      this.fieldList = await getUnsoldExportCardField()
    },
    closeDialog() {
      this.$emit('input', false)
    },
    async exportOrders() {
      const valid = await this.$refs.exportForm.validate()
      if (!valid) return
      const agur = {
        orderNo: this.agur.orderNo,
        fields: this.agur.fieldList ? this.agur.fieldList.split(',') : [],
        mobile: this.agur.mobile,
        remark: this.agur.remark
      }
      await exportCardDetail(agur)
      this.$router.push({ path: '/system_setting/task_mgr/task_mgr', query: { id: agur.orderNo }})
      this.closeDialog()
    }
  }
}
</script>
