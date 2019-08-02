<template>
  <title-plane title="全选" checkbox class="copytype-plane" @select-all="selectAllCopyType">
    <el-checkbox
      v-for="copyType in copyTypeList"
      :key="copyType.name"
      v-model="copyType.checked"
      style="margin:10px;"
    >
      <el-tag
        :type="copyType.closable? 'danger':'primary'"
        :closable="copyType.closable"
        @close="closeTag(copyType)"
      >{{copyType.name}}</el-tag>
    </el-checkbox>
    <div class="copytype-oper">
      <div v-if="needAdd">
        <el-button
          type="text"
          icon="el-icon-plus"
          v-if="isEditCopyType==false"
          @click="isEditCopyType=true"
        >新增制式</el-button>
        <el-input
          clearable
          v-model="newCopyType"
          v-else
          placeholder="最多6个字"
          maxlength="6"
          style="width:250px"
          size="small"
        >
          <template slot="append">
            <i class="el-icon-check" title="保存" @click="save"></i>
            <i class="el-icon-close" title="取消" @click="cancel"></i>
          </template>
        </el-input>
        <div style="font-size:14px">
          <div style="line-height:26px">1、关联影厅下拉有数据时显示：请选择关联影厅，如果无数据时显示：请先获取影厅；</div>
          <div style="line-height:26px">2、如果新增的特殊制式是4D时，不论是关联什么国标制式还是关联影厅，都是讲其对应的影片排期制式更改为4D；</div>
        </div>
      </div>
    </div>
  </title-plane>
</template>

<script>
import { getProgramCopyType } from '@/api/mallCenter'
export default {
  props: {
    value: [String, Array],
    needStandard: {
      // 是否需要显示标准制式
      type: Boolean,
      default: true
    },
    needAdd: {
      type: Boolean,
      default: true
    },
    cinemaIds: String
  },
  data() {
    return {
      copyTypeList: [],
      isEditCopyType: false,
      newCopyType: '',
      isInit: false
    }
  },
  computed: {
    checkedCopyType() {
      return this.copyTypeList.filter(e => e.checked)
    }
  },
  watch: {
    checkedCopyType(val) {
      this.$emit('input', val.map(e => e.name).join(','))
    },
    value(val) {
      this.init()
    }
  },
  methods: {
    init(val) {
      if (this.isInit) return
      if (this.value && (this.copyTypeList.length > 0 || !this.needStandard)) {
        const valueArr = this.value.split(',')
        this.copyTypeList.forEach(e => {
          if (valueArr.find(k => k === e.name)) {
            e.checked = true
          }
        })
        valueArr.forEach(e => {
          if (!this.copyTypeList.find(k => k.name === e)) {
            this.copyTypeList.push({ name: e, closable: true, checked: true })
          }
        })
        this.isInit = true
      }
    },
    save() {
      this.copyTypeList.push({
        name: this.newCopyType,
        closable: true,
        checked: false
      })
      this.cancel()
    },
    cancel() {
      this.newCopyType = ''
      this.isEditCopyType = false
    },
    selectAllCopyType(val) {
      this.copyTypeList.forEach(e => {
        e.checked = val
      })
    },
    closeTag(copyType) {
      this.copyTypeList = this.copyTypeList.filter(
        e => e.name !== copyType.name
      )
    }
  },
  async created() {
    if (this.needStandard) {
      const defaultCopyType = await getProgramCopyType(this.cinemaIds)
      this.copyTypeList = defaultCopyType.map(e => {
        return { name: e, closable: false, checked: false }
      })
    }

    this.init()
  }
}
</script>

<style scoped lang="scss">
.copytype-oper {
  margin-top: 20px;
  .el-icon-check,
  .el-icon-close {
    font-size: 16px;
    cursor: pointer;
  }
  .el-icon-close {
    margin-left: 10px;
  }
}
</style>
