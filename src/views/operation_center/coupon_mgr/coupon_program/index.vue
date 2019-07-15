<template>
    <div class="app-container">
      <el-tabs  v-model="query.isTemplate" @tab-click="tabClick">
        <el-tab-pane label="规则模板库" name="1"></el-tab-pane>
        <el-tab-pane label="已审核规则" name="0"></el-tab-pane>
      </el-tabs>
      <el-form inline label-width="120px">            
        <el-form-item label="影院名称">
          <el-input v-model="query.cinemaName" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>
          <!-- <cinema-id-selector v-model="query.cinemaId" style="width:200px;"></cinema-id-selector> -->
        </el-form-item>
        <el-form-item label="销售单号" v-if="query.isTemplate==='0'">
          <el-input v-model="query.orderNo" style="width:200px;" placeholder="输入电影券订单号查询"></el-input>
        </el-form-item>
        <el-form-item label="平台商家">
          <channel-id-selector v-model="query.channelId" type="1"></channel-id-selector>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
          <el-button type="danger" icon="el-icon-plus" @click="$router.push({path:'/operation_center/coupon_mgr/coupon_program/create'})" v-if="query.isTemplate==='1'">新增</el-button>
        </el-form-item>
      </el-form>
      <page-table ref="table" index :query="query" :fetch="queryTable">
        <el-table-column min-width="120"  label="规则名称" align="center" prop="name" ></el-table-column>
        <el-table-column min-width="180"  label="规则时间" align="center" prop="volidTime" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="120"  label="影院分组名称" align="center" prop="cinemaGroupName"></el-table-column>
        <el-table-column min-width="120"  label="添加人" align="center" prop="operator" v-if="query.isTemplate==='1'"></el-table-column>
        <el-table-column min-width="120"  label="添加时间" align="center" prop="createTime" v-if="query.isTemplate==='1'"></el-table-column><el-table-column min-width="180"  label="电影券销售单号" align="center" prop="orderNo" v-if="query.isTemplate==='0'"></el-table-column>
        <el-table-column min-width="120"  label="业务员" align="center" prop="operator" v-if="query.isTemplate==='0'"></el-table-column>
        <el-table-column min-width="100"  label="审核人" align="center" prop="checkPeople" v-if="query.isTemplate==='0'"></el-table-column>
        <el-table-column min-width="100"  label="启用状态" align="center" prop="status">
          <template slot-scope="{row}">
            <switch-confirm v-model="row.status" :id="row.id" action="/systemApi/couponProgram/setStatus"></switch-confirm>
          </template>
        </el-table-column>
        
        <el-table-column min-width="250"  label="操作" align="center" prop="oper">
          <template slot-scope="{row}">
            <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/view_program',query:{orderNo:row.orderNo}})" v-if="query.isTemplate==='0'">查看</el-button>
            <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/coupon_program/edit',query:{id:row.id}})" v-if="query.isTemplate==='1'">编辑</el-button>
            <el-button type="text" @click="deleteObj(row)">删除</el-button>
          </template>
        </el-table-column>
      </page-table>
    </div>
</template>

<script>
    import { getCouponProgramPageList, deleteCouponProgram } from '@/api/operationCenter'
    // import CouponTypeIdSelector from './CouponTypeIdSelector'
    // import ChannelSelector from '@/components/ChannelSelector'
    export default {
      name: 'coupon_program',
      // components: { CouponTypeIdSelector },
      data() {
        return {
          query: {
            isTemplate: '1',
            channelId: '',
            cinemaName: '',
            couponType: '',
            couponTypeId: '',
            interfaceType: ''
          }
        }
      },
      methods: {
        tabClick(tab, event) {
          window.sessionStorage.setItem(`query.isTemplate`, this.query.isTemplate)
          this.refreshTable()
        },
        queryTable(query) {
          return getCouponProgramPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteObj(row) {
          this.$confirm(`确定删除此电影券线上使用规则吗？删除后将导致规则内的电影券在原规则购买影票时无法使用！`, '温馨提示', { type: 'warning' }).then(async() => {
            await deleteCouponProgram(row.id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.refreshTable()
          })
        }
      }
    }
</script>

<style scoped>

</style>
