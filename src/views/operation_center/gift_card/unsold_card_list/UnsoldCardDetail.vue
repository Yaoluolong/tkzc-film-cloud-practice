<template>
    <div class="app-container">
		  <el-form inline label-width="120px">
        <el-form-item label="电影卡号码">
          <el-input v-model="query.cardCode" clearable placeholder="请输入电影卡号码" style="width:230px;"></el-input>
        </el-form-item>
        <el-form-item label="销售人员">
          <operator-id-selector selectStyle="width:210px" v-model="query.saleId" placeholder="请输入销售人员名称"></operator-id-selector>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
        </el-form-item>
      </el-form>
        <page-table ref="table" index :query="query"  :fetch="queryTable">
          <el-table-column min-width="180"  label="电影卡批次号" align="center" prop="batchNo" ></el-table-column>
          <el-table-column min-width="100"  label="电影卡种类" align="center" prop="typeName"></el-table-column>
          <el-table-column min-width="100"  label="电影卡类型" align="center" prop="styleName"></el-table-column>
          <el-table-column min-width="180"  label="卡号" align="center" prop="cardCode"></el-table-column>
          <el-table-column min-width="180"  label="生成时间" align="center" prop="createTime"></el-table-column>
          <el-table-column min-width="120"  label="生成人员" align="center" prop="operator" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="180"  label="销售时间" align="center" prop="saleTime"></el-table-column>
          <el-table-column min-width="120"  label="销售人员" align="center" prop="saleName" show-overflow-tooltip></el-table-column>
        </page-table>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="closeTab">关  闭</el-button> -->
      </div>
    </div>
</template>
<script>
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getUnsoldCardOrderList } from '@/api/operationCenter'
export default {
  name: 'gift_card_unsold_card_detail',
  components: { OperatorIdSelector },
  data() {
    return {
      query: {
        orderNo: this.$route.query.orderNo
      },
      dialogFormVisible: false
    }
  },
  methods: {
    queryTable(query) {
      if (this.$route.query.orderNo) {
        return getUnsoldCardOrderList(query)
      }
    },
    refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>
