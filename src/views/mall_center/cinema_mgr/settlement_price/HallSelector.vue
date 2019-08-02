<template>
  <div>
    <el-button type="primary" @click="showHalls">选择影厅</el-button>
        
    <div style="margin-top:2%"  v-if="selectType === '1' || (selectedCinemaHallList.length>0&&selectType==='2')">
      <el-card style="width:900px">
        <!-- 选择所有影厅时显示 -->
        <div  v-if="selectType === '1'" slot="header" class="clearfix">
          <span>所有{{hallTypeName}}</span> <br>
          <span v-for="(cinema , index) in cinemaHallData" :key="index">
            <span>{{cinema.cinemaName}}</span>
            <template v-if="index < cinemaHallData.length - 1">、</template>  
          </span>
        </div>
        <!-- 选择指定影厅并且至少已经选择一个影厅后显示 -->
        <div  v-if="selectedCinemaHallList.length>0&&selectType==='2'" slot="header" class="clearfix">
          <span>指定{{hallTypeName}}</span> <br>
          <span v-for="(cinema , index) in selectedCinemaHallList" :key="index">
            <span>{{cinema.cinemaName}}：</span>
            <span v-if="hall.checked" v-for="(hall , hallIndex) in cinema.hallList" :key="hall.id">{{hall.hallName}}
              <template v-if="hallIndex < cinema.hallList.length - 1">,</template> 
            </span>
            <template v-if="index < selectedCinemaHallList.length - 1">、</template>           
          </span>
        </div>
          <settlement-type-selector :pParams="pParams" ref="settlementTypeSelector"></settlement-type-selector> 
      </el-card>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="选择影厅"  :visible.sync="dialogVisible" width="600px" @close="resetFields('form')">
        <el-radio-group v-model="selectType" style="margin-top:-5%">
          <el-radio :label="'1'">
            所有影厅
          </el-radio>  
          <el-radio :label="'2'">
            指定影厅
          </el-radio>
        </el-radio-group>  
        <el-form inline  ref="form" v-show="selectType === '2'">           
          <el-form-item prop="cinemaName">
              <el-input clearable  v-model="filterCondition" placeholder="请输入影院名称"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="forShowCInemaHallDataFilter">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="checkbox-plane" v-show="selectType === '2'" >         
          <div class="content">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item  v-for="cinema in  forShowCInemaHallData" :key="cinema.cinemaId"  :name="cinema.cinemaId">
                  <template slot="title">
                    <el-checkbox :indeterminate="cinema.indeterminate" v-model="cinema.selectAll" @change="selectAllHalls(cinema)"> </el-checkbox> {{cinema.cinemaName}}
                  </template>
                  <div class="check-item" v-for="(hall,index) in cinema.hallList" :key="index">                                                  
                        <el-checkbox v-model="hall.checked">{{hall.hallName}}</el-checkbox>
                  </div>                
              </el-collapse-item>              
            </el-collapse>           
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save">确 定</el-button>
            <el-button @click="hide" >取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 影厅选择器
 */
