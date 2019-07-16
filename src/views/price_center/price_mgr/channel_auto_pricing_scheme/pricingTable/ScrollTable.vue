<template>
  <el-table :data="tableData" class="wp100">
    <el-table-column prop="sort" label="权重"></el-table-column>
    <el-table-column prop="name" label="方案名称"></el-table-column>
    <el-table-column label="有效日期">
      <template slot-scope="scope">
        {{scope.startDate}} - {{scope.endDate}}
      </template>
    </el-table-column>
    <el-table-column prop="statusName" label="状态"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="text" class="mr20" @click="del(scope.row)">删除</el-button>
        <el-button type="text" class="mr20">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    tableList: {
      type: Array,
      default() {
        return []
      }
    },
    sortStatus: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    tableList(val) {
      this.tableData = val.slice(0)
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.tableData = this.tableList.slice(0)
  },
  methods: {}
}
</script>
