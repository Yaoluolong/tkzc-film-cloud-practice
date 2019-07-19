<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="商家名称">
              <!-- <el-input v-model="query.name" clearable placeholder="请输入渠道商名称查询" style="width:200px;"></el-input> -->
              <channel-id-selector v-model="query.channelId"  style="width:200px;"></channel-id-selector>
            </el-form-item>
            <el-form-item label="商家类型">
                <el-select v-model="query.type">
                    <el-option label="全部" value="-1"></el-option>
                    <el-option label="自营" value="1"></el-option>
                    <el-option label="加盟" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/mall_center/channel_mgr/channel_connect/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column   label="商家名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column   label="消费终端" align="center" prop="deviceCodeName" ></el-table-column>
            <el-table-column   label="商家类型" align="center" prop="typeName"></el-table-column>
            <el-table-column   label="请求平台接口" align="center" prop="requestUrl"></el-table-column>
            <el-table-column   label="添加时间" align="center" prop="createTime"></el-table-column>            
            <el-table-column   label="是否启用" align="center" prop="status">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" activeValue="1"  confirmText="停用商家将导致涉及影院的常规价格方案自动下架以及线上购票链接或接口无法正常访问，但相关交易数据仍将保留。是否要执行此操作？" :id="row.id" action="/systemApi/channel/setStatus"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column min-width="160"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/mall_center/channel_mgr/view_channel',query:{id:row.id}})">查看</el-button>
                <el-button type="text" @click="editChannel(row)">编辑</el-button>
                <el-button type="text" @click="deleteChannel(row)">删除</el-button>
                <el-button v-if="row.type !== '2'" type="text" @click="createUrl(row)">生成链接</el-button>
              </template>
            </el-table-column>
         </page-table>
         <el-dialog :visible.sync="centerDialogVisible" width="500px" :show-close="false" center>
            <div slot="title">
              商家C端访问链接生成成功
            </div>
            <span style="width:450px">访问地址:{{showUrl}}</span>
            <span slot="footer">
              <el-button type="success" @click="copyUrl">复制链接</el-button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="centerDialogVisible = false">关闭</el-button>
            </span>
          </el-dialog>
    </div>
</template>

<script>
    import { getChannelPageList, deleteChannel, createUrl } from '@/api/mallCenter'
    import handleClipboard from '@/utils/clipboard'
    export default {
      name: 'channel_connect',
      data() {
        return {
          centerDialogVisible: false,
          query: {
            type: '-1'
          },
          showUrl: ''
        }
      },
      methods: {
        copyUrl(event) {
          handleClipboard(this.showUrl, event)
        },
        async createUrl(row) {
          this.showUrl = await createUrl(row.id)
          this.centerDialogVisible = true
        },
        editChannel(row) {
          /* if (row.status !== '2') {
            this.$confirm('编辑商家有涉及请求参数等重要信息配置的有可能会导致线上购票链接或接口无法正常访问，确定修改该商家吗？', '提示', { type: 'warning' }).then(async() => {
              if (row.status !== '2') {
                await setChannelStatus(row.id, '2')
                this.refreshTable()
              }
              this.$router.push({ path: '/mall_center/channel_mgr/channel_connect/edit', query: { id: row.id }})
            })
          } else {*/
          this.$router.push({ path: '/mall_center/channel_mgr/channel_connect/edit', query: { id: row.id }})
          // }
        },
        queryTable(query) {
          return getChannelPageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh(true)
        },
        priceFormatter(row, column, cellValue, index) {
          return cellValue + '元'
        },
        deleteChannel(row) {
          this.$confirm(`删除商家将导致涉及影院的常规价格方案自动下架以及线上购票链接或接口无法正常访问，但相关交易数据仍将保留。是否要执行此操作？`, '删除提示', { type: 'warning' }).then(async() => {
            await deleteChannel(row.id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.refreshTable()
          })
        },
        changeStatus(row) {

        }
      }
    }
</script>

<style scoped>

</style>
