<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="影院名称">
              <el-input clearable v-model="query.cinemaName" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>
              <!-- <cinema-id-selector v-model="query.cinemaId" style="width:200px;"></cinema-id-selector> -->
            </el-form-item>
            <!-- <el-form-item label="定价类型">
              <remote-select v-model="query.priceRight"  placeholder="请选择策略类型" clearable action="/systemApi/cinema/getPriceRight" style="width:320px"></remote-select>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/mall_center/cinema_mgr/settlement_price/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column width="160" align="center" label="方案名称" prop="name" ></el-table-column>
            <el-table-column min-width="240" align="center" label="方案影院（家）" prop="cinemaCount" ></el-table-column>
            <el-table-column width="100" align="center" label="结算规则（条）" prop="ruleNum" ></el-table-column>
            <el-table-column min-width="220" align="center" label="按影片最低限价结算" prop="isUseLowest" >
              <template slot-scope="{row}">
                {{row.isUseLowest === '1' ? '是':'否'}}
              </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="规则状态" prop="statusName"></el-table-column>
            <el-table-column width="160" align="center" label="操作人" prop="operator"></el-table-column>
            <el-table-column width="160" align="center" label="添加时间" prop="createTime"></el-table-column>
            <el-table-column min-width="160" align="center" label="操作" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/mall_center/cinema_mgr/settlement_price/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteObj(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getSettlementPageList, delSettlement } from '@/api/mallCenter'
    export default {
      name: 'settlement_price',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          return getSettlementPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteObj(row) {
          this.$confirm(`影院结算价涉及平台与影院的结算，删除影院结算价方案将导致涉及影院的常规价格方案自动下架以及线上影院无法正常购票！`, '删除提示', { type: 'warning' }).then(async() => {
            await delSettlement(row.id)
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
