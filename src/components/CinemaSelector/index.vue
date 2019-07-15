<template>
  <div>
    <el-button type="primary" @click="show">选择影院</el-button>
    <!-- 选择指定影院并且至少已经选择一个影院后显示 -->
    <div id="tag-div" class="tag-plane" v-show="selectedCinemaList&&selectedCinemaList.length>0&&selectTypeBak !== '1'" style="max-height:500px;overflow-y: auto;">
      <el-tag type="danger" @close="delFun(cinema,index)" class="selected-item" v-for="(cinema,index) in selectedCinemaList" closable :key="index">{{cinema.name}}</el-tag>
    </div>
    <!-- 选择所有影院时显示 -->
    <div class="tag-plane" v-if="selectTypeBak === '1'">
      所有影院
    </div>
    <el-dialog title="选择影院"  :visible.sync="dialogVisible" width="600px" @close="resetFields('form')">
        <el-form style="margin-top:-5%" inline :model="query"  ref="form" v-show="selectType === '2'">     
          <el-form-item label="省/自治区/直辖市" >
              <city-cascader ref="city" v-model.trim="query.area" :rang="1" :clearable="true" placeholder="请选择" style="width:170px;"></city-cascader>
          </el-form-item>  
          <div style="margin-top:10px">
            <el-form-item >
                <el-input style="width:300px" v-model.trim="query.cinemaName" placeholder="请输入影院名称"></el-input>
            </el-form-item>
            <el-form-item style="margin-left:60px">
                <el-button type="primary" @click="clearCinemaListAndFetchData" >搜索</el-button>
            </el-form-item>
          </div>              
        </el-form>
        
        <el-radio-group v-model="selectType" >
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
            <div class="check-item" v-for="cinema in cinemaList" v-if="cinema.show" :key="cinema.value+new Date().getTime()">             
                <el-checkbox @change="doChangeFun(cinema)" v-model="cinema.checked">{{cinema.name}}----{{cinema.cinemaCode}}</el-checkbox>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save" >确 定</el-button>
            <el-button @click="hide" >取 消</el-button>
        </span>
    </el-dialog>
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
      delFun: { // 点标签上的删除按钮时进行的操作
        type: Function,
        default: function(cinema, index) {
          this.handleClose(index)
        }
      },
      changeFun: { // 点标签上的删除按钮时进行的操作
        type: Function
      },
      selectTypeCallBack: Function, // 改变selectTypebak时要做的回调
      value: Array,
      form: Object,
      outNeedInterfaceTypeId: { // 是否需要传入票务系统商
        type: Boolean,
        default: false
      },
      outNeedChannelId: { // 是否需要传入渠道商(商家)
        type: Boolean,
        default: false
      },
      outNeedPolicy: { // 是否需要传策略
        type: Boolean,
        default: false
      },
      outNeedGroupId: { // 是否需要传groupId
        type: Boolean,
        default: false
      },
      outGroupId: String, // groupId
      outPolicy: Object, // 开关对象
      outChannelId: String, // 渠道商ID
      outInterfaceTypeId: String, // 票务系统商ID,
      outExcludeCinemaList: Array // 需要排除的影院
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
        dialogVisible: false,
        selectedCinemaList: [],
        delSelect: {},
        needInterfaceTypeId: this.outNeedInterfaceTypeId,
        interfaceTypeId: this.outInterfaceTypeId,
        needChannelId: this.outNeedChannelId,
        channelId: this.outChannelId,
        needPolicy: this.outNeedPolicy,
        policy: this.outPolicy,
        needGroupId: this.outNeedGroupId,
        groupId: this.outGroupId,
        excludeCinemaList: this.outExcludeCinemaList
      }
    },
    computed: {
    },
    watch: {
      selectTypeBak(val) {
        if (this.selectTypeCallBack) {
          this.selectTypeCallBack(val)
        }
      },
      outExcludeCinemaList(val) {
        if (this.excludeCinemaList !== val) {
          this.excludeCinemaList = val
        }
      },
      outInterfaceTypeId(val) {
        if (val !== this.interfaceTypeId) {
          this.interfaceTypeId = val
        }
      },
      interfaceTypeId(newVal, oldVal) { // 重新选择系统商后需要做的事情
        if (oldVal) {
          this.selectedCinemaList = []
          this.selectType = '2'
          this.selectTypeBak = '2'
        }
      },
      outChannelId(val) {
        if (val !== this.channelId && this.channelId) {
          this.selectedCinemaList = []
        }
        this.channelId = val
      },
      outGroupId(val) {
        if (val !== this.groupId && this.groupId) {
          this.selectedCinemaList = []
        }
        this.groupId = val
      },
      'outPolicy.priceRight'(val, oldVal) {
        if (oldVal && val !== oldVal) {
          this.selectedCinemaList = []
        }
        // this.policy.priceRight = val
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
      },
      show() {
        if (this.needInterfaceTypeId) {
          if (!this.interfaceTypeId) {
            this.$message.warning('请先选择票务系统商')
            return
          }
        }
        if (this.needChannelId) {
          if (!this.channelId) {
            this.$message.warning('请先选择执行商家')
            return
          }
        }
        if (this.needPolicy) {
          if (!this.policy || !this.policy.priceRight) {
            this.$message.warning('请先选择定价类型')
            return
          }
        }
        if (this.needGroupId) {
          if (!this.groupId) {
            this.$message.warning('请选择归属影院策略组')
            return
          }
        }
        this.dialogVisible = true
        this.clearCinemaListAndFetchData()
      },
      clearQueryPage() {
        this.query.page = 0
      },
      hide() {
        this.dialogVisible = false
        if (this.selectTypeBak) {
          this.selectType = this.selectTypeBak
        }
        // this.clearQueryPage()
      },
      async save() {
        this.selectTypeBak = this.selectType
        let temp = []
        if (this.selectType === '2' && !this.selectAll) {
          temp = this.cinemaList.filter((e) => {
            return e.checked
          })
          this.selectedCinemaList = temp
        } else {
          const request = realDeepClone(this.query)
          delete request.area
          delete request.page
          temp = await getCinemaList(request)

          this.selectedCinemaList = mergeArray(this.selectedCinemaList, temp)
        }
        // this.clearQueryPage()
        this.dialogVisible = false
      },
      handleClose(index) {
        this.delSelect = this.selectedCinemaList[index]
        this.selectedCinemaList.splice(index, 1)
      },
      doSelectAll(val) {
        this.selectedCinemaList = this.selectedCinemaList.filter(e => e.value !== '-1')
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
        // this.query = {}
        this.query.interfaceTypeId = this.interfaceTypeId
        this.query.channelId = this.channelId
        if (this.policy) {
          this.query.priceRight = this.policy.priceRight
        }
        if (this.groupId) {
          this.query.groupId = this.groupId
        }
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
        this.cinemaList = [...(this.cinemaList), ...(result.list)]
        // 再次点开恢复选中状态
        this.cinemaList.forEach(e => {
          e.show = true
          this.selectedCinemaList.forEach(el => {
            if (e.value === el.value) {
              e.checked = true
            }
          })
        })
        // 如果有需要被排除的影院则排除
        if (this.excludeCinemaList && this.excludeCinemaList.length > 0) {
          this.cinemaList.forEach(e => {
            const temp = this.excludeCinemaList.find(val => {
              return e.value === val.value
            })
            if (temp) {
              e.show = false
            } else {
              e.show = true
            }
          })
        }
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
  overflow-y: auto;
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
</style>
