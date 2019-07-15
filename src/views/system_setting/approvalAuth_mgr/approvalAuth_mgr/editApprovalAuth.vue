<template>
    <div class="app-container">
	    <el-form label-width="140px" label-position="left" style="width:1000px;" :model="params" :rules="rules" ref="form">
	    	<el-form-item label="审批类型：" prop="type">
		        <remote-select v-model="params.type" placeholder="请选择审批类型" action="/systemApi/dict/getList" :query="{type:'approvalType'}" style="width:230px;" @change="resetData"></remote-select>
		    </el-form-item>
	        <el-form-item label="审批流名称：" prop="name">
	          <el-input placeholder="请输入便于识别的审批流程名称,字数限制30个字" v-model.trim="params.name" style="width:450px"></el-input>
	        </el-form-item>
	        <el-form-item label="适用业务员：" prop="salesmanList" label-width="130px" v-if="!$route.query.id || (ok && $route.query.id)">
	        	<approval-man-selector ref="salesmanListComponent" v-model="params.salesmanList" :salesman="params.salesman" @salesmanChange="salesmanChange"></approval-man-selector>
	        </el-form-item>
	        <el-form-item label="审批流程开关：" prop="process" label-width="130px">
	        	<span style="font-size:14px;color:rgb(142, 142, 142);">请勾选需要开启的审批流程</span>
	        	<br/>
	        	<el-checkbox-group v-model="params.selectedProcessArray" @change="nodeListChange">
		            <el-checkbox v-for="processS in processArr" :label="processS.value" :key="processS.value">{{processS.name}}</el-checkbox> 
	          	</el-checkbox-group>
	        </el-form-item>
	        <el-form-item label="审批节点：" prop="nodeType" label-width="130px">
	        	<span style="font-size:14px;color:rgb(142, 142, 142);">以上所选操作审批流程是否一致？</span>
	        	<br/>
	        	<el-radio v-model="params.nodeType" label="1" @change="nodeListChange">统一配置</el-radio>
	        	<el-radio v-model="params.nodeType" label="2" @change="nodeListChange">独立配置</el-radio>
	        </el-form-item>
	        <div v-for="(node,index) in params.nodeList" :key="index">
		        <el-form-item label="" :prop="'nodeList.'+index+'.node'" :rules="nodeListRules.node" label-width="130px">		
		        	<approval-node-selector ref="approvalNode" v-model="params.nodeList[index]" :processId="params.nodeList[index].process" :nodeType="params.nodeType"></approval-node-selector>
		        </el-form-item>
		      </div>
	    </el-form>
	    <el-button type="primary" @click="save" v-if="!look">保存</el-button>
    	<el-button @click="cancel" >取消</el-button>
 	</div>
</template>
<script>
import ApprovalManSelector from '@/components/ApprovalManSelector'
import ApprovalNodeSelector from '@/components/ApprovalNodeSelector'
import { getApprovalTypeList, createApprovalType, getApprovalInfo } from '@/api/systemSetting'
export default{
  name: 'edit_approval_auth',
  components: { ApprovalManSelector, ApprovalNodeSelector },
  data() {
    return {
      params: {
        type: '1',
        name: '',
        process: '',
        salesmanList: [],
        selectedProcessArray: ['2', '3', '4', '5'],
        nodeType: '1',
        nodeList: [
          /* { process: '-1',
            priority: '1',
            accountList: [],
            accountId: '',
            messageType: '',
            smsTemplateType: '',
            smsTemplateId: '',
            mobile: ''
          }*/
        ]
      },
      rules: {
        type: { required: true, message: '请选择审批类型', trigger: 'blur' },
        name: { required: true, message: '请填写审批流名称', trigger: 'blur' }
      },
      nodeListRules: {
        node: { required: true, message: '请选择审批人', trigger: 'blur' }
      },
      salesmanListShow: false,
      processArr: [],
      ok: false
    }
  },
  methods: {
    resetData(val) {
      this.typeChange(val)
      this.nodeListChange()
    },
    async typeChange(val) {
      this.$set(this.params, 'selectedProcessArray', [])
      let approvalType = ''
      switch (val) {
        case '1':
          approvalType = 'couponApproval'
          this.$set(this.params, 'selectedProcessArray', ['2', '3', '4', '5'])
          break
        case '2':
          approvalType = 'cardApproval'
          this.$set(this.params, 'selectedProcessArray', ['2', '3', '4', '5'])
          break
        case '3':
          approvalType = 'ActiveApproval'
          this.$set(this.params, 'selectedProcessArray', ['2'])
          break
      }
      this.processArr = await getApprovalTypeList({ type: approvalType })
    },
    nodeListChange() {
      if (Object.keys(this.$refs).length !== 0) {
        this.$refs.approvalNode[0].resetData()
      }
      this.$set(this.params, 'nodeList', [])
      if (this.params.nodeType === '2') {
        this.params.selectedProcessArray.sort().map(e => {
          this.params.nodeList.push({
            process: e,
            priority: '1',
            accountList: [],
            accountId: '',
            messageType: '',
            smsTemplateType: '',
            smsTemplateId: '',
            mobile: ''
          })
        })
      } else {
        this.params.nodeList.push({
          process: '-1',
          priority: '1',
          accountList: [],
          accountId: '',
          messageType: '',
          smsTemplateType: '',
          smsTemplateId: '',
          mobile: ''
        })
      }

      if (this.$refs.approvalNode) {
        this.$refs.approvalNode.map(e => {
          e.resetData()
        })
      }

      console.log(this.$refs)
    },
    salesmanChange(val) {
      this.$set(this.params, 'salesman', val.map(e => e.value).join(','))
    },
    save() {
      this.$set(this.params, 'salesman', this.params.salesmanList.map(e => e.value).join(','))
      this.$set(this.params, 'process', this.params.selectedProcessArray.map(e => e).join(','))
      const request = this.params
      request.salesmanList.forEach(e => {
        this.$set(e, 'checked', 'true')
      })
      request.nodeList.forEach(el => {
        el.accountList.forEach(e => {
          this.$set(e, 'checked', 'true')
        })
      })
      /* delete request.salesmanList
	delete request.selectedProcessArray*/
      createApprovalType(request).then(res => {
        this.$message.success('保存成功')
        this.closeTab(true)
        this.$router.push({ path: '/system_setting/approvalAuth_mgr/approvalAuth_mgr' })
      }).catch(e => {
        this.params.salesmanList.forEach(e => {
          this.$set(e, 'checked', true)
        })
        this.params.nodeList.forEach(el => {
          el.accountList.forEach(e => {
            this.$set(e, 'checked', true)
          })
        })
      })
    },
    cancel() {
      this.closeTab(true)
    }
  },
  async created() {
    if (!this.$route.query.id) {
      this.resetData('1')
    }
    if (this.$route.query.id) {
      await getApprovalInfo({ id: this.$route.query.id }).then(e => {
        this.params = e
        this.typeChange(this.params.type)
        this.params.selectedProcessArray = this.params.process.split(',').filter(e => e)
        this.ok = true
      })
    }
  }
}
</script>
<style  lang="scss">

</style>