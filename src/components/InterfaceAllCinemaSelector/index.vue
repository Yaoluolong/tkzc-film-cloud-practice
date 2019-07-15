<template>
  <div class="cinemaContent">
    <div class="cinemaTitle">选择影院</div>
    <div class="cinemaContentainer">
      <el-form inline :model="query"  ref="form" v-show="selectType === '2'" class="cinemaCont">     
        <el-form-item class="cityProp">
            <span style="font-weight:bold;margin-right:10px;">省/自治区/直辖市</span>
            <city-cascader v-model.trim="query.area" :rang="1" :clearable="true" placeholder="请选择" style="width:170px;"></city-cascader>
        </el-form-item>
        <div style="display:inline-block;">
          <el-form-item >
              <el-input style="width:300px" v-model.trim="query.cinemaName" placeholder="请输入影院名称"></el-input>
          </el-form-item>
          <el-form-item style="margin-left:60px">
              <el-button type="primary" @click="clearCinemaListAndFetchData(query.interfaceTypeId,query.cinemaName)" >搜索</el-button>
          </el-form-item>
        </div>              
      </el-form>
      <el-radio-group v-model="selectType" @change="selectTypeChange">
        <el-radio :label="'1'">
          所有影院
        </el-radio>  
        <el-radio :label="'2'">
          指定影院
        </el-radio>
      </el-radio-group>  
      <div class="checkbox-plane" v-show="selectType === '2'">
        <div class="header">
          <el-checkbox v-model="selectAll" @change="doSelectAll">全选</el-checkbox>
        </div>
        <div class="content" id="content" @scroll="onScroll">
          <div class="check-item" v-for="cinema in cinemaList" :key="cinema.value+new Date().getTime()+Math.random()">             
              <el-checkbox @change="doChangeFun(cinema)" v-show="cinema.show" v-model="cinema.checked">{{cinema.name}}----{{cinema.cinemaCode}}</el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getListForCinemaPage, getCinemaList } from '@/api/systemSetting'
  import CityCascader from '@/components/CityCascader'
  import { mergeArray } from '@/utils'// mergeArray, mergeDiffArray, intersectArray
  import { realDeepClone } from '@/utils'
  export default {
    components: { CityCascader },
    props: {
      changeFun: { // 点标签上的删除按钮时进行的操作
        type: Function
      },
      value: Array,
      form: Object,
      outNeedInterfaceTypeId: { // 是否需要传入票务系统商
        type: Boolean,
        default: false
      },
      outInterfaceTypeId: String, // 票务系统商ID,
      excludeData: Array, // 排除数据
      outSelectType: String
    },
    data() {
      return {
        selectAll: false,
        selectAllList: [],
        unShowAllList: [],
        selectType: '1', // 1 选择全部影院  2 指定影院
        selectTypeBak: '2',
        query: {
          area: [],
          interfaceTypeId: '',
          getType: '1',
          page: 0
        },
        totalPage: '1',
        cinemaList: [],
        selectedCinemaList: [],
        delSelect: {},
        needInterfaceTypeId: this.outNeedInterfaceTypeId,
        interfaceTypeId: this.outInterfaceTypeId,
        cinemaId: '',
        doCount: true
      }
    },
    computed: {
    },
    watch: {
      // selectTypeBak(val) {
      //   if (this.selectTypeCallBack) {
      //     this.selectTypeCallBack(val)
      //   }
      // },
      /* async outInterfaceTypeId(val, oldval) {
        console.log(val, oldval)
        if (val !== oldval) {
          this.query.interfaceTypeId = val
          this.interfaceTypeId = val
          let temp = []
          const request = realDeepClone(this.query)
          delete request.area
          delete request.page
          temp = await getCinemaList(request)

          this.selectAllList = temp.map(e => {
            return { 'name': e.name, 'value': e.value, 'cinemaCode': e.cinemaCode, 'checked': true }
          })
          // this.clearCinemaListAndFetchData(val)
        }
      },*/

      /* selectType(val) {
        // this.$forceUpdate()
        if (val === '1') {
          // this.selectedCinemaList = this.selectAllList
          this.selectedCinemaList = [{ 'name': '', 'value': '-1', 'cinemaCode': '', 'checked': true }]
          // this.cinemaList.map(e => { this.$set(e, 'checked', true) })
        } else {
          this.clearCinemaListAndFetchData(this.query.interfaceTypeId)
        }

        this.$emit('cinemaTypeChange', val)
      },*/
      selectedCinemaList(val) {
        this.$emit('input', val)
      },
      value(val) {
        if (val && val.length > 0) {
          if (this.selectedCinemaList !== val) {
            this.selectedCinemaList = val
            this.selectedCinemaList.map(e => { this.$set(e, 'checked', true) })
            this.query.cinemaId = this.selectedCinemaList.map(e => e.value).join(',')
          }
        }
      }
    },
    methods: {
      selectTypeChange(val) {
        if (val === '1') {
          this.selectedCinemaList = [{ 'name': '', 'value': '-1', 'cinemaCode': '', 'checked': true }]
        } else {
          this.clearCinemaListAndFetchData(this.query.interfaceTypeId, '')
        }

        this.$emit('cinemaTypeChange', val)
      },
      async InterfaceTypeIdChange(val) {
        this.query.interfaceTypeId = val
        this.interfaceTypeId = val
        let temp = []
        const request = realDeepClone(this.query)
        delete request.area
        delete request.page
        temp = await getCinemaList(request)

        this.selectAllList = temp.map(e => {
          return { 'name': e.name, 'value': e.value, 'cinemaCode': e.cinemaCode }
        })
        this.clearCinemaListAndFetchData(val, '')
      },
      onScroll(event) {
        const element = document.getElementById('content')
        if (element.scrollTop + element.clientHeight === element.scrollHeight) {
          if (this.query.page < this.totalPage) {
            this.fetchData(this.interfaceTypeId, this.query.cinemaName)
          } else if (this.query.page === this.totalPage && this.query.getType === '2') {
            this.$set(this.query, 'getType', '3')
            this.query.page = 0
            this.totalPage = 1
            this.fetchData(this.interfaceTypeId, this.query.cinemaName)
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
        this.save()
      },
      clearQueryPage() {
        this.query.page = 0
      },
      async save() {
        if (this.selectType === '2' && !this.selectAll) {
          const temp = []
          this.cinemaList.map((e) => {
            if (e.checked) {
              temp.push(e)
            }
          })
          this.selectedCinemaList = temp
          // this.selectedCinemaList = mergeArray(this.selectedCinemaList, temp)
          // this.selectedCinemaList = this.selectAllList !== temp ? intersectArray(this.selectAllList, temp) : ''
        }
        /* else if (this.selectType === '2' && this.selectAll) {
          let temp = []
          const request = realDeepClone(this.query)
          delete request.area
          delete request.page
          temp = await getCinemaList(request)
          this.selectedCinemaList = temp.map(e => {
            return { 'name': e.name, 'value': e.value, 'cinemaCode': e.cinemaCode, 'checked': true }
          })
        }*/
      },
      async doSelectAll(val) {
        this.selectedCinemaList = []
        this.cinemaList.forEach(e => {
          if (e.show) {
            this.$set(e, 'checked', val)
          } else {
            this.$set(e, 'checked', !val)
          }
        })
        if (val) {
          let temp = []
          const request = realDeepClone(this.query)
          delete request.area
          delete request.page
          delete request.cinemaId
          delete request.getType
          temp = await getCinemaList(request)

          this.selectAllList = temp.map(e => {
            return { 'name': e.name, 'value': e.value, 'cinemaCode': e.cinemaCode, 'checked': true }
          })
          this.selectedCinemaList = this.selectAllList
          /* .filter(e => {
            return e.show
          })*/
        } else {
          this.selectedCinemaList = []
        }
        this.save()
      },
      clearCinemaListAndFetchData(interfaceTypeId, cinemaName) {
        this.clearCinemaList()
        this.clearQueryPage()
        this.fetchData(this.interfaceTypeId, cinemaName)
      },
      clearCinemaList() {
        this.cinemaList = []
      },
      async fetchData(interfaceTypeId, cinemaName) {
        this.query.interfaceTypeId = interfaceTypeId || this.interfaceTypeId
        this.query.cinemaName = cinemaName
        if (this.value && this.value.length > 0 && this.query.getType === '1') {
          this.$set(this.query, 'getType', '2')
          this.query.cinemaId = this.value.map(e => e.value).join(',')
        } else if (this.value && this.value.length > 0 && this.query.getType === '2' && this.query.page === this.totalPage) {
          this.$set(this.query, 'getType', '3')
          this.query.cinemaId = this.value.map(e => e.value).join(',')
        }

        this.query.page++
        delete this.query.cityId
        delete this.query.provinceId

        if (this.query.area && this.query.area.length === 2) {
          this.query.cityId = this.query.area[1]
        } else if (this.query.area && this.query.area.length === 1) {
          this.query.provinceId = this.query.area[0]
        } else {
          this.query.provinceId = ''
          this.query.cityId = ''
        }
        // this.$set(this.query, 'getType', '2')
        // this.$set(this.query, 'cinemaId', '9235,9236,9237,9238,9239,9240,9241')
  
        const temp = realDeepClone(this.query)
        delete temp.area
        const result = await getListForCinemaPage(temp)
        if (this.selectAll) {
          result.list.map(e => {
            this.$set(e, 'checked', true)
          })
        }
        if (this.selectAllList.length > 0 && this.selectAll) {
          result.list.forEach(e => {
            this.$set(e, 'checked', true)
          })
        }
        this.totalPage = result.count
  
        // this.cinemaList = [...(this.cinemaList), ...(result.list)]
        this.cinemaList = mergeArray(this.cinemaList, result.list)
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

        if (this.value && this.value.length > 0 && this.value.length <= 10 && this.doCount) {
          this.$set(this.query, 'getType', '3')
          this.query.cinemaId = this.value.map(e => e.value).join(',')
          this.query.page = 0
          this.totalPage = 1
          this.fetchData(this.interfaceTypeId, this.query.cinemaName)
          this.doCount = false
        }
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
  border: 1px solid #DCDFE6;
  .cinemaTitle{
    padding-left:20px;
    border-bottom: 1px solid #DCDFE6;
    background-color: #F2F6FC;
  }
  .cinemaContentainer{
    padding:0px 20px 20px 20px;
    .cinemaCont{
      padding-top:20px;
      .cityProp {
        .el-form-item__label:before{
          content:'';
          color:#000000;
        }
      }
    }
  }	

.checkbox-plane{
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 20px;
}
.header{
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #F2F6FC;
  padding: 0 20px;
  border-bottom:  1px solid #DCDFE6;
}
.content{
  padding: 0 20px;
  max-height: 300px;
  overflow-y: scroll;
  .check-item{
    margin: 10px 0px;
  }
}
.tag-plane{
   border: 1px solid #DCDFE6;
   border-radius: 4px;
   margin-top: 20px;
   display: flex;
   flex-wrap: wrap;
   padding: 10px;
   .selected-item{
     margin: 10px;
   }
}
.cinema-name{
  display: inline-block;
  width: 250px;
}
.cinema-rule {
  display: inline-block;
  width: 250px;
  overflow:hidden; 
  text-overflow:ellipsis; 
  white-space:nowrap;
}
}
</style>
