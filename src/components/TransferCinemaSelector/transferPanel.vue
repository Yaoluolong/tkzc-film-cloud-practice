<template>
  <div class="el-transfer-panel" style="border:1px solid #DCDFE6;height:300px;" :style="{width: panelWidth + 'px'}">
    <p class="el-transfer-panel__header">
      <el-checkbox v-show="true" 
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">
        {{ title }}
        <span v-if="isRight">{{ checkedSummary }}</span>
      </el-checkbox>
    </p>    
    <div :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <el-input
        class="el-transfer-panel__filter"
        v-model="query"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        v-if="filterable">
        <i slot="prefix"
          :class="['el-input__icon', 'el-icon-' + inputIcon]"
          @click="clearQuery"
        ></i>
      </el-input>
      <el-checkbox-group
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="el-transfer-panel__list"
        style="overflow-y:scroll"
        @scroll.native="onScroll" id="content"
        ref="checkboxScroll">
        <el-checkbox
          class="el-transfer-panel__item"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="item in filteredData">
          <option-content :option="item"></option-content>
          <!-- <span v-if="isRight" class="icon-close" style="float:right;margin-right:10px;width:20px;margin-top:5px;line-height:20px;text-align:center;height:20px;background-color:#ddd;border-radius:50%;">×</span> -->
        </el-checkbox><!--此处加了个判断是否为右边框给其加上相应的关闭按钮，isRight通过属性值进行传入-->
      </el-checkbox-group>
      <p
        class="el-transfer-panel__empty"
        v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
      <p
        class="el-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>
 
<script>
  import ElCheckboxGroup from 'element-ui/packages/checkbox-group'
  import ElCheckbox from 'element-ui/packages/checkbox'
  import ElInput from 'element-ui/packages/input'
  import Locale from 'element-ui/src/mixins/locale'
  import { getCinemaListForPage } from '@/api/systemSetting'
  import { realDeepClone } from '@/utils'

