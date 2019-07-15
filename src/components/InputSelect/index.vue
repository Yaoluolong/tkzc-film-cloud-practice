<template>
  <div class="pore">
    <!--异步数据的下拉框，配合 filterable和 remote实现输入搜索-->
    <el-select
      class="input-select wp100"
      ref="elSelect"
      :filterable="isRemote"
      :remote="isRemote"
      :remote-method="remoteMethod"
      :multiple="isMultiple"
      :reserve-keyword="isMultiple"
      :size="size"
      v-model="value1"
      v-bind="$attrs"
      v-on="$listeners"
      :disabled="isDisabled||selectLoading"
      clearable
      @keyup.native="getkeyup"
      @blur="getBlur"
      @visible-change="getMuBlur"
      @focus="getFocus"
    >
      <el-option
        @click.native="choseId(value1,item)"
        :label="newSelectName === 'cinemaCode'?(item[params.selectName]+'('+item.cinemaCode+')'):(isEditOption?isEditOption+item[params.selectName]:item[params.selectName])"
        :value="typeof(item[params.id])==='number'?item[params.id]+'':item[params.id]"
        v-for="(item,index) in options"
        :key="index"
        :disabled="item.disabled || selectLoading"
        :style="{textAlign: item.center}"
      ></el-option>
    </el-select>
    <i class="el-icon-loading poab" v-if="selectLoading" style="top: 14px;right: 10px;"></i>
  </div>
</template>

