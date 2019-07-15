<template>
  <title-plane checkbox title="全选" @select-all="selectAll">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item :title="cinema.name" :name="cinema.value" v-for="(cinema,index) in cinemaList" :key="index">
        <el-checkbox @change="selectCinemaAll(HallData[cinema.value],$event)">全选</el-checkbox>
        <div class="checkbox-plane">
          <el-checkbox class="check-box" v-model="hall.checked" v-for="(hall,index) in HallData[cinema.value]" :key="index" @change="checkboxChange" :title="hall.name">{{hall.name}}</el-checkbox>
        </div>
      </el-collapse-item>
    </el-collapse>
  </title-plane>
</template>

<script>
import { getCinemaHallList } from '@/api/mallCenter'
export default {
  props: {
    value: String,
    cinemaList: Array
  },
  data() {
    return {
      activeNames: [],
      HallData: {},
      initCheckedIds: []
    }
  },
  methods: {
    async fetchHall() {
      const result = await getCinemaHallList({ cinemaId: this.cinemaList.map(e => e.value).join(',') })
      this.cinemaList.forEach(e => {
        this.$set(this.HallData, e.value, result.filter(k => k.cinemaId === e.value))
        this.HallData[e.value].forEach(k => {
          if (this.initCheckedIds.indexOf(k.value) > -1) {
            this.$set(k, 'checked', true)
          }
        })
      })
    },
    checkboxChange() {
      let checked = []
      Object.keys(this.HallData).forEach(key => {
        const halls = this.HallData[key]
        checked = checked.concat(halls.filter(k => k.checked).map(a => a.value))
      })
      this.$emit('input', checked.join(','))
    },
    selectAll(val) {
      Object.keys(this.HallData).forEach(key => {
        this.HallData[key].forEach(k => {
          this.$set(k, 'checked', val)
        })
      })
      this.checkboxChange()
    },
    selectCinemaAll(halls, val) {
      halls.forEach(e => this.$set(e, 'checked', val))
      this.checkboxChange()
    }
  },
  async created() {
    if (this.value) {
      this.initCheckedIds = this.value.split(',')
    }
    this.fetchHall()
  }
}
</script>

<style scoped lang="scss">
.checkbox-plane{
  padding: 10px 10px 5px 10px;
  display: flex;
  flex-wrap: wrap;
  .check-box{
    //background-color: red;
    width: 170px;
    overflow: hidden;
    margin: 5px 10px;
  }
}
</style>