export default {
    mixins: [Locale],

    name: 'ElTransferPanel',

    componentName: 'ElTransferPanel',

    components: {
      ElCheckboxGroup,
      ElCheckbox,
      ElInput,
      OptionContent: {
        props: {
          option: Object
        },
        render(h) {
          const getParent = vm => {
            if (vm.$options.componentName === 'ElTransferPanel') {
              return vm
            } else if (vm.$parent) {
              return getParent(vm.$parent)
            } else {
              return vm
            }
          }
          const panel = getParent(this)
          const transfer = panel.$parent || panel
          return panel.renderContent
            ? panel.renderContent(h, this.option)
            : transfer.$scopedSlots.default
              ? transfer.$scopedSlots.default({ option: this.option })
              : <span>{ this.option[panel.labelProp] || this.option[panel.keyProp] }</span>
        }
      }
    },

    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      renderContent: Function,
      placeholder: String,
      title: String,
      panelWidth: Number,
      outInterfaceTypeId: String,
      outArea: Array,
      outCinemaName: String,
      filterable: Boolean,
      isRight: Boolean,
      format: Object,
      filterMethod: Function,
      defaultChecked: Array,
      props: Object
    },

    data() {
      return {
        checked: [],
        allChecked: false,
        query: '',
        inputHover: false,
        checkChangeByUser: true,
        params: {
          area: this.outArea,
          interfaceTypeId: this.outInterfaceTypeId,
          page: 1
        },
        totalPage: 10 // 初始值 随意设置
      }
    },

    watch: {
      checked(val, oldVal) {
        this.updateAllChecked()
        if (this.checkChangeByUser) {
          const movedKeys = val.concat(oldVal)
            .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1)
          this.$emit('checked-change', val, movedKeys)
        } else {
          this.$emit('checked-change', val)
          console.log('Check by User')
          this.checkChangeByUser = true
        }
      },

      data() {
        const checked = []
        const filteredDataKeys = this.filteredData.map(item => item[this.keyProp])
        this.checked.forEach(item => {
          if (filteredDataKeys.indexOf(item) > -1) {
            checked.push(item)
          }
        })
        this.checkChangeByUser = false
        this.checked = checked
      },

      checkableData() {
        this.updateAllChecked()
      },

      defaultChecked: {
        immediate: true,
        handler(val, oldVal) {
          if (oldVal && val.length === oldVal.length &&
            val.every(item => oldVal.indexOf(item) > -1)) return
          const checked = []
          const checkableDataKeys = this.checkableData.map(item => item[this.keyProp])
          val.forEach(item => {
            if (checkableDataKeys.indexOf(item) > -1) {
              checked.push(item)
            }
          })
          this.checkChangeByUser = false
          this.checked = checked
        }
      },

      interfaceTypeId(val) {
        console.log(val)
      }
    },

    computed: {
      filteredData() {
        return this.data.filter(item => {
          if (typeof this.filterMethod === 'function') {
            return this.filterMethod(this.query, item)
          } else {
            const label = item[this.labelProp] || item[this.keyProp].toString()
            return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1
          }
        })
      },

      checkableData: {
        get: function() {
          return this.filteredData.filter(item => !item[this.disabledProp])
        },
        set: function() {
  
        }
      },

      checkedSummary() {
        const checkedLength = this.checked.length
        const dataLength = this.data.length
        const { noChecked, hasChecked } = this.format
        if (noChecked && hasChecked) {
          return checkedLength > 0
            ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
            : noChecked.replace(/\${total}/g, dataLength)
        } else {
          return `${checkedLength}/${dataLength}`
        }
      },

      isIndeterminate() {
        const checkedLength = this.checked.length
        return checkedLength > 0 && checkedLength < this.checkableData.length
      },

      hasNoMatch() {
        return this.query.length > 0 && this.filteredData.length === 0
      },

      inputIcon() {
        return this.query.length > 0 && this.inputHover
          ? 'circle-close'
          : 'search'
      },

      labelProp() {
        return this.props.label || 'label'
      },

      keyProp() {
        return this.props.key || 'key'
      },

      disabledProp() {
        return this.props.disabled || 'disabled'
      },

      hasFooter() {
        return !!this.$slots.default
      }
    },

    methods: {
      resetPageParams() {
        this.$set(this.params, 'page', 1)
        this.$set(this, 'totalPage', 10)
      },
      onScroll(event) {
        if (this.isRight) return false
        const element = document.getElementById('content')
        if (element.scrollTop + element.clientHeight === element.scrollHeight) {
          if (this.params.page < this.totalPage) {
            this.fetchData(this.outInterfaceTypeId)
          }
        }
      },
      updateAllChecked() {
        const checkableDataKeys = this.checkableData.map(item => item[this.keyProp])
        this.allChecked = checkableDataKeys.length > 0 &&
          checkableDataKeys.every(item => this.checked.indexOf(item) > -1)
      },

      async handleAllCheckedChange(value) {
        this.checked = value
          ? this.checkableData.map(item => item[this.keyProp])
          : []
      },

      clearQuery() {
        if (this.inputIcon === 'circle-close') {
          this.query = ''
        }
      },

      async fetchData(interfaceTypeId) {
        this.params.interfaceTypeId = interfaceTypeId || this.outInterfaceTypeId
        this.params.page++
        this.params.cinemaName = this.outCinemaName
        if (this.outArea && this.outArea.length === 2) {
          this.params.cityId = this.outArea[1]
        } else if (this.outArea && this.outArea.length === 1) {
          this.params.provinceId = this.outArea[0]
        } else {
          this.params.provinceId = ''
          this.params.cityId = ''
        }
  
        const temp = realDeepClone(this.params)
        const result = await getCinemaListForPage(temp)
        result.list.forEach(e => {
          this.$parent.data.push({
            label: e.name,
            key: e.value
          })
        })
  
        this.totalPage = result.count
      }
    }
  }
</script>
