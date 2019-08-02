<template>
  <div class="cinemaContent">
    <div class="cinemaTitle">选择影院</div>
    <div class="cinemaContentainer">
      <el-form inline :model="query" ref="form" class="cinemaCont">
        <el-form-item class="cityProp">
          <span style="font-weight:bold;margin-right:10px;">省/自治区/直辖市</span>
          <city-cascader
            v-model.trim="query.area"
            :rang="1"
            :clearable="true"
            placeholder="请选择"
            style="width:170px;"
          ></city-cascader>
        </el-form-item>
        <div style="display:inline-block;">
          <el-form-item>
            <el-input
              clearable
              style="width:300px"
              v-model.trim="query.cinemaName"
              placeholder="请输入影院名称"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left:60px">
            <el-button type="primary" @click="clearCinemaListAndFetchData(query.cinemaName)">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div style="margin-top:20px;">
        <el-radio-group v-model="cinemaTypeOut">
          <el-radio :label="'1'">所有影院</el-radio>
          <el-radio :label="'2'">指定影院</el-radio>
        </el-radio-group>
      </div>
      <div class="el-transfer" v-if="cinemaTypeOut === '2'">
        <transfer-panel
          v-bind="$props"
          ref="leftPanel"
          :filterable="false"
          :data="sourceData"
          :panelWidth="panelWidth"
          :outInterfaceTypeId="interfaceTypeId"
          :cinemaTypeOut="cinemaType"
          :outArea="query.area"
          :outCinemaName="query.cinemaName"
          :title="titles[0] || t('el.transfer.titles.0')"
          :default-checked="leftDefaultChecked"
          @checked-change="onSourceCheckedChange"
        >
          <slot name="left-footer"></slot>
        </transfer-panel>
        <div class="el-transfer__buttons">
          <el-button
            type="primary"
            :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
            @click.native="addToRight"
          >
            <span>-></span>
            <!--此处本人更改为自己所需按钮，按钮事件名字也从addToLeft改为allToLeft-->
          </el-button>
          <el-button
            type="primary"
            :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
            @click.native="addToLeft"
            style="margin-left:0;"
          >
            <span><-</span>
            <!--此处本人更改为自己所需按钮，按钮事件名字也从addToRight改为allToRight-->
          </el-button>
        </div>
        <transfer-panel
          v-bind="$props"
          :filterable="false"
          :isRight="true"
          ref="rightPanel"
          :data="targetData"
          :panelWidth="panelWidth"
          :title="titles[1] || t('el.transfer.titles.1')"
          :default-checked="rightDefaultChecked"
          :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
          @checked-change="onTargetCheckedChange"
        >
          <slot name="right-footer"></slot>
        </transfer-panel>
      </div>
    </div>
  </div>
</template>
<script>
import CityCascader from '@/components/CityCascader'

import ElButton from 'element-ui/packages/button'
import TransferPanel from './transferPanel.vue'
import { getCinemaList } from '@/api/systemSetting'

