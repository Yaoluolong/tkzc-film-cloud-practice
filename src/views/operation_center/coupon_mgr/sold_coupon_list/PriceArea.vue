<template>
  <div class="price-Area">
    <!-- <el-select v-model="params.mark1" placeholder="请选择" style="width:120px;">
        <el-option label="大于" value="gt"></el-option>
        <el-option label="大于等于" value="egt"></el-option>
    </el-select>&nbsp;
    <el-input v-model.trim="params.price1" :precision="2" style="width:160px;"></el-input>&nbsp;元,&nbsp;&nbsp; -->
    <el-select v-model.trim="params.mark2" placeholder="请选择" style="width:120px;">
        <el-option label="小于" value="lt"></el-option>
        <el-option label="小于等于" value="elt"></el-option>
    </el-select>&nbsp;
    <el-input v-model.trim="params.price2" :precision="2" style="width:160px;"></el-input>&nbsp;元影片。
  </div>
</template>

<script>
  export default {
    props: {
      value: Object
    },
    data() {
      return {
        params: {
          /* mark1: '',
          price1: '',*/
          mark2: '',
          price2: ''
        }
      }
    },
    watch: {
      value() {
        this.valueToParams()
      },
      params: {
        handler() {
          this.paramsToValue()
        },
        deep: true
      }
    },
    methods: {
      valueToParams() {
        if (this.value) {
          const marks = Object.keys(this.value)
          if (marks.length > 0) {
            /* this.params.mark1 = marks[0]
            this.params.price1 = this.value[marks[0]]*/
            this.params.mark2 = marks[0]
            this.params.price2 = this.value[marks[0]]
          }
        }
      },
      paramsToValue() {
        const value = {}
        // if (!this.params.mark1 || !this.params.mark2 || !this.params.price1 || !this.params.price2) {
        //   this.$emit('input', null)
        // } else {
        // value[this.params.mark1] = this.params.price1
        value[this.params.mark2] = this.params.price2
        if (JSON.stringify(value) !== JSON.stringify(this.value)) { this.$emit('input', value) }
        // }
      }
    },
    created() {
      this.valueToParams()
    }
  }
</script>

<style scoped>
.price-rule{
    /*padding: 20px;*/
}
</style>
