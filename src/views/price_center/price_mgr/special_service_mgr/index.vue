<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="影院名称">
              <el-input clearable v-model="query.cinemaName" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>
              <!-- <cinema-id-selector v-model="query.cinemaId" clearable style="width:200px"></cinema-id-selector> -->
            </el-form-item>
            <el-form-item label="平台商家">
             <channel-id-selector v-model="query.channelId"  style="width:200px;"></channel-id-selector>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/price_center/price_mgr/special_service_mgr/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="150"  label="商家名称" align="center" prop="channelName" ></el-table-column>
            <el-table-column width="100"  label="增设类型" align="center" prop="typeName"></el-table-column>
            <el-table-column width="100"  label="关联影院数" align="center" prop="cinemaCount"></el-table-column>
            <el-table-column min-width="120"  label="增设方式" align="center" prop="way"></el-table-column>
            <el-table-column width="180"  label="规则时间" align="center" prop="volidTime"></el-table-column>            
            <el-table-column width="80"  label="启用状态" align="center" prop="status" fixed="right">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" confirm-text="是否确认进行此操作" :id="row.id" action="/systemApi/channelSpecialServicePrice/setStatus"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column width="160"  label="提交人" align="center" prop="operator"></el-table-column>
            <el-table-column min-width="180"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/price_center/price_mgr/special_service_mgr/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteSystemer(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getChannelSpecialServicePricePageList, delSpecialServicePrice } from '@/api/priceCenter'
    export default {
      name: 'special_service_mgr',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          return getChannelSpecialServicePricePageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteSystemer(row) {
          this.$confirm(`确定删除商家增值费？`, '删除提示', { type: 'warning' }).then(async() => {
            await delSpecialServicePrice(row.id)
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
