<template>
  <div class="price-Area" style="width:500px;">
    <el-table :data="params" size="mini" :show-header="false" >
        <el-table-column width="200" align="center" prop="left">
            <template slot-scope="{row}">
              <el-input v-model="row.left" placeholder="请输入票券号区间" style="width:180px"  @blur="checkCodeId"></el-input>
            </template>
        </el-table-column>
        <span>至</span>
        <el-table-column width="200" align="center" prop="right">
            <template slot-scope="{row}">
                <el-input v-model="row.right" placeholder="请输入票券号区间" style="width:180px" @blur="checkCodeId"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="100" align="center" label="" prop="oper">
            <template slot-scope="{$index}">
                <i class="el-icon-remove-outline oper" v-if="params.length!=1" @click="removeRule($index)"></i>&nbsp;&nbsp;
                <i class="el-icon-circle-plus-outline oper" @click="addArea" v-if="$index==params.length-1"></i>
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { checkCouponCodeId } from '@/api/operationCenter'
  export default {
    props: {
      value: Array,
      couponType: String,
      couponStyle: String,
      orderNo: String,
      outCheckId: Function
    },
    data() {
      return {
        params: [],
        paramsStatus: false
      }
    },
    watch: {
      value(val) {
        // this.valueToParams(val)
      },
      params: {
        handler() {
          this.paramsToValue()
        },
        deep: true
      }
    },
    methods: {
      addArea() {
        if (this.params.length < 5) {
          this.params.push({ left: '', right: '' })
        } else {
          this.$message.warning('不能超过5条')
          return false
        }
      },
      removeRule(index) {
        this.params.splice(index, 1)
        this.checkCodeId()
      },
      paramsToValue() {
        const value = JSON.parse(JSON.stringify(this.params))
        /* value.forEach(e => {
            e.week = e.week.join(',')
          })*/
        if (JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('input', value)
        }
      },
      valueToParams(val) {
        if (val) {
          const params = JSON.parse(JSON.stringify(val))
          /* params.forEach(e => {
              e.week = e.week ? e.week.split(',') : []
            })*/
          this.params = params
        }
      },
      checkCodeId() {
        const _this = this
        this.paramsStatus = false
        this.params.find(e => {
          if (!e.left || !e.right || !e) {
            _this.$message.warning('请填写完整电影券号区间!')
            _this.outCheckId('')
            this.paramsStatus = true
            return false
          }
        })
        if (!this.paramsStatus) {
          checkCouponCodeId({
            type: this.couponType,
            style: this.couponStyle,
            codeIdDetail: this.params,
            orderNo: _this.orderNo
          }).then((res) => {
            _this.outCheckId(res)
          }).catch(e => {
            _this.outCheckId('')
          })
        }
      }
    },
    created() {
      if (!this.params || this.params.length === 0) {
        this.params = [{ left: '', right: '' }]
      }
      this.valueToParams(this.value)
    }
  }
</script>

<style scoped>
.checkbox-plane{
  display: flex;
}
.oper{
  font-size: 26px;
  color:#F56C6C;
  cursor: pointer;
}
</style>
