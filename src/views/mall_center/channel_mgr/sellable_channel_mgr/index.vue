<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="影院">
              <el-input clearable v-model="query.cinemaName" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>
              <!-- <cinema-id-selector v-model="query.cinemaId" style="width:200px;"></cinema-id-selector> -->
            </el-form-item>
            <el-form-item label="渠道商">
              <channel-id-selector v-model="query.channelId" style="width:200px;"></channel-id-selector>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/mall_center/channel_mgr/sellable_channel_mgr/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="120" label="分组名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="120" label="票务系统商" align="center" prop="interfaceName" show-overflow-tooltip></el-table-column>
            <el-table-column width="120"  label="影院数" align="center" prop="cinemaNum"></el-table-column>
            <el-table-column width="120"  label="渠道商数" align="center" prop="channelNum"></el-table-column>
            <el-table-column width="180"  label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="250"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/mall_center/channel_mgr/sellable_channel_mgr/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteObj(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getChannelCinemaPageList, deleteChannelCinema } from '@/api/mallCenter'
    export default {
      name: 'channel_plan',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          return getChannelCinemaPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteObj(row) {
          this.$confirm(`是否删除【${row.name}】？`, '删除提示', { type: 'warning' }).then(async() => {
            await deleteChannelCinema(row.id)
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
