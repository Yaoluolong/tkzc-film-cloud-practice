<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="影院名称">
              <el-input v-model="query.cinemaName" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>
              <!-- <cinema-id-selector v-model="query.cinemaId" clearable style="width:200px"></cinema-id-selector> -->
            </el-form-item>
            <el-form-item label="方案类型">
               <el-select v-model="query.type" style="width:200px" clearable placeholder="请选择">
                  <!-- <el-option value="1" label="根据影片"></el-option> -->
                  <el-option value="2" label="根据影厅"></el-option>
                  <el-option value="3" label="根据制式"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus"  @click="$router.push(`/price_center/price_mgr/${programTypeName}_price_program/create`)">新增</el-button>
            </el-form-item>
         </el-form>
         <el-tabs  v-model="query.status" @tab-click="tabClick" type="card" >
           <!-- --------------------以下这块在常规价格方案管理中先隐藏---------------------- -->
            <!-- <el-tab-pane label="未提交审核" name="1"></el-tab-pane>   
            <el-tab-pane label="等待审核" name="2"></el-tab-pane>
            <el-tab-pane label="审核被拒" name="4"></el-tab-pane> -->
            <el-tab-pane label="已审核已开始" name="3"></el-tab-pane>
            <el-tab-pane label="已审核未开始" name="7"></el-tab-pane>
            <el-tab-pane label="已过期" name="5"></el-tab-pane>
            <el-tab-pane label="已下架" name="6"></el-tab-pane>
         </el-tabs>
         <page-table ref="table" index :query="query" :fetch="queryTable" >
            <el-table-column align="center" label="价格方案名称" prop="name" ></el-table-column>
            <el-table-column width="150" align="center" label="归属影院定价分组" prop="policyGroupName" ></el-table-column>
            <el-table-column width="140" align="center" label="执行平台商家" prop="channelName" show-overflow-tooltip></el-table-column>
            <el-table-column width="180" align="center" label="方案有效时间" prop="priceRightConfig" v-if="query.programType==1">
              <template slot-scope="{row}">
                {{row.startDate}}--{{row.endDate}}
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="方案类型" prop="typeName"></el-table-column>
            <el-table-column width="160" align="center" label="添加时间" prop="createTime"></el-table-column>
            <el-table-column width="100" align="center" label="创建人" prop="operator"></el-table-column>
            <el-table-column align="center" label="操作" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" v-if="query.status==3" @click="downProgram(row)">下架</el-button>
                <el-button type="text" v-if="query.status==3" @click="reviewPrice(row)">预览价格</el-button>
                <el-button type="text" @click="$router.push({path:`/price_center/price_mgr/${programTypeName}_price_program/look`,query:{id:row.id}})">查看</el-button>
                <el-button type="text" v-if="query.status==5 || query.status==6"  @click="$router.push({path:`/price_center/price_mgr/${programTypeName}_price_program/edit`,query:{id:row.id}})">编辑</el-button>
              </template>
            </el-table-column>
        </page-table>
    </div>
</template>

<script>
    import { getPriceProgramPageList, setPriceProgramStatus, reviewPriceProgram } from '@/api/priceCenter'
    export default {
      name: 'price_program_mgr',
      data() {
        return {
          query: {
            programType: '1',
            cinemaName: '',
            status: '3'
          },
          programTypeName: 'normal'
        }
      },
      methods: {
        queryTable(query) {
          if (!query.type) {
            delete query.type
          }
          return getPriceProgramPageList(query)
        },
        tabClick() {
          window.sessionStorage.setItem(`query.status`, this.query.status)
          this.refreshTable()
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        downProgram(row) {
          this.$confirm(`确定下架【${row.name}】？`, '下架提示', { type: 'warning' }).then(async() => {
            await setPriceProgramStatus({ id: row.id, status: 6 })
            this.$message({
              type: 'success',
              message: '设置成功!'
            })
            this.refreshTable()
          })
        },
        async reviewPrice(row) {
          await reviewPriceProgram(row.id)
        }
      },
      created() {
        this.query.programType = this.$route.meta.programType + ''
        this.programTypeName = this.$route.meta.programTypeName
        if (window.sessionStorage.getItem(`query.status`)) {
          this.query.status = window.sessionStorage.getItem(`query.status`)
        }
  }
    }
</script>

<style scoped>

</style>
