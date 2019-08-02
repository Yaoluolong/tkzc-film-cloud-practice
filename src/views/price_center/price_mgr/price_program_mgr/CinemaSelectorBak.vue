<template>
  <div>
    <el-button type="primary" @click="show">选择影院</el-button>
    <!-- 选择指定影院并且至少已经选择一个影院后显示 -->
    <div
      class="tag-plane"
      v-if="selectedCinemaList&&selectedCinemaList.length>0&&selectTypeBak !== '1'"
      style="max-height:500px;overflow-y: auto;"
    >
      <el-tag
        type="danger"
        @close="delFun(index,cinema)"
        class="selected-item"
        v-for="(cinema,index) in selectedCinemaList"
        closable
        :key="index"
      >{{cinema.name}}</el-tag>
    </div>
    <!-- 选择所有影院时显示 -->
    <div class="tag-plane" v-if="selectTypeBak === '1'">所有影院</div>
    <el-dialog
      title="选择影院"
      :visible.sync="dialogVisible"
      width="600px"
      @close="resetFields('form')"
    >
      <el-form style="margin-top:-5%" inline :model="query" ref="form" v-show="selectType === '2'">
        <el-form-item label="省/自治区/直辖市" prop="cinemaName">
          <city-cascader
            ref="city"
            v-model="query.area"
            :rang="1"
            :clearable="true"
            placeholder="请选择"
            style="width:170px;"
          ></city-cascader>
        </el-form-item>
        <div style="margin-top:10px">
          <el-form-item prop="cinemaName">
            <el-input
              clearable
              style="width:300px"
              v-model="query.cinemaName"
              placeholder="请输入影院名称"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left:60px">
            <el-button type="primary" @click="fetchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>

      <el-radio-group v-model="selectType">
        <el-radio :label="'1'">所有影院</el-radio>
        <el-radio :label="'2'">指定影院</el-radio>
      </el-radio-group>
      <div class="checkbox-plane" v-show="selectType === '2'">
        <div class="header">
          <el-checkbox @change="doSelectAll">全选</el-checkbox>
        </div>
        <div class="content">
          <div
            class="check-item"
            v-for="cinema in cinemaList"
            :key="cinema.value+new Date().getTime()"
          >
            <el-checkbox
              @change="doChangeFun(cinema)"
              v-model="cinema.checked"
            >{{cinema.name}}----{{cinema.cinemaCode}}</el-checkbox>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="hide">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
// 这个页面有样式要改   bug 7815
<script>
import { getCinemaById } from '@/api/priceCenter'
import { mergeArray } from '@/utils'
import CityCascader from '@/components/CityCascader'
export default {
  components: { CityCascader },
  props: {
    delFun: {
      // 点标签上的删除按钮时进行的操作
      type: Function,
      default: function(index) {
        this.handleClose(index)
      }
    },
    groupId: String,
    value: [String, Array]
  },
  data() {
    return {
      selectTypeBak: '2',
      selectType: '2', // 1 选择全部影院  2 指定影院
      query: {
        area: []
      },
      cinemaList: [],
      dialogVisible: false,
      selectedCinemaList: [],
      checkedValue: [],
      selectAll: false,
      delSelect: {},
      changeCinemaList: []
    }
  },
  computed: {},
  watch: {
    selectedCinemaList(val) {
      val.forEach(e => delete e.checked)
      this.$emit('input', val)
    },
    value(val) {},
    delSelect(val) {
      this.changeCinemaList.forEach(e => {
        if (e.value === val.value) {
          e.checked = false
        }
      })
    },
    groupId(val) {
      if (val) {
        this.changeCinemaList = []
      }
    }
  },
  methods: {
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
    async show() {
      if (this.groupId) {
        this.query.id = this.groupId
        this.dialogVisible = true
        this.selectAll = false
        this.cinemaList = this.changeCinemaList

        this.fetchData()
      } else {
        this.$message.warning('请选择归属影院策略组')
      }
    },
    hide() {
      this.dialogVisible = false
    },
    save() {
      this.selectTypeBak = this.selectType
      let temp = []
      if (this.selectType === '2') {
        temp = this.cinemaList.filter(e => {
          return e.checked
        })
        this.selectedCinemaList = temp
      } else {
        temp = this.cinemaList
        this.selectedCinemaList = mergeArray(this.selectedCinemaList, temp)
      }

      this.dialogVisible = false
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
    async fetchData() {
      const request = {}
      if (this.query.area.length > 0) {
        request.proivceId = this.query.area[0]
        if (this.query.area.length === 2) {
          request.cityId = this.query.area[1]
        }
      }
      request.id = this.groupId
      // if (this.cinemaList.length === 0) {
      this.cinemaList = await getCinemaById(request)
      this.cinemaList.forEach(e => {
        this.selectedCinemaList.forEach(el => {
          if (e.value === el.value) {
            e.checked = true
          }
        })
      })
      if (this.cinemaList.length === 0) {
        this.$message.warning('无当前策略类型对应的影院')
      }
      // }
    }
  },
  created() {
    this.selectedCinemaList = this.value
    // this.init()
  }
}
</script>

<style scoped lang="scss">
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
  padding: 20px;
  margin: -10px 0px;
  margin-top: 0;
  max-height: 300px;
  overflow: auto;
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
.btn-area {
  display: flex;
  align-items: center;
}
</style>
