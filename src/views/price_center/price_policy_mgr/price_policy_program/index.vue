<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="影院名称">
              <el-input clearable  v-model="query.cinemaName" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>
              <!-- <cinema-id-selector v-model="query.cinemaId"></cinema-id-selector> -->
            </el-form-item>
            <el-form-item label="定价类型">
              <remote-select v-model="query.priceRight"  placeholder="请选择策略类型" clearable action="/systemApi/cinema/getPriceRight" style="width:320px"></remote-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/price_center/price_policy_mgr/price_policy_program/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column width="160" align="center" label="分组名称" prop="name" ></el-table-column>
            <el-table-column min-width="240" align="center" label="定价类型" prop="priceRight" ></el-table-column>
            <el-table-column width="100" align="center" label="影院数" prop="cinemaNum" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="220" align="center" label="影院定价" prop="priceRightConfig" show-overflow-tooltip></el-table-column>
            <el-table-column width="160" align="center" label="添加时间" prop="createTime"></el-table-column>
            <el-table-column min-width="160" align="center" label="操作" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/price_center/price_policy_mgr/price_policy_program/look',query:{id:row.id}})">查看</el-button>
                <el-button type="text" @click="$router.push({path:'/price_center/price_policy_mgr/price_policy_program/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteObj(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getPriceGroupPageList, deletePriceGroup } from '@/api/priceCenter'
    export default {
      name: 'price_policy_program',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          return getPriceGroupPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteObj(row) {
          this.$confirm(`删除影院策略分组后将导致已生效的常规价格和活动价格的自动下架，同时也会影响线上购票。是否要执行此操作？`, '删除提示', { type: 'warning' }).then(async() => {
            await deletePriceGroup(row.id)
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
