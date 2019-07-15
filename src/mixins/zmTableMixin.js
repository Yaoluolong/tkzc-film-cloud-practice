export default {
  data() {
    return {
      tableParams: {
        count: 0,
        page: 1,
        pageSize: 10,
        data: [],
        selectList: [],
        isCheckBoxClick: false // 点击复选框标示
      },
      pk: 'id',
      advancedSearchVisible: false
    }
  },
  methods: {
    assignQuery(query) {
      return {
        page: this.tableParams.page,
        pageSize: this.tableParams.pageSize,
        ...query
      }
    },
    onSearch() {
      this.$set(this.tableParams, 'page', 1)
      this.loadList && this.loadList()
    },
    onReset() {
      if (this.$refs.searchForm) {
        this.$refs.searchForm.resetFields()
        if (this.onRangeChange && typeof this.onRangeChange === 'function') {
          this.rangeTime = []
          this.onRangeChange([])
        }
        this.onSearch()
      }
    },
    // handleSelectionChange () {
    //   let table = this.$refs.zmTabel.getTable
    //   this.tableParams.selectList = table.selection
    // },
    initialTableData(dataList, totalCount) {
      const tableParams = this.tableParams
      tableParams.count = totalCount
      tableParams.data = Object.freeze(dataList)
    },
    /**
     * 获取table组件的引用
     */
    getTableRef() {
      return this.$refs.zmTable || this.$refs.multipleTable
    },
    /**
     * 获取表格选中列的数组
     */
    getTableSelection(isEl) {
      // isEl 是否使用element自带的方法获取
      const table = this.getTableRef()
      if (table) {
        return table.getSelectionsList(isEl)
      }
      return []
    },
    /**
     * 清除表格选中列的数组
     */
    clearSelection() {
      const table = this.getTableRef()
      if (table) table.clearSelection()
    },
    /**
     * 获取已选的id,默认使用element自带方法获取
     */
    getSelectionIds(isNoEl, idName) {
      const tableSelection = this.getTableSelection(!isNoEl)
      const handlerIds = []
      const id = idName || 'id'
      tableSelection.forEach(item => {
        handlerIds.push(item[id])
      })
      return handlerIds
    },
    onAdvancedQuery() {
      this.advancedSearchVisible = true
    },
    onAdvancedQueryCancel(params, obj) {
      this.advancedSearchVisible = false
    },
    onAdvancedQuerySearch(params, obj) {
      this.advancedSearchVisible = false
      // 用高级搜索的params覆盖参数
      // if (this.resetParams && typeof this.resetParams === 'function') {
      //   this.resetParams(params, obj)
      // }
      this.onSearch()
    }
  }
}