import { getSettlementPriceCinemaHallList } from '@/api/mallCenter'
import SettlementTypeSelector from './SettlementTypeSelector'
import { realDeepClone } from '@/utils'
export default {
  name: 'hall_selector',
  components: { SettlementTypeSelector },
  props: {
    cinemaList: Array, // 父组件传过来的params
    hallType: String, // 影厅类型
    hallId: String, // 父组件传过来的影厅ID列表
    settlementType: String,
    money: String,
    servicePrice: String
    // pParams: Object
  },
  data() {
    return {
      hallTypeName: '', // 影厅类型名称
      activeName: '', // 手风琴面板激活的name
      dialogVisible: false,
      params: {}, // 要提交的参数
      selectedCinemaHallList: [], // 已经选择的影院影厅   里面包含了未选中的影厅  只有影厅的checked= true才算是选中了
      // 全部影厅     结构   [{cinemaName:"红星店",hallList:{hallName:"1号厅",id:"1"}},{cinemaName:"红星店",hallList:{hallName:"1号厅",id:"1"}}]
      cinemaHallData: [],
      forShowCInemaHallData: {}, // 用于展示的影厅  经过filterCondition条件筛选过
      selectType: '2', // 选择类型 1 所有影厅  2 指定影厅
      filterCondition: '', // 用于展示的影厅根据此条件筛选  有此条件时  判断影院的名称或者ID是否匹配
      query: {},
      pParams: {// 用于传到子组件,
        settlementType: this.settlementType,
        money: this.money,
        servicePrice: this.servicePrice
      },
      hallIdTemp: this.hallId
    }
  },
  watch: {
    hallType: function(val) {
      if (val === '1') {
        this.hallTypeName = '普通厅'
      }
      if (val === '2') {
        this.hallTypeName = '巨幕厅'
      }
      if (val === '3') {
        this.hallTypeName = '特殊厅'
      }
      this.query.hallType = this.hallType
      this.selectedCinemaHallList = []
      this.selectType = '2'
    },
    cinemaId: function(val) {
      this.query.cinemaId = val
    },
    cinemaList: function(val) {
      // 改变所选的影院时, 清除已选中影厅中未被选中的影院
      if (val && val.length > 0) {
        this.selectedCinemaHallList = this.selectedCinemaHallList.filter(e => {
          const temp = this.cinemaList.find(k => k.value === e.cinemaId)
          if (temp) {
            return true
          }
          return false
        })
      } else {
        this.selectedCinemaHallList = []
      }
    }
    // cinemaHallData: {
    //   handler: function(val, oldVal) {
    //     if (val && val.length > 0 && this.hallIdTemp) {
    //       // 根据传进来的hallId将已经选中的影厅进行选择
    //       let hallIdArray = this.hallId.split(',')
    //       hallIdArray = hallIdArray.filter(e => e)
    //       this.selectedCinemaHallList = val.filter(e => {
    //         let flag = false
    //         e.hallList.forEach(hall => {
    //           const temp = hallIdArray.find(element => hall.id === element)
    //           if (temp) {
    //             hall.checked = true
    //             flag = true
    //           }
    //         })
    //         return flag
    //       })
    //       this.hallIdTemp = ''
    //       this.selectType = '2'
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    // 将影院下所有的影厅选中
    selectAllHalls(cinema) {
      if (cinema.selectAll) { // 此参数代表影院下在影厅是否被全部选中
        cinema.hallList.forEach(element => {
          element.checked = true
        })
      } else {
        cinema.hallList.forEach(element => {
          element.checked = false
        })
      }
    },
    showHalls() {
      let message = ''
      if (!this.cinemaList || this.cinemaList.length === 0) {
        message = '请先选择影院'
      }
      if (!this.hallType) {
        message = '请先选择影厅类型'
      }
      if (message) {
        this.$message.warning(message)
      } else {
        this.initPreSelectedShow()
        this.dialogVisible = true
      }
    },
    // 设置indeterminate
    setCinemaSelectAllData(cinema, count) {
      if (count === 0) {
        cinema.selectAll = false
        cinema.indeterminate = false
      } else if (count === cinema.hallList.length) {
        cinema.selectAll = true
        cinema.indeterminate = false
      } else {
        cinema.indeterminate = true
      }
    },
    // 初始化上次选中的选项(非编辑)
    async initPreSelectedShow() {
      await this.fetchData()

      if (this.selectedCinemaHallList && this.selectedCinemaHallList.length > 0) {
        const temp = realDeepClone(this.selectedCinemaHallList)
        let temparray = []
        temp.forEach(e => {
          temparray = [...temparray, ...e.hallList]
        })
        this.cinemaHallData.forEach(e => {
          let count = 0
          e.hallList.forEach(hall => {
            const dd = temparray.find(el => el.id === hall.id)
            if (dd) {
              hall.checked = dd.checked
              if (hall.checked) {
                count++
              }
            } else {
              hall.checked = false
            }
          })
          this.setCinemaSelectAllData(e, count)
        })
      } else {
        this.cinemaHallData.forEach(e => {
          e.hallList.forEach(hall => {
            hall.checked = false
          })
        })
      }
      this.forShowCInemaHallData = this.cinemaHallData
      // this.$forceUpdate()
    },
    // 编辑的时候根据传进来的hallId将已经选中的影厅进行选择
    async initShowSelectedCinemaData() {
      if (this.hallIdTemp) {
        await this.fetchData()
        if (this.hallIdTemp === '-1') {
          this.selectType = '1'
          this.hallIdTemp = ''
          return
        }
        let hallIdArray = this.hallId.split(',')
        hallIdArray = hallIdArray.filter(e => e)
        this.selectedCinemaHallList = this.cinemaHallData.filter(e => {
          let flag = false
          let count = 0
          e.hallList.forEach(hall => {
            const temp = hallIdArray.find(element => hall.id === element)
            if (temp) {
              count++
              hall.checked = true
              flag = true
            } else {
              hall.checked = false
            }
          })
          this.setCinemaSelectAllData(e, count)
          return flag
        })

        this.hallIdTemp = ''
        this.selectType = '2'
      }
    },
    save() {
      this.selectedCinemaHallList = this.cinemaHallData.filter(e => {
        let flag = false
        e.hallList.forEach(hall => {
          if (hall.checked === true) {
            flag = true
          }
        })
        return flag
      })
      this.dialogVisible = false
    },
    // 生成返回结果
    getReturn() {
      return new Promise(async(resolve, reject) => {
        let result = {}
        const hallIds = []

        if (this.selectType === '1') {
        // 返回所有影厅
          hallIds.push('-1')
          // for (const cinema of this.cinemaHallData) {
          //   for (const hall of cinema.hallList) {
          //     hallIds.push(hall.id)
          //   }
          // }
        } else {
        // 返回指定影厅
          for (const cinema of this.selectedCinemaHallList) {
            for (const hall of cinema.hallList) {
              if (hall.checked) {
                hallIds.push(hall.id)
              }
            }
          }
        }
        if (hallIds.length === 0) {
          this.$message.warning('请选择影厅')
          reject('请先选择影厅')
        }
        const settlementTypeSelectorResult = await this.$refs.settlementTypeSelector.getReturn()
        // console.log('settlementTypeSelectorResult======', settlementTypeSelectorResult)
        result.hallId = hallIds.filter(e => e).join(',')
        result = Object.assign(result, settlementTypeSelectorResult)
        resolve(result)
      })
    },
    hide() {
      this.dialogVisible = false
      this.clearSelect()
    },
    clearSelect() { // 清空本次数据选择
      this.cinemaHallData.filter(e => {
        const temp = this.selectedCinemaHallList.find((n) => n === e) // 上一次选中的排除在外
        if (temp) {
          return false
        }
        return true
      }).forEach(e => {
        e.selectAll = false
        // e.selected = false
        e.hallList.forEach(e => {
          e.checked = false
        })
      })
    },
    // 根据搜索条件筛选要展示的影院
    forShowCInemaHallDataFilter() {
      if (!this.filterCondition.trim()) {
        this.forShowCInemaHallData = this.cinemaHallData
      } else {
        this.forShowCInemaHallData = this.cinemaHallData.filter((e) => {
          const flag1 = e.cinemaName.includes(this.filterCondition)
          const flag2 = e.cinemaId.includes(this.filterCondition)
          return flag1 || flag2
        })
      }
    },
    async fetchData() {
      this.query.cinemaId = this.cinemaId
      this.query.hallType = this.hallType
      this.cinemaHallData = await getSettlementPriceCinemaHallList(this.query)

      this.forShowCInemaHallData = this.cinemaHallData

      this.filterCondition = ''
    },
    doSelectAll() {}
  },
  computed: {
    cinemaId: function() {
      return this.cinemaList.map(e => e.value).filter(e => e).join(',')
    }
  },
  mounted() {

  },
  created() {
    this.initShowSelectedCinemaData()
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
.content{
  padding: 0 20px;
  max-height: 300px;
  overflow-y: auto;
  .check-item{
    margin: 20px 0px;
  }
}
</style>
