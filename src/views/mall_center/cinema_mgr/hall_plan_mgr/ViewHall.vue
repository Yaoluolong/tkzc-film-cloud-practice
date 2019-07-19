<template>
    <div class="app-container">
         <el-form inline label-width="120px">            
            <el-form-item >
              <el-button type="warning" icon="el-icon-refresh"  @click="updateSeat">更新影院影厅与座位</el-button>
            </el-form-item>
            <el-form-item label="影院名称：">
              <span>{{$route.query.cinemaName}}</span>
            </el-form-item>
         </el-form>
         <page-table ref="table" :query="query" :fetch="queryTable">
            <!-- <el-table-column min-width="120" label="影院名称" align="center" prop="cinemaName" show-overflow-tooltip></el-table-column> -->
            <el-table-column min-width="160"  label="影厅名称" align="center" prop="hallName" show-overflow-tooltip></el-table-column>
            <el-table-column width="120"  label="影厅编码" align="center" prop="hallNo" show-overflow-tooltip></el-table-column>
            <el-table-column width="70"  label="座位数" align="center" prop="seatCount"></el-table-column>
            <el-table-column width="120"  label="影厅分类" align="center" prop="type" show-overflow-tooltip>
                <template slot-scope="{row}">
                    <el-select v-model="row.type" @change="setHallType(row.type,row.id)">
                        <el-option v-for="el in hallTypes" :key="el.value" :label="el.name" :value="el.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <!-- <el-table-column width="120"  label="影厅标签色调" align="center" prop="hallLabelColor">
              <template slot-scope="{row}">
               <el-tag v-if="row.hallLabelColor && row.hallLabelColor != '--'" :style="{backgroundColor:row.hallLabelColor}">{{row.hallLabelColor}}</el-tag>
               <span v-else>--</span>
              </template>
            </el-table-column> -->
            <el-table-column width="80"  label="是否启用" align="center" prop="status">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" :id="row.id" action="/systemApi/cinemaHall/setStatus"></switch-confirm>
              </template>
            </el-table-column>
            <el-table-column width="160"  label="更新影厅时间" align="center" prop="updateTime" ></el-table-column>
            <el-table-column min-width="200"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/mall_center/cinema_mgr/hall_mgr/seat_pic',query:{id:row.id,cinemaId:row.cinemaId,hallNo:row.hallNo,cinemaName:row.cinemaName,hallName:row.hallName}})">查看座位图</el-button>
                <el-button type="text" @click="doSyncHallSeat(row)">更新座位图</el-button>
              </template>
            </el-table-column>
         </page-table>
         <el-dialog v-if="syncErrCinema && syncErrCinema.length > 0" :show-close="false" center width="500px" :visible="syncErrVisible">
            <div style="border-bottom:1px solid #CCCCCC;line-height:25px" slot="title">
                  影厅同步结果!
            </div>
            <div style="max-height:500px;overflow-y: auto;">
              <div  v-for="el in syncErrCinema" :key="el.cinemaId" style="border-bottom:1px solid #CCCCCC;text-align:left;margin-top:10px;font-size:14px;height:50px;" slot="title">
                  <div style="margin-top:10px">影院名称:{{el.cinemaName}}</div>
                    <div style="margin-top:4px">{{el.msg}}</div>
              </div>
            </div>
            
            <div slot="footer">
                <el-button type="primary" @click="syncErrVisible = false">关闭</el-button>
            </div>
         </el-dialog>
         <el-dialog :visible="centerDialogVisible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" modal width="600px" >
            <div  slot="title" class="el-dialog-title">
                正在努力更新影院影厅与座位,请稍后...
            </div>
            <div style="text-align:center;">
                <el-progress :percentage="percentage" ></el-progress>
            </div>           
        </el-dialog>
    </div>
</template>

<script>
    import { getCinemaHallePageList, syncHall, syncHallSeat, getHallTypeList, setHallType, getSyncHallPercent } from '@/api/mallCenter'
    export default {
      name: 'hall_mgr',
      data() {
        return {
          centerDialogVisible: false,
          percentage: 0,
          syncErrVisible: false,
          syncErrCinema: [{
            cinemaName: 'ddd',
            cinemaId: '2'
          }],
          query: {},
          hallTypes: []
        }
      },
      async created() {
        this.hallTypes = await getHallTypeList()
      },
      methods: {
        setHallType(type, id) {
          setHallType({ type, id }).then(() => {
            this.$message.success('影厅类型设置成功')
          })
        },
        queryTable(query) {
          query = Object.assign(query, { id: this.$route.query.id })
          return getCinemaHallePageList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        async doSyncHall() {
          const loading = this.$loading({
            lock: true,
            text: '正在更新影院影厅与座位',
            spinner: 'el-icon-loading'
          })
          try {
            this.centerDialogVisible = true
            const batchNo = await syncHall({ cinemaName: this.$route.query.cinemaName })
            // const msg = await getSyncHallPercent(batchNo)
            const _this = this
            const temp = setInterval(function() {
              getSyncHallPercent(batchNo).then((data) => {
                _this.percentage = parseInt(data.rand)
                if (data.rand === 100) {
                  clearInterval(temp)
                  _this.centerDialogVisible = false
                  _this.syncErrCinema = data.errorCinemaList
                  _this.syncErrVisible = true
                  _this.percentage = 0
                  _this.refreshTable()
                }
              })
            }, 6000)
            loading.close()
          } catch (error) {
            loading.close()
          }
        },
        async updateSeat() {
          this.doSyncHall()
        },
        async doSyncHallSeat(row) {
          const loading = this.$loading({
            lock: true,
            text: '正在更新座位图',
            spinner: 'el-icon-loading'
            // background: 'rgba(0, 0, 0, 0.7)'
          })
          try {
            await syncHallSeat({ cinemaId: row.cinemaId, hallNo: row.hallNo })
            this.$message.success('同步成功')
            loading.close()
          } catch (error) {
            loading.close()
          }
        }
      }
    }
</script>

<style scoped>
.el-dialog-title{
    text-align:center;
    font-size:15px;
    /* background-color:gray; */
    padding-top:10px
}
</style>
