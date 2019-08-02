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
       <el-form-item class="get-right" prop="describe" label="支付说明">
            <el-input clearable  v-model.trim="payParam.describe" maxlength="10" oninput="if(value.length > 11)value = value.slice(0, 11)" placeholder="请输入内容最多10个字"></el-input>            
        </el-form-item>
        <el-form-item class="get-right2" prop="sort" label="支付排序">
            <el-input clearable  v-model.trim="payParam.sort" placeholder="请输入内容"></el-input>
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
        describe: [{ required: true, message: '请输入支付说明', trigger: 'blur', max: 10 }],
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
