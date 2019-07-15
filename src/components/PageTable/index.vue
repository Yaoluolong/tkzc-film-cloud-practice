<template>
    <div>
        <div v-loading="listLoading"  v-if="isList"  style="min-height:200px"  element-loading-text="给哇哈一点点时间~~">
            <slot :list="tableDate"></slot>
        </div>
        <el-table ref="innerTable" v-bind="$attrs" v-else v-on="$listeners"  :data="tableDate" v-loading="listLoading" element-loading-text="给我一点时间" :border="border" fit highlight-current-row style="width: 100%">
            <el-table-column type="index" width="50" align="center" v-if="index"></el-table-column>
            <el-table-column type="selection" width="50" align="center" v-if="selection"></el-table-column>
            <slot></slot>
        </el-table>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageInfo.pageNo" :page-sizes="[10,20,30, 50]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
      props: {
        fetch: {
          type: Function,
          default: (page) => {
            const mockList = []
            const begin = (page.pageNo - 1) * page.pageSize
            for (let i = 0; i < page.pageSize.length; i++) {
              const row = {}
              for (let c = 0; c < 10; c++) {
                row[`col${c + 1}`] = `测试数据${begin + i + 1}-${c + 1}`
              }
              mockList.push(row)
            }
            return Promise.resolve({
              data: mockList,
              pageNo: page.pageNo,
              pageSize: page.pageSize,
              total: 100
            })
          }
        },
        isList: Boolean,
        initQuery: {
          type: Boolean,
          default: true
        },
        selection: Boolean,
        index: Boolean,
        query: Object,
        border: {
          type: Boolean,
          default: true
        }
      },
      data() {
        return {
          tableDate: [],
          pageInfo: {
            pageNo: 1,
            pageSize: 10,
            total: 0
          },
          listLoading: false
        }
      },
      methods: {
        async fetchData(pageNo) {
          this.listLoading = true
          const query = Object.assign({}, this.query)
          query.page = pageNo
          query.pageSize = this.pageInfo.pageSize
          const res = await this.fetch(query, this.pageInfo)
          res.pageTotal = Math.ceil(res.count / this.pageInfo.pageSize)
          if (res.pageTotal > 0 && res.pageTotal < pageNo) {
            this.fetchData(res.pageTotal)
            return
          }
          this.listLoading = false
          // this.pageInfo.pageNo = parseInt(res.pageNo)
          // this.pageInfo.pageSize = parseInt(res.pageSize)
          this.pageInfo.total = parseInt(res.count)
          this.tableDate = res.data
          this.tableDate.forEach(e => {
            for (const key in e) {
              if (e[key] === null || e[key] === '') {
                e[key] = '--'
              }
            }
          })
        },
        handleSizeChange(pageSize) {
          this.pageInfo.pageSize = pageSize
          this.fetchData(this.pageInfo.pageNo)
        },
        handleCurrentChange(currentPage) {
          this.fetchData(currentPage)
        },
        refresh(reset = false) {
          const pageNo = reset ? 1 : this.pageInfo.pageNo
          this.pageInfo.pageNo = reset ? 1 : this.pageInfo.pageNo
          this.fetchData(pageNo)
          this.$forceUpdate()
        },
        getSelection() {
          return this.$refs.innerTable.selection
        },
        getToggleRowSelection(row) {
          console.log(row)
          row.forEach(e => {
            this.$refs.innerTable.toggleRowSelection(e)
          })
        }
      },
      mounted() {
        if (this.initQuery) {
          this.fetchData(1)
        }
      }
    }
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
