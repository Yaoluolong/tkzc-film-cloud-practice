<template>
  <div class="app-container">
    <el-form inline label-width="80px" :model="params" :rules="rules" ref="form">
      <el-form-item label-width="120px" label="影院分组名称" prop="name">
        <el-input v-model.trim="params.name" placeholder="请输入影院分组名称,最多10个字" class="w420"></el-input>
      </el-form-item>
      <div class="choose-box">
        <div v-if="chooseParams.id">
          <query-form ref="queryForm" @change="queryChange" :areaStr="area" :queryParmas="query"></query-form>
        </div>
        <el-form-item prop="cinemaList">
          <div v-if="chooseParams.id" class="vm mr20">
            <el-button type="primary" icon="el-icon-search" @click="onOperateClick('query')">查询</el-button>
            <!-- <el-button
              type="primary"
              icon="el-icon-plus"
              @click="onOperateClick('delQueryCinema')"
            >全部选择</el-button>-->
          </div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="onOperateClick('addCinema')"
          >{{+chooseParams.cinemaType===1&&chooseParams.isChoosed?'修改影院':'添加影院'}}</el-button>
          <el-button
            v-if="+chooseParams.cinemaType===2"
            type="danger"
            icon="el-icon-plus"
            @click="onOperateClick('delCinema')"
            :disabled="disDelBtn"
          >删除影院</el-button>
        </el-form-item>
        <zm-table
          ref="multipleTable"
          :columns="columns"
          :fetch="loadList"
          :table-params="tableParams"
          @select="chooseSelect"
          :options="{mutilpleSelect:+chooseParams.cinemaType===2,loading:loading}"
        ></zm-table>
      </div>
      <choose-cinema
        v-model="cinemaVisible"
        v-if="cinemaVisible"
        @cancel="closePanel"
        :choose-params="chooseParams"
        @saveChoose="saveChoose"
      />
      <el-form-item class="tc mt20">
        <el-button type="primary" @click="save" v-if="!look">保存</el-button>
        <el-button @click="colsePage">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import uuid from 'uuid'
