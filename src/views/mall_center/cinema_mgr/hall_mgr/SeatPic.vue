<template>
      <!-- <div class="seat-no"></div>
      <div class="seat-content"></div> -->
    <div>
      <div class="title">
         <span class="t1">{{$route.query.cinemaName}}</span>
         <span class="t2">{{$route.query.hallName}}</span>
      </div>
      <div class="seat-tip">
        <tip content="当前系统座位图横轴座位号以及座位图纵轴座位排号均是从小到大排序，如果需要更换排序方法可将对应的排序开关开启即可！">
          <div class="text">修改座位图样式</div>        
        </tip>
      </div>
      <div class="seat-sort">
        <span>座位图横轴座位号从大到小</span>
        <el-switch v-model="rowValue" active-color="#13ce66" @change="sortRow"></el-switch>
        <span>座位图纵轴座位号从大到小</span>
        <el-switch v-model="colValue" active-color="#13ce66" @change="sortCol"></el-switch>
      </div>
      <table class="seat-table app-container" cellspacing="0" cellpadding="0" border="0">
        <tr v-for="(row, index) in maxRow" :key="index"  class="seat-row">
          <td v-for="col in maxCol[index]" :key="col.index" class="seat-col" >
            <div v-if="col.row" class="seat-row-no">{{row}}</div>
            <template v-else-if="col.seatCol">
              <div class="seat-item">
               <i class="el-icon-zuowei" ></i>
               <span class="seat-no">{{col.seatCol}}</span>
              </div>
            </template>
          </td>
        </tr>
      </table>
  </div>
</template>

<script>
  import { getCinemaHalleSeat, setSeatSort } from '@/api/mallCenter'
  export default {
    name: 'seat_pic',
    data() {
      return {
        id: '',
        seatInfo: [],
        maxRow: 0,
        maxCol: 0,
        rowValue: '',
        colValue: '',
        rowSort: '1',
        colSort: '1'
      }
    },
    methods: {
      sortRow(val) {
        val ? this.rowSort = '2' : this.rowSort = '1'
        setSeatSort({ id: this.id, rowSort: this.rowSort }).then(res => {
          this.maxCol.map(e => {
            e.splice(0, 1)
            e.reverse()
            e.unshift({ row: '0' })
          })
        })
      },
      sortCol(val) {
        val ? this.colSort = '2' : this.colSort = '1'
        setSeatSort({ id: this.id, colSort: this.colSort }).then(res => {
          if (this.colSort === '2') {
            this.maxRow.reverse()
            this.maxCol.reverse()
          } else if (this.colSort === '1') {
            this.maxRow.sort()
            this.maxCol.reverse()
          }
        })
      }
    },
    async created() {
      this.id = this.$route.query.id
      this.seatInfo = await getCinemaHalleSeat(this.$route.query)
      this.maxRow = this.seatInfo.row
      this.seatInfo.seat.map(e => {
        e.unshift({ row: '0' })
      })
      this.maxCol = this.seatInfo.seat
      if (this.seatInfo.rowSort === '2') {
        this.rowValue = true
      } else if (this.seatInfo.rowSort === '1') {
        this.rowValue = false
      }
      if (this.seatInfo.colSort === '2') {
        this.colValue = true
      } else if (this.seatInfo.colSort === '1') {
        this.colValue = false
      }
    }
  }
</script>

<style scoped lang="scss">
.title{
  padding: 20px 20px 0px 20px;
  font-size: 18px;
  .t1{
    color:#303133;
    font-weight: bold;
  }
  .t2{
    margin-left: 20px;
    color:#606266;
  }
}
// .seat-box{
//   // position: relative;
// }
// .seat-table{
//   // table-layout:fixed;
// }
.seat-tip {
  padding: 20px 0;
  padding-left: 20px;
  width: 150px;
  .text {
    line-height: 35px;
  }
}
.seat-sort {
  padding-left: 20px;
  span {
    margin-right: 20px;
  }
  span:last-of-type {
    margin-left: 50px;
  }
}
.seat-col{
  position: relative;
  .seat-item{
    padding: 5px;
    text-align: center;
    position: relative;
  }
  .el-icon-zuowei{
    font-size: 30px;
    color:#606266;
  }
  .seat-no{
    width: 40px;
    height: 40px;
    display: block;
    position: absolute;
    font-size: 16px;
    top: 0px;
    left: 0px;
    line-height: 40px;
    text-align: center;
  }
}
.seat-row-no{
  font-size: 16px;
  background-color: #DCDFE6;
  height: 40px;
  line-height: 40px;
  width: 40px;
  text-align: center;
  margin-right: 50px;
}
</style>
