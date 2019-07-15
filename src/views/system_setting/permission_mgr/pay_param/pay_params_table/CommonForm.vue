<template>
  <div>       
    <el-form inline ref="form" :rules="rules" :model="payParam" label-width="150px">
      <div>
        <p>
          上传支付图标:   (比例1:1,尺寸:40*40)
        </p>
      </div> 
       <el-form-item style="width:80%" prop="image">
              <pic-upload v-model="payParam.image" content="建议尺寸40*40"></pic-upload>
       </el-form-item>
       <div>
         <el-form-item class="get-right" prop="name" label="支付名称" label-width="1px;">
              <!-- <tip content="显示支付图标后面,例如:建行龙支付特惠购票." style="width:550px;"> -->
                <el-input v-model.trim="payParam.name" maxlength="8" oninput="if(value.length > 9)value = value.slice(0, 8)" placeholder="请输入内容最多8个字"></el-input>
              <!-- </tip>             -->
          </el-form-item>
        </div>
       <div>
         <el-form-item class="get-right" prop="describe" label="支付说明" label-width="1px;">
              <tip content="显示支付图标后面,例如:建行龙支付特惠购票." style="width:750px;">
                <el-input v-model.trim="payParam.describe" maxlength="50" oninput="if(value.length > 51)value = value.slice(0, 50)" placeholder="请输入内容最多50个字"></el-input>
              </tip>            
          </el-form-item>
        </div>
        <el-form-item class="get-right2" prop="sort" label="支付排序" label-width="1px;">
          <tip content="用户选择支付方式时的展示优先级排序,数字越大优先级越高." style="width:100px;">
            <el-input v-model.trim="payParam.sort" placeholder="请输入内容"></el-input>
          </tip>
        </el-form-item>
    </el-form>
    <slot></slot>

    <el-button type="danger" @click="submitForm" style="margin-top: 45px;">保存</el-button>
    <el-button style="margin-top: 45px;" @click="closeTab">关闭不保存</el-button>
  </div>
</template>

<script>
import { isPositiveInteger } from '@/utils/validate'
import { savePayConfig } from '@/api/systemSetting'
export default {
  name: 'pay_params_table',
  props: {
    value: Object,
    outSideRules: {
      type: Object,
      default: null
    },
    payType: {
      required: true
    }

  },
  data() {
    const checkSort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('支付排序不能为空'))
      }
      if (!isPositiveInteger(value)) {
        return callback(new Error('请输入正整数'))
      }
      callback()
    }
    return {
      payParam: {},
      rules: {
        image: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        name: [{ required: true, message: '请输入支付名称', trigger: 'blur', max: 8 }],
        sort: [{ validator: checkSort, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          savePayConfig(this.payParam).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.closeTab(true)
            this.$router.push('/system_setting/permission_mgr/pay_params_table')
          })
        } else {
          return false
        }
      })
    }
  },
  watch: {

  },
  created() {
    if (this.outSideRules) {
      this.rules = Object.assign(this.rules, this.outSideRules)
    }
    this.payParam = this.value
  }
}
</script>

<style scoped lang="scss">
</style>