<script>
import { cinemaGroupGetList, getInterfaceTypePageList } from '@/api/mallCenter'
import { getFilmList } from '@/api/mallCenter'
// import { getFilmIdList } from '@/api/priceCenter'
export default {
  props: {
    size: String,
    isActionChange: {
      // 判断是否需要根据参数刷新
      type: Boolean,
      default: false
    },
    isEditOption: {
      // 是否添加编辑字样
      type: String,
      default: ''
    },
    isDisabled: {
      // 是否从外部禁用
      type: Boolean,
      default: false
    },
    saveInput: {
      // 是否保存输入框文字
      type: Boolean,
      default: false
    },
    isPageRemote: {
      // 外部判断是否需要输入
      type: Boolean,
      default: true
    },
    isMultiple: {
      // 是否多选
      type: Boolean,
      default: false
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
    isNewQuery: {
      // 是否使用新的查询参数查询
      type: Boolean,
      default: false
    },
    newSelectName: {
      // 新的查询参数
      type: String,
      default: ''
    },
    getName: {
      // 查询时用于获取手动输入的查询条件
      type: String
    },
    value: {
      type: [String, Number, Object, Array],
      default: null
    }, // 外部传入的值
    info: {
      type: [String, Number, Object, Array],
      default: null
    },
    isRemote: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      query: {
        // 接口初始参数
        page: 1,
        pageSize: 200
      },
      params: {
        // 接口值
        selectName: '',
        id: '',
        selectApi: null
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
          id: 'id',
          selectApi: getFilmList
        }
      },
      options: [], // 列表值
      lastOptions: [], // 最后一次请求的数据
      value1: null, // 组件中的选值
      requstAll: false, // 判断是否有下拉数据
      isBottom: false, // 判断是否到达底部
      isInbottom: false, // 判断是否已经在底部了
      remoteVal: '', // 输入或者选择的具体值
      list: [], // 存放已有的options
      loadIndex: null, // 存放加载栏在options中的位置
      selectLoading: false, // loading
      iskeyup: false, // 判断是否手动输入过
      isChoseId: false, // 判断是否点击选择
      //   isRemote: true,
      isCanChose: false,
      isChosed: false
    }
  },
  watch: {
    'query.page': {
      handler(val, oldVal) {
        if (val !== 1) {
          this.fetchOptions()
        }
      }
    },
    value(val, oldVal) {
      this.isCanChose = !this.isCanChose
      if (
        (this.value !== null || this.value !== undefined) &&
        (this.options.length > 1 ||
          (+this.options[0].id && +this.options[0].id > 0))
      ) {
        this.getValue(this.value)
      }
    },
    isCanChose(val) {
      if (
        (this.value !== null || this.value !== undefined) &&
        (this.options.length > 1 ||
          (+this.options[0].id && +this.options[0].id > 0 && !this.isChosed))
      ) {
        this.getValue(this.value)
        this.isChosed = true
      }
    },
    isActionChange(val) {
      if (!val) {
        let time = 10
        const t2 = window.setInterval(() => {
          time = time - 0.5
          if (val || time < 0) {
            window.clearInterval(t2)
            if (val) {
              this.fetchOptions()
            }
          }
        }, 100)
      } else {
        this.fetchOptions()
      }
    },
    actionQuery: {
      handler(val, oldVal) {
        if (this.isActionChange) {
          this.fetchOptions()
        }
      },
      deep: true
    },
    value1(val, oldVal) {
      if (oldVal !== null) {
        if (!val || (Array.isArray(val) && val.length === 0)) {
          this.isBottom = false
          if (!this.isMultiple) {
            this.$nextTick(() => {
              this.remoteMethod('')
            })
            this.$emit('getSelectValue', ['', ''])
          } else {
            this.$emit('getSelectValue', [[]])
          }
        } else {
          if (this.isMultiple) {
            this.$emit('getSelectValue', [val])
          }
        }
      }
    }
  },
  methods: {
    getValue(val) {
      if (JSON.stringify(this.value1) !== JSON.stringify(val)) {
        if (this.isMultiple) {
          if (typeof val === 'string' && val.split(',') && val !== 'null') {
            this.value1 = val.split(',')
          } else {
            this.value1 = val || []
            console.log(val, this.value1)
          }
        } else {
          this.value1 = val !== 'null' && (val || val === '') ? val + '' : null
        }
      }
      if (!val || (Array.isArray(val) && val.length === 0)) {
        this.$delete(this.query, this.newSelectName)
        this.$delete(this.query, this.params.selectName)
      }
    },
    // 通过类型获取对应接口参数
    getType() {
      for (var key in this.selectParams) {
        if (key === this.selectType) {
          for (var ley in this.selectParams[key]) {
            this.$set(this.params, ley, this.selectParams[key][ley])
          }
        }
      }
      // let selectArr = ['interface', 'group', 'dict', 'holiday', 'processType']
    //   let selectArr = [
    //     'interface',
    //     'group',
    //     'dict',
    //     'dictWay',
    //     'processType',
    //     'holiday'
    //   ]
    //   if (selectArr.includes(this.selectType) || !this.isPageRemote) {
    //     this.isRemote = false
    //   }
    },
    // 下拉加载样式
    loadingStyle(loading) {
      //    if(this.options && this.options.length){
      //    if (loading) {
      //      if (!this.selectLoading) {
      //        let params = { id: '-2', value: 'loading', disabled: true, center: 'center' }
      //        this.$set(params, this.params.selectName, '加载中!')
      //        this.options.push(params)
      //        this.loadIndex = this.options.length - 1
      //      }
      //    } else {
      //      if (!this.selectLoading) {
      //        for (var i = 0; i < this.options.length; i++) {
      //          if (this.options[i].value === 'loading') {
      //            this.options.splice(i, 1)
      //          }
      //        }
      //      }
      //    }
      //     }
    },
    // 通过对应接口获取对应数据
    async fetchOptions() {
      this.getType()
      this.loadingStyle(true)
      this.selectLoading = true
      if (this.params.selectApi) {
        this.query = Object.assign({}, this.query, this.actionQuery)
        let options
        try {
          console.log(this.params.selectApi(), this.query)
          options = await this.params.selectApi(this.query)
        } catch (error) {
          console.log(error)
          this.loadingStyle(false)
          this.selectLoading = false
          return false
        }
        this.selectLoading = false
        this.loadingStyle(false)
        this.lastOptions =
          options.data && options.data.length
            ? options.data
            : options && options.length && !options.data
              ? options
              : []
        this.options = this.requstAll
          ? this.options.concat(this.lastOptions)
          : this.lastOptions
        this.list = this.options
        this.isBottom =
          this.lastOptions && this.lastOptions.length < this.query.pageSize
        if (this.options.length === 0) {
          const params = {
            id: '-3',
            value: 'noDate',
            disabled: true,
            center: 'center'
          }
          this.$set(params, this.params.selectName, '暂无数据！')
          this.options.push(params)
        }
        this.isCanChose = !this.isCanChose
      }
    },
    // 选择值
    choseId(value, msg) {
      this.isChoseId = true
      const selectName =
        this.isNewQuery && this.newSelectName
          ? this.newSelectName
          : this.params.selectName
      if (!msg.disabled && !this.selectLoading && !this.isMultiple) {
        let nameKey = ''
        if (msg) {
          for (var key in msg) {
            if (key === selectName) {
              if (msg[key]) {
                if (this.isRemote) {
                  this.remoteMethod(msg[key])
                }
                nameKey = msg[key]
              } else {
                this.remoteMethod('')
              }
            }
          }
        }
        //      this.$emit('update:getName', '')   //开启全局name模糊查询
        this.$nextTick(() => {
          this.$emit('getSelectValue', [value, nameKey])
          this.$emit('getSelectMsg', msg)
        })
      } else if (this.isMultiple) {
        this.$nextTick(() => {
          this.$emit('getSelectValue', [value])
        })
      }
    },
    // 判断是否手动输入过
    getkeyup(val) {
      this.iskeyup = true
      if (val.key === 'Backspace' && !val.path[0].value) {
        this.remoteMethod('')
      }
    },
    getBlur() {
      if (this.iskeyup && this.value1) {
        this.iskeyup = false
        if (this.saveInput) {
          this.$emit('getInput', this.value1)
        } else {
          //        this.$emit('update:getName', this.value1)   //开启全局name模糊查询
        }
      }
    },
    getFocus(val) {},
    getMuBlur(val) {
      if (!val || (Array.isArray(val) && !val.length)) {
        if (this.isMultiple) {
          this.remoteMethod('')
        } else {
          if (!this.isChoseId && !this.saveInput) {
            this.value1 = ''
          } else {
            this.isChoseId = false
          }
        }
      }
    },
    // 可输入时判断
    remoteMethod(remoteVal) {
      if (!this.isMultiple) {
        this.value1 = remoteVal
      }
      this.remoteVal = remoteVal
      let selectName = ''
      if (this.isNewQuery && this.newSelectName) {
        selectName = this.newSelectName
      } else {
        selectName = this.params.selectName
      }
      if (this.isRemote && !this.isBottom) {
        this.isBottom = false
        this.isInbottom = false
        this.query.page = 1
        this.options = []
        if (remoteVal) {
          setTimeout(() => {
            this.$set(this.query, selectName, remoteVal)
            this.fetchOptions()
          }, 500)
        } else {
          setTimeout(() => {
            this.$delete(this.query, selectName)
            this.fetchOptions()
          }, 500)
        }
      } else {
        if (remoteVal) {
          setTimeout(() => {
            this.options = this.list.filter((item, index) => {
              for (var key in item) {
                if (key === selectName) {
                  return item[key].indexOf(remoteVal) > -1
                }
              }
            })
          }, 500)
        } else {
          this.options = this.list
        }
      }
    },
    getBottom() {
      let scrollTop
      let windowHeight
      let scrollHeight
      if (this.$refs.elSelect) {
        if (this.isMultiple) {
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
        if (this.lastOptions.length < this.query.pageSize) {
          this.isBottom = true
        } else {
          this.isBottom = false
        }
        if (!this.isBottom) {
          setTimeout(() => {
            this.query.page = this.query.page + 1
            this.requstAll = true
          }, 400)
        } else {
          if (!this.isInbottom) {
            const params = {
              id: '-1',
              value: 'inBottom',
              disabled: true,
              center: 'center'
            }
            this.$set(params, this.params.selectName, '已经到底啦！')
            this.options.push(params)
            this.isInbottom = true
          }
        }
      }
    }
  },
  async created() {
    await this.fetchOptions()
  },
  mounted() {
    window.addEventListener('scroll', this.getBottom, true)
  }
}
</script>
