<template>
  <div class="app-container">
    <el-form inline label-width="120px">
      <el-form-item label="票务系统商">
        <remote-select
          v-model="query.interfaceId"
          clearable
          placeholder="请选择票务系统商"
          action="/systemApi/interfaceType/getList"
          style="width:200px;"
        ></remote-select>
      </el-form-item>
      <el-form-item label="影院名称">
        <el-input
          clearable
          v-model="query.cinemaName"
          style="width:200px;"
          placeholder="请输入影院名称或编码模糊查询"
        ></el-input>
      </el-form-item>
      <el-form-item label="省/自治区/直辖市">
        <city-cascader
          ref="city"
          v-model="query.area"
          :rang="1"
          :clearable="true"
          placeholder="请选择"
          style="width:320px;"
        ></city-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshTable">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="updateSeat">更新影院影厅/座位</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="updatePlan">获取影院排期</el-button>
        <el-button type="warning" icon="el-icon-down" @click="exportData">导出数据</el-button>
      </el-form-item>
    </el-form>
    <page-table ref="table" :query="query" :fetch="queryTable">
      <el-table-column
        min-width="150"
        label="影院名称"
        align="center"
        prop="cinemaName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="150" label="影厅总数" align="center" prop="hallNum"></el-table-column>
      <el-table-column min-width="150" label="排期总数" align="center" prop="cinemaPlanNum"></el-table-column>
      <el-table-column min-width="150" label="平均售价" align="center" prop="average"></el-table-column>
      <el-table-column
        min-width="150"
        label="票务系统商"
        align="center"
        prop="remark"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="150" label="城市" align="center" prop>
        <template slot-scope="{row}">{{row.provinceName + row.cityName}}</template>
      </el-table-column>
      <el-table-column width="80" label="是否启用" align="center" prop="status" fixed="right">
        <template slot-scope="{row}">
          <switch-confirm
            v-model="row.status"
            :id="row.id"
            action="/systemApi/cinema/setListStatus"
          ></switch-confirm>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="150"  label="影片名称" align="center" prop="filmName" show-overflow-tooltip></el-table-column>
            <el-table-column  min-width="150" label="排期编码" align="center" prop="featureAppNo"></el-table-column>
            <el-table-column  min-width="150" label="放映时间" align="center" prop="startTime"></el-table-column>
            <el-table-column   label="放映影厅" align="center" prop="hallName" show-overflow-tooltip></el-table-column>
            <el-table-column  label="放映制式" align="center" prop="copyType"></el-table-column>
            <el-table-column  label="排期状态" align="center" prop="statusName">
              <template  slot-scope="{row}"><el-tag :type="row.status=='1'? 'success':'danger'">{{row.status=='1'? '正常':'关闭'}}</el-tag></template>
            </el-table-column>
            <el-table-column   label="影片最低价" align="center" prop="lowestPrice" :formatter="priceFormatter"></el-table-column>
            <el-table-column   label="影片标准价" align="center" prop="standardPrice" :formatter="priceFormatter"></el-table-column>
            <el-table-column   label="影片挂牌价" align="center" prop="listingPrice"  :formatter="priceFormatter"></el-table-column>
      <el-table-column   label="影院服务费" align="center" prop="serviceAddFee"  :formatter="priceFormatter"></el-table-column>-->

      <el-table-column
        min-width="150"
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="200" label="操作" align="center" prop="eper" fixed="right">
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="$router.push({path:'/mall_center/cinema_mgr/view_hall',query:{id:row.id, cinemaName:row.cinemaName}})"
          >查看影厅</el-button>
          <el-button
            type="text"
            @click="$router.push({path:'/mall_center/cinema_mgr/view_plan',query:{id:row.id,interfaceId:row.interfaceId, cinemaName:row.cinemaName,remark:row.remark,updateTime:row.updateTime}})"
          >查看排期</el-button>
        </template>
      </el-table-column>
    </page-table>
    <el-dialog
      v-if="syncErrCinema && syncErrCinema.length > 0"
      :show-close="false"
      center
      :visible="syncErrVisible"
      width="500px"
    >
      <div style="border-bottom:1px solid #CCCCCC;line-height:25px" slot="title">排期同步结果!</div>
      <div style="max-height:500px;overflow-y: auto;">
        <div
          v-for="(el,index) in syncErrCinema"
          :key="index"
          style="max-height:600px;text-align:left;font-size:14px;"
          slot="title"
        >
          <div>{{el}}</div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="syncErrVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible="centerDialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      modal
      width="30%"
    >
      <div slot="title" class="el-dialog-title">服务器正在努力更新，请稍后...</div>
      <span style="text-align:center">
        <el-progress :percentage="percentage"></el-progress>
      </span>
      <span slot="footer" class="el-dialog-footer">更新影院排期的速度取决于影院排期数个数，请耐心等候！</span>
    </el-dialog>
  </div>
