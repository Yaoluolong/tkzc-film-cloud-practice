<template>
  <div
    class="el-step"
    :style="[style,  isLast ? '' : { marginRight: - $parent.stepOffset + 'px' }]"
    :class="['is-' + $parent.direction]">
    <div
      class="el-step__head"
      :class="['is-' + currentStatus, { 'is-text': !icon }]">
      <div
        class="el-step__line"
        :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
        :class="['is-' + $parent.direction, { 'is-icon': icon }]">
        <i class="el-step__line-inner" :style="lineStyle"></i>
      </div>
 
      <span class="el-step__icon">
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon">
          <i v-if="icon" :class="['el-icon-' + icon]"></i>
          <div v-else>{{ index + 1 }}</div>
        </slot>
        <i
          v-else
          :class="['el-icon-' + (currentStatus === 'success' ? 'check' : 'close')]">
        </i>
      </span>
    </div>
    <div
      class="el-step__main"
      :style="{ marginLeft: mainOffset }">
      <div
        class="el-step__title"
        ref="title"
        :class="['is-' + currentStatus]"
        style="display:inline-block;">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        class="el-step__more"
        ref="more"
        :class="['is-' + currentStatus]" 
        style="display:inline-block;font-size: 12px;margin-left: 20px;cursor: pointer;color: rgb(152, 166, 190);"
        @click="buttonEnter">
        <slot name="more" v-if="isShowMore">{{ more }}</slot>
      </div>
      <div
        class="el-step__approvalStatus"
        ref="approvalStatus"
        :class="['is-' + currentStatus]" 
        style="display:inline-block;font-size: 12px;color: rgb(152, 166, 190);">
        <slot name="approvalStatus">{{ approvalStatus }}</slot>
      </div>
      <div
        class="el-step__description"
        ref="description"
        :class="['is-' + currentStatus]">
        <slot name="description">{{description}}</slot>&nbsp;&nbsp;
        <slot name="approvalRes" style="color: rgb(152, 166, 190);">{{approvalRes}}</slot>
        <br>
        <slot name="dates" v-if="dates"><i class="el-icon-time"></i>&nbsp;&nbsp;{{dates}}</slot>
        <br>
        <slot name="suggestion"><div>{{suggestion?'审核意见：':''}}</div><div>{{suggestion}}</div></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ElStep',
  props: {
    title: String,
    more: String,
    approvalStatus: String,
    icon: String,
    description: String,
    dates: String,
    suggestion: String,
    approvalRes: String,
    status: String,
    isShowMore: Boolean
  },

  data() {
    return {
      index: -1,
      lineStyle: {},
      mainOffset: 0,
      internalStatus: ''
    }
  },

  beforeCreate() {
    this.$parent.steps.push(this)
  },

  beforeDestroy() {
    const steps = this.$parent.steps
    const index = steps.indexOf(this)
    if (index >= 0) {
      steps.splice(index, 1)
    }
  },

  computed: {
    currentStatus() {
      return this.status || this.internalStatus
    },
    prevStatus() {
      const prevStep = this.$parent.steps[this.index - 1]
      return prevStep ? prevStep.currentStatus : 'wait'
    },
    isLast: function() {
      const parent = this.$parent
      return parent.steps[parent.steps.length - 1] === this
    },
    style: function() {
      const parent = this.$parent
      const isCenter = parent.center
      const len = parent.steps.length

      if (isCenter && this.isLast) {
        return {}
      }

      const space = (typeof parent.space === 'number'
        ? parent.space + 'px'
        : parent.space
          ? parent.space
          : 100 / (isCenter ? len - 1 : len) + '%')
      if (parent.direction === 'horizontal') {
        return { width: space }
      } else {
        if (!this.isLast) {
          return { height: space }
        }
      }
    }
  },

  methods: {
    updateStatus(val) {
      const prevChild = this.$parent.$children[this.index - 1]

      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus
      } else if (val === this.index && this.prevStatus !== 'error') {
        this.internalStatus = this.$parent.processStatus
      } else {
        this.internalStatus = 'wait'
      }

      if (prevChild) prevChild.calcProgress(this.internalStatus)
    },

    calcProgress(status) {
      let step = 100
      const style = {}

      style.transitionDelay = 150 * this.index + 'ms'
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== 'error' ? 50 : 0
      } else if (status === 'wait') {
        step = 0
        style.transitionDelay = (-150 * this.index) + 'ms'
      }

      style.borderWidth = step ? '1px' : 0
      this.$parent.direction === 'vertical'
        ? style.height = step + '%'
        : style.width = step + '%'

      this.lineStyle = style
    },
    buttonEnter(event) {
      this.$emit('button-enter', this, event)
    }
  },

  mounted() {
    const parent = this.$parent

    if (parent.direction === 'horizontal') {
      if (parent.alignCenter) {
        this.mainOffset = -this.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px'
      }
    }

    const unwatch = this.$watch('index', val => {
      this.$watch('$parent.active', this.updateStatus, { immediate: true })
      unwatch()
    })
  }
}
</script>

