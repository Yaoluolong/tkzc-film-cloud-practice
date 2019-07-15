<template>
<!-- <keep-alive> -->
  <el-autocomplete
  v-model="state4"
  :fetch-suggestions="querySearchAsync"
   placeholder="请输入影院名称或影院编码"
  style="width:200px;"
  clearable
  v-on="$listeners"
></el-autocomplete>
<!-- </keep-alive> -->
</template>

<script>
  import { getCinemaList } from '@/api/mallCenter'
  export default {
    data() {
      return {
        cinemaList: [],
        state4: '',
        timeout: null
      }
    },
    methods: {
      querySearchAsync(queryString, cb) {
        let result = []
        if (queryString) {
          result = this.cinemaList.filter(e => e.name.indexOf(queryString) > -1 || e.value.indexOf(queryString) > -1).map(e => {
            return { value: e.name, id: e.value }
          })
        } else {
          result = this.cinemaList.map(e => {
            return { value: e.name, id: e.value }
          })
        }
        cb(result)
      },
      handleSelect(item) {
        console.log(item)
      }
    },
    async created() {
      this.cinemaList = await getCinemaList()
    }
  }
</script>
