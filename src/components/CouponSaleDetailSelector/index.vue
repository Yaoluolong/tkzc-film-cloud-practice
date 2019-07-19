<template>
  <div class="cinemaContent">
    <div class="cinemaTitle">选择电影券销售订单</div>
    <div class="cinemaContentainer">      
      <el-form inline :model="query"  ref="form" class="cinemaCont">     
        <el-form-item label="销售订单号" >
            <el-input style="width:300px" v-model.trim="query.orderNo" placeholder="输入电影券销售订单号"></el-input>
        </el-form-item>
        <el-form-item label="客户">
          <!-- <el-input style="width:300px" v-model.trim="query.customerName" placeholder="输入客户名称"></el-input> -->
          <remote-select-multiple  v-model="query.customerName" showAllOption placeholder="选择客户名称" action="/systemApi/customer/getList"></remote-select-multiple>
        </el-form-item>  
        
        <el-form-item style="margin-left:60px">
          <el-button type="primary" @click="fetchData">搜索</el-button>
        </el-form-item>           
      </el-form>
      
      <el-radio-group v-model="selectType"  style="margin-top:20px" @change="selectTypeChange">
        <el-radio :label="'1'">
          所有订单
        </el-radio>  
        <el-radio :label="'2'">
          指定订单
        </el-radio>
      </el-radio-group>
      <div class="checkbox-plane" v-show="selectType==='2'">
        <page-table ref="table" index :query="query" :fetch="queryTable">
          <el-table-column min-width="180"  label="销售订单号" align="center" prop="orderNo" show-overflow-tooltip></el-table-column>
          <el-table-column width="100"  label="业务员" align="center" prop="operator" show-overflow-tooltip></el-table-column>
          <el-table-column width="180"  label="客户" align="center" prop="customerName" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="180"  label="激活状态" align="center" prop="ActiveName" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="180"  label="" align="center" prop="isCheck">
            <template slot-scope="{row}">
              <el-checkbox v-model="row.isCheck" @change="rowIsCheckChange(row)"></el-checkbox>
            </template>
          </el-table-column>                                
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { getCouponOrderListForPage } from '@/api/systemSetting'
  export default {
    props: {
      value: String,
      dataList: Array,
      outSearchData: Object
    },
    data() {
      return {
        query: {
          orderNo: '',
          customerName: ''
        },
        selectType: '1',
        params: {

        },
        multipleSelection: [],
        multipleSelectionIds: ''
      }
    },
    watch: {
      multipleSelection(val) {
        val.indexOf('-1') > -1 ? this.$emit('input', '-1') : this.$emit('input', val.map(e => e.orderNo).join(','))
      }
    },
    methods: {
      selectTypeChange(val) {
        if (val === '1') {
          this.multipleSelection = ['-1']
        } else {
          this.$emit('input', this.multipleSelectionIds)
          this.queryTable(this.query)
        }
      },
      rowIsCheckChange(val) {
        if (val.isCheck) {
          this.multipleSelection = [...this.multipleSelection, ...[val]]
        } else {
          this.multipleSelection.forEach((e, k) => {
            if (e.id === val.id) {
              this.multipleSelection.splice(k, 1)
            }
          })
        }
      },
      fetchData() {
        if (this.query.customerName.indexOf('-1') > -1) {
          this.$set(this.query, 'customerName', ['-1'])
        }
        this.$emit('couponOrderConditionsFunc', this.query)
        this.$refs.table.refresh()
      },
      queryTable(query) {
        if (this.$route.query.id) {
          Object.assign(query, { id: this.$route.query.id })
        }
        return getCouponOrderListForPage(query)
      }
    },
    created() {
      this.query.orderNo = this.outSearchData.orderNo ? this.outSearchData.orderNo : ''
      this.query.customerName = this.outSearchData.customerName ? this.outSearchData.customerName : ''

      if (this.value) {
        this.multipleSelectionIds = this.value
        getCouponOrderListForPage().then(res => {
          res.data.map(el => {
            this.value.split(',').map(e => {
              if (el.orderNo === e) {
                this.multipleSelection.push(el)
              }
            })
          })
        })
        console.log(this.multipleSelection.indexOf('-1'))
        if (this.multipleSelection.indexOf('-1') > -1) {
          this.$set(this, 'selectType', '2')
        } else {
          this.$set(this, 'selectType', '1')
        }
      } else {
        this.$emit('input', '-1')
      }
    }
  }
</script>

<style scoped lang="scss">
.cinemaContent {
  border: 1px solid #DCDFE6;
  width:1000px;
  .cinemaTitle{
    padding-left:20px;
    border-bottom: 1px solid #DCDFE6;
    background-color: #F2F6FC;
  }
  .cinemaContentainer{
    padding:0px 20px 20px 20px;
    .cinemaCont{
      padding-top:20px;
    }
  } 

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
  padding: 0 20px;
  max-height: 300px;
  overflow-y: auto;
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
.cinema-name{
  display: inline-block;
  width: 250px;
}
.cinema-rule {
  display: inline-block;
  width: 250px;
  overflow:hidden; 
  text-overflow:ellipsis; 
  white-space:nowrap;
}
}
</style>
