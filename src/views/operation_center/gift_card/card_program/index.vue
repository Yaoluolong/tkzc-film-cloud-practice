<template>
    <div class="app-container">
         <el-form inline label-width="120px">                        
            <el-form-item label="平台商家名称">
              <channel-id-selector v-model="query.channelId"></channel-id-selector>
            </el-form-item>
            <el-form-item label="电影卡种类">
              <remote-select v-model="query.cardType" clearable placeholder="请选择电影券种类" action="/systemApi/dict/getList" :query="{type:'cardType'}" style="width:200px;"></remote-select>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="danger" icon="el-icon-plus" @click="$router.push({path:'/operation_center/gift_card/card_recharge_program/create'})">新增</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
         	<el-table-column min-width="120"  label="卡种类" align="center" prop="typeName"></el-table-column>
         	<el-table-column min-width="120"  label="充值点数" align="center" prop="point"></el-table-column>
         	<el-table-column min-width="120"  label="原价(元)" align="center" prop="price"></el-table-column>
          <el-table-column min-width="180"  label="适用平台商家" align="center" prop="channelName"></el-table-column>
          <el-table-column min-width="120"  label="充值点数有效期" align="center" prop="idpdValidityName" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="120"  label="充值活动" align="center" prop="isOpenActive">
            <template slot-scope="{row}">
              <span v-if="row.isOpenActive ==='1'">开启</span>
              <span v-else>关闭</span>
            </template>
          </el-table-column>
          <el-table-column min-width="120"  label="活动价(元)" align="center" prop="activePrice">
            <template slot-scope="{row}">
              <span v-if="row.isOpenActive ==='0'">--</span>
              <span v-else>{{row.activePrice}}</span>
            </template>
          </el-table-column>
         	<!-- <el-table-column min-width="120"  label="每张卡可参与" align="center" prop="activeNum"></el-table-column> -->
         	<!-- <el-table-column min-width="180"  label="活动时间" align="center" prop="activeTime">
                      <template slot-scope="{row}">
                        <span v-if="row.isOpenActive === '1'">{{row.activeStime}} -- {{row.activeEtime}}</span>
                        <span v-else>--</span>
                      </template>
                    </el-table-column> -->
         	<el-table-column min-width="120"  label="活动结束恢复原价" align="center" prop="recoveryName"></el-table-column>
         	
         	            
            <el-table-column min-width="100"  label="上下架" align="center" prop="status">
              <template slot-scope="{row}">
                <el-switch v-model="row.status" @change="clickSwitch(row)" :active-value="activeValue" :inactive-value="inactiveValue"></el-switch>
              </template>
            </el-table-column>
            <el-table-column min-width="250"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/gift_card/card_recharge_program/edit',query:{id:row.id}})">编辑</el-button>
                <el-button type="text" @click="deleteObj(row)">删除</el-button>
              </template>
            </el-table-column>
         </page-table>
    </div>
</template>

<script>
    import { getCardRechargeList, deleteCardRecharge, setCardRechargeStatus } from '@/api/operationCenter'
    import ChannelSelector from '@/components/ChannelSelector'
    export default {
      name: 'card_recharge_program',
      components: { ChannelSelector },
      data() {
        return {
          query: {
            channelId: '',
            cardType: ''
          },
          activeValue: '1',
          inactiveValue: '2'
        }
      },
      methods: {
        queryTable(query) {
          return getCardRechargeList(query)
        },
        refreshTable() {
          this.$refs.table.refresh()
        },
        clickSwitch(row) {
          setCardRechargeStatus({ id: row.id, status: row.status }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }).catch(e => {
            row.status = this.inactiveValue
          })
        },
        deleteObj(row) {
          this.$confirm(`删除电影卡--点卡充值规则后，应用端将自动下架该类型的充值规则！`, '温馨提示', { type: 'warning' }).then(async() => {
            await deleteCardRecharge({ id: row.id })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.refreshTable()
          })
        }
      }
    }
</script>

<style scoped>

</style>
