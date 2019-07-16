<template>
  <div class="app-container wp100 hp100 mall-auto-prcie">
    <div class="df wp100 hp100">
      <div class="mall-auto-prcie__menu bg-f mr10 df column">
        <div class="pd15 tc">
          <el-radio-group v-model="params.type" size="small" @change="changeType">
            <el-radio-button
              v-for="(item, index) in CHANNEL_TYPES"
              :key="index"
              :label="item.value"
            >{{item.label}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="flex-one">
          <div v-if="channelList&&channelList.length">
            <div
              v-for="(item,index) in channelList"
              :key="index"
              class="plr15 ptb10 cursor-pt"
              :class="{'bg-text':item.id===channelId}"
              @click="changeChannel(item)"
            >{{item.name}}</div>
          </div>
          <div v-else class="pt20 tc info">暂无数据</div>
        </div>
      </div>
      <div class="mall-auto-prcie__container flex-one bg-f">
        <pricing-table v-if="channelId" :id="channelId"></pricing-table>
      </div>
    </div>
  </div>
</template>
<script>
// import zmTable from '@/components/isNeedComponents/zmTable/index'
// import zmTableMixin from '@/mixins/zmTableMixin'
// import { autoSchemeColumns } from './constant'
import { getChannelPageList } from '@/api/mallCenter'
import pricingTable from './pricingTable'
import { CHANNEL_TYPES } from '@/model/type'
export default {
  // mixins: [zmTableMixin],
  components: {
    pricingTable
  },
  data() {
    return {
      CHANNEL_TYPES,
      params: {
        type: '1'
      },
      channelList: [],
      channelId: null
      // columns: autoSchemeColumns(this)
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    async loadList() {
      const res = await getChannelPageList(this.params)
      this.channelList = res.data
      if (res.data && res.data[0]) {
        this.channelId = res.data[0].id
      } else {
        this.channelId = null
      }
    },
    changeType() {
      this.loadList()
    },
    changeChannel(row) {
      this.channelId = row.id
    }
  }
}
</script>
<style lang="scss" scoped>
.mall-auto-prcie {
  // padding: 0;
  margin: 0;
  background-color: #e9eef3;
  &__menu {
    width: 160px;
  }
}
</style>

