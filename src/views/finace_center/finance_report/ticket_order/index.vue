<template>
  <div class="app-container multipleInline">
    <el-form inline label-width="90px">
      <el-form-item label="订单查询" class="wp100">
        <remote-select
          v-model="orderStatus"
          class="w150 vm"
          clearable
          showAllOption
          action="/systemApi/order/getDictList"
          :query="{ type: 'orderFilmSearchType' }"
        ></remote-select>
        <el-input
          class="vm w250"
          v-model="query[orderStatus&&orderStatus!=='-1'?orderStatus:'empty']"
          placeholder="请输入关键字"
        ></el-input>
      </el-form-item>
      <el-form-item label="时间查询" class="wp100">
        <el-select v-model="query.timeType" class="w150 vm">
          <el-option value="0" label="订单日期"></el-option>
          <el-option value="1" label="退票时间"></el-option>
        </el-select>
        <zm-datePicker class="vm" @on-change="getTime"></zm-datePicker>
      </el-form-item>
      <el-form-item label="支付方式">
        <remote-select
          v-model="query.payType"
          class="w200"
          clearable
          showAllOption
          placeholder="请选择支付方式"
          action="/systemApi/order/getDictList"
          :query="{ type: 'payType' }"
        ></remote-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="query.orderStatus">
          <el-option
            v-for="(item,index) in orderStatusType"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市:" prop="area">
        <city-cascader
          ref="city"
          v-model.trim="area"
          :rang="2"
          showAllOptions
          :clearable="true"
          placeholder="请选择"
          class="w200"
        ></city-cascader>
      </el-form-item>
      <el-form-item label="票务系统商">
        <remote-select-multiple
          v-model="query.interfaceType"
          showAllOption
          placeholder="选择票务系统商"
          action="/systemApi/interfaceType/getList"
          class="w200"
        ></remote-select-multiple>
      </el-form-item>
      <el-form-item label="平台商家">
        <remote-select
          v-model="query.channelId"
          clearable
          showAllOption
          placeholder="请选择交易渠道商"
          action="/systemApi/channel/getList"
          :query="{type: query.channelType }"
          class="w200"
        ></remote-select>
      </el-form-item>
      <div>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button type="success" icon="el-icon-upload2" @click="exportOrders">导出订单</el-button>
          <el-button type="warning" icon="el-icon-refresh" @click="syncStatus">更新订单</el-button>
        </el-form-item>
      </div>
    </el-form>
    <query-ext-plane :opened="opened">
      <div class="row pl20 pr20">
        <div class="block-box mr20 mb20" v-for="(item,key,index) in sumData" :key="index">
          <p>{{key|showSumFliter(key)||'暂无标题'}}</p>
          <p>{{item}}</p>
        </div>
      </div>
    </query-ext-plane>
    <div class="wp100 tc mb10">
      <el-button type="text" @click="showSum">
        {{opened?'收起统计':'展开统计'}}
        <i :class="opened?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
      </el-button>
    </div>
    <zm-table
      ref="multipleTable"
      :columns="columns"
      :fetch="loadList"
      :table-params="tableParams"
      :options="{mutilpleSelect:true}"
    ></zm-table>
    <choose-export v-model="exportVisible" @cancel="closeExport" :export-params="exportParams"></choose-export>
  </div>
</template>

<script>
import { orderStatusType, orderColumns, showSumType } from './const'
import zmDatePicker from '@/components/isNeedComponents/zmDatePicker'
import tableMixin from '@/mixins/zmTableMixin'
import zmTable from '@/components/isNeedComponents/zmTable'
import { getOrderPageList } from '@/api/financeCenter'
// getOrderStatus
import { realDeepClone } from '@/utils'
// exportData,
import CityCascader from '@/components/CityCascader'
import QueryExtPlane from '@/components/QueryExtPlane'
import chooseExport from './components/chooseExport'
export default {
  name: 'ticket_order',
  components: {
    QueryExtPlane,
    CityCascader,
    zmDatePicker,
    zmTable,
    chooseExport
  },
  mixins: [tableMixin],
  data() {
    return {
      exportVisible: false, // 打开导出窗口
      exportParams: {
        query: {},
        exportIds: ''
      },
      opened: false, // 展开关闭
      orderStatus: '', // 订单查询类型
      orderStatusType, // 订单状态类型
      query: {
        requestType: 'getList',
        timeType: '0',
        channelType: '-1',
        interfaceType: ['-1']
      },
      area: ['', '', ''],
      sumData: {} // 统计数据
    }
  },
  watch: {
    orderStatus(val, oldVal) {
      if (oldVal) this.query[oldVal] = ''
    }
  },
  computed: {
    columns() {
      return orderColumns(this)
    }
  },
  filters: {
    // 统计类型
    showSumFliter(value) {
      if (!value) {
        return '暂无标题'
      }
      let label
      showSumType.forEach(e => {
        if (e.key === value) label = e.label
      })
      return label
    }
  },
  created() {},
  methods: {
    async loadList() {
      this.query.requestType = 'getList'
      this.getArea(this.area)
      if (this.query.empty) delete this.query.empty
      const res = await getOrderPageList(this.assignQuery(this.query))
      this.initialTableData(res.data, res.count)
      if (this.opened) this.getSumData()
    },
    getTime(msg) {
      this.query.orderTimeStart = msg.joinTime[0]
      this.query.orderTimeEnd = msg.joinTime[1]
    },
    getArea(val) {
      this.query.provinceId = this.area[0]
      this.query.cityId = this.area[1]
      this.query.countyId = this.area[2]
    },
    showSum() {
      this.opened = !this.opened
      this.getSumData()
    },
    async getSumData() {
      const query = realDeepClone(this.query)
      query.requestType = 'sum'
      this.sumData = await getOrderPageList(query)
    },
    exportOrders() {
      this.exportVisible = true
      const query = realDeepClone(this.query)
      this.exportParams.query = query
      this.exportParams.exportIds = this.getSelectionIds(false, 'orderId').join(
        ','
      )
      // exportData(getOrderPageList, query)
    },
    closeExport() {
      this.exportVisible = false
    },
    async syncStatus() {
      this.$confirm(
        `由于更新订单状态比较耗时，默认只更新近两周内的订单状态，如果需要更新更长时间的订单状态可自行选择自定义时间进行查询更新，所需时间也会相应增加！`,
        '温馨提示',
        { type: 'warning' }
      ).then(async() => {
        const loading = this.$loading({
          lock: true,
          text: '正在同步订单状态',
          spinner: 'el-icon-loading'
        })
        const query = Object.assign({}, this.query)
        query.requestType = 'syncStatus'
        query.page = 1
        query.pageSize = 10
        const func = async() => {
          try {
            await getOrderPageList(query)
            this.$message.success('同步成功')
            loading.close()
          } catch (error) {
            if (error.status === 30001) {
              query.page += 1
              func()
            } else {
              loading.close()
            }
          }
        }
        func()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.block-box {
  width: 150px;
  height: 80px;
  padding: 0 5px;
  border-radius: 4px;
  text-align: center;
  background: #3ca0ec;
  color: #fff;
}
</style>
