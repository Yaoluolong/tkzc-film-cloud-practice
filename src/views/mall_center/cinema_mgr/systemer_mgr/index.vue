<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="系统商状态">
              <el-select v-model="query.status" clearable placeholder="系统商状态" style="width:200px;">
                <el-option value="1" label="已启用"></el-option>
                <el-option value="2" label="已停用"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="系统商名称">
              <el-input v-model.trim="query.name" clearable placeholder="请输入系统商名称" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push('/mall_center/cinema_mgr/systemer_mgr/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="150"  label="系统商名称" align="center" prop="name" ></el-table-column>
            <!-- <el-table-column min-width="100"  label="版本" align="center" prop="version"></el-table-column> -->
            <el-table-column width="100"  label="版本类" align="center" prop="class"></el-table-column>
            <el-table-column width="120"  label="请求超时(分钟)" align="center" prop="requestOverTime"></el-table-column>
            <el-table-column min-width="120"  label="响应超时(分钟)" align="center" prop="responseOverTime"></el-table-column>
            <el-table-column width="160"  label="添加时间" align="center" prop="createTime"></el-table-column>
           <el-table-column width="80"  label="是否启用" align="center" prop="status">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" confirm-text="停用系统商同时会关闭影院启用，确定要执行此操作" :id="row.id" action="/systemApi/interfaceType/setStatus"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column min-width="200"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/mall_center/cinema_mgr/systemer_mgr/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteSystemer(row)">删除</el-button>
                <el-button type="text" @click="getOpenCinema(row)">读取影院</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getInterfaceTypePageList, deleteInterfaceType, getOpenCinema } from '@/api/mallCenter'
    export default {
      name: 'systemer_mgr',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        async getAllFilm(id, pageIndex) {
          const loading = this.$loading({
            lock: true,
            text: '正在同步影院信息',
            spinner: 'el-icon-loading'
          })
          await getOpenCinema(id, pageIndex).then(res => {
            if (res.pageAll === null) {
              this.$message.success('同步成功')
              loading.close()
              return false
            }
            if (pageIndex < res.pageAll) {
              this.getAllFilm(id, pageIndex += 1)
            } else if (pageIndex === res.pageAll) {
              this.$message.success('同步成功')
              loading.close()
            } else {
              this.$message.success(res.content)
              loading.close()
            }
          }).catch(e => {
            this.$message.warning(e.content)
            loading.close()
          })
        },
        getOpenCinema(row) {
          this.$confirm('是否进行读取影院的操作', '温馨提示', { type: 'warngin' }).then(async() => {
            // try {
            this.getAllFilm(row.id, 1)
            // await getOpenCinema(row.id)
            // this.$message.success('同步成功')
            // loading.close()
            // } catch (e) {
            //   loading.close()
            // }
          })
        },
        queryTable(query) {
          return getInterfaceTypePageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteSystemer(row) {
          this.$confirm(`确定删除该票务系统商吗？同意删除票务系统商成功后将关停对接的影院，但不影响其他数据！`, '删除提示', { type: 'warning' }).then(async() => {
            await deleteInterfaceType(row.id)
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
