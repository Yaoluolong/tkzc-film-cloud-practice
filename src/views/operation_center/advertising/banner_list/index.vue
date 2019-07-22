<template>
    <div class="app-container">
         <el-form inline label-width="120px">
           <el-form-item label="投放商家">
             <channel-id-selector v-model="query.channelId"  style="width:200px;" type="1"></channel-id-selector>
            </el-form-item>
            <!-- <el-form-item label="投放影院">
              <cinema-id-selector v-model="query.cinemaId" clearable style="width:200px"></cinema-id-selector>
            </el-form-item> -->
            <el-form-item label="广告状态">
              <el-select v-model="query.status" style="width:200px">
                    <el-option value="-1" label="全部"></el-option>
                    <el-option value="1" label="已上线"></el-option>
                    <el-option value="2" label="已下线"></el-option>
              </el-select>              
            </el-form-item>
            <el-form-item label="广告类型">
                 <remote-select showAllOption v-model="query.type"  placeholder="请选择广告类型" action="/systemApi/dict/getList"  :query="{type:'bannerType'}" style="width:200px">
                 </remote-select>
            </el-form-item>              
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/operation_center/advertising/banner_list/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="100"  label="投放商家" align="center" prop="channelName" ></el-table-column>
            <el-table-column width="180"  label="广告图" align="center" prop="image">
              <template slot-scope="{row}">
                <img :src="row.image"  style="width:150px;height:80px"/>
              </template>
            </el-table-column>
            <el-table-column width="120"  label="广告名称" align="center" prop="name"></el-table-column>
            <el-table-column min-width="120"  label="投放时间" align="center" prop="startTime">
              <template slot-scope="{row}">
                {{row.startTime}}:{{row.endTime}}
              </template>
            </el-table-column>           
           <el-table-column width="120"  label="上线/下线" align="center" prop="status">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" confirm-text="是否进行此操作" :id="row.id" action="/systemApi/channelBanner/setStatus"></switch-confirm>
              </template>
            </el-table-column>
             <el-table-column width="160"  label="广告类型" align="center" prop="typeName"></el-table-column>
             <el-table-column width="120"  label="投放终端" align="center" prop="deviceType"></el-table-column>
             <el-table-column width="160"  label="更新时间" align="center" prop="updateTime"></el-table-column>
             <el-table-column width="120"  label="点击量" align="center" prop="clickNum"></el-table-column>
            <el-table-column min-width="180"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/advertising/banner_list/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteSystemer(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { channelBannerPageList, delChannelBanner } from '@/api/operationCenter'
    export default {
      name: 'banner_list',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable(query) {
          return channelBannerPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteSystemer(row) {
          this.$confirm(`广告删除后，将自动下线，是否执行？`, '删除提示', { type: 'warning' }).then(async() => {
            await delChannelBanner(row.id)
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
