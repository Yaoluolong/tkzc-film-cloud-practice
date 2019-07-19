<template>
    <div class="app-container">
         <el-form inline label-width="120px">              
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus"  @click="$router.push('/system_setting/permission_mgr/activity_pay/create')">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="80"  label="支付类型" align="center" prop="typeName" ></el-table-column>
            <el-table-column width="200"  label="支付说明" align="center" prop="describe" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="160"  label="支付商户号" align="center" prop="partnerId" show-overflow-tooltip></el-table-column>                       
            <el-table-column width="100"  label="支付排序" align="center" prop="sort"></el-table-column>
            <el-table-column width="160"  label="接入类型" align="center" prop="accessType"></el-table-column>
            <el-table-column width="80"  label="是否启用" align="center" prop="isUse" fixed="right">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.isUse" confirm-text="是否进行此操作" :id="row.id" :status="row.isUse" action="/systemApi/activityPayConfig/setStatus"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column min-width="180"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/system_setting/permission_mgr/activity_pay/edit',query:{id:row.id}})">编辑</el-button>
                <!-- <el-button type="text" @click="deleteSystemer(row)">删除</el-button> -->
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getActivityPayConfigList, deleteActivityPayConfig } from '@/api/activitySetting'
    export default {
      name: 'activity_pay_setting',
      data() {
        return {
          query: {}
        }
      },
      methods: {
        queryTable() {
          return getActivityPayConfigList()
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteSystemer(row) {
          this.$confirm(`删除支付类型后，平台内有调用到此支付类型的支付方式全部下架，请确认是否删除！`, '删除提示', { type: 'warning' }).then(async() => {
            await deleteActivityPayConfig({ id: row.id })
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
