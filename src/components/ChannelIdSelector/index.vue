<template>
<el-select v-model="cinemaId" value-key="label" filterable clearable placeholder="请输入商家名称" :remote-method="querySearchAsync" remote style="width:220px;">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.name"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import { getChannelList } from '@/api/mallCenter'
  export default {
    props: {
      isAll: {
        type: String,
        default: '0'
      },
      value: [Number, String],
      type: String
    },
    data() {
      return {
        channelList: [],
        options: [],
        cinemaId: ''
      }
    },
    watch: {
      cinemaId(val) {
        this.$emit('input', val)
      },
      value(val) {
        this.cinemaId = val
      }
    },
    methods: {
      querySearchAsync(queryString) {
        if (queryString) {
          this.options = this.channelList.filter(e => e.name.indexOf(queryString) > -1)
        } else {
          this.options = this.channelList
        }
      }
    },
    async created() {
      if (this.value) {
        this.cinemaId = this.value
      }
      this.options = this.channelList = await getChannelList({ isAll: this.isAll, type: this.type })
    }
  }
</script>
