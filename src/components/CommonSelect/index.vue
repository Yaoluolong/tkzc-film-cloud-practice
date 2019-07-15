<template>
  <div>
    <el-select
      v-model="selections"
      @clear="handleClear"
      @change="handleChange"
      clearable
      :multiple="selectAttr.multiple"
      filterable
      :remote="selectAttr.remote"
      :reserve-keyword="selectAttr.multiple&&selectAttr.remote?selectAttr.reserveKeyword:false"
      :remote-method="throttleInputChange"
      :placeholder="selectAttr.placeholder||selectPlaceholder[selectType]||''"
      :loading="loading"
      :size="selectAttr.size"
      class="wp100"
      ref="elSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.name"
        :value="item[selectKey]"
        :disabled="item.disabled"
        :class="{tc:item[selectKey]==='-1'}"
      ></el-option>
    </el-select>
    <i class="el-icon-loading poab" v-show="loading"></i>
  </div>
</template>

<script>
import { getFilmList } from '@/api/mallCenter'
import { getCompanyList } from '@/api/systemSetting'
// import { getFilmIdList } from '@/api/priceCenter'
import { cinemaGroupGetList, getInterfaceTypePageList } from '@/api/mallCenter'
import { debounce, throttle } from 'throttle-debounce'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [Array, String, Number],
      default: ''
    },
    attrOptions: {
      default() {
        return {}
      }
    },
    actionQuery: {
      // 接口额外参数
      type: Object,
      default: () => {
        return {}
      }
    },
    selectType: {
      // 设置的接口参数
      type: String
    },
    isQueryAllOnce: {
      // 是否一次性全部获取
      type: Boolean,
      default: false
    },
    // select回填值
    defaultSelection: {
      type: [Array, Object],
      default() {
        return []
      }
    },
    isReload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      selectAttr: {
        size: 'small',
        multiple: false,
        remote: true,
        reserveKeyword: true,
        // disabled: false,
        placeholder: ''
      },
      query: {
        // 接口初始参数
        page: 1,
        pageSize: 50
      },
      params: {
        // 接口值
        selectName: '',
        id: '',
        selectApi: null
      },
      selectPlaceholder: {
        cinemaGroup: '请选择区域',
        filmList: '请输入影片名称模糊搜索',
        interfaceType: '请选择系统商'
      },
      selectParams: {
        // 选项接口参数
        cinemaGroup: {
          selectName: 'name',
          id: 'id',
          selectApi: cinemaGroupGetList
        },
        interfaceType: {
          selectName: 'name',
          id: 'id',
          selectApi: getInterfaceTypePageList
        },
        filmList: {
          selectName: 'filmName',
          id: 'value',
          selectApi: getFilmList
        },
        companyList: { // 公司
          selectName: 'name',
          id: 'value',
          selectApi: getCompanyList
        }
      },
      // 已选值
      selections: null,
      isNoMore: false, // 判断分页数据已经没有更多数据了
      isInbottom: false, // 判断是否已经在底部了
      totalNum: 0, // 服务端数据总条数
      options: [], // 已有的options列表
      listRequstOnce: [] // 存放一次性获取的所有
    }
  },
  computed: {
    selectKey() {
      return this.selectParams[this.selectType] &&
        this.selectParams[this.selectType].id
        ? this.selectParams[this.selectType].id
        : 'id'
    },
    selectName() {
      return this.selectParams[this.selectType] &&
        this.selectParams[this.selectType].selectName
        ? this.selectParams[this.selectType].selectName
        : 'name'
    }
  },
  watch: {
    defaultSelection(val, oldVal) {
      this.showDefault(val, oldVal)
    },
    isReload(val) {
      if (val) this.onSearch()
    }
    // selections(val) {
    //   this.$emit('change', val)
    // }
  },
  created() {
    this.selectAttr = {
      ...this.selectAttr,
      ...this.attrOptions
    }
    this.getType()
    this.showDefault(this.defaultSelection)
    // 防抖、节流
    this.throttleInputChange = debounce(300, this.onSearch)
    this.debouncedScroll = throttle(300, this.onScroll)
  },
  mounted() {
    const elScrollDom = this.getSelectScrollDom()
    elScrollDom &&
      elScrollDom.addEventListener('scroll', this.debouncedScroll, true)
    this.throttleInputChange()
  },
  methods: {
    throttleInputChange() {},
    debouncedScroll() {},
    showDefault(val, oldVal) {
      if (oldVal || !val) return
      if (val instanceof Array) {
        this.options = val.slice(0)
        this.selections = val.map(v => v[this.selectKey])
      } else {
        this.options = [val]
        this.selections = val[this.selectKey]
      }
    },
    onSearch(val = '') {
      this.query.page = 1
      this.query[this.selectName] = val
      this.fetch(val)
      this.$emit('update:isReload', false)
    },
    async fetch(val) {
      this.loading = true
      if (!this.params.selectApi) return
      const query = this.getSearchQuery(val)
      let result = null
      try {
        result = await this.loadList(query)
      } catch (error) {
        this.loading = false
        return false
      }
      this.loading = false
      this.query = query
      this.totalNum = result.count
      const page = result.data && result.data.length ? result.data : []
      this.options = query.page === 1 ? page : this.options.concat(page)
      //   this.list = this.options
      this.setBottom()
      //   this.isCanChose = !this.isCanChose
      console.log('onSearch-2', this.options.length)
    },
    getSearchQuery(name) {
      return Object.assign({}, this.query, this.actionQuery, {
        [this.selectName]: name || ''
      })
    },
    async loadList(query) {
      let options = {
        count: 0,
        data: []
      }
      // 正常获取
      if (!this.isQueryAllOnce) {
        options = await this.params.selectApi(query)
        return {
          count: options.count,
          data: options.data
        }
      }
      // 一次性获取
      if (query.page === 1) {
        options = await this.params.selectApi(query)
        this.totalListInQueryAll = options
      } else {
        options = this.totalListInQueryAll
      }
      const start = (query.page - 1) * query.pageSize
      console.log(start, start + query.pageSize)
      return {
        count: options.length,
        data: options.slice(start, start + this.query.pageSize)
      }
    },
    setBottom() {
      this.isNoMore = this.totalNum <= this.options.length
    },
    getType() {
      const result = this.selectParams[this.selectType]
      if (result) {
        for (var ley in result) {
          this.$set(this.params, ley, result[ley])
        }
      }
    },
    handleClear() {
      console.log('select', this.selections)
    },
    handleChange(val) {
      console.log('select', val)
      const value = val && this.selectAttr.multiple ? val.join(',') : val
      this.$emit('change', value, val)
    },
    onScroll() {
      console.log('toBottom')
      let scrollTop
      let windowHeight
      let scrollHeight
      if (this.$refs.elSelect) {
        if (this.selectAttr.multiple) {
          scrollTop = this.$refs.elSelect.$children[2].$children[0].$el
            .children[0].scrollTop
          windowHeight = this.$refs.elSelect.$children[2].$children[0].$el
            .children[0].clientHeight
          scrollHeight = this.$refs.elSelect.$children[2].$children[0].$el
            .children[0].scrollHeight
        } else {
          scrollTop = this.$refs.elSelect.$children[1].$el.children[0]
            .children[0].scrollTop
          windowHeight = this.$refs.elSelect.$children[1].$el.children[0]
            .children[0].clientHeight
          scrollHeight = this.$refs.elSelect.$children[1].$el.children[0]
            .children[0].scrollHeight
        }
      }
      if (scrollTop + windowHeight >= scrollHeight && scrollTop !== 0) {
        console.log('toBottom-2')
        this.touchBottom()
      }
    },
    getSelectScrollDom() {
      return this.selectAttr.multiple
        ? this.$refs.elSelect.$children[2].$children[0].$el.children[0]
        : this.$refs.elSelect.$children[1].$el.children[0].children[0]
    },
    touchBottom() {
      this.setBottom() // 判断是否还有可读取的
      if (this.isNoMore) {
        if (this.isInbottom) return
        const params = {
          [this.selectKey]: '-1',
          name: '已经到底啦！',
          disabled: true,
          center: 'center'
        }
        this.options.push(params)
        this.isInbottom = true
      } else {
        // 还有
        this.nextPage()
      }
    },
    nextPage() {
      this.query.page++
      this.fetch()
    }
  }
}
</script>

<style scoped lang="scss">
.film-selector-box {
  padding: -20px 0px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}
.film-select-plane {
  display: flex;
  align-items: center;
  margin: 20px 0px;
  & > span {
    width: 120px;
    text-align: right;
    margin-right: 20px;
  }
  .oper {
    font-size: 28px;
    margin-left: 20px;
    i {
      cursor: pointer;
    }
  }
}
</style>
