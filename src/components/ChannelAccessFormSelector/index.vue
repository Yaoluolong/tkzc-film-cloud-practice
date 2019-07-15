<template>
  <div>
    <el-form ref="numberValidateForm" label-width="600px" class="ruleForm">
      <div class="tag-head">{{allText}}</div>
      <el-radio-group v-model="selectType" :disabled="inDisabled" style="padding:20px;">
        <el-radio :label="'1'">
          所有商家
        </el-radio>  
        <el-radio :label="'2'">
          指定商家
        </el-radio>
      </el-radio-group> 
      <div class="checkbox-plane" v-show="selectType === '2'">
        <div class="header">
          <el-checkbox @change="doSelectAll" v-model="selectAll" :disabled="inDisabled">全选</el-checkbox>
        </div>
        <div class="content">
          <div class="check-item" v-for="(channel,index) in channelList" :key="index">
            <el-checkbox @change="doChangeFun(channel)" v-model="channel.checked" :disabled="inDisabled">{{channel.name}}</el-checkbox>
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
      type: String,
      outDisabled: Boolean
    },
    data() {
      return {
        selectTypebak: '2',
        selectType: '1', // 1 选择全部渠道  2 指定渠道
        query: {
          type: this.type
        },
        channelList: [],
        selectedChannelList: [],
        isInit: false,
        selectAll: false,
        inDisabled: this.outDisabled,
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
          this.channelList.forEach(e => {
            this.$set(e, 'checked', true)
          })
          this.selectedChannelList = ['-1']
        }
        this.selectAll = this.selectedChannelList.length === this.channelList.length
      }
    },
    methods: {
      doChangeFun(channel) {
        const arr = this.channelList.filter(e => { return e.checked })
        this.selectedChannelList = arr.map(e => e.value)
        this.selectAll = this.selectedChannelList.length === this.channelList.length
        this.save()
      },
      save() {
        if (this.selectType === '1') {
          this.selectedChannelList = ['-1']
          // this.selectedChannelList = mergeArray(this.selectedChannelList, this.channelList)
        } else {
          const arr = this.channelList.filter(e => e.checked)
          this.selectedChannelList = mergeArray(this.selectedChannelList, arr.map(e => e.value))
        }
        this.$forceUpdate()
      },
      doSelectAll(val) {
        this.channelList.forEach(e => {
          this.$set(e, 'checked', val)
        })
        if (val) {
          this.selectedChannelList = ['-1']
        } else {
          this.selectedChannelList = []
        }
      },
      async fetchData() {
        this.query.channelId = this.query.channelName
        this.channelList = await getChannelList(this.query)

        this.channelList.forEach(e => {
          const temp = this.selectedChannelList.find((value, index, arr) => {
            return value === e.value
          })
          if (temp) {
            e.checked = true
          }
        })
      }
    },
    created() {
      if (this.value.indexOf('-1') === -1) {
        this.$set(this, 'selectType', '2')
        if (this.value.indexOf(',') === -1) {
          this.selectedChannelList.push(this.value)
        } else {
          this.selectedChannelList = this.value.split(',')
        }
      } else {
        this.$set(this, 'selectType', '1')
        this.selectedChannelList = ['-1']
      }
      this.fetchData()
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
