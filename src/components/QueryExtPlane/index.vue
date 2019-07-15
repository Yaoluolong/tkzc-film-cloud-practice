<template>
  <el-collapse-transition  >
    <div v-show="opened" class="query-ext-plane">
      <slot></slot>
    </div>
  </el-collapse-transition>
</template>

<script>
export default {
  props: {
    opened: Boolean
  }
}
</script>

<style scoped lang="scss">
.query-ext-plane{
  background-color: #f3f4f5;
  border-top: 1px solid #E4E7ED;
  border-bottom: 1px solid #E4E7ED;
  padding-top: 20px;
  margin-bottom: 20px;
}
</style>
