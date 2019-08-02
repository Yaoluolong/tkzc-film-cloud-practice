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
        <el-radio :label="'1'" :disabled="onlyOneAll">所有影院</el-radio>
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
            :key="cinema.value+new Date().getTime()"
          >
            <el-checkbox
              @change="doChangeFun(cinema)"
              v-show="cinema.show"
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
import { intersectArray } from '@/utils' // mergeArray, mergeDiffArray, intersectArray
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
    value: Array,
    form: Object,
    outNeedInterfaceTypeId: {
      // 是否需要传入票务系统商
      type: Boolean,
      default: false
    },
    outInterfaceTypeId: String, // 票务系统商ID,
    excludeData: Array, // 排除数据
    parantId: String
  },
  data() {
    return {
      selectAll: false,
      selectAllList: [],
      unShowAllList: [],
      selectType: '2', // 1 选择全部影院  2 指定影院
      selectTypeBak: '2',
      query: {
        area: [],
        interfaceTypeId: '',
        page: 0
      },
      innerExcludeData: this.excludeData,
      totalPage: '',
      cinemaList: [],
      selectedCinemaList: [],
      delSelect: {},
      needInterfaceTypeId: this.outNeedInterfaceTypeId,
      interfaceTypeId: this.outInterfaceTypeId,
      onlyOneAll: false
    }
  },
  computed: {},
  watch: {
    /* excludeData(val) {
        this.innerExcludeData = val
        this.innerExcludeData.forEach(e => {
          this.cinemaList.forEach(el => {
            if (e.value === el.value) {
              this.$set(el, 'show', false)
            }
          })
        })
      },*/
    selectTypeBak(val) {
      if (this.selectTypeCallBack) {
        this.selectTypeCallBack(val)
      }
    },
    async outInterfaceTypeId(val) {
      this.query.interfaceTypeId = val
      this.interfaceTypeId = val
      let temp = []
      this.$set(this.query, 'cityId', '')
      this.$set(this.query, 'provinceId', '')
      if (this.query.area.length === 2) {
        this.query.cityId = this.query.area[1]
      } else if (this.query.area.length === 1) {
        this.query.provinceId = this.query.area[0]
      }
      const request = realDeepClone(this.query)
      delete request.area
      delete request.page
      temp = await getCinemaList(request)

      this.selectAllList = temp.map(e => {
        return {
          name: e.name,
          value: e.value,
          cinemaCode: e.cinemaCode,
          checked: true
        }
      })
      this.clearCinemaListAndFetchData(val)
    },
    /* 'query.interfaceTypeId'(newVal, oldVal) { // 重新选择系统商后需要做的事情
        this.selectType = '2'
        this.selectTypeBak = '2'
        this.query.interfaceTypeId = newVal
      },*/
    selectType(val) {
      if (val === '1') {
        this.selectedCinemaList = this.selectAllList
        this.cinemaList.map(e => {
          this.$set(e, 'checked', true)
        })
      } else {
        this.selectedCinemaList = []
        this.cinemaList.map(e => {
          this.$set(e, 'checked', false)
        })
      }
    },
    selectedCinemaList(val) {
      this.$emit('input', val)
    },
    value(val) {
      if (val && val.length > 0) {
        if (this.selectedCinemaList !== val) {
          this.selectedCinemaList = val
          this.selectedCinemaList.map(e => {
            this.$set(e, 'checked', true)
          })
        }
      }
    }
  },
  methods: {
    onScroll(event) {
      const element = document.getElementById('content')
      if (element.scrollTop + element.clientHeight === element.scrollHeight) {
        if (this.query.page < this.totalPage) {
          this.fetchData(this.interfaceTypeId)
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
      } else {
        this.selectAll = false
      }
      this.$forceUpdate()
      this.save()
    },
    clearQueryPage() {
      this.query.page = 0
    },
    async save() {
      // console.log(this.cinemaList, 9999)
      // console.log(this.selectAllList, 2931)
      this.selectTypeBak = this.selectType

      if (this.selectType === '2' && !this.selectAll) {
        let temp = []
        temp = this.cinemaList.filter(e => {
          return e.checked
        })
        // console.log(temp, 666)
        // this.selectedCinemaList = mergeArray(this.selectAllList, temp)
        this.selectedCinemaList = intersectArray(this.selectAllList, temp)

        // console.log(this.selectedCinemaList, 'mmmm')
      } else if (this.selectType === '2' && this.selectAll) {
        this.selectedCinemaList = this.selectAllList
      }
      /* else {
          const request = realDeepClone(this.query)
          delete request.area
          delete request.page
          temp = await getCinemaList(request)

          this.selectedCinemaList = temp.map(e => {
            return e.checked
          })
        }*/
    },
    handleClose(index) {
      this.delSelect = this.selectedCinemaList[index]
      this.selectedCinemaList.splice(index, 1)
    },
    async doSelectAll(val) {
      this.cinemaList.forEach(e => {
        if (e.show) {
          this.$set(e, 'checked', val)
        } else {
          this.$set(e, 'checked', !val)
        }
      })
      if (val) {
        this.selectedCinemaList = this.selectAllList.filter(e => {
          return e.show
        })
      } else {
        this.selectAllList = []
        this.selectedCinemaList = []
      }
      // console.log(this.cinemaList)
      this.save()
    },
    clearCinemaListAndFetchData() {
      if (!this.interfaceTypeId) {
        this.$message.warning('请先选择票务系统商')
        return false
      }
      this.clearCinemaList()
      this.clearQueryPage()
      this.fetchData(this.interfaceTypeId)
    },
    clearCinemaList() {
      this.cinemaList = []
      // this.selectedCinemaList = []
    },
    getCinemaList() {
      return this.cinemaList
    },
    getSelectedCinemaList() {
      return this.selectedCinemaList
    },
    updateCinemaList(val) {
      if (val.length > 0) {
        val.forEach(e => {
          this.cinemaList.forEach(el => {
            if (e.checked && e.value === el.value) {
              this.$set(el, 'show', false)
            } else if (!e.checked && e.value === el.value) {
              this.$set(el, 'show', true)
            }
          })
        })
      } else {
        this.cinemaList.forEach(e => {
          this.$set(e, 'show', true)
        })
      }

      this.$forceUpdate()
    },
    async fetchData(interfaceTypeId) {
      // console.log(interfaceTypeId, this.interfaceTypeId)
      this.query.interfaceTypeId = interfaceTypeId || this.interfaceTypeId

      this.query.page++
      this.$set(this.query, 'cityId', '')
      this.$set(this.query, 'provinceId', '')
      if (this.query.area.length === 2) {
        this.query.cityId = this.query.area[1]
      } else if (this.query.area.length === 1) {
        this.query.provinceId = this.query.area[0]
      }

      const temp = realDeepClone(this.query)
      delete temp.area
      const result = await getCinemaListForPage(temp)
      if (this.selectAll) {
        result.list.map(e => {
          this.$set(e, 'checked', true)
        })
      }
      if (this.selectAllList.length > 0 && this.selectAll) {
        // console.log(result.list)
        // console.log(this.selectAllList)
        result.list.forEach(e => {
          this.$set(e, 'checked', true)
        })
      }
      this.totalPage = result.count
      this.cinemaList = [...this.cinemaList, ...result.list]
      /* if (this.selectAllList.length > this.cinemaList.length && this.selectAll) {
          this.cinemaList = this.selectAllList.filter(e => {
            return e.checked
          })
        }*/
      // 再次点开恢复选中状态
      if (this.selectType === '1') {
        this.cinemaList.forEach(e => {
          this.$set(e, 'checked', true)
        })
        this.selectedCinemaList = this.cinemaList
      } else {
        this.cinemaList.forEach(e => {
          e.show = true
        })
        this.cinemaList.forEach(e => {
          this.selectedCinemaList.map(el => {
            if (e.value === el.value) {
              this.$set(e, 'checked', true)
            }
          })
        })
      }

      this.excludeData.forEach(e => {
        this.cinemaList.forEach(el => {
          if (e.value === el.value) {
            this.$set(el, 'show', false)
          }
        })
      })
    }
  },
  async created() {
    if (this.value.length > 0) {
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
