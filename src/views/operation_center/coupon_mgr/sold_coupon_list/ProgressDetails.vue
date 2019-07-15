<template>
	<div class="app-container">		
		<el-steps :active="parseInt(params.checkStatus)">
		  <el-step title="创建销售单" :description="description" :dates="date"></el-step>
		  <el-step title="部门初审" 
        :description="firstCheckInfo.checkName" 
        :dates="firstCheckInfo.createTime" 
        :suggestion="firstCheckInfo.suggestion"
        :button="firstCheckInfo.isAgree" 
        @button-enter="buttonFirst">
      </el-step>
		  <el-step title="财务复审" 
        :description="secondCheckInfo.checkName" 
        :dates="secondCheckInfo.createTime"
        :suggestion="secondCheckInfo.suggestion" 
        :button="secondCheckInfo.isAgree"
         @button-enter="buttonSecond">
      </el-step>
		  <el-step title="完成" :status="status" description=""></el-step>
		</el-steps>

	</div>
</template>

<script>
import ElStep from './elsteps'
import { GetSoldCouponCheckInfo } from '@/api/operationCenter'
export default {
  name: 'progress_details',
  components: { ElStep },
  data() {
    return {
      params: {
        checkStatus: '',
        operator: '',
        operatorId: '',
        saleTime: ''
      },
      firstCheckInfo: {
        checkName: '',
        suggestion: '',
        createTime: '',
        isAgree: ''
      },
      secondCheckInfo: {
        checkName: '',
        suggestion: '',
        createTime: '',
        isAgree: ''
      },
      status: '',
      description: '',
      date: ''
    }
  },
  watch: {
    'params.checkStatus'(val) {
      if (val === '3') this.status = '3'
    }
  },
  methods: {
    buttonSecond() {
      // this.$router.push({ path: '/operation_center/coupon_mgr/progress_sell_register', query: { orderNo: this.$route.query.orderNo }})
    },
    buttonFirst() {
      // this.$router.push('/operation_center/coupon_mgr/sold_coupon_list')
    }
  },
  async created() {
    const _this = this
    GetSoldCouponCheckInfo({ orderNo: this.$route.query.orderNo }).then((res) => {
      _this.params = res
      _this.firstCheckInfo.checkName = res.firstCheckInfo.checkName || ''
      _this.firstCheckInfo.createTime = res.firstCheckInfo.createTime || ''
      _this.firstCheckInfo.suggestion = res.firstCheckInfo.suggestion || ''
      switch (res.firstCheckInfo.isAgree) {
        case '1':
          _this.params.firstCheckInfo.isAgree = '同意'
          break
        case '2':
          _this.params.firstCheckInfo.isAgree = '驳回'
          break
        default:
          _this.params.firstCheckInfo.isAgree = ''
          break
      }
      if (res.secondCheckInfo) {
        _this.secondCheckInfo.checkName = res.secondCheckInfo.checkName || ''
        _this.secondCheckInfo.createTime = res.secondCheckInfo.createTime || ''
        _this.secondCheckInfo.suggestion = res.secondCheckInfo.suggestion || ''
        switch (res.secondCheckInfo.isAgree) {
          case '1':
            _this.params.secondCheckInfo.isAgree = '同意'
            break
          case '2':
            _this.params.secondCheckInfo.isAgree = '驳回'
            break
          default:
            _this.params.secondCheckInfo.isAgree = ''
            break
        }
      } else {
        /* _this.params.secondCheckInfo.checkName = ''
        _this.params.secondCheckInfo.createTime = ''
        _this.params.secondCheckInfo.suggestion = ''*/
      }

      _this.description = res.operator
      _this.date = res.saleTime
      if (res.checkStatus === '3') {
        _this.params.checkStatus = '4'
      } else if (res.checkStatus === '4') {
        _this.params.checkStatus = '1'
      }
    })
  }
}
</script>
<style type="text/scss">
	
</style>