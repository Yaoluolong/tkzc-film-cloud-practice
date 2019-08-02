<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="影院名称">
              <el-input clearable  v-model="query.name" placeholder="请输入影院名称或影院编码" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/price_center/plan_price_mgr/plan_price_program/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column width="180" align="center" label="调价方案名称" prop="name" ></el-table-column>
            <el-table-column width="150" align="center" label="调价渠道商" prop="channelName" ></el-table-column>
            <el-table-column min-width="250" align="center" label="调价类型--调整金额" prop="priceRule">
              <template slot-scope="{row}">
                <el-tooltip effect="dark" placement="top">
                  <span class="priceType">{{row.priceRule[0]}}</span>
                  <div slot="content">
                    <p v-for="item in row.priceRule" :key="item.index">{{item}}</p>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="180" align="center" label="添加时间" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column width="100" align="center" label="是否启用" prop="status">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" :id="row.id" action="/systemApi/priceModify/setStatus"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column min-width="180" align="center" label="操作" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/price_center/plan_price_mgr/plan_price_program/look',query:{id:row.id}})">查看</el-button>
                <el-button type="text" @click="$router.push({path:'/price_center/plan_price_mgr/plan_price_program/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteObj(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getPriceModifyPageList } from '@/api/priceCenter'
    export default {
      name: 'plan_price_program',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        ceshi(row) {
          // console.log(row, 188)
        },
        queryTable(query) {
          return getPriceModifyPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteObj(row) {
          this.$confirm(`是否删除【${row.userName}】,删除用户后仅同时删除用户所有操作记录？`, '删除提示', { type: 'warning' }).then(async() => {
            // await deleteRole(row.id)
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
.priceType {
  overflow: hidden;
  white-space: normal;
}
</style>
