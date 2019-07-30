<template>
  <div class="app-container">
    <el-form inline label-width="120px">
      <el-form-item label="销售订单号">
        <el-input v-model="query.saleOrderNo" class="w230" placeholder="请输入销售订单号"></el-input>
      </el-form-item>
      <el-form-item label="批次号">
        <el-input v-model="query.batchNo" class="w230" placeholder="请输入生成批次号"></el-input>
      </el-form-item>
      <el-form-item label="导出类型">
        <el-select v-model="query.type" class="w230">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间筛选">
        <el-date-picker
          unlink-panels
          v-model="query.time"
          class="w230"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshTable">查询</el-button>
      </el-form-item>
    </el-form>
    <h3>提示:由于导出文件过大，为了给您提供安全、高效的下载体验，您的文件于导出请求生效后会暂存在阿里云oss上，三天后会自动删除。</h3>
    <page-table ref="table" index :query="query" :fetch="queryTable">
      <el-table-column min-width="120" label="导出人" align="center" prop="operator"></el-table-column>
      <el-table-column
        min-width="120"
        label="导出时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="120" label="导出类型" align="center" prop="type"></el-table-column>
      <el-table-column min-width="120" label="销售订单" align="center" prop="saleOrderNo"></el-table-column>
      <el-table-column min-width="120" label="批次号" align="center" prop="batchNo"></el-table-column>
      <!-- <el-table-column min-width="250" label="导出备注" align="center" prop="remark"></el-table-column> -->
      <!-- <el-table-column min-width="120" label="状态" align="center" prop="statusName"></el-table-column> -->
      <el-table-column min-width="120" label="文件" align="center" fixed="right">
        <template slot-scope="{row}">
          <div v-if="+row.status===1">
            <el-button type="text" @click="exportData(row)">下载</el-button>
            <el-button type="text" @click="delExport(row)">删除</el-button>
          </div>
          <span v-else>{{row.statusName}}</span>
        </template>
      </el-table-column>
    </page-table>
  </div>
</template>
<script>
import { realDeepClone } from '@/utils'
import { getTaskMgrList, exportTaskMgr, deleteExportTask } from '@/api/systemSetting'
export default {
  name: 'task_mgr',
  data() {
    return {
      query: {
        saleOrderNo: '',
        batchNo: '',
        type: '',
        time: []
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '3',
          label: '票务订单'
        },
        {
          value: '1',
          label: '电影券导出'
        },
        {
          value: '2',
          label: '电影卡导出'
        }
      ]
    }
  },
  methods: {
    queryTable(query) {
      const req = realDeepClone(query)
      delete req.time
      req.startTime = query.time ? query.time[0] : ''
      req.endTime = query.time ? query.time[1] : ''
      return getTaskMgrList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    exportData(row) {
      exportTaskMgr({ id: row.id })
        .then(res => {
          location.href = res
        })
        .catch(e => {
          this.$message.warning(e)
        })
    },
    async delExport(row) {
      await deleteExportTask({ id: row.id })
      this.$message.success('删除成功')
      this.refreshTable()
    }
  }
}
</script>
<style scoped>
</style>