</template>

<script>
import CityCascader from '@/components/CityCascader'
import {
  getCinemaAndPlanInfo,
  syncCinemaPlan,
  getSyncCinemaPlanPercent,
  getSyncHallPercent,
  syncHall
} from '@/api/mallCenter'
import { realDeepClone, exportData } from '@/utils'
export default {
  name: 'hall_plan_mgr',
  components: { CityCascader },
  data() {
    return {
      query: {},
      syncErrCinema: [],
      syncErrVisible: false,
      centerDialogVisible: false,
      percentage: 0
    }
  },
  methods: {
    queryTable(query) {
      const temp = realDeepClone(query)
      if (temp.time) {
        temp.startTime = temp.time[0]
        temp.endTime = temp.time[1]
      } else {
        temp.startTime = undefined
        temp.endTime = undefined
      }
      if (temp.area) {
        temp.cityId = temp.area[1]
        temp.provinceId = temp.area[0]
        delete temp.area
      }
      delete temp.time
      return getCinemaAndPlanInfo(temp)
    },
    refreshTable() {
      this.$set(this.query, 'isExport', '')
      this.$refs.table.refresh()
    },
    priceFormatter(row, column, cellValue, index) {
      return cellValue ? cellValue + '元' : '--'
    },
    async doUpdatePlan() {
      const loading = this.$loading({
        lock: true,
        text: '正在更新排期',
        spinner: 'el-icon-loading'
      })
      try {
        const batchNo = await syncCinemaPlan({
          cinemaName: this.query.cinemaName,
          interfaceTypeId: this.query.interfaceId
        })

        const _this = this
        const temp = setInterval(function() {
          getSyncCinemaPlanPercent(batchNo).then(data => {
            _this.centerDialogVisible = true
            _this.percentage = parseInt(data.rand)
            if (data.rand === 100) {
              _this.centerDialogVisible = false
              loading.close()
              clearInterval(temp)
              _this.syncErrCinema = data.cinemaList
              _this.syncErrVisible = true
              _this.refreshTable()
            }
          })
        }, 6000)
      } catch (error) {
        loading.close()
      }
    },
    async updatePlan() {
      if (this.query.cinemaName || this.query.interfaceId) {
        if (!this.query.cinemaName || !this.query.interfaceId) {
          this.$message.info('系统将更新全部影院排期')
        }
        this.doUpdatePlan()
      } else {
        this.$confirm(
          `在未选择影院的情况下默认更新所有已启用的影院的排期,此时更新时间会较长,建议选择当家影院进行更新!`,
          '温馨提示',
          {
            confirmButtonText: '继续更新',
            cancelButtonText: '选择单家',
            type: 'warning'
          }
        ).then(async() => {
          if (!this.query.cinemaName || !this.query.interfaceId) {
            this.$message.info('系统将更新全部影院排期')
          }
          this.doUpdatePlan()
        })
      }
    },
    async doSyncHall() {
      const loading = this.$loading({
        lock: true,
        text: '正在更新影院影厅与座位',
        spinner: 'el-icon-loading'
      })
      try {
        this.centerDialogVisible = true
        const query = {}
        query.interfaceId = this.query.interfaceId
        query.cinemaName = this.query.cinemaName
        if (this.query.area) {
          query.provinceId = this.query.area[0]
          query.cityId = this.query.area[1]
        }

        const batchNo = await syncHall(query)
        // const msg = await getSyncHallPercent(batchNo)
        const _this = this
        const temp = setInterval(function() {
          getSyncHallPercent(batchNo).then(data => {
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
      if (this.query.cinemaName) {
        this.doSyncHall()
      } else {
        const _this = this
        this.$confirm(
          `在未选择影院的情况下默认更新所有已启用的影院影厅以及对于影厅的座位图,此时更新时间会较长,建议选择单家影院进行更新!`,
          '温馨提示',
          {
            confirmButtonText: '继续更新',
            cancelButtonText: '选择单家',
            type: 'warning'
          }
        ).then(async() => {
          _this.doSyncHall()
        })
      }
    },
    exportData() {
      const query = Object.assign(this.query, { isExport: '1' })
      exportData(getCinemaAndPlanInfo, query)
    }
  }
}
</script>

<style scoped>
</style>
