export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    detailParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      info: {}
    }
  },
  mounted() {
    if (this.id) this.getInfo()
  }
}

