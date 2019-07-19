<template>
    <div class="app-container">
          <el-button type="primary" @click="getOpenCinema">读取/更新影院</el-button>
         <el-tabs v-model="cinemaType" @tab-click="handleTabChange">
            <el-tab-pane label="启用影院" name="normal"></el-tab-pane>
            <el-tab-pane label="停用影院" name="closeNormal"></el-tab-pane>
            <el-tab-pane label="异常影院" name="abnormal"></el-tab-pane>            
          </el-tabs>
         <el-form inline label-width="100px">
            <el-form-item label="影院">
                <el-input v-model="query.cinemaName" style="width:200px;" placeholder="请输入影院名称或编码模糊查询"></el-input>
            </el-form-item>
            <el-form-item label="票务系统商">
              <remote-select v-model="query.interfaceId" clearable placeholder="请选择票务系统商" action="/systemApi/interfaceType/getList" style="width:200px;"></remote-select>
            </el-form-item>
            <el-form-item label="影院所在地区" prop="area">
              <city-cascader ref="city" v-model="area" :rang="2" :clearable="true" placeholder="请选择" style="width:320px;"></city-cascader>
            </el-form-item>
            <!-- <el-form-item label="广电编码">
              <el-input v-model="query.cinemaId" clearable placeholder="请输入广电编码" style="width:200px;"></el-input>
            </el-form-item> -->
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus" v-if="cinemaType==='normal'" @click="$router.push('/mall_center/cinema_mgr/cinema_connect/create')">新增</el-button>
              
              <el-button type="success" v-if="cinemaType==='closeNormal'" @click="openCinema">开启影院</el-button>              
              <el-button type="success" v-if="cinemaType==='normal'" icon="el-icon-upload2" @click="exportCinema">导出影院</el-button>
              <el-button type="danger" v-if="cinemaType==='normal'" @click="CloseCinema">停用影院</el-button>
            </el-form-item>
         </el-form>         
         <page-table ref="table" index :query="query" :fetch="queryTable" @selection-change="changeSelectedFun">

            <el-table-column width="50"  label="平台影院ID"  v-show="cinemaType !== 'abnormal'" align="center" prop="id" type="selection"></el-table-column>

            <!-- <el-table-column type="selection" :selectable="selectable" align="center" reserve-selection width="40"></el-table-column> -->

            <el-table-column min-width="180"  label="平台内部ID" align="center" prop="id" show-overflow-tooltip></el-table-column>

            <el-table-column width="160"  label="影院所在地" align="center" prop="countyName" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{row.provinceName}}/{{row.cityName}}/{{row.countyName}}
              </template>
            </el-table-column>

            <el-table-column min-width="180"  label="影院名称" align="center" prop="cinemaName" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="120"  label="广电编码" align="center" prop="cinemaId" show-overflow-tooltip></el-table-column>            
            
            <el-table-column width="180"  label="票务系统商" align="center" prop="interfaceName"></el-table-column>

            <el-table-column v-if="cinemaType !== 'abnormal'" width="180"  label="定价权" align="center" key="priceRight" prop="priceRight" show-overflow-tooltip></el-table-column>

            <el-table-column  v-if="cinemaType !== 'abnormal'" width="130"  label="退票限制" align="center" key="refundConfig" prop="refundConfig" show-overflow-tooltip></el-table-column>

            <el-table-column  min-width="180"  label="接入有效期" align="center" show-overflow-tooltip prop="startTime">
               <template slot-scope="{row}">
                {{row.startTime}}--{{row.endTime}}
              </template>
            </el-table-column>

            <el-table-column  min-width="80"  label="排期数" align="center" show-overflow-tooltip prop="schCount"></el-table-column>

            <el-table-column width="180" v-show="cinemaType === 'abnormal'" label="添加时间" align="center" key="createTime" prop="createTime" show-overflow-tooltip></el-table-column>

            <!-- <el-table-column width="100" v-if="cinemaType === 'normal'" label="是否启用" align="center" key="status" prop="status">
              <template slot-scope="{row}">
                <switch-confirm v-model="row.status" :id="row.id" id-key="id"  action="/systemApi/cinema/setStatus"></switch-confirm>
              </template>
            </el-table-column> -->
            <el-table-column min-width="180"  label="操作" align="center"  prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" v-if="cinemaType === 'normal'" @click="$router.push({path:'/mall_center/cinema_mgr/view_cinema',query:{id:row.id}})">查看</el-button>
                <el-button type="text" @click="$router.push({path:'/mall_center/cinema_mgr/cinema_connect/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" v-if="cinemaType !== 'normal'" @click="deleteSystemer(row)">删除</el-button>
              </template>
            </el-table-column>

            <el-table-column width="180" label="更新时间" align="center" key="updateTime" prop="updateTime" show-overflow-tooltip></el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getCinemaPageList, deleteCinema, getOpenCinema, setCinemaListStatus } from '@/api/mallCenter'
    import CityCascader from '@/components/CityCascader'
    import { exportData, realDeepClone } from '@/utils'
    export default {
      name: 'cinema_connect',
      components: { CityCascader },
      data() {
        return {
          query: {
            abnormal: '0',
            status: '1'
          },
          cinemaType: 'normal', // 影院类型 normal 正常  abnormal  异常
          area: ['', ''],
          multipleSelection: []
        }
      },
      methods: {
        handleTabChange(tab) {
          this.$set(this.query, 'status', '')
          if (tab.name === 'normal') {
            this.query.abnormal = '0'
            this.query.status = '1'
          } else if (tab.name === 'abnormal') {
            this.query.abnormal = '1'
          } else if (tab.name === 'closeNormal') {
            this.query.abnormal = '0'
            this.query.status = '2'
          }
          this.refreshTable()
          this.$forceUpdate()
        },
        queryTable(query) {
          query.provinceId = this.area[0]
          query.cityId = this.area[1]
          query.countyId = this.area[2]
          const req = realDeepClone(query)
          return getCinemaPageList(req)
        },
        refreshTable() {
          this.$refs.table.refresh(true)
        },
        async getOpenCinema() {
          const interfaceId = this.query.interfaceId
    
          if (!interfaceId) {
            this.$message.warning('请选择票务系统商')
            // this.$confirm(`您目前操作的是读取“全部”系统商开通的影院，数据读取量较大请耐心等候，建议可选择单个系统商进行读取！读取成功后需工作人员在异常影院列表中进行编辑填补！`, '温馨提示',
            //   {
            //     confirmButtonText: '继续读取',
            //     cancelButtonText: '选择单家',
            //     type: 'warning'
            //   }).then(async() => {
            //   if (!this.query.cinemaId) {
            //     this.$message.info('系统将读取全部开通影院')
            //   }
            //   const loading = this.$loading({
            //     lock: true,
            //     text: '正在读取开通影院',
            //     spinner: 'el-icon-loading'
            //   })
            //   try {
            //     await getOpenCinema(undefined, 1)
            //     this.$message.success('读取成功')
            //     loading.close()
            //   } catch (error) {
            //     loading.close()
            //   }
            // })
          } else {
            const loading = this.$loading({
              lock: true,
              text: '正在读取开通影院',
              spinner: 'el-icon-loading'
            })
            try {
              const data = await getOpenCinema(interfaceId)
              for (let i = 2; i <= data.pageAll; i++) {
                await getOpenCinema(interfaceId, i)
              }
              this.$message.success('读取成功')
              loading.close()
            } catch (error) {
              loading.close()
            }
          }
        },
        deleteSystemer(row) {
          this.$confirm(`删除影院后将导致相关的渠道商无该影院的后果，但不会删除该影院所产生的交易数据。是否要执行此操作？`, '删除提示', { type: 'warning' }).then(async() => {
            await deleteCinema(row.id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.refreshTable()
          })
        },
        changeSelectedFun(val) {
          this.multipleSelection = val
        },
        CloseCinema() {
          console.log(this.multipleSelection)
          const req = this.multipleSelection.map(e => e.id).join(',')
          setCinemaListStatus({ ids: req, status: '2' }).then(res => {
            this.$message.success('操作成功')
            this.refreshTable()
          })
        },
        openCinema() {
          const req = this.multipleSelection.map(e => e.id).join(',')
          setCinemaListStatus({ ids: req, status: '1' }).then(res => {
            this.$message.success('操作成功')
            this.refreshTable()
          })
        },
        exportCinema() {
          this.query.provinceId = this.area[0]
          this.query.cityId = this.area[1]
          this.query.countyId = this.area[2]
          this.$set(this.query, 'status', 1)
          const selectData = this.$refs.table.getSelection()
          this.query.ids = selectData.map(e => e.id).join(',')
          exportData(getCinemaPageList, this.query).then(e => {
            delete this.query.ids
            this.refreshTable()
          })
        }
      }
    }
</script>

<style scoped>

</style>
