<template>
  <div class="app-container edit-price-program">
    <el-form
      label-width="140px"
      label-position="left"
      style="width:1000px;"
      :model="params"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="执行商家:" prop="channelId">
        <channel-id-selector v-model="channelId"></channel-id-selector>
      </el-form-item>
      <el-form-item label="增设类型：" prop="type">
        <el-select clearable v-model="params.type">
          <el-option value="1" label="购影片"></el-option>
          <el-option value="2" disabled label="购商品"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" prop="dateType">
        <el-select clearable v-model="params.dateType" style="width:320px">
          <el-option label="指定日期" value="1"></el-option>
          <el-option label="每月" value="2"></el-option>
        </el-select>
        <el-date-picker
          unlink-panels
          v-if="params.dateType==1"
          v-model="params.dateDetail1"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束时间"
          style="width:320px;"
        ></el-date-picker>
        <date-selector
          clearable
          v-if="params.dateType==2"
          v-model="params.dateDetail2"
          style="width:320px"
        ></date-selector>
      </el-form-item>
      <el-form-item label="时间限制" :prop="propType">
        <el-select
          clearable
          v-model="params.timeType"
          style="width:320px;margin-bottom:20px"
          v-if="params.dateType==1"
        >
          <el-option label="不限制" value="-1"></el-option>
          <el-option label="每天" value="day"></el-option>
          <el-option label="每周" value="week"></el-option>
        </el-select>
        <date-selector
          clearable
          v-if="params.timeType=='week'&&params.dateType==1"
          type="week"
          v-model="params.weekTime"
          style="width:320px"
        ></date-selector>
        <el-time-picker
          v-if="(params.timeType=='day'||params.timeType=='week')||params.dateType==2"
          v-model="params.limitTime"
          is-range
          value-format="HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width:320px;"
        ></el-time-picker>
      </el-form-item>
      <el-form-item label="执行影院:" prop="cinemaList">
        <cinema-selector outNeedChannelId :outChannelId="channelId" v-model="cinemaList"></cinema-selector>
      </el-form-item>
      <el-form-item label="增设方式：" prop="way" v-if="params.type === '1'">
        <el-select clearable v-model="params.way" @change="checkCinemaList">
          <el-option value="1" label="根据影厅"></el-option>
          <el-option value="2" label="根据制式"></el-option>
          <el-option value="3" label="根据影片"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="params.way && rule" v-for="(rule,index) in params.ruleList" :key="rule.key">
        <el-form-item label="选择影厅：" prop="hallId" v-if="params.way === '1'">
          <hall-selector
            :index="index"
            :selectTypeNotAllCallBack="selectNotAllHallCallBack"
            :selectTypeAllCallBack="selectAllHallCallBack"
            ref="hallSelector"
            :rule="rule"
            v-model="rule.hallId"
            :disableHallIds="getDisablehallIds(index)"
            :cinemaList="cinemaList"
          ></hall-selector>
        </el-form-item>
        <el-form-item label="选择制式：" prop="standard" v-if="params.way === '2'">
          <standard-selector
            ref="standard"
            :selectTypeNotAllCallBack="selectNotAllHallCallBack"
            :selectTypeAllCallBack="selectAllHallCallBack"
            v-model="rule.standard"
            :disableStandards="getDisableStandards(index)"
            :cinemaList="cinemaList"
          ></standard-selector>
        </el-form-item>
        <el-form-item label="选择影片：" prop="filmId" v-if="params.way === '3'">
          <el-radio v-model="rule.filmType" label="-1">全部影片</el-radio>
          <el-radio v-model="rule.filmType" label="1">指定影片</el-radio>
          <film-selector
            :content-list="rule.contentList"
            v-if="rule.filmType === '1'"
            getFilmId
            v-model="rule.filmId"
          ></film-selector>
        </el-form-item>

        <el-form-item label="针对支付方式：" prop="payType">
          <el-checkbox
            v-model="rule.selectAllPayTypeFlag"
            @change="ddd(rule)"
            style="float:left"
            label="-1"
          >全选</el-checkbox>
          <el-checkbox-group style="margin-left:70px" v-model="rule.selectedPayTypeArray">
            <el-checkbox
              v-for=" payType in allPayTypeArray"
              :key="payType.payCode"
              :label="payType.payCode"
            >{{payType.payName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="增设特殊服务费：" prop="servicePrice">
          <el-input
            clearable
            style="width:150px;"
            v-model.trim="rule.servicePrice"
            placeholder="0.00"
          >
            <template slot="append">元</template>
          </el-input>
          <div class="oper" style="float:right">
            <i
              class="el-icon-remove info"
              title="删除"
              @click="delRule(index)"
              v-if="params.ruleList.length!=1"
            ></i>
            <i
              class="el-icon-circle-plus danger"
              title="添加"
              @click="addNewRule(params.way)"
              v-if="index==params.ruleList.length-1 && rule.showAdd"
            ></i>
          </div>
        </el-form-item>
        <div>-------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
      </div>

      <el-form-item style="text-align:center;margin-top:20px">
        <el-button type="primary" @click="save" v-if="!look">保存</el-button>
        <!-- <el-button type="primary" @click="save" v-if="!look">保存并提交审批</el-button> -->
        <el-button @click="closeTab">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CinemaSelector from '@/components/CinemaSelector'
import ChannelSelector from '@/components/ChannelSelector'
import ChannelIdSelector from '@/components/ChannelIdSelector'
import HallSelector from '@/components/HallSelector'
// import HallSelector from './HallSelector'
import StandardSelector from './StandardSelector'
import FilmSelector from '@/components/FilmSelector'
import DateSelector from '@/components/DateSelector'
import {
  getPayTypeList,
  createSpecialServicePrice,
  getChannelSpecialServicePriceInfo,
  updateSpecialServicePrice
} from '@/api/priceCenter'
export default {
  name: 'edit_additional_mgr',
  components: {
    DateSelector,
    CinemaSelector,
    ChannelSelector,
    HallSelector,
    StandardSelector,
    FilmSelector,
    ChannelIdSelector
  },
  data() {
    return {
      channelId: '',
      cinemaList: [],
      // channelList: [],
      standardParam: {},
      // filmType: '1', // -1 全部影片  1指定影片
      allPayTypeArray: [], // 所有的支付方式数组
      ruleId: 0, // 规则ID
      params: {
        type: '',
        way: '',
        ruleList: []
      },
      rules: {
        name: {
          required: true,
          max: 10,
          message: '请输入价格方案名称，最多10个字',
          trigger: 'blur'
        },
        channelId: { required: true, trigger: 'blur' },
        cinemaList: { required: true, trigger: 'blur' },
        way: { required: true, message: '请选择增设方式', trigger: 'blur' },
        type: { required: true, message: '请选择增设类型', trigger: 'blur' }
      }
    }
  },
  computed: {
    // channelId: function() {
    //   return this.channelList.map(e => e.value).join(',')
    // },
    cinemaId: function() {
      return this.cinemaList.map(e => e.value).join(',')
    }
  },
  watch: {
    channelId(val, oldVal) {
      if (!this.channelId) {
        this.params.type = ''
      }
    },
    cinemaList: {
      handler: function(newValue, oldValue) {
        if (!newValue || newValue.length === 0) {
          // this.params.type = ''
          this.params.way = ''
        }
      },
      deep: true
    },
    'params.way': {
      // 改变增设方式时将ruleList清空,并根据增设类型增加元素
      handler: function(newValue, oldValue) {
        // 编辑时, 第一次选择不新增规则
        if (!oldValue && this.$route.query.id) {
          return
        }
        if (newValue !== oldValue) {
          this.params.ruleList = []
          this.addNewRule(newValue)
        }
      },
      deep: true
    }
  },
  methods: {
    // 如果某条规则选择了全部影片那么将其他规则清除
    selectAllHallCallBack(index) {
      if (this.params.ruleList && this.params.ruleList.length > 0) {
        const temp = this.params.ruleList[index]
        temp.showAdd = false
        this.params.ruleList = []
        this.params.ruleList.push(temp)
      }
    },
    selectNotAllHallCallBack(index) {
      this.params.ruleList[index].showAdd = true
    },
    ddd(rule) {
      if (rule.selectAllPayTypeFlag) {
        rule.selectedPayTypeArray = this.allPayTypeArray.map(e => e.payCode)
      } else {
        rule.selectedPayTypeArray = []
      }
    },
    // 获取需要排除的影厅id
    getDisablehallIds(index) {
      let temp = []
      for (let i = 0; i < this.params.ruleList.length; i++) {
        if (i === index) {
          continue
        }
        if (this.params.ruleList[i].hallId) {
          const hallIdArray = this.params.ruleList[i].hallId.split(',')
          temp = [...temp, ...hallIdArray]
        }
      }
      return temp
    },
    // 获取需要排除的制式
    getDisableStandards(index) {
      let temp = []
      for (let i = 0; i < this.params.ruleList.length; i++) {
        if (i === index) {
          continue
        }
        if (this.params.ruleList[i].standard) {
          const standardArray = this.params.ruleList[i].standard.split(',')
          temp = [...temp, ...standardArray]
        }
      }
      return temp
    },
    addNewRule(way) {
      const rule = {}
      rule.selectedPayTypeArray = []
      rule.servicePrice = ''
      if (way === '3') {
        // 增设方式为按影片则默认选中 指定影片
        rule.filmType = '1'
      }
      rule.showAdd = true // 是否显示增加新规则的 "+"号按钮
      rule.key = this.ruleId
      this.ruleId++
      this.params.ruleList.push(rule)
    },
    delRule(index) {
      this.params.ruleList.splice(index, 1)
    },
    checkCinemaList() {
      // 选择增设方式前先要判断是否选择了影院
      if (!this.cinemaList || this.cinemaList.length === 0) {
        this.params.way = ''
        this.$message.warning('请先选择影院')
      }
    },
    save() {
      const result = {}
      result.channelId = this.channelId
      result.cinemaId = this.cinemaId
      result.type = this.params.type
      result.way = this.params.way
      result.ruleList = this.params.ruleList.map(e => {
        const temp = {}
        temp.servicePrice = e.servicePrice
        temp.payType = e.selectedPayTypeArray.join(',')
        if (this.params.way === '1') {
          // 根据影厅
          temp.hallId = e.hallId
        } else if (this.params.way === '2') {
          // 根据制式
          temp.standard = e.standard
        } else if (this.params.way === '3') {
          // 根据影片
          if (e.filmType === '-1') {
            temp.filmId = '-1'
          } else {
            temp.filmId = e.filmId
          }
        }
        return temp
      })
      if (this.$route.query.id) {
        result.id = this.$route.query.id
        updateSpecialServicePrice(result).then(() => {
          this.$message.success('保存成功')
          this.closeTab(true)
        })
      } else {
        createSpecialServicePrice(result).then(() => {
          this.$message.success('保存成功')
          this.closeTab(true)
        })
      }
    }
  },
  async created() {
    this.allPayTypeArray = await getPayTypeList()
    if (this.$route.query.id) {
      const result = await getChannelSpecialServicePriceInfo(
        this.$route.query.id
      )
      this.cinemaList = result.cinemaList
      this.channelList = result.channelList
      this.channelId = result.channelId
      this.params.type = result.type
      this.params.way = result.way
      const ruleTemp = result.ruleList.map(e => {
        const temp = {}
        temp.key = this.ruleId
        this.ruleId++
        temp.servicePrice = e.servicePrice
        temp.selectedPayTypeArray = e.payType.split(',')
        temp.selectedPayTypeArray = temp.selectedPayTypeArray.filter(e => e)
        if (result.way === '1') {
          // 根据影厅
          temp.hallId = e.hallId
        } else if (result.way === '2') {
          // 根据制式
          temp.standard = e.standard
        } else if (result.way === '3') {
          // 根据影片
          temp.filmId = e.filmId
          temp.filmType = '1' // 指定影片
          temp.contentList = e.contentList
        }
        return temp
      })
      this.params.ruleList = ruleTemp
    }
  }
}
</script>

<style  lang="scss">
.edit-price-program {
  .el-card__body {
    padding: 20px 20px 0px 0px;
  }
  .add-rule-btn {
    text-align: center;
    font-size: 25px;
  }
  .rule-card {
    margin-bottom: 20px;
    position: relative;
  }
  .remove-rule {
    position: absolute;
    top: 26px;
    left: 20px;
    font-size: 24px;
    cursor: pointer;
  }
  .cinema-tip {
    position: absolute;
    top: 5px;
    left: 10px;
  }
  .oper {
    font-size: 28px;
    margin-left: 20px;
    i {
      cursor: pointer;
    }
  }
}
</style>
