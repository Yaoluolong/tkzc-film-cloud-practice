<template>
  <div class="app-container wp100 hp100 mall-auto-prcie">
    <div class="df">123456
      <div class="mall-auto-prcie__menu"></div>
      <div class="mall-auto-prcie__container flex-one">
        <!-- <pricing-table></pricing-table> -->
      </div>
    </div>
  </div>
</template>
<script>
// import zmTable from '@/components/isNeedComponents/zmTable/index'
// import zmTableMixin from '@/mixins/zmTableMixin'
// import { autoSchemeColumns } from './constant'
// import { getAutoPricePageList, setAutoPriceStatus } from '@/api/priceCenter'
import pricingTable from './pricingTable'
export default {
  // mixins: [zmTableMixin],
  components: {
    pricingTable
  },
  data() {
    return {
      params: {
        name: null
      }
      // columns: autoSchemeColumns(this)
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    async loadList() {
      // const res = await getAutoPricePageList(this.assignQuery(this.params))
      // this.initialTableData(res.data, res.count)
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
  padding: 0;
  margin: 0;
  background-color: #e9eef3;
  &__header {
    width: 300px;
  }
}
</style>

