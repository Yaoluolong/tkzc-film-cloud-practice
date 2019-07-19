<template>
  <div class="app-container">
    <el-form inline label-width="120px">
      <el-form-item label="分销商名称">
        <customer-selector
          v-model="query.customer"
          access-type="couponLimit"
          select-style="width:230px"
          :isAddNew="false"
        ></customer-selector>
      </el-form-item>
      <el-form-item label="券申请名称">
        <el-input v-model="query.name" clearable placeholder="请输入券申请名称" class="w230"></el-input>
      </el-form-item>
      <el-form-item label="券类型">
        <remote-select
          clearable
          v-model="query.couponStyle"
          showAllOption
          placeholder="请选择电影券类型"
          action="/systemApi/dict/getList"
          :query="{type:'couponStyle'}"
          class="w230"
        ></remote-select>
      </el-form-item>
      <el-form-item label="券种类">
        <remote-select
          clearable
          v-model="query.couponType"
          showAllOption
          placeholder="请选择电影券种类"
          action="/systemApi/dict/getList"
          :query="{type:'couponType'}"
          class="w230"
        ></remote-select>
      </el-form-item>
      <el-form-item label="申请状态">
          <remote-select
          clearable
          v-model="query.status"
          showAllOption
          placeholder="请选择电影券种类"
          action="/systemApi/dict/getList"
          :query="{type:'couponApplicationStatus'}"
          class="w230"
        ></remote-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="orderTimeRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="chooseData"
          class="w230"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <zm-table ref="multipleTable" :columns="columns" :fetch="loadList" :table-params="tableParams"></zm-table>
    <zm-panel title="查看申请详情" :visible.sync="detailPanelShow" @change="closeDetaliPanel">
      <detail ref="applyDetail" :id="editId" :detail-params="detailParams" @save-after="saveAfter" @cancel="closeDetaliPanel"></detail>
      <div slot="footer" class="footer-button">
        <el-button @click="closeDetaliPanel">{{+detailParams.status!==0?'关闭':'取消'}}</el-button>
        <el-button type="primary" @click="onOperateClick('subApply')" v-if="+detailParams.status===0">确定</el-button>
      </div>
    </zm-panel>
  </div>
</template>
<script>
import { getCouponApplyPageList } from '@/api/operationCenter'
import CustomerSelector from '@/components/CustomerSelector'
import zmTable from '@/components/isNeedComponents/zmTable'
import zmPanel from '@/components/isNeedComponents/zmPanel'
import tableMixin from '@/mixins/zmTableMixin'
import detail from './detail'
import { couponApplyColumns } from './const'
export default {
  name: 'coupon_apply_list',
  components: { zmTable, zmPanel, CustomerSelector, detail },
  mixins: [tableMixin],
  computed: {
    columns() {
      return couponApplyColumns(this)
    }
  },
  data() {
    return {
      query: {},
      editId: '',
      detailPanelShow: false,
      detailParams: {},
      orderTimeRange: []
    }
  },
  methods: {
    async loadList() {
      const res = await getCouponApplyPageList(this.assignQuery(this.query))
      this.initialTableData(res.data, res.count)
    },
    chooseData(val) {
      this.query.creatTimeS = val ? val[0] : ''
      this.query.creatTimeE = val ? val[1] : ''
    },
    onOperateClick(type, row) {
      switch (type) {
        case 'detail':
          this.editId = row.id
          this.detailParams = row
          this.detailPanelShow = true
          break
        case 'subApply':
          this.$refs.applyDetail.submit()
      }
    },
    saveAfter() {
      this.closeDetaliPanel()
      this.onSearch()
    },
    closeDetaliPanel() {
      this.editId = ''
      this.detailPanelShow = false
    }
  }
}
</script>
