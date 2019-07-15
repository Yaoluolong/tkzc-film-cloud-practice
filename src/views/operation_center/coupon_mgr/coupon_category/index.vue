<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="电影券名称">
              <el-input v-model="query.name" clearable placeholder="请输入电影券名称" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="电影券类型">
              <remote-select v-model="query.type" showAllOption clearable placeholder="请选择电影券类型" action="/systemApi/dict/getList" :query="{type:'couponType'}" style="width:200px;"></remote-select>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus" @click="$router.push({path:'/operation_center/coupon_mgr/coupon_category/create'})">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="120"  label="电影券名称" align="center" prop="name" ></el-table-column>
            <el-table-column min-width="120"  label="电影券类型" align="center" prop="typeName" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="100"  label="消费对象" align="center" prop="consumeTargetName"></el-table-column>
            <el-table-column min-width="120"  label="消费方式" align="center" prop="consumeTypeName"></el-table-column>
            <el-table-column min-width="180"  label="添加时间" align="center" prop="createTime"></el-table-column>
            <el-table-column min-width="100"  label="启用状态" align="center" prop="status">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" :id="row.id" action="/systemApi/couponType/setStatus"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column min-width="250"  label="操作" align="center" prop="oper">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/coupon_category/look',query:{id:row.id}})">查看</el-button>
                <el-button type="text" @click="$router.push({path:'/operation_center/coupon_mgr/coupon_category/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteObj(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getCouponTypePageList, deleteCouponType } from '@/api/operationCenter'
    export default {
      name: 'coupon_category',
      data() {
        return {
          query: {
            type: '-1'
          }
        }
      },
      methods: {
        queryTable(query) {
          return getCouponTypePageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        deleteObj(row) {
          this.$confirm(`删除电影券品类将导致已下发的对应电影券品类作废，是否执行此操作？`, '删除提示', { type: 'warning' }).then(async() => {
            await deleteCouponType(row.id)
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
