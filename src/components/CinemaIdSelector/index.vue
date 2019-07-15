<template>
<el-select v-model="cinemaId" filterable @scroll="onScroll" @focus="querySearchAsync('')" clearable placeholder="请输入影院名称或编码" :remote-method="querySearchAsync" remote style="width:220px;">
    <el-option
      v-for="item in showOptions"
      :key="item.value"
      :label="item.name"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import { getCinemaList } from '@/api/mallCenter'
  export default {
    props: {
      value: [Number, String],
      isAll: {
        type: String, // 是否返回全部影院  1 是  0 否
        default: '0'
      }
    },
    data() {
      return {
        cinemaList: [],
        options: [],
        cinemaId: ''
      }
    },
    computed: {
      showOptions() { // 用于显示的options  只取options中的400条
        let result
        if (this.options.length <= 400) {
          result = this.options
        } else {
          result = this.options.slice(0, 400)
        }
        return result
      }
    },
    watch: {
      cinemaId(val) {
        this.$emit('input', val)
      }
    },
    methods: {
      onScroll(event) {
        console.log('ffffffffffffffffffffffffffffffffff')
      },
      async querySearchAsync(queryString) {
        // if (queryString) {
        this.options = await getCinemaList({ isAll: this.isAll, cinemaName: queryString })
        // } else {
        // this.options = this.cinemaList
        // }
      }
    },
    async created() {
      // this.querySearchAsync('')
    }
  }
</script>
