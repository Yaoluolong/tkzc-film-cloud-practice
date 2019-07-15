<template>
  <div>
    <el-button type="primary" @click="show">选择影厅</el-button>
    <div class="tag-plane" v-if="selectedHallList.length>0">
      <div class="tag-title">
        <!-- {{hallType.name||'请选择影厅类型'}} -->
        <div class="tag-subtitle">
          <div v-for="(cinema , index) in selectedHallList" :key="index">
            <span>{{cinema.cinemaName}}：{{cinema.hallList.map(e=>e.hallName).join(',')}}</span>
          </div>
        </div>
      </div>
      <slot></slot>
    </div>
    <el-dialog title="选择影厅" :visible.sync="dialogVisible" width="600px">
        <div class="checkbox-plane">
          <!-- <div class="header">
            <el-checkbox @change="doSelectAll">全选</el-checkbox>
          </div> -->
          <div class="content">
            <el-collapse accordion >
              <el-collapse-item  v-for="cinema in  hallList" :key="cinema.cinemaId"  :name="cinema.cinemaId">
                  <template slot="title">
                    <el-checkbox v-model="cinema.selectAll" @change="selectAllHalls(cinema)"> </el-checkbox> {{cinema.cinemaName}}
                  </template>
                  <div class="check-item" v-for="(hall,index) in cinema.hallList" :key="index">
                        <el-checkbox :disabled="hall.disabled" v-model="hall.checked">{{hall.hallName}}</el-checkbox>
                  </div>
              </el-collapse-item>
            </el-collapse>
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
  import { getSettlementPriceCinemaHallList } from '@/api/mallCenter'
  import { realDeepClone } from '@/utils'
  // import { mergeArray, split } from '@/utils'
  export default {
    props: {
      cinemaId: String, // 多个用逗号隔开
      hallType: String,
      value: String, // hallId 逗号隔开
      disableHallIds: { // 需要禁用的影厅ID数组
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        query: {
          cinemaId: '',
          hallType: ''
        },
        params: {},
        hallList: [],
        dialogVisible: false,
        selectedHallList: []
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
      selectedHallList(val) {
        this.selectedHallListToValue(val)
      },
      // hallId(val) {
      //   if (this.selectedHallList !== val) {
      //     this.selectedHallList = val
      //   }
      // },
      value(val, oldValue) {
        if (val !== oldValue) {
          this.valueToSelectedHallList(val)
        }
      }
    },
    methods: {
  
      setHallDisable() {
        this.hallList.forEach(e => {
          e.hallList.forEach(hall => {
          // 设置禁选
            let flag = true
            if (this.disableHallIds) {
              this.disableHallIds.forEach(disableHallid => {
                if (hall.id === disableHallid) {
                  hall.disabled = true
                  flag = false
                }
              })
            }
  
            if (flag) {
              hall.disabled = false
            }
          })
        })
      },
      async show() {
        if (!this.cinemaId) {
          this.$message.warning('请先选择影院')
          return
        }
        if (!this.hallType) {
          this.$message.warning('请先选择影厅类型')
          return
        }
        await this.fetchData()
  
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      save() {
        const temp = realDeepClone(this.hallList)
        this.selectedHallList = temp.map(e => Object.assign(e, { hallList: e.hallList.filter(k => k.checked === true) }))
          .filter(e => e.hallList.length > 0)
        this.dialogVisible = false
      },
      selectAllHalls(cinema) {
        cinema.hallList.forEach(e => { e.checked = cinema.selectAll })
      },
      selectedHallListToValue(val) {
        const value = val.map(e => e.hallList.map(k => k.id).join(',')).join(',')
        if (value !== val) {
          this.$emit('input', value)
        }
      },
      async valueToSelectedHallList(val) {
        if (val) {
          await this.fetchData()
  
          // const temp = []
          // // const temp = (this.hallList)
          // this.hallList.forEach(e => {
          //   let flag = false
          //   e.hallList.forEach(hall => {
          //     if ((',' + val + ',').indexOf(',' + hall.id + ',') !== -1) {
          //       hall.checked = true
          //       flag = true
          //     } else {
          //       hall.checked = false
          //     }
          //   })
          //   if (flag) {
          //     temp.push(realDeepClone(e))
          //   }
          // })
          // this.selectedHallList = temp
          // this.selectedHallList.forEach(e => {
          //   e.hallList = e.hallList.filter(hall => hall.checked)
          // })
        } else {
          this.selectedHallList = []
          this.hallList.forEach(e => {
            e.hallList.forEach(el => {
              el.checked = false
            })
          })
        }
      },
      async fetchData() {
        return new Promise(async(resolve, reject) => {
          if (this.query.cinemaId !== this.cinemaId || this.query.hallType !== this.hallType) {
            this.query.cinemaId = this.cinemaId
            this.query.hallType = this.hallType
            // this.selectedHallList = []
            this.hallList = await getSettlementPriceCinemaHallList(this.query)
            this.hallList.forEach(e => {
              e.hallList.forEach(el => {
                el.checked = false
              })
            })
            this.setHallDisable()

            const temp = []
            // const temp = (this.hallList)
            this.hallList.forEach(e => {
              let flag = false
              e.hallList.forEach(hall => {
                if ((',' + this.value + ',').indexOf(',' + hall.id + ',') !== -1) {
                  hall.checked = true
                  flag = true
                } else {
                  hall.checked = false
                }
              })
              if (flag) {
                temp.push(realDeepClone(e))
              }
            })
            this.selectedHallList = temp
            this.selectedHallList.forEach(e => {
              e.hallList = e.hallList.filter(hall => hall.checked)
            })
          }
          resolve()
        })
      }
    },
    created() {
      this.valueToSelectedHallList(this.value)
    }
  }
</script>

<style scoped lang="scss">
.checkbox-plane{
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
  // margin-top: 20px;
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
  padding: 20px;
  margin: -10px 0px;
  margin-top: 0;
  max-height: 300px;
  overflow: auto;
  .check-item{
    margin: 5px 20px;
  }
}
.tag-plane{
   border: 1px solid #DCDFE6;
   border-radius: 4px;
   margin-top: 20px;
   .tag-title{
     padding: 5px 20px;
     border-bottom: 1px solid #DCDFE6;
     font-weight: bold;
     .tag-subtitle{
       font-size: 12px;
       font-weight: normal;
       line-height: 30px;
     }
   }
}
</style>
