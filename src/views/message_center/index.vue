<template>
  <div class="app-container">
    <div class="container-heard mb20">消息中心</div>
    <div class="container-body">
      <el-table
        class="wp100 message-table"
        :data="tableDate"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        :show-header="false"
        fit
        highlight-current-row
      >
        <el-table-column width="50" align="center">
          <template slot-scope="{row}">
            <span :class="+row.isRead===0?'danger':'default'">●</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="message" show-overflow-tooltip />
        <el-table-column width="100" align="left">
          <template slot-scope="{row}">
            <el-button type="text" @click="operDetail(row)">【查看详情】</el-button>
          </template>
        </el-table-column>
        <el-table-column width="120" align="right" prop="operTime" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'message_center',
  data() {
    return {
      tableDate: [
        {
          message:
            '您有一条【分销商名称】发起的“【券申请流程名称】”券申请待处理。',
          link: '',
          isRead: 0,
          operTime: '20:29:10'
        }
      ],
      listLoading: false
    }
  },
  methods: {
    operDetail(row) {
      //   this.$router.push({ name: '', params: row })
    }
  }
}
</script>

<style scoped>
.message-table {
  border: 1px solid #ebeef5;
  border-bottom: none;
}
</style>
