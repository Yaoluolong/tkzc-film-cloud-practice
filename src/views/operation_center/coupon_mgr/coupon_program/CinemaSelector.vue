<template>
  <div class="cinemaContent">
    <div class="cinemaTitle">选择影院</div>
    <div class="cinemaContentainer">
      <el-form inline :model="query" ref="form" v-show="selectType === '2'" class="cinemaCont">
        <el-form-item label="省/自治区/直辖市">
          <city-cascader
            ref="city"
            v-model.trim="query.area"
            :rang="1"
            :clearable="true"
            placeholder="请选择"
            style="width:170px;"
          ></city-cascader>
        </el-form-item>
        <el-form-item label="票务系统商">
          <remote-select
            v-model="query.interfaceTypeId"
            clearable
            placeholder="请选择票务系统商"
            action="/systemApi/interfaceType/getList"
            style="width:200px;"
          ></remote-select>
        </el-form-item>
        <div style="margin-top:10px">
          <el-form-item>
            <el-input
              clearable
              style="width:300px"
              v-model.trim="query.cinemaName"
              placeholder="请输入影院名称"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left:60px">
            <el-button type="primary" @click="clearCinemaListAndFetchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>

      <el-radio-group v-model="selectType">
        <el-radio :label="'1'">所有影院</el-radio>
        <el-radio :label="'2'">指定影院</el-radio>
      </el-radio-group>
      <div class="checkbox-plane" v-show="selectType === '2'">
        <div class="header">
          <el-checkbox v-model="selectAll" @change="doSelectAll">全选</el-checkbox>
        </div>
        <div class="content" id="content" @scroll="onScroll">
          <div
            class="check-item"
            v-for="cinema in cinemaList"
            v-if="cinema.show"
            :key="cinema.value+new Date().getTime()"
          >
            <el-checkbox
              @change="doChangeFun(cinema)"
              v-model="cinema.checked"
            >{{cinema.name}}----{{cinema.cinemaCode}}</el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCinemaListForPage, getCinemaList } from '@/api/systemSetting'
import CityCascader from '@/components/CityCascader'
import { mergeArray } from '@/utils'
import { realDeepClone } from '@/utils'
export default {
  components: { CityCascader },
  props: {
    delFun: {
      // 点标签上的删除按钮时进行的操作
      type: Function,
      default: function(cinema, index) {
        this.handleClose(index)
      }
    },
    changeFun: {
      // 点标签上的删除按钮时进行的操作
      type: Function
    },
    selectTypeCallBack: Function, // 改变selectTypebak时要做的回调
    value: Array,
    form: Object,
    outNeedInterfaceTypeId: {
      // 是否需要传入票务系统商
      type: Boolean,
      default: false
    },
    outNeedChannelId: {
      // 是否需要传入渠道商(商家)
      type: Boolean,
      default: false
    },
    outChannelId: String, // 渠道商ID
    outInterfaceTypeId: String // 票务系统商ID,
  },
  data() {
    return {
      selectAll: false,
      selectType: '2', // 1 选择全部影院  2 指定影院
      selectTypeBak: '2',
      query: {
        area: [],
        page: 0
      },
      totalPage: '',
      cinemaList: [],
      selectedCinemaList: [],
      delSelect: {},

      needChannelId: this.outNeedChannelId,
      channelId: this.outChannelId
    }
  },
  computed: {},
  watch: {
    selectTypeBak(val) {
      if (this.selectTypeCallBack) {
        this.selectTypeCallBack(val)
      }
    },
    selectType(val) {
      this.clearCinemaListAndFetchData()
    },
    outChannelId(val) {
      if (val !== this.channelId && this.channelId) {
        this.selectedCinemaList = []
      }
      this.channelId = val
      if (val) {
        this.clearCinemaListAndFetchData()
      } else {
        this.clearCinemaList()
        this.clearQueryPage()
      }
    },
    selectedCinemaList(val) {
      this.$emit('input', val)
    },
    value(val) {
      if (val && val.length > 0) {
        if (this.selectedCinemaList !== val) {
          this.selectedCinemaList = val
        }
      }
    }
  },
  methods: {
    onScroll(event) {
      const element = document.getElementById('content')
      if (element.scrollTop + element.clientHeight === element.scrollHeight) {
        if (this.query.page < this.totalPage) {
          this.fetchData()
        }
      }
    },
    doChangeFun(cinema) {
      if (this.changeFun) {
        const _this = this
        const callBack = () => {
          _this.$forceUpdate()
        }
        this.changeFun(cinema, callBack)
      }
      this.$forceUpdate()
      this.save()
    },
    clearQueryPage() {
      this.query.page = 0
    },
    async save() {
      this.selectTypeBak = this.selectType
      let temp = []
      if (this.selectType === '2' && !this.selectAll) {
        temp = this.cinemaList.filter(e => {
          return e.checked
        })
        this.selectedCinemaList = temp
      } else {
        const request = realDeepClone(this.query)
        delete request.area
        delete request.page
        temp = await getCinemaList(request)

        this.selectedCinemaList = mergeArray(this.selectedCinemaList, temp)
        console.log(this.selectedCinemaList, 'ssss')
      }
    },
    handleClose(index) {
      this.delSelect = this.selectedCinemaList[index]
      this.selectedCinemaList.splice(index, 1)
    },
    doSelectAll(val) {
      this.cinemaList.forEach(e => {
        this.$set(e, 'checked', val)
      })
    },
    clearCinemaListAndFetchData() {
      this.clearCinemaList()
      this.clearQueryPage()
      this.fetchData()
    },
    clearCinemaList() {
      this.cinemaList = []
    },
    async fetchData() {
      this.query.channelId = this.channelId

      this.query.page++
      if (this.query.area[1]) {
        this.query.cityId = this.query.area[1]
      } else {
        this.query.cityId = ''
      }
      const temp = realDeepClone(this.query)
      delete temp.area
      const result = await getCinemaListForPage(temp)

      this.totalPage = result.count
      this.cinemaList = [...this.cinemaList, ...result.list]
      // 再次点开恢复选中状态
      if (this.selectType === '1') {
        this.cinemaList.forEach(e => {
          this.$set(e, 'checked', true)
        })
        this.selectedCinemaList = this.cinemaList
      } else {
        this.cinemaList.forEach(e => {
          e.show = true
          this.selectedCinemaList.forEach(el => {
            if (e.value === el.value) {
              e.checked = true
            }
          })
        })
      }
    }
  },
  mounted() {
    if (this.channelId) {
      this.clearCinemaListAndFetchData()
    }
  },
  created() {
    if (this.value) {
      if (this.selectedCinemaList !== this.value) {
        this.selectedCinemaList = this.value
      }
    }
  }
}
</script>

<style scoped lang="scss">
.cinemaContent {
  border: 1px solid #dcdfe6;
  .cinemaTitle {
    padding-left: 20px;
    border-bottom: 1px solid #dcdfe6;
    background-color: #f2f6fc;
  }
  .cinemaContentainer {
    padding: 0px 20px 20px 20px;
    .cinemaCont {
      padding-top: 20px;
    }
  }

  .checkbox-plane {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 20px;
  }
  .header {
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #f2f6fc;
    padding: 0 20px;
    border-bottom: 1px solid #dcdfe6;
  }
  .content {
    padding: 0 20px;
    max-height: 300px;
    overflow-y: auto;
    .check-item {
      margin: 10px 0px;
    }
  }
  .tag-plane {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .selected-item {
      margin: 10px;
    }
  }
  .cinema-name {
    display: inline-block;
    width: 250px;
  }
  .cinema-rule {
    display: inline-block;
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
