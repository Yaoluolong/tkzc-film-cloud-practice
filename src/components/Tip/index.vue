<template>
<div class="tip-box">
  <slot></slot>
  <el-tooltip v-bind="$attrs" :placement="placement">
    <div slot="content" v-html="content"></div>
    <i class="el-icon-question"></i>
  </el-tooltip>
</div>

</template>

<script>
  export default {
    props: {
      content: String,
      placement: {
        type: String,
        default: 'right'
      }
    }
  }
</script>

<style scoped lang="scss">
.tip-box{
  display: inline-block;
  // padding-right: 34px;
  position: relative;
  width: 100%;
}
.el-icon-question{
  position: absolute;
  font-size: 22px;
  color:#3ca0ec;
  top:7px;
  right: -34px;
  cursor: pointer;
}
</style>
