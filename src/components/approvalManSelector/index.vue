<template>
    <div class="salemanContent">
      <div class="salemanTitle">选择职员</div>
      <div class="salemanContentainer">
        <el-radio-group v-model="selectType" style="margin-top:-5%">
          <el-radio :label="'1'">
            所有职员
          </el-radio>  
          <el-radio :label="'2'">
            指定职员
          </el-radio>
        </el-radio-group> 
        <el-form inline :model="query"  ref="form" v-show="selectType === '2'">
          <el-form-item prop="name">
              <el-input  v-model="query.name" placeholder="请输入职员名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="fetchData(query.name)" >查询</el-button>
          </el-form-item>
        </el-form>
        <div class="checkbox-plane" v-show="selectType === '2'">
          <div class="header">
            <el-checkbox @change="doSelectAll" v-model="selectAll">全选</el-checkbox>
          </div>          
          <div class="content">
            <div class="check-item" v-for="(user,index) in UserList.list" :key="index">
              <el-checkbox @change="doChangeFun" v-model="user.checked" >{{user.name}}</el-checkbox>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import { getUserListForPage } from '@/api/systemSetting'
  import { mergeArray } from '@/utils'
  export default {
    props: {
      value: [String, Array],
      salesman: String,
      showAllChoice: Boolean
    },
    data() {
      return {
        selectTypebak: '2',
        selectType: '2', // 1 选择全部职员  2 指定职员
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
        this.$emit('salesmanChange', val)
      },
      selectType(val) {
        if (val === '1') {
          this.selectedUserList = [{
            name: '-1',
            value: '-1'
          }]
        } else {
          this.fetchData()
        }
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
      doChangeFun() {
        this.selectTypebak = this.selectType
        if (this.selectTypebak === '1') {
          this.selectedUserList = mergeArray(this.selectedUserList, this.UserList.list)
        } else {
          console.log(this.UserList.list.filter(e => e.checked))
          // this.selectedUserList = this.UserList.list.filter(e => e.checked)
          this.$set(this, 'selectedUserList', this.UserList.list.filter(e => e.checked))
          this.$forceUpdate()
          // this.selectedUserList = mergeArray(this.selectedUserList.filter(e => e.value !== '-1'), this.UserList.list.filter(e => e.checked))
        }
      },
      doSelectAll(val) {
        this.UserList.list.forEach(e => {
          this.$set(e, 'checked', val)
        })
        if (val) {
          this.selectedUserList = this.UserList.list
        } else {
          this.selectedUserList = []
        }
      },
      async fetchData(val) {
        this.UserList = await getUserListForPage({ realName: val })
  
        this.UserList.list.forEach(e => {
          const temp = this.selectedUserList.find((value, index, arr) => {
            return value.value === e.value
          })
          if (temp) {
            e.checked = true
          }
        })
      }
    },
    created() {
      if (this.salesman === '-1') {
        this.$set(this, 'selectType', '1')
        this.selectedUserList.push({
          name: '-1',
          value: '-1'
        })
      } else {
        this.fetchData()
        this.selectedUserList = this.value.filter(e => {
          return e.value
        })
      }
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
    margin: 20px 0;
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
