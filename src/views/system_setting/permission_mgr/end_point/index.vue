<template>
  <div class="app-container">
       <el-form inline label-width="120px">
            <!-- <el-form-item label="商家名称">
                <el-input v-model="query.name"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
            </el-form-item> -->
             <el-form-item >
              <el-button type="primary" icon="el-icon-plus"  @click="showAdd()">新增</el-button>
            </el-form-item>
         </el-form>
         <br>
         <page-table ref="table" :query="query" :fetch="fetchData">
            <el-table-column min-width="100"  label="终端名称" align="center" prop="name" ></el-table-column>
            <el-table-column min-width="100"  label="适用商家" align="center" prop="channelTypeStr" ></el-table-column>
            <el-table-column min-width="120"  label="终端编码" align="center" prop="code"></el-table-column>
            <el-table-column min-width="120"  label="登录类型" align="center" prop="loginTypeStr"></el-table-column>
            <el-table-column min-width="120"  label="终端类型" align="center" prop="typeName">               
            </el-table-column>            
            <el-table-column min-width="120"  label="操作" align="center" prop="broswer">
                <template slot-scope="{row}">
                    <el-button @click="showEdit(row)" type="text">编辑</el-button>
                    <el-button @click="del(row.id)" type="text">删除</el-button>
                </template>
            </el-table-column>
         </page-table>

        <el-dialog :title="dialogData.title" :visible.sync="dialogData.dialogVisible" width="30%">
          <span>
              <el-form inline :model="submitData" :rules="rules" ref="form">
                <el-form-item label="终端名称:" prop="name">
                    <el-input v-model.trim="submitData.name" style="width: 280px;" :maxlength="8" placeholder="请输入终端名称,最多8个字"></el-input>
                </el-form-item>
                <el-form-item label="适用商家:" prop="channelType">
                  <el-radio-group v-model="submitData.channelType" size="medium">
                    <el-radio label="1">自营</el-radio>
                    <el-radio label="2">加盟</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="终端代码:" prop="code" v-if="submitData.channelType==='1'">
                    <el-input v-model.trim="submitData.code" style="width: 280px;" placeholder="请输入消费终端代码"></el-input>
                </el-form-item>
                <el-form-item label="终端类型:" prop="type">
                    <!-- <el-select v-model="submitData.type" placeholder="请选择">
                        <el-option label="IOS" value="1"></el-option>
                        <el-option label="安卓" value="2"></el-option>
                        <el-option label="微信H5" value="3"></el-option>
                    </el-select> -->
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="submitData.type" @change="handleCheckedTypesChange">
                  <el-checkbox v-for="item in submitDataTypeOptions" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                </el-form-item>
                <el-form-item label="登录类型:" prop="loginType" v-if="submitData.channelType==='1'">
                  <el-radio-group v-model="submitData.loginType" size="medium">
                    <el-radio label="1">自有平台方式登录</el-radio>
                    <el-radio label="2">第三方平台联合登录</el-radio>
                  </el-radio-group>
                  <div v-if="submitData.loginType==='1'" style="color:rgb(157, 161, 169);">微信授权登录、手机号快捷登录，微信授权与手机号必须关联绑定！</div>
                </el-form-item>
                <el-form-item label="联名登录平台:" prop="platformType" v-if="submitData.channelType==='1' && submitData.loginType==='2'">
                  <remote-select v-model="submitData.platformType"  placeholder="请选择联名登录平台" action="systemApi/consumerTerminal/getPlatformList" :query="{}" style="width:200px;"></remote-select>
                </el-form-item>
              </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogData.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">保 存</el-button>
          </span>
        </el-dialog>
  </div>
</template>

<script>
import { getConsumerTerminalPage, createConsumerTerminalPage, updateConsumerTerminalPage, deleteConsumerTerminal } from '@/api/systemSetting'
export default {
  name: 'score',
  data() {
    return {
      submitDataTypeOptions: [{
        value: '1',
        name: 'IOS'
      }, {
        value: '2',
        name: '安卓'
      }, {
        value: '3',
        name: '微信H5'
      }],
      checkAll: false,
      isIndeterminate: true,
      dialogData: {
        dialogVisible: false,
        title: '新增消费终端'
      },
      submitData: {
        type: [],
        name: '',
        channelType: '1',
        code: '',
        loginType: '1',
        platformType: ''
      },
      rules: {
        name: { required: true, max: 8, message: '请输入终端名称,最多8个字', trigger: 'blur' },
        code: { required: true, message: '请输入消费终端代码', trigger: 'blur' },
        type: { required: true, message: '请选择终端类型', trigger: 'blur' },
        channelType: { required: true, message: '请选择适用商家', trigger: 'blur' },
        loginType: { required: true, message: '请选择登录类型', trigger: 'blur' },
        platformType: { required: true, message: '请选择联名登录平台', trigger: 'blur' }
      },
      query: {}
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.submitData.type = val ? this.submitDataTypeOptions.map(e => e.value) : []
      this.isIndeterminate = false
    },
    handleCheckedTypesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.submitDataTypeOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.submitDataTypeOptions.length
    },
    del(id) {
      this.$confirm('是否确定要执行此操作', '删除提示', { type: 'warning' }).then(() => {
        deleteConsumerTerminal(id).then(() => {
          this.refreshTable()
        })
      })
    },
    fetchData(query) {
      return getConsumerTerminalPage(query)
    },
    refreshTable() {
      if (this.$refs.table) {
        this.$refs.table.refresh()
      }
    },
    showAdd() {
      this.dialogData.dialogVisible = true
      this.dialogData.title = '新增消费终端'
      this.clearSubmitData()
    },
    showEdit(row) {
      if (row.isRelationPf === 1) {
        this.$message.warning('请先与商家解除关联后，再进行编辑操作！')
        return
      }
      this.dialogData.dialogVisible = true
      this.dialogData.title = '编辑消费终端'
      this.submitData.name = row.name
      this.submitData.type = row.type.split(',')
      this.submitData.code = row.code
      this.submitData.id = row.id
      this.submitData.channelType = row.channelType
      this.submitData.loginType = row.loginType
      this.submitData.platformType = row.platformType
    },
    clostDialog() {
      // this.clearSubmitData()
      this.dialogData.dialogVisible = false
    },
    clearSubmitData() {
      this.submitData.name = ''
      this.submitData.type = []
      this.submitData.code = ''
      this.submitData.channelType = ''
      this.submitData.loginType = ''
      this.submitData.platformType = ''
      delete this.submitData.id
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let promise
          const request = {}
          request.code = this.submitData.code
          request.name = this.submitData.name
          request.type = this.submitData.type.join(',')
          request.channelType = this.submitData.channelType
          request.loginType = this.submitData.loginType
          request.platformType = this.submitData.platformType
          if (this.submitData.id) {
            request.id = this.submitData.id
            promise = updateConsumerTerminalPage(request)
          } else {
            promise = createConsumerTerminalPage(request)
          }
          promise.then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.clostDialog()
            this.refreshTable()
          })
        }
      })
    }
  },
  created() {
    this.refreshTable()
  }
}
</script>

<style scoped lang="scss">

</style>
