<template>
  <div class="activityContainer">
    <div v-for="(rule, index) in activityRules" :key="index">
      <div class="ruleHeader">
        <h3>第{{index+1}}优先级</h3>
        <div class="oper" style="float:right;">
          <i
            class="el-icon-remove info"
            title="删除"
            @click="removeActivityRule(index)"
            v-if="activityRules.length!=1"
          ></i>
          <i
            class="el-icon-circle-plus danger"
            title="添加"
            @click="newActivityRule"
            v-if="index==activityRules.length-1"
          ></i>
        </div>
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        style="width:1000px;"
        ref="form"
        :params="rule"
        :rules="rules"
      >
        <el-form-item label="优惠方式:" prop="rule_discount_type">
          <el-radio-group v-model="rule.rule_discount_type" size="medium">
            <el-radio label="cash_back">定额立减</el-radio>
            <el-radio label="random_cash_back">随机立减</el-radio>
            <el-radio label="discount">折扣立减</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动标签:" prop="rule_discount_tag" style="width:260px;">
          <tip content="微信商户客户端配置的标记(goods_tag)">
            <el-input
              clearable
              placeholder="输入活动标签"
              v-model.trim="rule.rule_discount_tag"
              style="width:120px"
            ></el-input>
          </tip>
        </el-form-item>
        <el-form-item label="使用门槛:" prop="rule_mininum">
          <el-input
            clearable
            placeholder="门槛金额"
            v-model.trim="rule.rule_mininum"
            style="width:120px"
          ></el-input>&emsp;元及以上金额订单可用
        </el-form-item>
        <el-form-item
          label="减价金额:"
          prop="rule_min_unit"
          v-if="rule.rule_discount_type==='cash_back'"
        >
          <el-input
            clearable
            placeholder="输入减价金额"
            v-model.trim="rule.rule_min_unit"
            style="width:200px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="减价区间:"
          prop="rule_min_unit"
          v-if="rule.rule_discount_type==='random_cash_back'"
        >
          <el-input
            clearable
            placeholder="输入减价区间"
            v-model.trim="rule.rule_min_unit"
            style="width:100px"
          ></el-input>&nbsp;至&nbsp;
          <el-input
            clearable
            placeholder="输入减价区间"
            v-model.trim="rule.rule_max_unit"
            style="width:100px"
          ></el-input>&nbsp;元
        </el-form-item>
        <el-form-item
          label="折扣比例:"
          prop="rule_min_unit"
          v-if="rule.rule_discount_type==='discount'"
        >
          <el-input
            clearable
            placeholder="输入折扣比例"
            v-model.trim="rule.rule_min_unit"
            style="width:200px"
          ></el-input>&emsp;（原价为1，0.88即为八八折）
        </el-form-item>
        <el-form-item
          label="优惠金额:"
          prop="rule_max_unit"
          v-if="rule.rule_discount_type==='discount'"
        >
          <el-input
            clearable
            placeholder="输入优惠金额"
            v-model.trim="rule.rule_max_unit"
            style="width:200px"
          ></el-input>&emsp;元
        </el-form-item>
        <el-form-item label="发放金额:" prop="rule_total_amount" style="width:340px;">
          <tip content="本条规则发放的总金额数">
            <el-input
              clearable
              placeholder="输入发放金额"
              v-model.trim="rule.rule_total_amount"
              style="width:200px"
            ></el-input>
          </tip>
        </el-form-item>
        <el-form-item label="日参与次数:" class="noTag" style="width:400px;">
          <tip content="参与次数不填写次数为不限制次数">
            每人每天可参与&emsp;
            <el-input
              clearable
              placeholder="次数"
              v-model.trim="rule.rule_chances_per_day"
              style="width:120px"
            ></el-input>&emsp;次
          </tip>
        </el-form-item>
        <el-form-item label="周参与次数:" class="noTag">
          每人每周可参与&emsp;
          <el-input
            clearable
            placeholder="次数"
            v-model.trim="rule.rule_chances_per_week"
            style="width:120px"
          ></el-input>&emsp;次
        </el-form-item>
        <el-form-item label="月参与次数:" class="noTag">
          每人每月可参与&emsp;
          <el-input
            clearable
            placeholder="次数"
            v-model.trim="rule.rule_chances_per_month"
            style="width:120px"
          ></el-input>&emsp;次
        </el-form-item>
        <el-form-item label=" " label-width=".1px;" prop="rule_seats_per" class="isTag">
          活动期间最多参与&emsp;
          <el-input
            clearable
            placeholder="次数"
            v-model.trim="rule.rule_total_chances"
            style="width:120px"
          ></el-input>&emsp;次，每笔订单最多有&emsp;
          <el-input
            clearable
            placeholder="个数"
            v-model.trim="rule.rule_seats_per_order"
            style="width:120px"
          ></el-input>&emsp;个座位
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: [Array, Object, String]
  },
  data() {
    return {
      activityRules: [
        {
          rule_discount_type: 'cash_back',
          rule_discount_tag: '',
          rule_mininum: '',
          rule_total_amount: '',
          rule_chances_per_day: '',
          rule_chances_per_week: '',
          rule_chances_per_month: '',
          rule_total_chances: '',
          rule_seats_per_order: '',
          rule_min_unit: '',
          rule_max_unit: ''
        }
      ],
      rules: {}
    }
  },
  watch: {
    activityRules: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    },
    value(val) {
      if (val) {
        this.activityRules = val
      }
    }
  },
  methods: {
    removeActivityRule(index) {
      this.activityRules.splice(index, 1)
    },
    newActivityRule(val) {
      this.activityRules.push({
        rule_discount_type: 'cash_back',
        rule_discount_tag: '',
        rule_mininum: '',
        rule_total_amount: '',
        rule_chances_per_day: '',
        rule_chances_per_week: '',
        rule_chances_per_month: '',
        rule_total_chances: '',
        rule_seats_per_order: ''
      })
    }
  }
}
</script>
<style scoped lang="scss">
.activityContainer {
  padding: 0 20px 20px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}
.el-form-item {
  margin-bottom: 22px;
}
.ruleHeader {
  display: flex;
  align-items: center;
  margin: 20px 0px;
  & > span {
    width: 120px;
    text-align: right;
    margin-right: 20px;
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
<style>
.noTag .el-form-item__label:before {
  content: '' !important;
}
.isTag .el-form-item__label:before {
  content: '*';
  color: #f55c5c;
  margin-right: 4px;
}
</style>