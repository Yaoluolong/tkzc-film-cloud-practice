<template>
  <div class="salemanContent">
    <div class="salemanTitle">{{approvalName}}</div>
    <div class="salemanContentainer">
      <el-radio-group v-model="selectType" style="margin-top:-5%">
        <el-radio :label="'1'">所有职员</el-radio>
        <el-radio :label="'2'">指定职员</el-radio>
      </el-radio-group>
      <el-form inline :model="query" ref="form" v-show="selectType === '2'">
        <el-form-item prop="name">
          <el-input v-model="query.name" placeholder="请输入职员名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData(query.name)">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="checkbox-plane" v-show="selectType === '2'">
        <div class="header">
          <el-checkbox @change="doSelectAll" v-model="selectAll">全选</el-checkbox>
        </div>
        <div class="content">
          <div class="check-item" v-for="(user,index) in UserList.list" :key="index">
            <el-checkbox @change="doChangeFun" v-model="user.checked">{{user.name}}</el-checkbox>
          </div>
        </div>
      </div>
      <div>
        <el-form>
          <el-form-item label="审批提醒：" prop="messageType" style="margin-bottom:20px;">
            <el-radio v-model="nodeList.messageType" label="1">短信</el-radio>
            <el-radio v-model="nodeList.messageType" label="2" disabled>邮箱</el-radio>
          </el-form-item>
          <el-form-item label="模板类型：" prop="smsTemplateType" style="margin-bottom:20px;">
            <remote-select
              v-model="nodeList.smsTemplateType"
              clearable
              placeholder="请选择"
              action="/systemApi/dict/getList"
              :query="{type:'smsTemplateType'}"
              @change="parentTypeChange"
            ></remote-select>
          </el-form-item>
          <el-form-item label="模板名称：" prop="smsTemplateStr" style="margin-bottom:20px;">
            <el-select v-model="nodeList.smsTemplateStr" clearable placeholder="请选择模板名称">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知接收人：" style="margin-bottom:20px;" class="mobileStyle">
            <el-input
              clearable
              v-model="nodeList.mobile"
              type="textarea"
              :rows="5"
              style="width:600px;"
              placeholder="接收号码与接收号码之间用英文“,”隔开"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserListForPage, getTemplateNameList } from '@/api/systemSetting'
