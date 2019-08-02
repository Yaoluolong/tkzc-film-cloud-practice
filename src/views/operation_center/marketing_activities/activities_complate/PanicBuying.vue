<template>
    <el-form label-width="140px" :model="params" :rules="panicBuyingRules" ref="panicBuyingRulesForm">
    	<el-form-item label="投放终端:" prop="devices">
        <el-checkbox-group v-model="params.devices">
          <el-checkbox label="1">微信H5</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="投放位置:" prop="scopes">
        <el-checkbox label="2" v-model="params.scopes">活动模块</el-checkbox>
      </el-form-item>
      <el-form-item label="活动链接:" prop="link">
        <el-input clearable  v-model="params.link"></el-input>
      </el-form-item>
    </el-form>
</template>
<script>
  export default {
    name: 'panic_subsidy',
    props: {
      value: Object
    },
    data() {
      const checkUrl = (rule, value, cb) => {
        const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/
        if (!reg.test(value)) {
          cb(new Error('这网址不是以http://或https://开头，或者不是网址！'))
        }
        cb()
      }
      return {
        params: {
          devices: ['1'],
          scopes: ['2'],
          link: ''
        },
        panicBuyingRules: {
          devices: { required: true, message: '请填写投放终端', trigger: 'blur' },
          scopes: { required: true, message: '请填写投放位置', trigger: 'blur' },
          link: { required: true, validator: checkUrl, trigger: 'change' }
        }
      }
    },
    watch: {
      params: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true
      }
    },
    methods: {
      validateChild() {
        const _this = this
        this.$refs.panicBuyingRulesForm.validate(async(valid) => {
          if (valid) {
            _this.$emit('submitType', ['subject', true])
          } else {
            this.$message.warning('请填写完整表单内容')
            this.$emit('submitType', ['subject', false])
          }
        })
      },
      getSubmitType(type) { // 获取验证子组件表单的通过状态
        if (type[0] === 'subject') {
          this.canValidate = type[1]
        }
      }
    },
    created() {
      if (this.$route.query.id && !(this.value.devices instanceof Array)) { // 编辑
        // this.params = this.value
        this.value.devices ? this.$set(this.params, 'devices', this.value.devices.split(',')) : ''
        this.value.scopes ? this.$set(this.params, 'scopes', this.value.scopes.split(',')) : ''
        this.value.link ? this.$set(this.params, 'link', this.value.link) : ''
      }
    }
  }
</script>