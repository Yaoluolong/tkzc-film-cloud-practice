<template>
  <div>
    <el-button type="primary" @click="show">选择渠道商</el-button>
    <div class="tag-plane" v-if="selectedChannelList.length>0">
      <el-tag type="danger" @close="handleClose(index,channel)" class="selected-item" v-for="(channel,index) in selectedChannelList" closable :key="index">{{channel.name}}</el-tag>
    </div>
    <el-dialog title="选择渠道商" :visible.sync="dialogVisible" width="600px" @close="resetFields('form')">
        <el-form inline :model="query"  ref="form">
          <el-form-item prop="name">
              <el-input  v-model="query.name" placeholder="请输入渠道商名称"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="fetchData" >查询</el-button>
          </el-form-item>
        </el-form>
        <div class="checkbox-plane">
          <div class="header">
            <el-checkbox @change="doSelectAll" v-model="selectAll">全选</el-checkbox>
          </div>
          <div class="content">
            <div class="check-item" v-for="(channel,index) in channelList" :key="index">
              <el-checkbox v-model="channel.checked" >{{channel.name}}</el-checkbox>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save" >确 定</el-button>
            <el-button @click="hide" >取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getChannelList } from '@/api/mallCenter'
  import { mergeArray } from '@/utils'
  export default {
    props: {
      value: [String, Array]
      // text: {
      //   type: Array,
      //   default: function() {
      //     return []
      //   }
      // }
    },
    data() {
      return {
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
        // const result = val.map(e => e.value)
        this.$emit('input', val)
      },
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
        this.selectedChannelList = mergeArray(this.selectedChannelList, this.channelList.filter(e => e.checked))
        const selectFalse = mergeArray(this.selectedChannelList, this.channelList.filter(e => JSON.stringify(e.checked) === 'false'))
        if (selectFalse) {
          selectFalse.forEach((e, i, self) => {
            if (!e.checked) {
              self.splice(i, self.length)
            }
          })
        }
        this.changeChannelList = this.channelList
        this.selectedChannelList = selectFalse
        this.dialogVisible = false
      },
      handleClose(index) {
        this.delSelect = this.selectedChannelList[index]
        this.selectedChannelList.splice(index, 1)
      },
      doSelectAll(val) {
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
      }
    },
    created() {
      this.selectedChannelList = this.value
      // this.init()
    }
  }
</script>

<style scoped lang="scss">
.checkbox-plane{
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 20px;
}
.header{
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #F2F6FC;
  padding: 0 20px;
  border-bottom:  1px solid #DCDFE6;
}
.content{
  padding: 20px;
  margin: -10px 0px;
  margin-top: 0;
  max-height: 300px;
  overflow: auto;
  .check-item{
    margin: 10px 0px;
  }
}
.tag-plane{
   border: 1px solid #DCDFE6;
   border-radius: 4px;
   margin-top: 20px;
   display: flex;
   flex-wrap: wrap;
   padding: 10px;
   .selected-item{
     margin: 10px;
   }
}
</style>
