<template>
  <!-- 不考虑分页 -->
  <el-select
    ref="zmSelect"
    v-model="selectValue"
    v-bind="$attrs"
    v-on="$listeners"
    :filterable="selectOpt.remote"
    :remote="selectOpt.remote"
    :remote-method="remoteMethod"
    :multiple="selectOpt.multiple"
    :reserve-keyword="selectOpt.multiple"
    :disabled="selectOpt.disabled||selectLoading"
    :size="selectOpt.size"
    @visible-change="visibleChange"
    @focus="getFocus"
    clearable
  >
    <el-option
      :label="item[apiParams.name]"
      :value="item[apiParams.id]"
      v-for="(item,index) in optionsData"
      :key="index"
    ></el-option>
    <i slot="suffix" class="el-icon-loading" v-show="selectLoading"></i>
  </el-select>
</template>
<script>
import { apiType } from './const'
export default {
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    // 传入的api类型
    selectType: {
      type: String,
      default: ''
    },
    // 传入的设置参数
    attrOption: {
      type: Object,
      default() {
        return {
          multiple: false
        }
      }
    },
    // 传入的额外查询参数
    actionQuery: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      apiType,
      selectValue: null,
      selectLoading: false,
      isBackfill: false,
      selectOpt: {
        multiple: false, // 是否多选
        filterable: true, // 是否可搜索
        remote: true, // 是否远程搜素
        disabled: false, // 是否禁用选项
        isFocus: true // 是否激活后加载数据
      },
      apiParams: {
        // 组件接口参数
        name: '',
        id: '',
        api: ''
      },
      optionsData: [], // 展示用选项数组
      list: [], // 完整选项数组
      queryParams: {} // 默认查询参数
    }
  },
  watch: {
    value(val) {
      // 只做一次回填
      if (val && val.length && !this.isBackfill) {
        this.getInfo(val)
        this.isBackfill = true
      }
    }
  },
  mounted() {
    // 传入的selectOpt覆盖默认设置
    this.selectOpt = Object.assign({}, this.selectOpt, this.attrOption)
    this.selectValue = this.attrOption.multiple ? [] : ''
    this.getApiType()
  },
  methods: {
    // 回填数据
    async getInfo(val) {
      if (!this.optionsData.length) await this.getOptionArr()
      // 不考虑分页只需要有值时做回填，数据请求完毕后再进行回填
      if (JSON.stringify(val) !== JSON.stringify(this.selectValue)) {
        if (this.attrOption.multiple) {
          this.selectValue = val ? Array.isArray(val) ? val : val.split(',') : []
        } else {
          this.selectValue = val || ''
        }
      }
    },
    // 根据外部传入的类型获取api参数
    getApiType() {
      const apiParams = this.apiType[this.selectType]
      this.$set(this.apiParams, 'name', apiParams.name || 'name')
      this.$set(this.apiParams, 'id', apiParams.id || 'value')
      this.$set(this.apiParams, 'api', apiParams.selectApi)
    },
    // 通过接口获取选项数组
    getOptionArr() {
      const _this = this
      return new Promise(async(resolve, reject) => {
        _this.selectLoading = true
        // 链接内部参数和外部参数
        _this.queryParams = Object.assign({}, _this.queryParams, _this.actionQuery)
        let res
        try {
          res = await _this.apiParams.api(_this.queryParams)
        } catch (error) {
          _this.selectLoading = false
          reject(error)
          return
        }
        _this.selectLoading = false
        _this.optionsData = res.data || res
        _this.list = res.data || res
        resolve()
      })
    },
    remoteMethod(remoteVal) {
      if (remoteVal) {
        setTimeout(() => {
          this.optionsData = this.list.filter((item, index) => {
            for (var key in item) {
              if (key === this.apiParams.name) {
                return item[key].indexOf(remoteVal) > -1
              }
            }
          })
        }, 200)
      } else {
        this.optionsData = this.list
      }
    },
    getFocus(val) {
      // 多选时处理值被清空时，拉回所有列表
      if (!val.target.value && this.attrOption.multiple) this.remoteMethod('')
    },
    changeSelect(val) {
      this.$emit('update:input', val)
      // 筛选选中的值以数组形式传出，单选的情况下则为单项数组
      const chooseArr = []
      this.list.forEach(e => {
        if (this.attrOption.multiple) {
          val.forEach(item => {
            if (item === e[this.apiParams.id]) {
              chooseArr.push(e)
            }
          })
        } else {
          if (e[this.apiParams.id] === val) chooseArr.push(e)
        }
      })
      this.$emit('change', chooseArr)
    },
    visibleChange(val) {
      if (val) {
        // 不需要回填的时候，手动加载数据,展开时如果没有可选数组则获取数据
        if (this.selectOpt.isFocus && !this.optionsData.length) this.getOptionArr()
        // 单选时处理值被清空时，拉回所有列表
        if (!(this.selectValue && this.selectValue.length) && !this.attrOption.multiple) this.remoteMethod('')
      } else {
        // 收缩时，更新外部数据
        this.changeSelect(this.selectValue)
      }
    }
  }
}
</script>
