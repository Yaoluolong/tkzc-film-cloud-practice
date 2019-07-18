<template>
  <transition :name="transitionName">
    <div class="zm-panel-mask" :style="{zIndex: zIndex}" v-show="visible">
      <transition name="fade-scale-in">
        <!-- sidebar.opened针对该项目的侧栏收缩做监听，改变窗口大小 -->
        <div
          class="zm-panel"
          :class="{'has-footer':$slots.footer}"
          :style="{left:sidebar.opened?'270px':'65px'}"
          v-if="renderEveryTime"
        >
          <div class="zm-panel-header" v-if="showHeader">
            {{title}}
            <i class="zm-panel-close el-icon-close" @click="closePanel"></i>
          </div>
          <div class="zm-panel-body">
            <slot />
          </div>
          <div class="zm-panel-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
// import PopupManager from 'element-ui/lib/utils/popup/popup-manager'
import { PopupManager } from 'element-ui/lib/utils/popup'
export default {
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    transitionName: {
      type: String,
      default: 'fade-scale'
    },
    title: {
      type: String,
      default: '标题'
    },
    visible: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    keepAlive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      zIndex: 1
    }
  },
  computed: {
    renderEveryTime() {
      if (this.keepAlive) {
        return true
      } else {
        return this.visible
      }
    },
    hasFooter() {
      return this.$slots.footer
    },
    ...mapGetters(['sidebar'])
  },
  watch: {
    visible(val) {
      if (val) {
        this.openPanel()
      }
    }
  },
  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
    if (this.visible === true) {
      this.openPanel()
    }
  },
  destroyed() {
    if (this.appendToBody) {
      document.body.removeChild(this.$el)
    }
  },
  methods: {
    openPanel() {
      if (this.visible === true) {
        this.zIndex = PopupManager.nextZIndex()
      }
    },
    closePanel() {
      this.$emit('change', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.zm-panel-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  // background: rgba(0,0,0,0.2);
  .zm-panel {
    display: flex;
    position: absolute;
    box-sizing: border-box;
    &.has-footer {
      padding-bottom: 70px;
    }
    top: 115px;
    right: 20px;
    left: 270px;
    bottom: 52px;
    flex-direction: column;
    background: #fff;
    border-radius: 6px;
    // box-shadow: 0 2px 8px 0 #dcdcdc;
    .zm-panel-header {
      position: relative;
      margin: 10px 15px 0;
      padding: 5px 0;
      font-size: 20px;
      line-height: 30px;
      border-bottom: 1px solid #ddd;
      .zm-panel-close {
        position: absolute;
        right: 15px;
        top: 10px;
        font-size: 20px;
        color: #ccc;
        cursor: pointer;
        transition: all 0.3s linear;
        &:hover {
          transform: rotate(180deg) scale(1.2);
          color: #999;
        }
        &:active {
          color: #f56c6c;
        }
      }
    }
    .zm-panel-body {
      flex: 1;
      overflow: auto;
      padding: 0 15px 15px;
    }
    .zm-panel-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid #ddd;
      height: 60px;
      line-height: 60px;
      // text-align: center;
      padding: 0 20px;
    }
  }
}
</style>

