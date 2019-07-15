<template>
    <div class="app-container">
            <el-form label-position="left" label-width="150px" ref="form" :rules="rules" :model="editData">
                <el-form-item label="商家名称:" prop="name" style="width:30%" >
                    <el-input v-model.trim="editData.name" placeholder="请输入积分平台商家名称,最多30个字符"></el-input>
                </el-form-item>
                <el-form-item label="积分平台接口地址:" prop="requestUrl" style="width:50%">
                     <el-input v-model.trim="editData.requestUrl" placeholder="请输入用于请求积分平台的接口地址"></el-input>
                </el-form-item>
                <el-form-item label="积分平台版本类:" prop="edition">
                    <remote-select v-model="editData.edition" valueKey="value" labelKey="name" 
                        lab placeholder="请选择接口版本类" action="/systemApi/integralPlatform/getEditionList" style="width:320px"></remote-select>   
                </el-form-item>
                <el-form-item label="接口请求参数:" style="width:70%" required>
                    <el-card>
                        <div>                            
                            <div v-for="item in editData.param" :key="item"> 
                               <span style="float:left;margin-left:1%">{{item}}</span>
                               <i style="margin-left:20%" @click="delParam(item)"  class="el-icon-close"></i>
                            </div>                           
                        </div>
                            <div>
                                <div v-show="showAddInput" style="margin-top:1%">
                                    <el-input v-model="newParam" placeholder="输入请求接口的键值,例如:【key】=【value】" style="width:70%;float:left;margin-right:5%"></el-input>
                                    <el-button type="success" @click="addParam()" icon="el-icon-check" ></el-button>
                                    <el-button type="danger" @click="showAddInput = false;newParam=''" icon="el-icon-delete" ></el-button>
                                </div>  
                            </div>
                        <div>
                            <el-button type="text" @click="showAddInput = true">+新增键值</el-button>
                        </div>
                    </el-card>                    
                </el-form-item>
                <el-form-item label="影票兑换比例:" style="width:100%" required>
                    <div>
                        <el-col :span="10" style="width:15%">
                            <el-form-item prop="ticketExchangePoint"  style="width:100%">
                                <el-input placeholder="请输入影票点数"  v-model.trim="editData.ticketExchangePoint" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" style="width:2%">
                             &nbsp; :
                        </el-col>
                        <el-col :span="10" style="width:15%">
                            <el-form-item prop="ticketExchangeIntegral" style="width:100%">
                                <el-input v-model.trim="editData.ticketExchangeIntegral" placeholder="请输入积分数" ></el-input>
                            </el-form-item>
                        </el-col> 
                    </div>
                </el-form-item>
                <el-form-item label="购物兑换比例:"  style="width:100%" required>
                    <div>
                        <el-col :span="10" style="width:15%">
                            <el-form-item prop="goodsExchangeMoney"  style="width:100%">
                               <el-input v-model.trim="editData.goodsExchangeMoney" placeholder="请输入商品金额" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" style="width:2%">
                             &nbsp; :
                        </el-col>
                        <el-col :span="10" style="width:15%">
                            <el-form-item prop="goodsExchangeIntegral" style="width:100%">
                                <el-input v-model.trim="editData.goodsExchangeIntegral" placeholder="请输入积分数"></el-input>
                            </el-form-item>
                        </el-col>                         
                    </div>
                </el-form-item>
                <el-form-item label="上传商家图标:" prop="image">
                    <pic-upload content="比例1:1,尺寸:60*60" v-model="editData.image"></pic-upload>
                </el-form-item>
            </el-form>
        <el-button style="margin-left:30%" type="primary" @click="save">保存</el-button>
        <el-button style="margin-left:2%" type="text" @click="closeTab">取消</el-button>
        
    </div>
</template>
<script>
import { createIntegralPlatform, getIntegralPlatform, updateIntegralPlatform } from '@/api/systemSetting'
import { isPositiveInteger } from '@/utils/validate'
export default {
  name: 'edit_score',
  data() {
    const checkTicketExchangePoint = (rule, value, cb) => {
      if (!isPositiveInteger(value) || !value) {
        cb(new Error('输入影票点数,只为正整数'))
      }
      cb()
    }
    const checkTicketExchangeIntegral = (rule, value, cb) => {
      if (!isPositiveInteger(value) || !value) {
        cb(new Error('输入积分数,只为正整数'))
      }
      cb()
    }
    const checkGoodsExchangeMoney = (rule, value, cb) => {
      if (!isPositiveInteger(value) || !value) {
        cb(new Error('输入商品金额,只为正整数'))
      }
      cb()
    }
    const checkGoodsExchangeIntegral = (rule, value, cb) => {
      if (!isPositiveInteger(value) || !value) {
        cb(new Error('输入积分数,只为正整数'))
      }
      cb()
    }
    return {
      editData: {
        name: '',
        param: []
      },
      showAddInput: false,
      newParam: '',
      rules: {
        name: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
        requestUrl: [{ required: true, message: '请输入接口地址', trigger: 'blur' }],
        edition: [{ required: true, message: '请输入版本', trigger: 'change' }],
        // param: [{ validator: checkParam, message: '请输入参数', trigger: 'blur' }],
        ticketExchangePoint: { validator: checkTicketExchangePoint, trigger: 'blur' },
        ticketExchangeIntegral: { validator: checkTicketExchangeIntegral, trigger: 'blur' },
        goodsExchangeMoney: { validator: checkGoodsExchangeMoney, trigger: 'blur' },
        goodsExchangeIntegral: { validator: checkGoodsExchangeIntegral, trigger: 'blur' },
        image: [{ required: true, message: '请选择商家logo', trigger: 'change' }]
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            this.editData.id = this.$route.query.id
            this.$confirm('确定修改该积分平台商家的信息吗？', '新增提示', { type: 'warning' })
              .then(() => {
                updateIntegralPlatform(this.editData).then(() => {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  this.closeTab()
                  this.$router.push('/system_setting/permission_mgr/score')
                })
              })
          } else {
            this.$confirm('确定新增该积分平台商家吗？同意新增商家成功后该商家默认是“关闭”状态，需在列表内进行手动“开启”操作！', '新增提示', { type: 'warning' })
              .then(() => {
                createIntegralPlatform(this.editData).then(() => {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  this.closeTab(true)
                  this.$router.push('/system_setting/permission_mgr/score')
                })
              })
          }
        } else {
          return false
        }
      })
    },
    addParam() {
      if (this.newParam) {
        if (!this.editData.param) {
          this.editData.param = []
        }
        this.editData.param.push(this.newParam)
        this.newParam = ''
        this.showAddInput = false
      }
    },
    delParam(item) {
      var index = this.editData.param.indexOf(item)
      if (index > -1) {
        this.editData.param.splice(index, 1)
      }
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.editData = await getIntegralPlatform(this.$route.query.id)
    }
  }
}
</script>
<style scoped>
.el-form-item{
    width: 300px;
}
</style>