import { mergeArray } from '@/utils'
export default {
  props: {
    value: [String, Array, Object],
    nodeType: String,
    processId: String,
    showAllChoice: Boolean
  },
  data() {
    return {
      selectTypebak: '2',
      selectType: '2', // 1 选择全部职员  2 指定职员
      query: {},
      UserList: [],
      selectedUserList: [],
      selectAll: false,
      delSelect: {},
      changeUserList: [],
      options: [],
      nodeList: {
        process: this.processId,
        priority: '1',
        accountId: '',
        messageType: '',
        smsTemplateType: '',
        smsTemplateStr: '',
        mobile: ''
      },
      approvalName: ''
    }
  },
  watch: {
    processId(val) {
      this.titleChange()
    },
    nodeList: {
      handler(val) {
        const accountId = this.selectedUserList
          .map(e => {
            return e.value
          })
          .join(',')
        const nodeResult = {
          process: this.processId,
          priority: '1',
          accountId: accountId,
          accountList: this.selectedUserList,
          messageType: this.nodeList.messageType,
          smsTemplateType: this.nodeList.smsTemplateType,
          smsTemplateStr: this.nodeList.smsTemplateStr,
          mobile: this.nodeList.mobile
        }
        this.$emit('input', nodeResult)
      },
      deep: true
    },
    selectType(val) {
      if (val === '1') {
        this.selectedUserList = [
          {
            name: '-1',
            value: '-1'
          }
        ]
        const nodeResult = {
          process: this.processId,
          priority: '1',
          accountId: '-1',
          accountList: this.selectedUserList,
          messageType: this.nodeList.messageType,
          smsTemplateType: this.nodeList.smsTemplateType,
          smsTemplateStr: this.nodeList.smsTemplateStr,
          mobile: this.nodeList.mobile
        }
        this.$emit('input', nodeResult)
      } else {
        this.selectedUserList = []
        const nodeResult = {
          process: this.processId,
          priority: '1',
          accountId: '',
          accountList: [],
          messageType: this.nodeList.messageType,
          smsTemplateType: this.nodeList.smsTemplateType,
          smsTemplateStr: this.nodeList.smsTemplateStr,
          mobile: this.nodeList.mobile
        }
        this.$emit('input', nodeResult)
        this.fetchData()
      }
    },
    /* value(val) {
        console.log(val)
        if (this.nodeList !== val) {
          this.nodeList = val
        }
      },*/
    delSelect(val) {
      this.changeUserList.forEach(e => {
        if (e.value === val.value) {
          e.checked = false
        }
      })
    },
    resetData() {
      this.$set(this, 'selectedUserList', [])
      this.$set(this, 'nodeList', {
        process: this.processId,
        priority: '1',
        accountId: '',
        messageType: '',
        smsTemplateType: '',
        smsTemplateStr: '',
        mobile: ''
      })
    }
  },
  methods: {
    resetData() {
      this.$set(this, 'nodeList', {
        process: '',
        priority: '1',
        accountId: '',
        accountList: [],
        messageType: '',
        smsTemplateType: '',
        smsTemplateStr: '',
        mobile: ''
      })
      this.selectedUserList = []
      this.UserList.list.map(e => {
        e.checked = false
      })
    },
    doChangeFun(val) {
      this.selectTypebak = this.selectType

      if (this.selectTypebak === '1') {
        this.selectedUserList = mergeArray(
          this.selectedUserList,
          this.UserList.list
        )
      } else {
        /* this.selectedUserList = mergeArray(this.selectedUserList.filter(e => e.value !== '-1'), this.UserList.list.filter(e => e.checked))*/
        this.$set(
          this,
          'selectedUserList',
          this.UserList.list.filter(e => e.checked)
        )
      }
      const nodeResult = {
        process: this.processId,
        priority: '1',
        accountId:
          this.selectType === '1'
            ? '-1'
            : this.selectedUserList
              .map(e => {
                return e.value
              })
              .join(','),
        accountList:
          this.selectType === '1'
            ? mergeArray(this.selectedUserList, this.UserList.list)
            : this.UserList.list.filter(e => e.checked),
        messageType: this.nodeList.messageType,
        smsTemplateType: this.nodeList.smsTemplateType,
        smsTemplateStr: this.nodeList.smsTemplateStr,
        mobile: this.nodeList.mobile
      }
      this.$emit('input', nodeResult)
      this.$forceUpdate()
    },
    doSelectAll(val) {
      this.UserList.list.forEach(e => {
        this.$set(e, 'checked', val)
      })
      if (val) {
        this.selectedUserList = this.UserList.list
      } else {
        this.selectedUserList = []
      }
    },
    async fetchData(val) {
      this.UserList = await getUserListForPage({ realName: val })

      this.UserList.list.forEach(e => {
        const temp = this.selectedUserList.find((value, index, arr) => {
          return value.value === e.value
        })
        if (temp) {
          e.checked = true
        }
      })
    },
    parentTypeChange(val) {
      this.$set(this.nodeList, 'smsTemplateStr', '')
      getTemplateNameList({ type: val }).then(res => {
        this.options = []
        res.forEach(e => {
          this.options.push({
            label: e.name,
            value: e.value
          })
        })
      })
    },
    editNode() {
      const accountId = this.selectedUserList
        .map(e => {
          return e.value
        })
        .join(',')
      const nodeResult = {
        process: this.processId,
        priority: '1',
        accountId: accountId,
        accountList: this.selectedUserList,
        messageType: this.nodeList.messageType,
        smsTemplateType: this.nodeList.smsTemplateType,
        smsTemplateStr: this.nodeList.smsTemplateStr,
        mobile: this.nodeList.mobile
      }
      this.parentTypeChange(this.nodeList.smsTemplateType)
      this.$set(this, 'nodeList', nodeResult)
    },
    titleChange() {
      if (this.nodeType === '1') {
        this.approvalName = '选择职员'
      } else {
        switch (this.processId) {
          case '1':
            this.approvalName = '总经理审批'
            break
          case '2':
            this.approvalName = '部门经理审批'
            break
          case '3':
            this.approvalName = '财务收款审批'
            break
          case '4':
            this.approvalName = '财务开票审批'
            break
          case '5':
            this.approvalName = '财务激活审批'
            break
        }
      }
    }
  },
  created() {
    if (this.value) {
      this.nodeList = this.value
      this.titleChange()
      if (this.value.accountId === '-1') {
        this.$set(this, 'selectType', '1')
        this.selectedUserList.push({
          name: '-1',
          value: '-1'
        })
      } else {
        this.$set(this, 'selectType', '2')
        const accountListTemp = this.value.accountList
        this.selectedUserList = accountListTemp.filter(e => {
          return e.value
        })
      }
      this.editNode()
    }
    this.fetchData()
  }
}
</script>

<style scoped lang="scss">
.salemanContent {
  border: 1px solid #dcdfe6;
  .salemanTitle {
    padding-left: 20px;
    border-bottom: 1px solid #dcdfe6;
    background-color: #f2f6fc;
  }
  .salemanContentainer {
    padding: 20px;
    .salemanCont {
      padding-top: 20px;
    }
  }
  .checkbox-plane {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    margin: 20px 0;
  }
  .header {
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #f2f6fc;
    padding: 0 20px;
    border-bottom: 1px solid #dcdfe6;
  }
  .content {
    padding: 0px 20px 20px 20px;
    margin: -10px 0px;
    margin-top: 0;
    max-height: 300px;
    overflow: auto;
    .check-item {
      margin: 10px 0px;
    }
  }
  .tag-plane {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .selected-item {
      margin: 10px;
    }
  }
}
</style>
<style>
.mobileStyle .el-form-item__label:before {
  content: '' !important;
}
</style>