import zmTable from '@/components/isNeedComponents/zmTable'
import tableMixin from '@/mixins/zmTableMixin'
import chooseCinema from '@/components/isNeedComponents/chooseCinema'
import queryForm from '@/components/isNeedComponents/addCinemaQuery'
import { cinemaGroupDetailColumns } from './const'
import {
  createCinemaGroup,
  newUpdateCinema,
  getCinemaGroupInfo,
  getCinemaGroupList,
  saveCinemaAdd,
  updateCinemaAdd
} from '@/api/mallCenter'
export default {
  name: 'create_cinema_group',
  components: { zmTable, chooseCinema, queryForm },
  mixins: [tableMixin],
  computed: {
    columns() {
      return cinemaGroupDetailColumns(this)
    }
  },
  data() {
    const cinemaListValid = (rule, value, callback) => {
      if (
        this.chooseParams.cinemaId && this.chooseParams.cinemaId.length
      ) {
        callback()
      } else {
        callback(new Error('请添加影院'))
      }
    }
    return {
      disDelBtn: true,
      loading: false, // 表格loading
      isStartInfo: true, // 首次加载info
      cinemaVisible: false, // 添加影院窗口开关
      cinemaNum: '', // 已添加的影城数量
      area: '', // 选择所有时展示添加影院时选择的地区
      chooseParams: { // 这里开始想弄只传给组件的参数，后面发现参数params里面都有，再优化吧
        // 影院选择参数
        id: '',
        cinemaId: '', // 指定时存放最终选择的选项
        cinemaList: [],
        code: '',
        searchParam: {}, // 内部选择的查询项
        cinemaType: '2' // 添加影院类型，1全部2指定
      },
      query: {
        code: '',
        cinemaThirdNo: '', // 编码+名称
        interfaceId: '',
        provinceId: '',
        cityId: ''
      },
      params: {
        cinemaList: [], // 已选的影院列表-新建用
        name: '',
        interfaceTypeId: '',
        cinemaId: '',
        cinemaType: '2'
      },
      rules: {
        name: {
          required: true,
          max: 10,
          message: '请输入影院分组名称,最多10个字',
          trigger: 'blur'
        },
        cinemaList: { validator: cinemaListValid, trigger: 'change' }
      }
    }
  },
  // created() {
  //   this.getInfo()
  // },
  methods: {
    async getInfo() {
      const _this = this
      return new Promise(async(resolve, reject) => {
        const id = _this.$route.query.id || ''
        // 获取code值
        const code = uuid().split('-')
        _this.chooseParams.code =
          code[code.length - 1] + '' + code[code.length - 2]
        _this.chooseParams.id = id
        _this.params = id ? await getCinemaGroupInfo({ id: id }) : _this.params
        _this.chooseParams = Object.assign({}, _this.chooseParams, _this.params)
        // _this.chooseParams.cinemaType = _this.params.cinemaType
        // _this.chooseParams.cinemaId = _this.params.cinemaId
        // _this.chooseParams.cinemaList = _this.params.cinemaList
        // _this.chooseParams.searchParam = _this.params.searchParam
        // _this.chooseParams.area =
        // 编辑时调用此接口和可选列表做匹配，可选列表可筛选掉分组中记录的影院
        _this.loading = true
        if (id) await saveCinemaAdd({ code: _this.chooseParams.code, id: id })
        _this.isStartInfo = false
        resolve()
      })
    },
    async loadList() {
      if (this.isStartInfo) await this.getInfo()
      this.loading = true
      this.query.code = this.chooseParams.code
      this.query.type = '1'
      this.query.cinemaType = this.chooseParams.cinemaType
      // 判断编辑时直接读取接口，新建时判断是否添加过，添加过则读取接口
      const res = this.$route.query.id
        ? await getCinemaGroupList(this.assignQuery(this.query))
        : this.chooseParams.isChoosed
          ? await getCinemaGroupList(this.assignQuery(this.query))
          : { data: [], count: 0 }
      // 添加影院时选择所有影院的情况下，判断下接口是否有返回影院，表单验证用
      if (+this.query.cinemaType === 1 && this.chooseParams.isChoosed) {
        this.chooseParams.cinemaId = res.data.join(',')
        // this.$refs.form.validateField('cinemaList')
      }
      this.initialTableData(res.data, res.count)
      this.cinemaNum = res.count
      this.loading = false
    },
    queryChange(msg) {
      this.query = { ...msg.query }
      this.area = msg.area
    },
    onOperateClick(type, row) {
      switch (type) {
        case 'query':
          this.$refs.queryFrom.querySubmit()
          this.onSearch()
          break
        case 'addCinema':
          this.cinemaVisible = true
          break
        case 'del' :
          this.operCinema(type, row)
          break
        case 'delCinema' :
          this.operCinema(type, row)
          break
      }
    },
    // 实时操作表格多选框
    chooseSelect(msg, msg2) {
      this.disDelBtn = !msg.length
    },
    closePanel() {
      this.cinemaVisible = false
    },
    // 影院操作
    async operCinema(type, row) {
      // 删除单个 del  删除多个 delCinema 按查询条件删除delQueryCinema
      const ids =
        type === 'delCinema'
          ? this.getSelectionIds().join(',')
          : type === 'del'
            ? row.id
            : ''
      await updateCinemaAdd({
        code: this.chooseParams.code,
        isAdd: '0',
        cinemaType: this.chooseParams.cinemaType,
        // searchParam:+this.chooseParams.cinemaType===1?JSON.stringify(searchParam):'',
        cinemaIds: +this.chooseParams.cinemaType === 2 ? ids : '',
        type: this.chooseParams.cinemaType
      })
      // 删除后要删掉chooseParams上的对应值
      // 操作值转数组.再删除对应id，然后在把剩余的数组转为字符串
      const realDelCinemaIds = ids.split(',')
      const realCinemaIds = this.chooseParams.cinemaId.split(',')
      realDelCinemaIds.forEach(item => {
        const index = realCinemaIds.findIndex(e => item === e)
        if (index !== -1) realCinemaIds.splice(index, 1)
      })
      this.chooseParams.cinemaId = realCinemaIds.join(',')
      // 操作后清除已选，刷新列表
      this.clearSelection()
      this.disDelBtn = false
      this.loadList()
    },
    // 筛选id
    getCinemaIds(cinemaList) {
      const ids = []
      cinemaList &&
        cinemaList.forEach(item => {
          ids.push(item.cinemaId)
        })
      return ids
    },
    // 添加影院回调
    saveChoose(chooseInfo) {
      this.chooseParams = Object.assign({}, this.chooseParams, chooseInfo)
      // 所有影院的情况下把组件内部的查询条件赋给外部
      if (+chooseInfo.cinemaType === 1) {
        this.query = Object.assign({}, this.query, chooseInfo.searchParam)
      }
      this.onSearch()
    },
    // 全屏加载
    fullLoading(loading, text) {
      const fullLoading = this.$loading({
        lock: true,
        fullscreen: true,
        text: text || '加载中！',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.4)'
      })
      if (loading === false) {
        setTimeout(() => {
          fullLoading.close(!loading)
        }, 100)
      }
    },
    // 页面取消时，要调用操作接口删除改code值下的临时操作记录
    async colsePage() {
      this.fullLoading(true)
      await updateCinemaAdd({
        code: this.chooseParams.code,
        isAdd: '0',
        cinemaType: this.chooseParams.cinemaType,
        // searchParam:+this.chooseParams.cinemaType===1?JSON.stringify(searchParam):'',
        status: 2,
        type: this.chooseParams.cinemaType
      })
      this.fullLoading(false)
      this.closeTab()
    },
    async save() {
      const valid = await this.$refs.form.validate()
      if (!valid) return
      // const params = Object.assign({}, this.params);
      // params.cinemaId = params.cinemaList.map(e => e.value).join(",");
      // params.interfaceTypeId = this.query.interfaceId;
      const params = {
        name: this.params.name,
        code: this.chooseParams.code,
        id: this.chooseParams.id || '',
        searchParam:
          +this.chooseParams.cinemaType === 1 &&
          JSON.stringify(this.chooseParams.searchParam) !== '{}'
            ? JSON.stringify(this.chooseParams.searchParam)
            : '',
        interfaceTypeId: this.chooseParams.searchParam.interfaceId || '-1',
        cinemaNum: this.cinemaNum,
        cinemaId: +this.chooseParams.cinemaType === 2 ? this.chooseParams.cinemaId : '-1'
      }
      if (!this.chooseParams.id) delete params.id
      await (this.chooseParams.id
        ? newUpdateCinema(params)
        : createCinemaGroup(params))
      this.$message.success('保存成功')
      this.closeTab(true)
      this.$router.push('/mall_center/cinema_mgr/cinema_group')
    }
  }
}
</script>

<style scoped lang="scss">
.sub-menu {
  margin: 10px;
}
.choose-box {
  padding: 15px;
  background-color: #e9eef3;
}
</style>
