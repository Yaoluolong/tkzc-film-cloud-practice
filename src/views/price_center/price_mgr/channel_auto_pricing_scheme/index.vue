<template>
  <div class="app-container wp100 hp100 mall-auto-prcie">
    <div class="df wp100 hp100">
      <div class="mall-auto-prcie__menu bg-f mr10">
        <div class="pd15">
          <el-radio-group v-model="params.type">
            <el-radio-button v-for="(item, index) in CHANNEL_TYPES" :key="index" :label="item.vaule">{{item.label}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="mall-auto-prcie__container flex-one bg-f">
        <!-- <pricing-table></pricing-table> -->
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
      }
      // columns: autoSchemeColumns(this)
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    async loadList() {
      const res = await getChannelPageList(this.assignQuery(this.params))
      this.initialTableData(res.data, res.count)
    },
    openDetail(row) {},
    openEdit(row) {
      this.$router.push({
        path: '/common_page/message_center/auto_pricing_scheme/edit',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .app-main {
//   padding: 20px;
//   margin: 20px;
//   background-color: #e9eef3;
// }
.mall-auto-prcie {
  // padding: 0;
  margin: 0;
  background-color: #e9eef3;
  &__menu {
    width: 160px;
  }
}
</style>

