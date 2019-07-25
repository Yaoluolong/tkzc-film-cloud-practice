<template>
  <div class="app-container">
    <el-form inline label-width="120px">
      <el-form-item label="票务系统商：">
        <!-- <remote-select v-model="query.interfaceTypeId" clearable placeholder="请选择票务系统商" action="/systemApi/interfaceType/getList" style="width:200px;"></remote-select> -->
        <span>{{$route.query.remark}}</span>
      </el-form-item>
      <el-form-item label="影院名称：">
        <!-- <el-input v-model="query.cinemaName" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></
        el-input>-->
        <span>{{$route.query.cinemaName}}</span>
      </el-form-item>
      <el-form-item label="更新时间：">
        <span>{{$route.query.updateTime}}</span>
      </el-form-item>
      <br />
      <el-form-item label="影片名称">
        <el-input v-model="query.filmName" clearable placeholder="请输入影片名称" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="排期编码">
        <el-input
          v-model="query.featureAppNo"
          clearable
          placeholder="请输入影片排期编码"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="放映日期">
        <el-date-picker
          unlink-panels
          v-model="query.time"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="排期状态">
        <el-select v-model="query.status" clearable placeholder="请选择排期状态" style="width:200px;">
          <el-option value="1" label="正常"></el-option>
          <el-option value="2" label="关闭"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="省/自治区/直辖市">
              <city-cascader ref="city" v-model="query.area" :rang="1" :clearable="true" placeholder="请选择" style="width:320px;"></city-cascader>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshTable">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="updatePlan">更新影院排期</el-button>
        <el-button type="warning" @click="exportData">导出排期</el-button>
      </el-form-item>
    </el-form>
    <page-table ref="table" index :query="query" :fetch="queryTable">
      <!-- <el-table-column min-width="150"  label="影院名称" align="center" prop="cinemaName" ></el-table-column>
            <el-table-column min-width="150"  label="城市" align="center" prop="cinemaName" >
              <template slot-scope="{row}">
                  {{row.provinceName + row.cityName}}
              </template>
      </el-table-column>-->
      <el-table-column
        min-width="150"
        label="影片名称"
        align="center"
        prop="filmName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="150"
        label="排期编码"
        align="center"
        prop="featureAppNo"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="150" label="放映时间" align="center" prop="startTime"></el-table-column>
      <el-table-column label="放映影厅" align="center" prop="hallName" show-overflow-tooltip></el-table-column>
      <el-table-column label="放映制式" align="center" prop="copyType"></el-table-column>
      <el-table-column label="排期状态" align="center" prop="statusName">
        <template slot-scope="{row}">
          <el-tag :type="row.status=='1'? 'success':'danger'">{{row.status=='1'? '正常':'关闭'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        min-width="120"
        label="影片最低价"
        align="center"
        prop="lowestPrice"
        :formatter="priceFormatter"
      ></el-table-column>
      <el-table-column
        min-width="120"
        label="影片票价"
        align="center"
        prop="ticketPrice"
        :formatter="priceFormatter"
      ></el-table-column>
      <!-- <el-table-column   label="影片挂牌价" align="center" prop="listingPrice"  :formatter="priceFormatter"></el-table-column> -->
      <el-table-column
        min-width="120"
        label="影院服务费"
        align="center"
        prop="serviceAddFee"
        :formatter="priceFormatter"
      ></el-table-column>
      <el-table-column
        min-width="120"
        label="服务费上限"
        align="center"
        prop="thresholds"
        :formatter="priceFormatter"
      ></el-table-column>
      <!-- <el-table-column   label="系统商结算价" align="center" prop="ticketPrice"  :formatter="priceFormatter"></el-table-column> -->
      <el-table-column min-width="150" label="更新排期时间" align="center" prop="updateTime"></el-table-column>
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
  getCinemaPlanPageList,
  syncCinemaPlan,
  getSyncCinemaPlanPercent
} from '@/api/mallCenter'
import { realDeepClone } from '@/utils'
export default {
  name: 'cinema_plan',
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
      temp.id = this.$route.query.id
      if (temp.time) {
        temp.startTime = temp.time[0]
        temp.endTime = temp.time[1]
      } else {
        temp.startTime = undefined
        temp.endTime = undefined
      }
      /* if (temp.area) {
        temp.cityId = temp.area[1]
        temp.provinceId = temp.area[0]
        delete temp.area
      }*/
      delete temp.time
      return getCinemaPlanPageList(temp)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    async exportData() {
      const query = realDeepClone(this.query)
      query.requestType = 'export'
      query.id = this.$route.query.id
      await getCinemaPlanPageList(query)
      this.$message.success('导出成功，请到下载中心进行下载')
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
        const params = Object.assign(this.query, {
          cinemaName: this.$route.query.cinemaName,
          interfaceId: this.$route.query.interfaceId
        })
        const batchNo = await syncCinemaPlan(params)

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
      this.doUpdatePlan()
    }
  }
}
</script>

<style scoped>
</style>
