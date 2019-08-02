<template>
  <div>
    <el-button type="primary" @click="show">选择商家</el-button>
    <!-- 选择指定渠道并且至少已经选择一个渠道后显示 -->
    <div class="tag-plane" v-if="selectedChannelList.length>0&&selectTypebak !== '1'">
      <el-tag
        type="danger"
        @close="handleClose(index,channel)"
        class="selected-item"
        v-for="(channel,index) in selectedChannelList"
        closable
        :key="index"
      >{{channel.name}}</el-tag>
    </div>
    <!-- 选择所有渠道时显示 -->
    <div class="tag-plane" v-if="selectTypebak === '1'">{{allText}}</div>
    <el-dialog
      title="选择商家"
      :visible.sync="dialogVisible"
      width="600px"
      @close="resetFields('form')"
    >
      <el-radio-group v-model="selectType" style="margin-top:-5%">
        <el-radio :label="'1'">所有商家</el-radio>
        <el-radio :label="'2'">指定商家</el-radio>
      </el-radio-group>
      <el-form inline :model="query" ref="form" v-show="selectType === '2'">
        <el-form-item prop="name">
          <el-input clearable v-model="query.name" placeholder="请输入商家名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="checkbox-plane" v-show="selectType === '2'">
        <div class="header">
          <el-checkbox @change="doSelectAll" v-model="selectAll">全选</el-checkbox>
        </div>
        <div class="content">
          <div class="check-item" v-for="(channel,index) in channelList" :key="index">
            <el-checkbox @change="doChangeFun" v-model="channel.checked">{{channel.name}}</el-checkbox>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="hide">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getChannelList } from '@/api/mallCenter'
import { mergeArray } from '@/utils'
export default {
  props: {
    value: [String, Array],
    allText: {
      type: String,
      default: '所有商家'
    }
    // text: {
    //   type: Array,
    //   default: function() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      selectTypebak: '2',
      selectType: '2', // 1 选择全部渠道  2 指定渠道
      query: {},
      channelList: [],
      dialogVisible: false,
      selectedChannelList: [],
      isInit: false,
      selectAll: false,
      delSelect: {},
      changeChannelList: []
    }
  },
  watch: {
    selectedChannelList(val) {
      this.$emit('input', val)
    },
    selectType(val) {},
    value(val) {
      // this.init(val)
      if (this.selectedChannelList !== val) {
        this.selectedChannelList = val
      }
    },
    delSelect(val) {
      this.changeChannelList.forEach(e => {
        if (e.value === val.value) {
          e.checked = false
        }
      })
    }
  },
  methods: {
    doChangeFun(val) {
      this.selectedChannelList = this.selectedChannelList.filter(
        e => e.value !== '-1'
      )
    },
    // init(value) {
    //   if (!this.isInit && this.text.length > 0) {
    //     if (typeof value === 'string') {
    //       value = split(value)
    //     }
    //     this.selectedChannelList = value.map((e, i) => {
    //       return { name: this.text[i], value: e }
    //     })
    //     this.isInit = true
    //   }
    // },
    show() {
      this.query = {}
      this.selectAll = false
      if (this.changeChannelList.length === 0) {
        this.fetchData()
      } else {
        this.channelList = this.changeChannelList
      }
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    save() {
      this.selectTypebak = this.selectType
      if (this.selectTypebak === '1') {
        this.selectedChannelList = mergeArray(
          this.selectedChannelList,
          this.channelList
        )
      } else {
        this.selectedChannelList = mergeArray(
          this.selectedChannelList,
          this.channelList.filter(e => e.checked)
        )
        const selectFalse = mergeArray(
          this.selectedChannelList,
          this.channelList.filter(e => JSON.stringify(e.checked) === 'false')
        )
        if (selectFalse) {
          selectFalse.forEach((e, i, self) => {
            if (!e.checked) {
              self.splice(i, self.length)
            }
          })
        }
        this.changeChannelList = this.channelList
        this.selectedChannelList = selectFalse
      }
      this.dialogVisible = false
    },
    handleClose(index) {
      this.delSelect = this.selectedChannelList[index]
      this.selectedChannelList.splice(index, 1)
    },
    doSelectAll(val) {
      this.selectedChannelList = this.selectedChannelList.filter(
        e => e.value !== '-1'
      )
      this.channelList.forEach(e => {
        this.$set(e, 'checked', val)
      })
    },
    async fetchData() {
      this.query.channelId = this.query.channelName
      this.channelList = await getChannelList(this.query)
      // this.channelList.forEach(e => {
      //   this.$set(e, 'checked', false)
      // })
      this.channelList.forEach(e => {
        const temp = this.selectedChannelList.find((value, index, arr) => {
          return value.value === e.value
        })
        if (temp) {
          e.checked = true
        }
      })
    }
  },
  created() {
    this.selectedChannelList = this.value

    // this.init()
  }
}
</script>

<style scoped lang="scss">
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
.content {
  padding: 20px;
  margin: -10px 0px;
  margin-top: 0;
  max-height: 300px;
  overflow: auto;
  .check-item {
    margin: 10px 0px;
  }
}
.tag-plane {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  .selected-item {
    margin: 10px;
  }
}
</style>
