<template>
  <div class="switch-confirm">
    <el-switch v-model="switchValue" v-bind="$attrs" v-on="$listeners" :active-value="activeValue" :inactive-value="inactiveValue"></el-switch>
    <div class="switch-mask"  @click.stop="clickSwitch"></div>
  </div>
</template>

<script>
  export default {
    props: {
      activeValue: {
        type: String,
        default: '1'
      },
      inactiveValue: {
        type: String,
        default: '2'
      },
      valueName: {
        type: String,
        default: 'status'
      },
      value: String,
      confirmText: {
        type: String,
        default: '确定进行该操作？'
      },
      id: [String, Number],
      idKey: {
        type: String,
        default: 'id'
      },
      isRefreshTable: Boolean,
      action: String
    },
    data() {
      return {
        switchValue: ''
      }
    },
    watch: {
      value(val) {
        if (val !== this.switchValue) {
          this.switchValue = val
        }
      }
    },
    methods: {
      clickSwitch() {
        this.$confirm(this.switchValue === this.activeValue ? this.confirmText : '确定进行该操作？', '提示', { type: 'warning' }).then(async() => {
          const loading = this.$loading({
            lock: true,
            text: '操作中...',
            spinner: 'el-icon-loading'
          })
          try {
            const params = {}
            params[this.idKey] = this.id
            params[this.valueName] = this.otherActive()
            await this.$request.post(this.action, params)
            this.switchValue = this.otherActive()
            if (this.isRefreshTable) {
              this.$emit('submitChange', '')
            }
            loading.close()
          } catch (error) {
            loading.close()
          }
        })
      },
      otherActive() {
        if (this.switchValue === this.activeValue) {
          return this.inactiveValue
        } else {
          return this.activeValue
        }
      }
    },
    created() {
      this.switchValue = this.value
    }
  }
</script>

<style scoped lang="scss">
.switch-confirm{
  display: inline-block;
  position: relative;
  .switch-mask{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
  }
}
</style>
