<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="影院名称">
              <el-input v-model="query.cinemaName" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>
              <!-- <cinema-id-selector v-model="query.cinemaId"  style="width:200px;"></cinema-id-selector> -->
            </el-form-item>
            <el-form-item label="商家名称">
              <channel-id-selector v-model="query.channelId"  style="width:200px;"></channel-id-selector>
            </el-form-item>
            <el-form-item label="省/市">
             <city-cascader ref="city" v-model="query.area" :rang="1" :clearable="true" placeholder="请选择" style="width:170px;"></city-cascader>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="warning" icon="el-icon-refresh"  @click="updatePlan(query.channelId,query.cinemaId,query.cinemaName)">更新排期及价格</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="180"  label="影院名称" align="center" prop="cinemaName" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="180"  label="影院定价分组" align="center" prop="priceRightName" ></el-table-column>
            <el-table-column min-width="140"  label="商家名称" align="center" prop="channelName" show-overflow-tooltip></el-table-column>
            <el-table-column width="80"  label="总排期数" align="center" prop="totoalNum"></el-table-column>
            <el-table-column width="100"  label="可售排期数" align="center" prop="sellNum"></el-table-column>
            <el-table-column min-width="100"  label="不可售排期数" align="center" prop="unSellNum"></el-table-column>
            <el-table-column width="140"  label="更新排期时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="200"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="goToManage(row)">管理排期</el-button>
                <el-button type="text" @click="updatePlan(row.channelId,row.cinemaId,row.cinemaName)">更新排期</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
import CityCascader from '@/components/CityCascader'
import { realDeepClone } from '@/utils'
import { getChannelPlanPageList, syncChannelPlan } from '@/api/mallCenter'
export default {
  name: 'channel_plan',
  components: { CityCascader },
  data() {
    return {
      query: {
        area: [],
        cinemaName: '',
        channelId: ''
      },
      updataParams: ''
    }
  },
  methods: {
    queryTable(query) {
      const request = realDeepClone(query)
      if (query.area[0]) {
        request.provinceId = query.area[0]
      }
      if (query.area[1]) {
        request.cityId = query.area[1]
      }
      delete request.area
      return getChannelPlanPageList(request)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    goToManage(row) {
      const manage = {
        cinemaId: row.cinemaId,
        channelId: row.channelId,
        cinemaName: row.cinemaName,
        channelName: row.channelName,
        priceRight: row.priceRight
      }
      sessionStorage.setItem('manage', JSON.stringify(manage))
      this.$router.push({ path: '/price_center/price_mgr/channel_plan/channel_management' })
    },
    async updatePlan(channelId, cinemaId, cinemaName) {
      if (!cinemaId) {
        this.$confirm('在未选择渠道商或影院的情况下默认更新所有渠道商的影院排期，此时更新时间会比较长，建议选择单家渠道商进行更新！', '温馨提示', {
          confirmButtonText: '继续更新',
          cancelButtonText: '选择单家',
          type: 'warning'
        }).then(async() => {
          this.updataParams = { channelId, cinemaName }
          const loading = this.$loading({
            lock: true,
            text: '正在更新排期',
            spinner: 'el-icon-loading'
          })
          try {
            await syncChannelPlan(this.updataParams)
            this.$message.success('系统后台已进入商家影院排期同步中，请稍候返回查看数据')
            loading.close()
          } catch (error) {
            loading.close()
          }
        }).catch(() => {
          this.$message.warning('请选择渠道商')
        })
      } else {
        this.updataParams = { channelId, cinemaId }
        const loading = this.$loading({
          lock: true,
          text: '正在更新排期',
          spinner: 'el-icon-loading'
        })
        try {
          await syncChannelPlan(this.updataParams)
          this.$message.success('系统后台已进入商家影院排期同步中，请稍候返回查看数据')
          loading.close()
        } catch (error) {
          loading.close()
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
