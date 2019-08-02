<template>
  <title-plane class="arg-edit-plane">
    <div class="tag-plane">
      <el-tag
        type="primary"
        class="arg-tag"
        closable
        @close="closeTag(key)"
        v-for="(val, key) in args"
        :key="key"
      >{{key+':'+val}}</el-tag>
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
        <el-input
          clearable
          v-model="newArg"
          v-else
          placeholder="请输入键值,如果不确定时只需输入键名,键名与键值用:隔开"
          style="width:100%"
          size="small"
        >
          <template slot="append">
            <i class="el-icon-check" title="保存" @click="save"></i>
            <i class="el-icon-close" title="取消" @click="cancel"></i>
          </template>
        </el-input>
      </div>
    </div>
  </title-plane>
</template>

<script>
export default {
  props: {
    value: [String, Object],
    help: String
  },
  data() {
    return {
      args: {},
      isEditArg: false,
      newArg: '',
      isInit: false
    }
  },
  watch: {
    value(val) {
      this.args = val
    }
  },
  methods: {
    save() {
      this.newArg = this.newArg.replace('：', ':')
      let key = ''
      let value = ''
      const arr = this.newArg.split(':')
      if (arr.length === 1) {
        key = arr[0]
      } else if (arr.length === 2) {
        key = arr[0]
        value = arr[1]
      }
      this.args[key] = value
      this.$emit('input', this.args)
      this.cancel()
    },
    cancel() {
      this.newArg = ''
      this.isEditArg = false
    },
    closeTag(key) {
      delete this.args[key]
      this.args = Object.assign({}, this.args)
    }
  },
  async created() {
    if (this.value) {
      this.args = this.value
    }
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
</style>
