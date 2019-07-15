<template>
    <div class="salemanContent">
      <div class="salemanTitle">选择客户</div>
      <div class="salemanContentainer">
        <el-radio-group v-model="selectType" style="margin-top:-5%" @change="selectTypeChange">
          <el-radio :label="'1'">
            所有客户
          </el-radio>  
          <el-radio :label="'2'">
            指定客户
          </el-radio>
        </el-radio-group>
        <div class="checkbox-plane" v-show="selectType === '2'">
          <div class="header">
            <el-checkbox @change="doSelectAll" v-model="selectAll">全选</el-checkbox>
          </div>          
          <div class="content">
            <div class="check-item" v-for="(user,index) in UserList" :key="index" v-if="UserList">
              <el-checkbox @change="doChangeFun" v-model="user.checked" >{{user.name}}</el-checkbox>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import { getCustomerList } from '@/api/operationCenter'
  import { mergeArray } from '@/utils'
  export default {
    props: {
      value: [String, Array],
      showAllChoice: Boolean
    },
    data() {
      return {
        selectTypebak: '2',
        selectType: '1', // 1 选择全部客户  2 指定客户
        query: {},
        UserList: [],
        selectedUserList: [],
        selectAll: false,
        delSelect: {},
        changeUserList: []
      }
    },
    watch: {
      selectedUserList(val) {
        this.$emit('input', val)
      },
      value(val) {
        if (this.selectedUserList !== val) {
          this.selectedUserList = val
        }
      },
      delSelect(val) {
        this.changeUserList.forEach(e => {
          if (e.value === val.value) {
            e.checked = false
          }
        })
      }
    },
    methods: {
      selectTypeChange(val) {
        if (val === '1') {
          this.selectedUserList = ['-1']
        } else {
          this.fetchData()
        }
      },
      doChangeFun(val) {
        if (this.selectType === '1') {
          this.selectedUserList = ['-1']
          // this.selectedUserList = mergeArray(this.selectedUserList, this.UserList)
        } else {
          const arr = this.UserList.filter(e => { return e.checked })
  
          this.selectedUserList = mergeArray(this.selectedUserList.filter(e => e !== '-1'), arr.map(e => e.value))
          // this.$forceUpdate()
        }
      },
      doSelectAll(val) {
        this.UserList.forEach(e => {
          this.$set(e, 'checked', val)
        })
        if (val) {
          this.selectedUserList = ['-1']
        } else {
          this.selectedUserList = []
        }
      },
      async fetchData() {
        const _this = this
        await getCustomerList({}).then(el => {
          if (_this.value && _this.value.indexOf('-1') === -1) {
            this.selectedUserList = typeof (_this.value) === Array ? _this.value : _this.value.split(',')
            if (el) {
              this.$set(this, 'UserList', el)
              if (_this.selectedUserList && _this.selectedUserList.indexOf('-1') === -1) {
                _this.UserList.forEach(e => {
                  const temp = _this.selectedUserList.find((value, index, arr) => {
                    return value === e.value
                  })
                  if (temp) {
                    e.checked = true
                  }
                })
                _this.$set(_this, 'selectType', '2')
              } else {
                _this.$set(_this, 'selectType', '1')
                _this.selectedUserList = ['-1']
              }
            }
          } else {
            this.$set(this, 'UserList', el)
            this.UserList.forEach(e => {
              this.$set(e, 'checked', false)
            })
          }
        })
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>

<style scoped lang="scss">
.salemanContent {
  border: 1px solid #DCDFE6;
  .salemanTitle{
    padding-left:20px;
    border-bottom: 1px solid #DCDFE6;
    background-color: #F2F6FC;
  }
  .salemanContentainer{
    padding:20px;
    .salemanCont{
      padding-top:20px;
    }
  }
  .checkbox-plane{
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    overflow: hidden;
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
    padding: 0px 20px 20px 20px;
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
}
</style>
