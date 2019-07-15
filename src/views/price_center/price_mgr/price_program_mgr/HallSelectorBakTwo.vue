<template>
  <div>    
    <el-card title="选择影厅"  width="600px">
      <div style="margin-left:10px">
          <el-radio-group v-model="selectType" style="margin-top:-2%">
            <el-radio :label="'1'" :disabled="disableHallIds&&disableHallIds.length>0">
              所有影厅
            </el-radio>  
            <el-radio :label="'2'">
              指定影厅
            </el-radio>
          </el-radio-group>
          <div class="checkbox-plane" v-show="selectType === '2' && cinemaHallData.length > 0" >         
              <div class="content">
                <el-collapse v-model="activeName" accordion>
                  <el-collapse-item  v-for="cinema in  cinemaHallData" :key="cinema.cinemaId"  :name="cinema.cinemaId">
                      <template slot="title">
                        <el-checkbox v-model="cinema.selectAll" @change="selectAllHalls(cinema)"> </el-checkbox> {{cinema.cinemaName}}
                      </template>
                      <div class="check-item" v-for="hall in cinema.hallList" :key="hall.id">                                                  
                            <el-checkbox :disabled="hall.disabled" v-model="hall.checked">{{hall.hallName}}</el-checkbox>
                      </div>                
                  </el-collapse-item>              
                </el-collapse>           
              </div>
          </div>
         <div style="margin-bottom:10px"></div>
      </div>        
    </el-card>
  </div>
</template>

<script>
/**
 * 影厅选择器
 */
import { getSettlementPriceCinemaHallList } from '@/api/mallCenter'
export default {
  name: 'hall_selector',
  props: {
    cinemaList: Array, // 父组件传过来的params
    value: String, // 影厅ids
    selectTypeAllCallBack: Function, // 选择了所有影厅要执行的方法
    selectTypeNotAllCallBack: Function, // 选择了指定影厅要执行的方法
    index: Number,
    disableHallIds: { // 需要禁用的影厅ID数组
      type: Array,
      default: []
    }
  },
  data() {
    return {
      activeName: '', // 手风琴面板激活的name
      params: {}, // 要提交的参数
      selectedCinemaHallList: [], // 已经选择的影院影厅   里面包含了未选中的影厅  只有影厅的checked= true才算是选中了
      // 全部影厅     结构   [{cinemaName:"红星店",hallList:{hallName:"1号厅",id:"1"}},{cinemaName:"红星店",hallList:{hallName:"1号厅",id:"1"}}]
      cinemaHallData: [],
      selectType: '2', // 选择类型 1 所有影厅  2 指定影厅
      query: {},
      pParams: {
      }
    }
  },
  computed: {
    cinemaId: function() {
      return this.cinemaList.map(e => e.value).filter(e => e).join(',')
    },
    hallId: function() {
      let temp = []
      this.cinemaHallData.forEach(e => {
        temp = [...temp, ...(e.hallList.filter(el => el.checked).map(el => el.id))]
      })
      temp = temp.filter(e => e).join(',')
      return temp
    }
  },
  watch: {
    disableHallIds: function(val, oldval) {
      if (val !== oldval) {
        this.disableHallIds = val
        this.setHallDisable()
        this.$forceUpdate()
        // 如果被禁用的选项的选项被改变了且选择的是所有影厅 那么重新返回所有影厅
        // if (this.selectType === '1') {
        //   const temp = this.getAllHall()
        //   this.$emit('input', temp)
        // }
      }
    },
    selectType: {
      handler: function(val, oldVal) {
        // 如果选择了所有影厅则返回所有影厅的ID   需要排除掉被禁用的
        if (val !== oldVal) {
          if (val === '1') {
            const temp = this.getAllHall()
            this.$emit('input', temp)
          } else {
            this.$emit('input', this.hallId)
          }
          if (val === '1' && this.selectTypeAllCallBack) {
            this.selectTypeAllCallBack(this.index)
          }
          if (val === '2' && this.selectTypeNotAllCallBack) {
            this.selectTypeNotAllCallBack(this.index)
          }
        }
      },
      deep: true
    },
    hallId: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('input', val)
        }
      },
      deep: true
    },
    cinemaHallData: {
      handler: function(val, oldVal) {
      },
      deep: true
    },
    cinemaId: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.fetchData()
        }
      },
      deep: true
    }
  },
  methods: {
    getAllHall() { // 获得所有非disable的影厅的ID
      let temp = []
      this.cinemaHallData.forEach(e => {
        temp = [...temp, ...(e.hallList.filter(el => !el.disabled).map(el => el.id))]
      })
      temp = temp.filter(e => e).join(',')
      return temp
    },
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
    handleClose() {},
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
    },
    setHallDisable() {
      this.cinemaHallData.forEach(e => {
        e.hallList.forEach(hall => {
          // 设置禁选
          let flag = true
          this.disableHallIds.forEach(disableHallid => {
            if (hall.id === disableHallid) {
              hall.disabled = true
              flag = false
            }
          })
          if (flag) {
            hall.disabled = false
          }
        })
      })
    },
    async fetchData() {
      let message = ''
      if (!this.cinemaList || this.cinemaList.length === 0) {
        message = '请先选择影院'
      }
      if (message) {
        this.cinemaHallData = []
        this.$message.warning(message)
        return
      }
      this.query.cinemaId = this.cinemaId
      const doFetch = true

      if (doFetch) {
        await getSettlementPriceCinemaHallList(this.query).then(res => {
          this.cinemaHallData = res
          let selectHallIds = []
          if (this.value) {
            selectHallIds = this.value.split(',')
            selectHallIds = selectHallIds.filter(e => e)
          }
          this.cinemaHallData.forEach(e => {
            e.hallList.forEach(hall => {
              if (selectHallIds.find(n => n === hall.id)) {
                hall.checked = true
              } else {
                hall.checked = false
              }
            })
          })
          this.setHallDisable()
        })
      }
    },
    doSelectAll() {}
  },
  mounted() {

  },
  created() {
    this.fetchData()
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
