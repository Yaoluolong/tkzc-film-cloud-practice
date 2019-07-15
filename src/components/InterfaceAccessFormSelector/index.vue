<template>
  <div>
    <el-form ref="numberValidateForm" label-width="600px" class="ruleForm">
      <div class="tag-head">{{allText}}</div>
      <el-radio-group v-model="selectType" :disabled="inDisabled" style="padding:20px;">
        <el-radio :label="'1'">
          所有系统商
        </el-radio>  
        <el-radio :label="'2'">
          指定系统商
        </el-radio>
      </el-radio-group>
      <div class="checkbox-plane" v-show="selectType === '2'">
        <div class="header">
          <el-checkbox @change="doSelectAll" v-model="selectAll" :disabled="inDisabled">全选</el-checkbox>
        </div>
        <div class="content">
          <div class="check-item" v-for="(item,index) in interfaceList" :key="index">
            <el-checkbox @change="doChangeFun(item)" v-model="item.checked" :disabled="inDisabled">{{item.name}}</el-checkbox>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { getInterfaceTypeList } from '@/api/mallCenter'
  import { mergeArray } from '@/utils'
  export default {
    props: {
      value: [String, Array],
      allText: {
        type: String,
        default: '选择平台系统商'
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
        interfaceList: [],
        selectedInterfaceList: [],
        isInit: false,
        selectAll: false,
        inDisabled: this.outDisabled,
        delSelect: {},
        changeinterfaceList: []
      }
    },
    watch: {
      selectedInterfaceList(val) {
        this.$emit('input', val)
      },
      selectType(val) {
        if (val === '1') {
          /* this.interfaceList.forEach(e => {
            this.$set(e, 'checked', true)
          })
          this.selectedInterfaceList = this.interfaceList*/
          this.selectedInterfaceList = ['-1']
        }
        this.selectAll = this.selectedInterfaceList.length === this.interfaceList.length
      }
    },
    methods: {
      doChangeFun() {
        const arr = this.interfaceList.filter(e => { return e.checked })
        this.selectedInterfaceList = arr.map(e => e.value)
        this.selectAll = this.selectedInterfaceList.length === this.interfaceList.length
        this.save()
      },
      save() {
        this.selectTypebak = this.selectType
        if (this.selectTypebak === '1') {
          this.selectedInterfaceList = ['-1']
          // this.selectedInterfaceList = mergeArray(this.selectedInterfaceList, this.interfaceList)
        } else {
          const arr = this.interfaceList.filter(e => e.checked)
          this.selectedInterfaceList = mergeArray(this.selectedInterfaceList, arr.map(e => e.value))
        }
        this.$forceUpdate()
      },
      doSelectAll(val) {
        this.interfaceList.forEach(e => {
          this.$set(e, 'checked', val)
        })
        if (val) {
          this.selectedInterfaceList = this.interfaceList.map(e => e.value)
        } else {
          this.selectedInterfaceList = []
        }
      },
      async fetchData() {
        this.query.interfaceId = this.query.interfaceName
        const temp = await getInterfaceTypeList(this.query)
        temp.forEach(el => {
          this.interfaceList.push({ value: el.value, name: el.name })
        })
        this.interfaceList.forEach(e => {
          const temp = this.selectedInterfaceList.length > 0 && this.selectedInterfaceList.find((value, index, arr) => {
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
          this.selectedInterfaceList.push(this.value)
        } else {
          this.selectedInterfaceList = this.value.split(',')
        }
      } else {
        this.$set(this, 'selectType', '1')
        this.selectedInterfaceList = ['-1']
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
