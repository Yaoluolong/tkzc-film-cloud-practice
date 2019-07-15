<template>
  <div>
    <el-button type="primary" @click="show">选择影院</el-button>
    <!-- 选择指定影院并且至少已经选择一个影院后显示 -->
    <div class="tag-plane" v-if="selectedCinemaList.length>0&&selectType !== '1'" style="max-height:500px;overflow-y: auto;">
      <el-tag type="danger" @close="handleClose(index,cinema)" class="selected-item" v-for="(cinema,index) in selectedCinemaList" closable :key="index">{{cinema.name}}</el-tag>
    </div>
    <!-- 选择所有影院时显示 -->
    <div class="tag-plane" v-if="selectType === '1'">
      所有影院
    </div>
    <el-dialog title="选择影院"  :visible.sync="dialogVisible" width="600px" @close="resetFields('form')">        
        <el-form style="margin-top:-5%" inline :model="query"  ref="form" v-show="selectType === '2'">     
          <el-form-item label="省/自治区/直辖市" prop="cinemaName">
              <city-cascader ref="city" v-model="query.area" :rang="1" :clearable="true" placeholder="请选择" style="width:170px;"></city-cascader>
          </el-form-item>  
          <div style="margin-top:10px">
            <el-form-item  prop="cinemaName">
                <el-input style="width:300px" v-model="query.cinemaName" placeholder="请输入影院名称"></el-input>
            </el-form-item>
            <el-form-item style="margin-left:60px">
                <el-button type="primary" @click="fetchData" >搜索</el-button>
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
            <el-checkbox @change="doSelectAll" v-model="allChecked">全选</el-checkbox>
          </div>
          <div class="content">
            <div class="check-item" v-for="(cinema,index) in cinemaList" :key="index">             
                <el-checkbox v-model="cinema.checked"  @change="dataChange(cinema)" :disabled="cinema.disable">
                  <span class="cinema-name">{{cinema.name}}----{{cinema.cinemaCode}}</span>
                </el-checkbox>
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
import CityCascader from '@/components/CityCascader'
import { getCinemaList } from '@/api/mallCenter'
import { getCinemaById } from '@/api/priceCenter'
import { split } from '@/utils'
export default {
  components: { CityCascader },
  props: {
    policy: Object, // 开关对象
    value: [String, Array],
    text: {
      type: Array,
      default: function() {
        return []
      }
    },
    form: Object
  },
  data() {
    return {
      selectAll: false,
      selectType: '2', // 1 选择全部影院  2 指定影院
      query: {},
      cinemaList: [],
      dialogVisible: false,
      selectedCinemaList: [],
      isInit: false,
      checkedValue: [],
      allChecked: false,
      delSelect: {},
      changeCinemaList: []
    }
  },
  computed: {

  },
  watch: {
    text(val, oldVal) {
      if (val.length === 0) {
        this.selectedCinemaList = []
      }
    },
    selectType(val) {
      // 选择全部影院的时候只要提交一个-1
      if (val === '1') {
        const result = ['-1']
        this.$emit('input', result)
      }
    },
    selectedCinemaList(val) {
      // 只有在指定影院时才做处理
      if (this.selectType === '2') {
        const result = val.map((e) => {
          return e.value
        })
        this.$emit('input', result)
        if (val.length === 0) {
          this.checkedValue = []
          this.policy.priceRightConfig = ''
          this.changeCinemaList.forEach(e => {
            e.disable = false
          })
        }
        if (this.form) {
          this.form.cinemaList = []
          val.forEach(e => {
            this.form.cinemaList.push(e.name)
          })
        }
      }
    },
    value(val) {
      this.init(val)
    },
    'policy.priceRight'(val) {
      if (this.create) {
        this.selectedCinemaList = []
        this.cinemaList = []
        this.checkedValue = []
      }
      this.changeCinemaList = []
    },
    delSelect(val) {
      this.changeCinemaList.forEach(e => {
        if (e.value === val.value) {
          e.checked = false
        }
      })
    }
  },
  methods: {
    init(value) {
      if (!this.isInit && this.text.length > 0) {
        if (typeof value === 'string') {
          value = split(value)
        }
        this.selectedCinemaList = value.map((e, i) => {
          return { name: this.text[i], value: e }
        })
        this.isInit = true
      }
    },
    dataClear() {
      this.selectedCinemaList = []
      this.checkedValue = []
      this.cinemaList.forEach(e => {
        this.$set(e, 'checked', false)
      })
    },
    show() {
      if (this.policy) {
        this.allChecked = false
        this.policyJudge()
      } else {
        if (this.form.policyGroupId) {
          this.dialogVisible = true
          this.allChecked = false
          this.query = {}
          if (this.changeCinemaList.length === 0) {
            this.fetchData()
          } else {
            this.cinemaList = this.changeCinemaList
          }
        } else {
          this.$message({
            message: '请先选择策略组',
            type: 'warning'
          })
        }
      }
    },
    hide() {
      this.cinemaList = []
      this.dialogVisible = false
    },
    save() {
      if (this.policy) {
        if (this.checkedValue.length !== 0) {
          this.policy.priceRightConfig = this.checkedValue[0]
        }
      }
      this.changeCinemaList = this.cinemaList
      // this.selectedCinemaList = mergeArray(this.selectedCinemaList, this.cinemaList.filter(e => e.checked))
      this.selectedCinemaList = this.cinemaList.filter(e => e.checked)

      this.dialogVisible = false
    },
    handleClose(index) {
      this.delSelect = this.selectedCinemaList[index]
      this.selectedCinemaList.splice(index, 1)
    },
    doSelectAll(val) {
      if (this.policy) {
        if (val) {
          this.policySelectAll(val)
        } else {
          this.cinemaList.forEach(e => {
            this.$set(e, 'disable', false)
            this.$set(e, 'checked', val)
            this.checkedValue = []
          })
        }
      } else {
        this.cinemaList.forEach(e => {
          this.$set(e, 'checked', val)
        })
      }
    },
    policySelectAll(val) {
      const filterArr = []
      this.cinemaList.forEach(e => {
        filterArr.push(e.priceRightConfig)
      })
      const result = filterArr.filter((e, i, self) => {
        return self.indexOf(e) === i
      })
      if (result.length < this.cinemaList.length) {
        const result = []
        this.cinemaList.forEach(e => {
          this.$set(e, 'checked', val)
          result.push(e.priceRightConfig)
          this.checkedValue = result
        })
      } else {
        this.cinemaList.forEach(e => {
          const result = []
          this.$set(e, 'checked', val)
          result.push(e.priceRightConfig)
          this.checkedValue = result
        })
      }
    },
    dataChange(res) {
      const priceRight = res.priceRightConfig

      if (res.checked) {
        this.checkedValue.push(res.priceRightConfig)
      } else {
        this.checkedValue.pop()
      }
      // console.log(this.checkedValue, 123)

      this.cinemaList.forEach(e => {
        if (e.priceRightConfig.indexOf(priceRight) > -1) {
          e.disable = false
        } else {
          if (res.checked) {
            e.disable = true
          } else {
            if (this.checkedValue.length === 0) {
              e.disable = false
            }
          }
        }
      })
      this.allChecked = false
      this.$forceUpdate()
    },
    policyJudge() {
      if (this.policy.priceRight) {
        this.query.priceRight = this.policy.priceRight
        if (this.changeCinemaList.length === 0) {
          this.fetchData()
        } else {
          this.cinemaList = this.changeCinemaList
        }
        this.dialogVisible = true
      } else {
        this.$message({
          message: '请先选择策略类型',
          type: 'warning'
        })
        this.dialogVisible = false
      }
    },
    async fetchData() {
      // this.query.cinemaId = this.query.cinemaName
      if (this.query.cinemaName === undefined) { delete this.query['cinemaName'] }
      this.cinemaList = this.policy ? await getCinemaList(this.query) : await getCinemaById({ id: this.form.policyGroupId })

      // 恢复已经选中的选项
      if (this.value) {
        this.cinemaList.forEach(e => {
          const temp = this.value.find(v => e.value === v)
          if (temp) {
            e.checked = true
          }
        })
      }

      if (this.policy) {
        this.cinemaList.forEach(e => {
          e.disable = false
        })
        if (this.cinemaList.length === 0) {
          this.$message({
            message: '无当前策略类型对应的影院',
            type: 'warning'
          })
        } else {
          // this.dataClear()
          this.dialogVisible = true
        }
      }
    }
  },
  created() {
    this.init()
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
