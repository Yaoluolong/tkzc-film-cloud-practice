<template>
  <div class="menu-checkbox-plane">
    <div class="header" v-if="title||$slots.header">
      <el-checkbox v-if="checkbox" @change="doSelectAll" >{{title}}</el-checkbox>
      <span v-else-if="title">{{title}}</span>
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      checkbox: Boolean,
      title: String
    },
    data() {
      return {

      }
    },
    methods: {
      doSelectAll(val) {
        this.$emit('select-all', val)
      }
    },
    created() {

    }
  }
</script>

<style scoped lang="scss">
.menu-checkbox-plane{
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
  padding: 20px;
}
</style>
