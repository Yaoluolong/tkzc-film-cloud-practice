<template>
  <div>
    <el-form ref="numberValidateForm" label-width="600px" class="ruleForm">
      <div class="tag-head">{{allText}}</div>
      <el-radio-group v-model="selectType" style="padding:20px;">
        <el-radio :label="'1'">
          所有商家
        </el-radio>  
        <el-radio :label="'2'">
          指定商家
        </el-radio>
      </el-radio-group> 
      <div class="checkbox-plane" v-show="selectType === '2'">
        <div class="header">
          <el-checkbox @change="doSelectAll" v-model="selectAll">全选</el-checkbox>
        </div>
        <div class="content">
          <div class="check-item" v-for="(channel,index) in channelList" :key="index">
            <el-checkbox @change="doChangeFun(channel)" v-model="channel.checked" >{{channel.name}}</el-checkbox>
          </div>
        </div>
      </div>
    </el-form>
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
        default: '选择平台商家'
      },
      changeFun: { // 点标签上的删除按钮时进行的操作
        type: Function
      },
      type: String
    },
    data() {
      return {
        selectTypebak: '2',
        selectType: '2', // 1 选择全部渠道  2 指定渠道
        query: {},
        channelList: [],
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
      selectType(val) {
        if (val === '1') {
          this.fetchData()
          this.channelList.forEach(e => {
            this.$set(e, 'checked', true)
          })
          this.selectedChannelList = this.channelList
        }
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
      doChangeFun(channel) {
        if (this.changeFun) {
          const _this = this
          const callBack = () => {
            _this.$forceUpdate()
          }
          this.changeFun(channel, callBack)
        }
        this.$forceUpdate()
        this.save()
      },
      save() {
        this.selectTypebak = this.selectType
        if (this.selectTypebak === '1') {
          this.selectedChannelList = mergeArray(this.selectedChannelList, this.channelList)
        } else {
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
        }
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
        this.query.type = this.type
        this.channelList = await getChannelList(this.query)

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
      this.fetchData()
      this.selectedChannelList = this.value
  
      // this.init()
    }
  }
</script>

<style scoped lang="scss">
.ruleForm {
  border: 1px solid #DCDFE6;
  .tag-head{
    padding: 0px 20px;
    border-bottom: 1px solid #DCDFE6;
    background-color: #F2F6FC;
  }
}
.checkbox-plane{
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 20px 20px;
}
.header{
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.content{
  padding: 0 20px 20px;
  margin: -10px 0px;
  margin-top: 0;
  max-height: 300px;
  overflow: auto;
  
}
</style>
