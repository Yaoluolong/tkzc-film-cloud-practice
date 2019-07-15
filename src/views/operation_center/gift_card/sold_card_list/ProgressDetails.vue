<template>
	<div class="app-container" v-if="ok">
		<el-steps :active="Number(params.checkStatus)">
		  <el-step title="创建销售单" :description="description" :dates="date"></el-step>
		  <el-step title="部门初审"
        :description="params.firstCheckInfo.checkName"
        :dates="params.firstCheckInfo.createTime"
        :suggestion="params.firstCheckInfo.suggestion"
        :button="params.firstCheckInfo.isAgree"
        @button-enter="buttonFirst">
      </el-step>
		  <el-step title="财务复审"
        :description="params.secondCheckInfo.checkName"
        :dates="params.secondCheckInfo.createTime"
        :suggestion="params.secondCheckInfo.suggestion"
        :button="params.secondCheckInfo.isAgree"
        @button-enter="buttonSecond">
      </el-step>
		  <el-step title="完成" :status="status" description=""></el-step>
		</el-steps>

	</div>
</template>

<script>
import ElStep from './elsteps'
import { GetSoldCardCheckInfo } from '@/api/operationCenter'
import _ from 'lodash'
export default {
  name: 'gift_card_progress_details',
  components: { ElStep },
  data() {
    return {
      params: {
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
        }
      },
      status: '',
      description: '',
      date: '',
      ok: false
    }
  },
  watch: {
    'params.checkStatus'(val) {
      if (val === '3') {
        this.status = 'finish'
      }
    }
  },
  methods: {
    buttonSecond() {
      // this.$router.push({ path: '/operation_center/coupon_mgr/progress_sell_register', query: { orderNo: this.$route.query.orderNo }})
    },
    buttonFirst() {
      // this.$router.push('/operation_center/gift_card/sold_card_list')
    },
    creatStepObj(target, isArgreeNum) {
      const obj = {
        checkName: '无',
        createTime: '',
        suggestion: '',
        isAgree: ''
      }
      Object.assign(obj, target || {})
      let isAgree = ''
      switch (isArgreeNum) {
        case '1':
          isAgree = '同意'
          break
        case '2':
          isAgree = '驳回'
          break
        default:
          isAgree = ''
          break
      }
      obj.isAgree = isAgree
      return obj
    }

  },
  async created() {
    const _this = this
    GetSoldCardCheckInfo({ orderNo: this.$route.query.orderNo }).then((res) => {
      _this.params = _.cloneDeep(res)
      const { creatStepObj } = this
      _this.params.firstCheckInfo = creatStepObj(res.firstCheckInfo, res.firstCheckInfo.isAgree)
      // const bool = 'secondCheckInfo' in _this.params

      const bool = _this.params.secondCheckInfo
      let secondCheckInfo = {}
      if (bool) {
        console.log(bool)
        const bool1 = 'isAgree' in res.secondCheckInfo
        secondCheckInfo = creatStepObj(res.secondCheckInfo, bool1 ? res.secondCheckInfo.isAgree : '')
      } else {
        secondCheckInfo = creatStepObj({}, '')
      }
      _this.params.secondCheckInfo = secondCheckInfo
      _this.ok = true

      // _this.params.firstCheckInfo.checkName = res.firstCheckInfo.checkName || '无'
      // _this.params.firstCheckInfo.createTime = res.firstCheckInfo.createTime || ''
      // _this.params.firstCheckInfo.suggestion = res.firstCheckInfo.suggestion || ''
      // switch (res.firstCheckInfo.isAgree) {
      //   case '1':
      //     _this.params.firstCheckInfo.isAgree = '同意'
      //     break
      //   case '2':
      //     _this.params.firstCheckInfo.isAgree = '驳回'
      //     break
      //   default:
      //     _this.params.firstCheckInfo.isAgree = ''
      //     break
      // }
      // _this.params.secondCheckInfo.   = res.secondCheckInfo.checkName || '无'
      // _this.params.secondCheckInfo. = res.secondCheckInfo.createTime || ''
      // _this.params.secondCheckInfo. = res.secondCheckInfo.suggestion || ''
      // switch (res.secondCheckInfo.isAgree) {
      //   case '1':
      //     _this.params.secondCheckInfo.isAgree = '同意'
      //     break
      //   case '2':
      //     _this.params.secondCheckInfo.isAgree = '驳回'
      //     break
      //   default:
      //     _this.params.secondCheckInfo.isAgree = ''
      //     break
      // }
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
