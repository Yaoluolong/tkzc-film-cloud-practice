<template>
    <el-card v-if="detail.invoiceType !== '1'" shadow="never" style="width:800px;margin-top:20px;margin-bottom:15px;">
        <el-form label-width="140px" :model="submitData" inline-message ref="form" label-position="right" :rules="invoiceRules">
            <el-form-item label="发票类型:">
                <!-- <div style="float:right"> <span :style="style"> {{detail.isDrawInvoice === '9' ? '已开票' : '未开票'}}</span></div> -->
                <div>{{detail.invoiceTypeName}}</div>             
            </el-form-item>
            <el-form-item label="发票抬头:" v-if="detail.title">
                {{detail.title}}
            </el-form-item>
            <el-form-item label="身份证号:" v-if="detail.idNumber">
               {{detail.idNumber}}
            </el-form-item>
            <!-- 企业相关START -->
            <el-form-item label="税号:" v-if="detail.taxNo">
                {{detail.taxNo}}
            </el-form-item>
            <el-form-item label="企业地址:" v-if="detail.companyAddress">
                {{detail.companyAddress}}
            </el-form-item>
            <el-form-item label="电话号码:" v-if="detail.companyMobile">
                {{detail.companyMobile}}
            </el-form-item>
            <el-form-item label="开户银行:" v-if="detail.bank">
                {{detail.bank}}
            </el-form-item>
            <el-form-item label="银行账号:" v-if="detail.bankNo">
                {{detail.bankNo}}
            </el-form-item>
            <el-form-item prop="invoiceNo" v-if="detail.invoiceType !== '1'" label="发票号:" >
                <span v-if="detail.isDrawInvoice === '1'">{{detail.invoiceNo}}</span>
                <el-input v-else style="width:250px;" v-model="detail.invoiceNo" placeholder="输入发票号"></el-input>
            </el-form-item>
            <el-form-item v-if="detail.invoiceType !== '1'" label="开票金额:" prop="invocieMoney">
                <span v-if="detail.isDrawInvoice === '1'">{{detail.invocieMoney}}</span>
                <el-input v-else style="width:100px" v-model="detail.invocieMoney" placeholder="0"></el-input>  元
            </el-form-item>
            <el-form-item v-if="detail.invoiceType !== '1'" label="开票说明:">
                <span v-if="detail.isDrawInvoice === '1'">{{detail.drawInvoiceExplain}}</span>
                <el-input v-else style="width:400px" type="textarea" v-model="detail.drawInvoiceExplain" placeholder="请输入开票说明"></el-input>
            </el-form-item>
            
            <!-- 企业相关END -->
            <!-- 个人相关START -->               
            <!-- 个人相关END -->
            <el-form-item label="电子邮箱:" v-if="detail.receiveEmail">
                {{detail.receiveEmail}}
            </el-form-item>
            <el-form-item label="领取方式:" v-if="detail.receiveTypeName">
               {{detail.receiveTypeName}}
            </el-form-item>
            <el-form-item label="收件人:" v-if="detail.receiveName">
                {{detail.receiveName}}
            </el-form-item>
            <el-form-item label="联系电话:" v-if="detail.receiveMobile">
                {{detail.receiveMobile}}
            </el-form-item>
            <el-form-item label="收件地址:" v-if="detail.receiveAddress">
                {{detail.receiveAddress}}
            </el-form-item>
            <!-- <el-form-item v-if="detail.receiveType == '1'" label="配送公司:" prop="transportName">
                <el-input style="width:250px;" v-model="submitData.transportName" placeholder="输入快递公司名称"></el-input>
            </el-form-item>
            <el-form-item v-if="detail.receiveType == '1'" label="运单号:" prop="transportNo">
                <el-input  style="width:250px;" v-model="submitData.transportNo" placeholder="输入快递运单号"></el-input>
            </el-form-item> -->
            <el-form-item  label="开票状态:" v-if="detail.isDrawInvoice === '1'">
              {{detail.isDrawInvoiceStr}}
            </el-form-item>
            <el-form-item  label="开票人:" v-if="detail.isDrawInvoice === '1'">
              {{detail.drawInvoicePeople}}
            </el-form-item>
            <el-form-item  label="开票时间:" v-if="detail.isDrawInvoice === '1'">
              {{detail.drawInvoiceTime}}
            </el-form-item>
             <el-form-item style="margin-top:30px" v-if="detail.isDrawInvoice === '0'">
                <el-button style="margin-left:180px" type="primary" @click="save">确定开票</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { drawCardInvoice, drawCouponInvoice } from '@/api/operationCenter'
export default {
  props: {
    outData: [Object, Array], // 初始化数据
    type: String, // 开票类型  coupon  card
    drawInvoiceName: String
  },
  data() {
    return {
      detail: this.outData,
      submitData: {
        transportName: '',
        transportNo: '',
        invoiceNo: '',
        invocieMoney: ''
      },
      invoiceRules: {
        invoiceNo: { required: true, message: '请输入发票号', trigger: 'blur' },
        invocieMoney: { required: true, message: '请输入开票金额', trigger: 'blur' },
        transportName: { required: true, message: '请输入配送公司名称', trigger: 'blur' },
        transportNo: { required: true, message: '请输入运单号', trigger: 'blur' }
      }
    }
  },
  watch: {
    'outData'(val) {
      this.detail = val
      this.submitData = val
    }
  },
  methods: {
    save() {
      this.detail.invoiceNo === null ? this.detail.invoiceNo = '' : ''
      this.detail.invocieMoney === '0.00' ? this.detail.invocieMoney = '' : ''
      this.submitData.orderNo = this.detail.orderNo
      this.submitData.invoiceNo = this.detail.invoiceNo
      this.submitData.invocieMoney = this.detail.invocieMoney
      this.submitData.drawInvoiceExplain = this.detail.drawInvoiceExplain
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type === 'card') {
            drawCardInvoice(this.submitData).then(res => {
              this.$message.success('开票成功')
              this.$set(this.detail, 'isDrawInvoice', '1')
              this.$set(this.detail, 'drawInvoicePeople', res)
            })
          } else if (this.type === 'coupon') {
            drawCouponInvoice(this.submitData).then(res => {
              this.$message.success('开票成功')
              this.$set(this.detail, 'isDrawInvoice', '1')
              this.$set(this.detail, 'drawInvoicePeople', res)
            })
          }
          setTimeout(() => { this.$emit('refresh') }, 200)
        }
      })
    }
  },
  created() {
    this.submitData = Object.assign(this.submitData, this.detail)
  }
}
</script>

<style scoped lang="scss">

</style>
