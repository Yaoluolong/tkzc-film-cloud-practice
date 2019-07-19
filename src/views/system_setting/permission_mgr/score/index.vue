<template>
  <div class="app-container">
       <el-form inline label-width="120px">
            <el-form-item label="商家名称">
                <el-input v-model.trim="query.name"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
            </el-form-item>
             <el-form-item >
              <el-button type="primary" icon="el-icon-plus"  @click="$router.push({path:'/system_setting/permission_mgr/score/create'})">新增</el-button>
            </el-form-item>
         </el-form>
         <br>
         <page-table ref="dataTable" index :query="query" :fetch="fetchData">
            <el-table-column min-width="100"  label="商家名称" align="center" prop="name" ></el-table-column>
            <el-table-column min-width="120"  label="创建人" align="center" prop="operator"></el-table-column>
            <el-table-column min-width="120"  label="添加时间" align="center" prop="createTime"></el-table-column>
            <el-table-column min-width="120"  label="是否启用" align="center" prop="status">
              <template slot-scope="{row}">        
                    <switch-confirm v-model="row.status" :id="row.id" action="systemApi/integralPlatform/setStatus"></switch-confirm>
                </template>
            </el-table-column>
            <el-table-column min-width="120"  label="影票兑换比例（点）" align="center" prop="ticketExchange"></el-table-column>
            <el-table-column min-width="120"  label="购物兑换比例（元）" align="center" prop="goodsExchange"></el-table-column>
            <el-table-column min-width="120"  label="操作" align="center" prop="broswer" fixed="right">
                <template slot-scope="{row}">
                    <el-button @click="editRow(row)" type="text">编辑</el-button>
                    <el-button type="text" @click="del(row)">删除</el-button>
                </template>
            </el-table-column>
         </page-table>
  </div>
</template>

<script>
import { getIntegralPlatformPage, delIntegralPlatform, setStatusIntegralPlatform } from '@/api/systemSetting'
export default {
  name: 'score',
  data() {
    return {
      query: {}
    }
  },
  methods: {
    editRow(row) {
      if (row.status === '1') {
        this.$confirm('编辑商家有涉及请求参数等重要信息配置的有可能会导致线上购票链接或接口无法正常访问，确定修改该商家吗？', '提示', { type: 'warning' }).then(async() => {
          await setStatusIntegralPlatform(row.id, '2')
          this.refreshTable()
          this.$router.push({ path: '/system_setting/permission_mgr/score/edit', query: { id: row.id }})
        })
      } else {
        this.$router.push({ path: '/system_setting/permission_mgr/score/edit', query: { id: row.id }})
      }
    },
    fetchData(query) {
      return getIntegralPlatformPage(query)
    },
    async del(row) {
      this.$confirm(`确定删除该积分平台商家？同意删除商家成功后系统将同时解除平台会员有关该商家的账户绑定操作，但不影响数据！`, '删除提示', { type: 'warning' }).then(async() => {
        await delIntegralPlatform(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.refreshTable()
      })
    },
    refreshTable() {
      if (this.$refs.dataTable) {
        this.$refs.dataTable.refresh()
      }
    }
  },
  created() {
    this.refreshTable()
  }
}
</script>

<style scoped lang="scss">

</style>