export default {
  name: 'ElTransfer',
  components: { CityCascader, TransferPanel, ElButton },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    titles: {
      type: Array,
      default() {
        return []
      }
    },
    panelWidth: Number,
    interfaceTypeId: String,
    cinemaType: String,
    buttonTexts: {
      type: Array,
      default() {
        return []
      }
    },
    filterPlaceholder: {
      type: String,
      default: ''
    },
    filterMethod: Function,
    leftDefaultChecked: {
      type: Array,
      default() {
        return []
      }
    },
    rightDefaultChecked: {
      type: Array,
      default() {
        return []
      }
    },
    renderContent: Function,
    value: {
      type: Array,
      default() {
        return []
      }
    },
    format: {
      type: Object,
      default() {
        return {}
      }
    },
    filterable: Boolean,
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled'
        }
      }
    },
    targetOrder: {
      type: String,
      default: 'original'
    }
  },

  data() {
    return {
      query: {
        interfaceTypeId: '',
        area: [],
        cinemaName: '',
        page: 1
      },
      totalCinemaList: [],
      cinemaTypeOut: this.cinemaType,
      leftChecked: [],
      rightChecked: [],
      checkedleft: true,
      checkedright: false,
      queryBak: {}
    }
  },
  computed: {
    dataObj() {
      const key = this.props.key
      return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {})
    },

    sourceData: {
      get: function() {
        return this.data.filter(
          item => this.value.indexOf(item[this.props.key]) === -1
        )
      },
      set: function() {}
    },

    targetData: {
      get: function() {
        return this.targetOrder === 'original'
          ? this.totalCinemaList.filter(
            item => this.value.indexOf(item[this.props.key]) > -1
          ) // 从所有影城中渲染匹配key
          : this.value.map(key => this.dataObj[key])
        /* return this.targetOrder === 'original'
          ? this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1)
          : this.value.map(key => this.dataObj[key])*/
      },
      set: function() {}
    },

    hasButtonTexts() {
      return this.buttonTexts.length === 2
    }
  },
  watch: {
    value(val) {
      this.$emit('ElFormItem', 'el.form.change', val)
    },
    cinemaTypeOut(val, oldval) {
      //  @cinemaTypeChange="cinemaTypeChange"接收子组件;子组件传cinemaType切换给父组件
      this.$emit('cinemaTypeChange', val)
    },
    interfaceTypeId(val) {
      this.$set(this.query, 'area', [])
      this.resetParams()
    }
  },
  methods: {
    copyObject(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    resetParams() {
      this.$refs.leftPanel.params.page = 1
      this.$refs.leftPanel.totalPage = 100
    },
    async clearCinemaListAndFetchData() {
      console.log(this.query, this.queryBak)

      this.resetParams()
      delete this.query.cityId
      delete this.query.provinceId

      if (this.query.area && this.query.area.length === 2) {
        this.query.cityId = this.query.area[1]
      } else if (this.query.area && this.query.area.length === 1) {
        this.query.provinceId = this.query.area[0]
      } else {
        this.query.provinceId = ''
        this.query.cityId = ''
      }
      // this.query.page = 1
      this.query.interfaceTypeId = this.interfaceTypeId
      if (this.query.cinemaName === this.queryBak.cinemaName) {
        this.query.page++
      } else {
        this.query.page = 1
      }
      this.$emit('cinemaChange', this.query)
    },
    getMigratingConfig() {
      return {
        props: {
          'footer-format': 'footer-format is renamed to format.'
        }
      }
    },

    onSourceCheckedChange(val, movedKeys) {
      this.leftChecked = val
      if (movedKeys === undefined) return
      this.$emit('left-check-change', val, movedKeys)
      // this.addToRight()// 在此处直接把选中项添加到右边框，实现单击操作，而不需通过按钮再次操作
    },

    onTargetCheckedChange(val, movedKeys) {
      this.rightChecked = val
      if (movedKeys === undefined) return
      this.$emit('right-check-change', val, movedKeys)
      // this.addToLeft()// 在此处直接把选中项添加到左边框，实现单击操作，而不需通过按钮再次操作
    },
    allToLeft() {
      this.$refs.leftPanel.handleAllCheckedChange(true) // 直接出发全选事件，父组件调用子组件方法需要通过this.$refs.组件ref值.子组件方法名
    },
    addToLeft() {
      const currentValue = this.value.slice()
      this.rightChecked.forEach(item => {
        const index = currentValue.indexOf(item)
        if (index > -1) {
          currentValue.splice(index, 1)
        }
      })
      this.$emit('input', currentValue)
      this.$emit('change', currentValue, 'left', this.rightChecked)
    },
    allToRight() {
      this.$refs.rightPanel.handleAllCheckedChange(true) // 直接出发全选事件，父组件调用子组件方法需要通过this.$refs.组件ref值.子组件方法名
    },
    addToRight() {
      this.$refs.leftPanel.fetchData(this.interfaceTypeId)
      let currentValue = this.value.slice()
      const itemsToBeMoved = []
      const key = this.props.key
      this.data.forEach(item => {
        const itemKey = item[key]
        if (
          this.leftChecked.indexOf(itemKey) > -1 &&
          this.value.indexOf(itemKey) === -1
        ) {
          itemsToBeMoved.push(itemKey)
        }
      })
      currentValue =
        this.targetOrder === 'unshift'
          ? itemsToBeMoved.concat(currentValue)
          : currentValue.concat(itemsToBeMoved)
      this.$emit('input', currentValue)
      this.$emit('change', currentValue, 'right', this.leftChecked)
      this.$message.success(
        '添加至第' + (parseInt(this.$refs.leftPanel.params.page) - 1) + '页成功'
      )
      this.queryBak = this.copyObject(this.query)
    },

    clearQuery(which) {
      if (which === 'left') {
        this.$refs.leftPanel.query = ''
      } else if (which === 'right') {
        this.$refs.rightPanel.query = ''
      }
    }
  },
  async created() {
    await getCinemaList({ interfaceTypeId: this.interfaceTypeId }).then(res => {
      res.map(e => {
        this.totalCinemaList.push({
          label: e.name,
          key: e.value
        })
      })
    })
  }
}
</script>
<style scoped lang="scss">
.cinemaContent {
  border: 1px solid #dcdfe6;
  .cinemaTitle {
    padding-left: 20px;
    border-bottom: 1px solid #dcdfe6;
    background-color: #f2f6fc;
  }
  .cinemaContentainer {
    padding: 0px 20px 20px 20px;
    .cinemaCont {
      padding-top: 20px;
      .cityProp {
        .el-form-item__label:before {
          content: '';
          color: #000000;
        }
      }
    }
  }

  .checkbox-plane {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 20px;
  }
  .header {
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #f2f6fc;
    padding: 0 20px;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>