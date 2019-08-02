<template>
  <el-dialog title="导出订单" :visible="value" width="60%" @close="closeDialog" :close-on-click-modal="false">
    <div class="waring-message" v-if="showWaring">
      自定义报表已生成，请前往
      <el-button type="text" @click="goTaskMgr">下载中心</el-button>，
      <span class="danger">已生成的报表将至少为你保留90天。</span>
    </div>
    <div v-for="(item,index) in chooseList" :key="index" class="check-box">
      <el-checkbox
        class="mb15 fs16"
        v-model="item.isAll"
        @change="operChoose('all',item)"
        :indeterminate="item.indeterminate"
      >{{item.name}}</el-checkbox>
      <el-checkbox-group v-model="item.ids">
        <el-checkbox
          class="w150 mr-check mb15"
          v-for="(childItem,childIndex) in item.children"
          :key="childIndex"
          :label="childItem.value"
          @change="operChoose('one',childItem,item)"
        >{{childItem.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div slot="footer" class="dialog-footer tr">
      <el-button @click="goTaskMgr">查看已生成报表</el-button>
      <el-button type="primary" @click="exportBtn" :disabled="loading">导出报表
        <i class="el-icon-loading" v-if="loading"></i>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDictList, getOrderPageList } from '@/api/financeCenter'
import { getCanChooseIds } from '@/utils'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    exportParams: {
      type: Object,
      default: () => {
        return {
          query: {},
          exportIds: ''
        }
      }
    }
  },
  data() {
    return {
      showWaring: false,
      loading: false,
      chooseList: [
        {
          name: '订单信息',
          type: 'orderFilmExport'
          // children:[],
          // ids:[],
          //   isAll:false,
          // indeterminate:false
        },
        {
          name: '场次信息',
          type: 'orderFilmInfoExport'
        }
      ]
    }
  },
  watch: {
    // 只在打开时触发方法
    value(val) {
      if (val) this.getChooseList()
    }
  },
  methods: {
    // 获取可选数组
    async getChooseList() {
      // 不摧毁组件时，判断无子集时才调用接口
      this.chooseList.forEach(async e => {
        const children =
          e.children && e.children.length
            ? e.children
            : await getDictList({ type: e.type })
        this.$set(e, 'children', children)
        this.$set(e, 'ids', e.ids || [])
        this.$set(e, 'isAll', e.isAll || false)
        this.$set(e, 'indeterminate', e.indeterminate || false)
      })
    },
    goTaskMgr() {
      this.closeDialog()
      this.$router.push({ name: 'task_mgr' })
    },
    operChoose(type, item, parentItem) {
      let ids = []
      switch (type) {
        case 'one':
          parentItem.isAll = parentItem.ids.length === parentItem.children.length
          parentItem.indeterminate = parentItem.ids.length > 0 && parentItem.ids.length < parentItem.children.length
          break
        case 'all':
          ids = getCanChooseIds(item.children, item.isAll)
          item.ids = ids
          item.indeterminate = false
          break
      }
    },
    async exportBtn() {
      let query = {}
      const exportObj = {}
      this.chooseList.forEach(item => {
        this.$set(exportObj, item.type, item)
      })
      query = Object.assign({}, this.exportParams.query, {
        requestType: 'export',
        exportOrderIds: this.exportParams.exportIds || '',
        orderFilmExport: exportObj.orderFilmExport.ids.join(','),
        orderFilmInfoExport: exportObj.orderFilmInfoExport.ids.join(',')
        // 缺选中的表头id参数
      })
      // if (query.orderFilmExport || query.orderFilmInfoExport) {
      this.loading = true
      try {
        await getOrderPageList(query)
        this.$message.success('导出成功，请前往下载中心查看')
        this.loading = false
        this.showWaring = true
        this.$emit('after-save', true)
      } catch (error) {
        this.loading = false
      }
      // } else {
      //   this.$message.error('请选择一个导出条件')
      // }
    },
    closeDialog() {
      this.showWaring = false
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.check-box {
  padding: 15px;
  background-color: #e9eef3;
  margin-bottom: 20px;
}
.waring-message {
  background: #ffa80026;
  border: 1px solid #f5a209;
  padding: 0 20px;
  margin-bottom: 20px;
}
</style>
