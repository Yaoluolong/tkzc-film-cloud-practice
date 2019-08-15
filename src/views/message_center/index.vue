<template>
  <div class="app-container">
    <div class="container-heard mb20">消息中心</div>
    <div class="container-body">
      <zm-table
        :columns="columns"
        :fetch="loadList"
        :table-params="tableParams"
        :options="{showHeader:false,border:false,loading:loading}"
      ></zm-table>
    </div>
    <zm-panel title="查看申请详情" :visible.sync="detailPanelShow" @change="closeDetaliPanel">
      <component
        :is="detailParams.componentsName"
        :ref="detailParams.componentsName"
        :id="detailParams.id"
        :detail-params="detailParams"
        @save-after="saveAfter"
        @cancel="closeDetaliPanel"
      />
      <div slot="footer" class="footer-button">
        <el-button @click="closeDetaliPanel">{{+detailParams.status!==0?'关闭':'取消'}}</el-button>
        <el-button
          type="primary"
          @click="onOperateClick('subApply')"
          v-if="+detailParams.status===0"
        >确定</el-button>
      </div>
    </zm-panel>
  </div>
</template>

<script>
import { getPageList, read } from '@/api/systemMessage'
import zmTable from '@/components/isNeedComponents/zmTable'
import tableMixin from '@/mixins/zmTableMixin'
import zmPanel from '@/components/isNeedComponents/zmPanel'
import coupon_apply from '@/views/operation_center/coupon_mgr/coupon_apply/detail'
import { messageColumns } from './const'
import detailPanel from '@/mixins/detailPanel'
export default {
  name: 'message_center',
  mixins: [tableMixin, detailPanel],
  components: { zmTable, zmPanel, coupon_apply },
  data() {
    return {
      detailPanelShow: false,
      loading: false,
      listLoading: false,
      query: {}
    }
  },
  computed: {
    columns() {
      return messageColumns(this)
    }
  },
  methods: {
    async loadList() {
      this.loading = true
      const res = await getPageList(this.assignQuery(this.query))
      this.initialTableData(res.data, res.count)
      this.loading = false
    },
    closeDetaliPanel() {
      this.detailPanelShow = false
    },
    saveAfter() {
      this.closeDetaliPanel()
      this.$router.push({ name: this.detailParams.componentsName })
    },
    async operDetail(row) {
      const param = row.param
        ? typeof row.param === 'string'
          ? JSON.parse(row.param)
          : row.param
        : {}
      console.log(param)
      try {
        await read({ id: row.id })
        this.loadList()
      } catch (error) {
        console.log(error)
        return
      }
      this.detailParams.id = param.id
      this.detailParams.status = param.status
      this.detailParams.componentsName = 'coupon_apply'
      this.detailPanelShow = true
    },
    onOperateClick() {
      this.$refs[this.detailParams.componentsName].submit()
    }
  }
}
</script>
