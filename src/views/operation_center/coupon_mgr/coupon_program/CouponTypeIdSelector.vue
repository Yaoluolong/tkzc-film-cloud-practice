<template>
<el-select v-model="cinemaId" filterable @clear="querySearchAsync('')" clearable placeholder="请输入影院名称或编码" :remote-method="querySearchAsync" remote style="width:220px;">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
  import { getCouponTypeList } from '@/api/operationCenter'
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
    watch: {
      cinemaId(val) {
        this.$emit('input', val)
      }
    },
    methods: {
      querySearchAsync(queryString) {
        if (queryString) {
          this.options = this.cinemaList.filter(e => e.name.indexOf(queryString) > -1)
        } else {
          this.options = this.cinemaList
        }
      }
    },
    async created() {
      this.options = this.cinemaList = await getCouponTypeList()
    }
  }
</script>
