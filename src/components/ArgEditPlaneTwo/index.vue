<template>
  <title-plane class="arg-edit-plane">
    <div class="tag-plane">
      <el-table v-if="args && args.length > 0" :data="args">
        <el-table-column label="请求键名" prop="key"></el-table-column>
        <el-table-column label="请求参值" prop="value"></el-table-column>
        <el-table-column prop="value">
          <template slot-scope="{row}">
            <i class="el-icon-close" style="cursor: pointer;" @click="del(row.key)" title="取消"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="arg-oper">
      <div>
        <el-button type="text" icon="el-icon-plus" v-if="isEditArg==false" @click="isEditArg=true">
          新增键值
          <el-tooltip placement="right" v-if="help">
            <div slot="content" v-html="help"></div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-button>
        <div v-else>
          <el-input
            clearable
            v-model.trim="newKey"
            placeholder="输入请求接口键名,例如:[key]"
            size="small"
            style="width:200px"
          ></el-input>
          <el-input
            clearable
            v-model.trim="newValue"
            placeholder="输入请求接口参值,例如:[url]"
            size="small"
            style="width:200px"
          ></el-input>
          <i class="el-icon-check" title="保存" @click="save"></i>
          <i class="el-icon-close" title="取消" @click="cancel"></i>
        </div>
      </div>
    </div>
  </title-plane>
</template>

<script>
import { realDeepClone } from '@/utils'
export default {
  props: {
    value: {
      type: Array,
      default: function() {
        return []
      }
    },
    help: String
  },
  data() {
    return {
      args: this.value,
      isEditArg: false,
      newArg: '',
      newKey: '',
      newValue: '',
      isInit: false
    }
  },
  watch: {
    value(val) {
      this.args = val
      if (this.args && this.args.length > 0) {
        this.args.forEach(e => {
          e.key = e.key + ''
        })
      }
    }
  },
  computed: {
    argsForSub() {
      const reuslt = realDeepClone(this.args)
      if (reuslt && reuslt.length > 0) {
        reuslt.forEach(e => {
          e.key = e.key + ''
        })
      }
      return reuslt
    }
  },
  methods: {
    del(key) {
      this.args = this.args.filter(e => e.key !== key)
      this.$emit('input', this.argsForSub)
    },
    save() {
      // this.newArg = this.newArg.replace('：', ':')
      // let key = ''
      // let value = ''
      // const arr = this.newArg.split(':')
      // if (arr.length === 1) {
      //   key = arr[0]
      // } else if (arr.length === 2) {
      //   key = arr[0]
      //   value = arr[1]
      // }
      // this.args[key] = value
      let flag = false
      if (this.args && this.args.length > 0) {
        this.args.forEach(e => {
          if (e.key === this.newKey) {
            flag = true
          }
        })
      } else {
        this.args = []
      }
      if (flag) {
        this.$message.warning('已经添加了这个key,不能重复添加')
        return
      }
      const temp = {}
      temp.key = this.newKey
      temp.value = this.newValue
      this.args.push(temp)
      this.$emit('input', this.argsForSub)
      this.cancel()
    },
    cancel() {
      this.newKey = ''
      this.newValue = ''
      this.isEditArg = false
    }
  },
  async created() {
    // if (this.value) { this.args = this.value }
  }
}
</script>

<style scoped lang="scss">
.el-icon-question {
  font-size: 22px;
  color: #3ca0ec;
  cursor: pointer;
}
.tag-plane {
  margin: -10px;
  .arg-tag {
    margin: 10px;
  }
}

.arg-oper {
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
.el-table th {
  background-color: '';
}
</style>
