<template>
  <div class="app-container">
    <el-form inline label-width="120px">
      <el-form-item label="方案名称">
        <el-input placeholder="输入关键字" v-model="params.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
        <el-button
          type="danger"
          icon="el-icon-plus"
          @click="$router.push('/price_center/price_mgr/auto_pricing_scheme/create')"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <zm-table :columns="columns" :fetch="loadList" :table-params="tableParams"></zm-table>
    <pricing-detail v-if="detailPanel.visible" :id="detailPanel.id" @cancel="closeDetailPanel"></pricing-detail>
  </div>
</template>
<script>
import zmTable from '@/components/isNeedComponents/zmTable/index'
import zmTableMixin from '@/mixins/zmTableMixin'
import { autoSchemeColumns } from './constant'
import { getAutoPricePageList, setAutoPriceStatus } from '@/api/priceCenter'
import PricingDetail from './PricingDetail'
export default {
  mixins: [zmTableMixin],
  components: {
    zmTable,
    PricingDetail
  },
  data() {
    return {
      params: {
        name: null
      },
      columns: autoSchemeColumns(this),
      detailPanel: {
        visible: false,
        id: null
      }
    }
  },
  methods: {
    async loadList() {
      const res = await getAutoPricePageList(this.assignQuery(this.params))
      this.initialTableData(res.data, res.count)
    },
    async switchOpenStatus(row, rowIndex) {
      // this.$set(this.tableParams.data[rowIndex], 'status', !row.status)
      await this.$confirm(
        `确定要${+row.status === 1 ? '关闭' : '开启'}改方案？`,
        '提示',
        { type: 'warning' }
      )
      await setAutoPriceStatus({
        id: row.id,
        status: +row.status === 1 ? 2 : 1
      })
      this.loadList()
    },
    openDetail(row) {
      this.detailPanel = {
        visible: true,
        id: row.id
      }
    },
    closeDetailPanel() {
      this.detailPanel = {
        visible: false,
        id: null
      }
    },
    openEdit(row) {
      this.$router.push({
        path: '/price_center/price_mgr/auto_pricing_scheme/edit',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>

