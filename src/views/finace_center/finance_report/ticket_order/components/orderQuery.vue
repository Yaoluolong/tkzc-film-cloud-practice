<template>
  <el-dialog
    title="订单查询"
    :visible="value"
    width="60%"
    @close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form :model="query" inline label-width="110px" label-position="left">
      <el-form-item
        v-for="(item,index) in formList"
        :key="index"
        :label="item.name"
        class="wp30 mr15"
      >
        <el-input
          type="text"
          v-model="query[item.value]"
          clearable
          :placeholder="`请输入${item.name}`"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer tr">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDictList } from '@/api/financeCenter'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    orderQueryParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      formList: [],
      query: {}
    }
  },
  watch: {
    orderQueryParams: {
      handler() {
        this.query = this.orderQueryParams
      },
      deep: true
    }
  },
  created() {
    // this.query = Object.assign({}, this.query, this.orderQueryParams)
    this.getForm()
  },
  methods: {
    async getForm() {
      this.formList =
        this.formList && this.formList.length
          ? this.formList
          : await getDictList({ type: 'orderFilmSearchType' })
    },
    closeDialog() {
      this.$emit('cancel')
    },
    submit() {
      this.$emit('after-save', this.query)
    }
  }
}
</script>
