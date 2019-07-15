<template>
  <div>
    <el-form ref="numberValidateForm" label-width="600px" class="ruleForm">
      <div class="tag-head">{{allText}}</div>
      <el-radio-group v-model="selectType" style="padding:20px;">
        <el-radio :label="'1'">
          所有电影券
        </el-radio>  
        <el-radio :label="'2'">
          指定电影券
        </el-radio>
      </el-radio-group> 
      <div class="checkbox-plane" v-show="selectType === '2'">
        <div class="header">
          <el-checkbox @change="doSelectAll" v-model="selectAll">全选</el-checkbox>
        </div>
        <div class="content">
          <div class="check-item" v-for="(couponType,index) in couponTypeList" :key="index">
            <el-checkbox @change="doChangeFun(couponType)" v-model="couponType.checked" >{{couponType.name}}</el-checkbox>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { getCouponNameList } from '@/api/operationCenter'
  import { mergeArray } from '@/utils'
  export default {
    props: {
      value: [String, Array],
      allText: {
        type: String,
        default: '选择适用电影券'
      },
      changeFun: { // 点标签上的删除按钮时进行的操作
        type: Function
      },
      couponType: {
        type: String,
        default: ''
      },
      couponStyle: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        selectTypebak: '2',
        selectType: '2', // 1 选择全部电影券  2 指定电影券
        query: {},
        couponTypeList: [],
        selectedCouponTypeList: [],
        selectAll: false,
        delSelect: {},
        changeCouponTypeList: []
      }
    },
    watch: {
      selectedCouponTypeList(val) {
        this.$emit('input', val)
      },
      selectType(val) {
        if (val === '1') {
          this.fetchData(this.couponType, this.couponStyle)
          this.couponTypeList.forEach(e => {
            this.$set(e, 'checked', true)
          })
          this.selectedCouponTypeList = this.couponTypeList
        }
      },
      value(val) {
        // if (this.selectedCouponTypeList !== val) {
        this.selectedCouponTypeList = val
        console.log(val, 876543)
        // }
      },
      delSelect(val) {
        this.changeCouponTypeList.forEach(e => {
          if (e.value === val.value) {
            e.checked = false
          }
        })
      }
    },
    methods: {
      doChangeFun(couponType) {
        this.selectTypebak = this.selectType
        if (this.selectTypebak === '1') {
          this.selectedCouponTypeList = mergeArray(this.selectedCouponTypeList, this.couponTypeList)
        } else {
          this.selectedCouponTypeList = this.couponTypeList.filter(e => {
            return e.checked
          })
          this.fetchData(this.couponType, this.couponStyle)
        }
      },
      handleClose(index) {
        this.delSelect = this.selectedCouponTypeList[index]
        this.selectedCouponTypeList.splice(index, 1)
      },
      doSelectAll(val) {
        this.couponTypeList.forEach(e => {
          this.$set(e, 'checked', val)
        })
      },
      async fetchData(couponType, couponStyle) {
        // this.$set(this, 'couponTypeList', [])
        this.couponTypeList = await getCouponNameList({ type: couponType, style: couponStyle })
        if (this.selectedCouponTypeList && this.selectedCouponTypeList.length > 0) {
          this.couponTypeList.forEach(e => {
            const temp = this.selectedCouponTypeList.find((value, index, arr) => {
              return value.value === e.value
            })
            if (temp) {
              e.checked = true
            }
          })
        }
      }
    },
    async created() {
      this.selectedCouponTypeList = this.value
      if (this.$route.query.id) {
        this.fetchData(this.couponType, this.couponStyle)
      }
      console.log(this.value, 23)
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
