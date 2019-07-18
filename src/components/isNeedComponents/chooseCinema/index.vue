<template>
  <zm-panel :title="title" :visible.sync="value" @change="closePanel">
    <div class="hp100">
      <el-form inline label-width="80px" label-position="right" class="mt20 mb20">
        <query-form ref="queryForm" @change="queryChange" :area-str="area" :query-params="query"></query-form>
        <el-radio-group v-model="cinemaType" class="mb20 ml20" v-if="chooseOption.isShowCinemaType">
          <el-radio label="1">所有影院</el-radio>
          <el-radio label="2">指定影院</el-radio>
        </el-radio-group>
        <div>
          <el-button type="primary" icon="el-icon-search" @click="onOperateClick('query')">查询</el-button>
        </div>
      </el-form>
      <zm-table
        ref="multipleTable"
        :columns="columns"
        :fetch="loadList"
        :table-params="tableParams"
        :options="{mutilpleSelect:+cinemaType===2,loading:loading}"
      ></zm-table>
    </div>
    <div slot="footer" class="tl pl20">
      <el-button size="small" type="default" @click="closePanel">取消</el-button>
      <el-button size="small" type="primary" @click="onSubmitClick">添加</el-button>
    </div>
  </zm-panel>
</template>

<script>
import { getCinemaGroupList, updateCinemaAdd } from '@/api/mallCenter'
// getCinemaList
import zmTable from '@/components/isNeedComponents/zmTable'
import zmPanel from '@/components/isNeedComponents/zmPanel'
import tableMixin from '@/mixins/zmTableMixin'
import queryForm from '@/components/isNeedComponents/addCinemaQuery'
import { chooseCinemaColumns } from './const'
export default {
  components: { zmTable, zmPanel, queryForm },
  mixins: [tableMixin],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    chooseParams: {
      type: Object,
      default() {
        return {}
      }
    },
    chooseOption: {
      type: Object,
      default() {
        return {
          isShowCinemaType: true // 是否需要展示所有和指定按钮
        }
      }
    },
    apiObj: {
      type: Object,
      default() {
        return {
          listApi: getCinemaGroupList, // 列表接口
          operaApi: updateCinemaAdd // 操作接口
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      title: '添加影院',
      query: {},
      area: '',
      cinemaType: '2' // 1所有影院，2指定影院
    }
  },
  computed: {
    columns() {
      return chooseCinemaColumns(this)
    }
  },
  created() {
    this.cinemaType = this.chooseParams.cinemaType || '2'
    this.query = Object.assign({}, this.query, this.chooseParams.searchParam)
    this.area = this.chooseParams.area || ''
  },
  methods: {
    async loadList() {
      this.loading = true
      const query = { ...this.query }
      query.code = this.chooseParams.code
      query.type = '2'
      query.cinemaType = this.cinemaType
      const res = await this.apiObj.listApi(this.assignQuery(query))
      this.initialTableData(res.data, res.count)
      this.loading = false
    },
    queryChange(msg) {
      this.query = { ...msg.query }
      this.area = msg.area
    },
    onOperateClick(type, row) {
      switch (type) {
        case 'query':
          this.$refs.queryForm.querySubmit()
          this.onSearch()
          break
      }
    },
    closePanel() {
      this.$emit('cancel')
    },
    async onSubmitClick() {
      const cinemaIds = this.chooseParams.cinemaId ? this.chooseParams.cinemaId.split(',') : [].concat(this.getSelectionIds())
      const chooseInfo = {
        cinemaId: +this.cinemaType === 2 ? cinemaIds.join(',') : '',
        cinemaList: +this.cinemaType === 2 ? this.getTableSelection() : [],
        searchParam: +this.cinemaType === 1 ? this.query : {},
        area: this.area, // 地区展示，用于所有影院时做回填
        cinemaType: this.cinemaType, // 操作范围 1全部 2指定
        isChoosed: true
      }
      // 添加影院时，如果用户选择所有影院，则直接传出chooseInfo，外部已选列表使用code,cinemaType和searchParam直接调取
      // 如果用户选择指定影院，则调用接口，将对应的参数传入
      // 添加影院
      if (+this.cinemaType === 2) {
        if (chooseInfo.cinemaId) {
          await this.apiObj.operaApi({
            code: this.chooseParams.code,
            isAdd: 1,
            cinemaType: this.cinemaType,
            // searchParam: JSON.stDringify(chooseInfo.searchParam) !== '{}' ? JSON.stringify(chooseInfo.searchParam) : '',
            cinemaIds: this.getSelectionIds().join(','),
            type: this.cinemaType // 1 覆盖操作 2添加操作
          })
          this.$emit('saveChoose', chooseInfo)
          this.$emit('cancel')
        } else {
          this.$message.error('请选择影院')
        }
      } else {
        this.$emit('saveChoose', chooseInfo)
        this.$emit('cancel')
      }
    }
  }
}
</script>

<style lang="scss">
.transfer-item {
  width: 500px;
}
</style>
