<template>
  <div>
    <el-button type="primary" @click="show">选择电影券</el-button>
    <div class="tag-plane" v-if="selectedCouponList.length>0">
      <div class="tag-title">
        电影券类型：{{couponTypeName}}
      </div>
      <el-tag type="danger" @close="handleClose(index,coupon)" class="selected-item" v-for="(coupon,index) in selectedCouponList" closable :key="coupon.id+new Date().getTime()">{{coupon.name}}</el-tag>
    </div>
    <el-dialog title="选择电影券" :visible.sync="dialogVisible" width="600px" @close="resetFields('form')">
        <el-form  :model="query"  ref="form">
          <slot></slot>
          <el-form-item style="margin-top:20px">
              <el-radio v-model="isAll" :label="true">所有电影券</el-radio>
              <el-radio v-model="isAll" :label="false" @change="fetchData">指定电影券</el-radio>
          </el-form-item>
        </el-form>
        <div class="checkbox-plane" v-if="!isAll">
          <!-- <div class="header">
            <el-checkbox @change="doSelectAll">全选</el-checkbox>
          </div> -->
          <div class="content">
            <div class="check-item" v-for="coupon in couponList" :key="coupon.id+new Date().getTime()">
              <el-checkbox v-model="coupon.checked" >{{coupon.name}}</el-checkbox>
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
  import { getCouponTypeList } from '@/api/operationCenter'
  // import { mergeArray, split } from '@/utils'
  export default {
    props: {
      couponType: String,
      couponTypeName: String,
      value: String
    },
    data() {
      return {
        query: {
          pageSize: 500,
          type: this.couponType
        },
        couponList: [],
        dialogVisible: false,
        selectedCouponList: [],
        isAll: false,
        selectCouponType: {}
      }
    },
    watch: {
      selectedCouponList(val) {
        this.selectedCouponListToValue()
      },
      value(val) {
        this.valueToSelectedCouponList()
      },
      couponType(val) {
        this.query.type = val
        this.fetchData()
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
        // this.isAll = true
        this.couponList = []
        this.fetchData()
      },
      hide() {
        this.dialogVisible = false
      },
      save() {
        if (!this.query.type) {
          this.$message.error('请选择电影券类型')
          return
        }
        if (this.isAll) {
          this.selectedCouponList = this.couponList
        } else {
          this.selectedCouponList = this.couponList.filter(e => e.checked)
        }
        this.dialogVisible = false
      },
      handleClose(index) {
        this.selectedCouponList.splice(index, 1)
      },
      selectedCouponListToValue() {
        const value = this.selectedCouponList.map(e => e.id).join(',')
        if (value !== this.value) { this.$emit('input', value) }
      },
      async valueToSelectedCouponList() {
        if (this.value && this.selectedCouponList.length === 0) {
          await this.fetchData(this.value)
        }
      },
      async fetchData(value) {
        // if (!this.isAll && !value) {
        //   return
        // }
        this.couponList = (await getCouponTypeList(this.query))
        this.couponList.forEach(e => {
          if (this.selectedCouponList.find(k => k.id === e.id)) {
            this.$set(e, 'checked', true)
          }
        })
        if (value) {
          this.selectedCouponList = this.couponList.filter(e => value.indexOf(e.id) > -1)
        }
      }
      // typeChage(val, option) {
      //   if (option) {
      //     this.selectCouponType = option
      //     this.fetchData()
      //   }
      // }
    },
    created() {
      this.valueToSelectedCouponList()
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
   position: relative;
   padding-top: 50px;
   .tag-title{
     padding: 5px 20px;
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     border-bottom: 1px solid #DCDFE6;
   }
   .selected-item{
     margin: 10px;
   }
}
</style>
