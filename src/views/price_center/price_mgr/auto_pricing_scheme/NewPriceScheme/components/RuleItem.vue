<template>
  <el-form
    :model="ruleData"
    :rules="priceFormRules"
    label-width="90px"
    ref="priceRulesForm"
    class="mt20"
  >
    <div class="rule-item">
      <div class="mt10 mb10 df df-center">
        <span class="flex-one">定价规则{{ruleIndex+1}}</span>
        <div class="fr mr15">
          <el-button type="text" v-if="isShowAdd" @click="addItem">添加</el-button>
          <el-button type="text" v-if="isShowDelete" class="danger" @click="delleteItem">删除</el-button>
        </div>
      </div>
      <el-form-item label="配置时间">
        <div>
          <el-radio v-model="ruleData.timeType" :label="'1'">有效期内，所有时间段可用</el-radio>
        </div>
        <div>
          <el-radio v-model="ruleData.timeType" :label="'2'">
            <span>有效期内，指定</span>
            <el-select clearable v-model="ruleData.dateType" @change="changeDateType">
              <el-option label="周期" :value="'1'"></el-option>
              <el-option label="日期" :value="'2'"></el-option>
            </el-select>
            <span>可用</span>
          </el-radio>
          <!-- 周期、日期 -->
          <time-rule-list
            v-if="+ruleData.timeType===2"
            :time-rule="ruleData.timeRule"
            :rule-index="ruleIndex"
            :date-type="ruleData.dateType"
            :time-type="ruleData.timeType"
            ref="timeRuleList"
          ></time-rule-list>
        </div>
        <div>
          <el-radio v-model="ruleData.timeType" :label="'3'">有效期内，指定节日可用</el-radio>
          <time-rule-list
            v-if="+ruleData.timeType===3"
            :time-rule="ruleData.timeRule"
            :rule-index="ruleIndex"
            :date-type="ruleData.dateType"
            :time-type="ruleData.timeType"
            ref="timeRuleList"
          ></time-rule-list>
        </div>
      </el-form-item>
      <el-form-item label="定价方式" prop="interfaceId">
        <span>参考第三方</span>
        <common-select
          class="vm"
          v-model="ruleData.interfaceId"
          :attr-options="{multiple:true}"
          :select-type="'interfaceType'"
          :action-query="{dockType:2,placeholder:'第三方平台'}"
          :default-selection="defaultInterfaceInfo"
          @change="onInterfaceIdChange"
        ></common-select>
        <span>选择</span>
        <el-select clearable v-model="ruleData.priceType">
          <el-option
            v-for="(item,index) in PRICING_METHODS"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <el-tooltip placement="top-start">
          <div slot="content">
            通过和猫眼、淘票票等第三方平台，通过计算公式自动算出参考价格
            <br />1、最高值定价：取第三方平台的最高价格
            <br />2、最低值定价：取第三方平台的最低价格
            <br />3、平均值定价：取第三方平台的最平均值
          </div>
          <i class="el-icon-question primary"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="配置价格">
        <el-form-item prop="price">
          <span>参考第三方价格，统一</span>
          <el-select clearable v-model="ruleData.type" class="w100">
            <el-option :value="'1'" label="增加"></el-option>
            <el-option :value="'2'" label="减少"></el-option>
          </el-select>
          <el-input clearable v-model="ruleData.price" placeholder="0.00" class="w160">
            <template slot="append">元</template>
          </el-input>
          <el-tooltip placement="top-start" content="配置价格，是参考第三方的定价，在常规价格上进行调价">
            <i class="el-icon-question primary"></i>
          </el-tooltip>
        </el-form-item>
        <div class="info mt20">调整的价格将会影响给加盟商的影城票价，若减价后金额小于常规价格，则将会将常价提供给加盟商，请慎重填写</div>
      </el-form-item>
      <!-- <el-button @click="validate">校验</el-button> -->
    </div>
  </el-form>
</template>
<script>
import { PRICING_METHODS } from '@/views/price_center/price_mgr/auto_pricing_scheme/constant'
import CommonSelect from '@/components/CommonSelect'
import TimeRuleList from './TimeRuleList'
import { STRING_NUMBER } from '@/utils/validate'
export default {
  props: {
    ruleData: {
      type: Object,
      default() {
        return {}
      }
    },
    ruleIndex: {
      type: Number,
      default: 0
    },
    isShowDelete: {
      type: Boolean,
      default: false
    },
    isShowAdd: {
      type: Boolean,
      default: false
    }
  },
  components: {
    // TimeRange,
    CommonSelect,
    TimeRuleList
  },
  data() {
    return {
      // WEEKS,
      PRICING_METHODS,
      priceDateRange: null,
      priceRulesForm: {},
      priceFormRules: {
        interfaceId: {
          required: true,
          trigger: 'change',
          message: '请选择第三方平台'
        },
        price: [
          { required: true, trigger: 'blur', message: '请输入价格' },
          { validator: STRING_NUMBER, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    defaultInterfaceInfo() {
      if (this.ruleData && this.ruleData.interfaceName) {
        const defaultNames = this.ruleData.interfaceName.split(',')
        const interfaceIds = this.ruleData.interfaceId.split(',')
        return interfaceIds.map((v, i) => {
          return {
            id: interfaceIds[i],
            name: defaultNames[i]
          }
        })
      } else {
        return null
      }
    }
  },
  watch: {
    'ruleData.timeType'(val) {
      this.$emit('on-change-time-type', val, this.ruleIndex)
      // this.$set(this.ruleData, 'timeRule', +val === 1 ? [] : [createTimeRuleItem()])
      // switch (+val) {
      //   case 1:
      //     this.ruleData.timeRule = []
      //     break
      //   case 2:
      //     // this.$set(this.ruleData, 'dateType', 1)
      //     // this.$set(this.ruleData, 'timeRule', [createTimeRuleItem()])
      //     this.$emit('on-change-time-type', val)
      //     break
      //   case 3:
      //     // this.ruleData.timeRule = [createTimeRuleItem()]
      //     break
      // }
    }
    // 'ruleData.interfaceId'() {}
  },
  created() {
    // if (!this.ruleData.dateType) {
    //   this.ruleData.dateType = this.ruleData.time && this.ruleData.time.length ? '1' : '2'
    // }
  },
  methods: {
    changeDateType(val) {
      this.$emit('on-change-date-type', val, this.ruleIndex)
      // this.ruleData.timeRule = []
      // this.ruleData.week = ''
      // this.ruleData.startDate = ''
      // this.ruleData.endDate = ''
      // this.ruleData.date = []
      // switch (+val) {
      //   case 1:
      //     this.ruleData.timeRule = []
      //     break
      //   case 2:
      //     this.ruleData.timeRule = [createTimeRuleItem()]
      //     break
      //   case 3:
      //     this.ruleData.timeRule = []
      //     break
      // }
    },
    onInterfaceIdChange(val, obj) {
      this.ruleData.interfaceName = obj.name
    },
    addItem() {
      this.$emit('on-add', this.ruleIndex)
    },
    delleteItem(index) {
      this.$emit('on-delete', this.ruleIndex)
    },
    validate() {
      const priomiseArry = []
      const form =
        this.$refs.priceRulesForm && this.$refs.priceRulesForm.validate()
      if (form) priomiseArry.push(form)
      const timeRuleList =
        this.$refs.timeRuleList && this.$refs.timeRuleList.validateAll()
      if (timeRuleList) priomiseArry.push(timeRuleList)
      return Promise.all(priomiseArry)
    }
  }
}
</script>
<style lang="scss" scoped>
.rule-item {
  border-top: 1px solid #f0f1f3;
}
</style>


