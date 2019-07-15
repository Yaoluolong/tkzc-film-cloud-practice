<template>
    <div class="app-container">
	    <el-form label-width="140px" label-position="left" style="width:1000px;" :model="params" ref="form">
	    	<el-form-item label="审批类型：" prop="type">
            {{params.typeName}}
		    </el-form-item>
	        <el-form-item label="审批流名称：" prop="name">
	         <span>{{params.name}}</span>
          </el-form-item>
	        <el-form-item label="适用业务员：" prop="salesmanList" label-width="130px">
	        	<!-- <approval-man-selector ref="salesmanListComponent" v-model="params.salesmanList" :salesman="params.salesman" @salesmanChange="salesmanChange"></approval-man-selector> -->
              <span>{{salesman}}</span>
	        </el-form-item>
	        <el-form-item label="审批流程开关：" prop="process" label-width="130px">
	        	<!-- <span style="font-size:14px;color:rgb(142, 142, 142);">请勾选需要开启的审批流程</span>
            <br/>
            <el-checkbox-group v-model="params.selectedProcessArray" @change="nodeListChange">
                            <el-checkbox v-for="processS in processArr" :label="processS.value" :key="processS.value">{{processS.name}}</el-checkbox> 
                          </el-checkbox-group> -->
                          {{params.processName}}
	        </el-form-item>
	        <el-form-item label="审批节点：" prop="nodeType" label-width="130px">
	        	<!-- <span style="font-size:14px;color:rgb(142, 142, 142);">以上所选操作审批流程是否一致？</span>
            <br/> -->
	        	<el-radio v-model="params.nodeType" label="1" disabled>统一配置</el-radio>
	        	<el-radio v-model="params.nodeType" label="2" disabled>独立配置</el-radio>
	        </el-form-item>
	        <div v-for="(node,index) in nodeStrTemp" :key="index">
		        <el-form-item label="" label-width="130px">		
		        	<!-- <approval-node-selector ref="approvalNode" v-model="params.nodeList[index]" :processId="params.nodeList[index].process" :nodeType="params.nodeType"></approval-node-selector> -->
              <h3>{{node.processName}}</h3>
              <p>审批人：{{node.acctounList}}</p>
              <p>审批提醒：{{node.messageTypeName}}</p>
              <p>模板类型：{{node.smsTemplateTypeName}}</p>
              <p>模板名称：{{node.smsTemplateStrName}}</p>
              <p>通知接收人：{{node.mobile}}</p>
		        </el-form-item>            
		      </div>
          

	    </el-form>
 	</div>
</template>
<script>
import { getApprovalInfoComplete } from '@/api/systemSetting'
export default{
  name: 'view_approval_auth',
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
        ]
      },
      salesman: '',
      nodeStrTemp: [],

      salesmanListShow: false,
      processArr: [],
      ok: false
    }
  },
  methods: {
    cancel() {
      this.closeTab(true)
    }
  },
  async created() {
    if (this.$route.query.id) {
      await getApprovalInfoComplete({ id: this.$route.query.id }).then(e => {
        this.params = e
        if (e.salesmanName === '指定职员') {
          this.$set(this, 'salesman', e.salesmanList.map(e => e.name).join(','))
        } else {
          this.$set(this, 'salesman', '所有职员')
        }
        e.nodeList.forEach(res => {
          const accountListTemp = res.accountList.map(e => e.name).join(',')
          this.nodeStrTemp.push({
            processName: res.processName,
            acctounList: accountListTemp,
            messageTypeName: res.messageTypeName,
            smsTemplateTypeName: res.smsTemplateTypeName,
            smsTemplateStrName: res.smsTemplateStrName,
            mobile: res.mobile
          })
        })
        this.ok = true
      })
    }
  }
}
</script>
<style  lang="scss">

</style>