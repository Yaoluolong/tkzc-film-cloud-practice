<template>
  <div style="margin-top:10px">
    <el-card>
      <div slot="header">规则列表</div>
      <el-button type="text" @click="showEditRule">+添加影院结算价规则</el-button>    
      <edit-rule v-show="editRuleShow" ref="editRule" :cinemaList="cinemaList">
          <el-button type="primary" @click="saveRule"  v-if="!look">保存</el-button>
          <el-button @click="hideEditRule" >取消</el-button>
      </edit-rule> <br>  <!-- 规则编辑 -->    
      <el-collapse v-if="ruleList.length > 0 " style="margin-top:20px" v-model="activeName" accordion>
        <el-collapse-item style="margin-bottom:3px" v-if="rule"  v-for="(rule,index) in  ruleList" :key="index"  :name="index">
            <template slot="title">
              <!-- <div style=""> -->
                <el-row style="padding-left:5px;background-color:#F7F7F7;font-size:14px;" inline>
                  <el-col :span="6">规则标题：{{rule.name}}</el-col>
                  <el-col :span="7">结算规则：{{rule.typeName}}</el-col>
                  <el-col :span="6">规则状态：<span :class="{red : rule.statusName === '已过期'}">{{rule.statusName ? rule.statusName : '正常'}}</span></el-col>
                  <el-col @click.stop="" :span="4" style="text-align: right;">
                    <el-button type="text" >编辑</el-button>
                     <el-dropdown>
                        <span @click.stop="" class="el-dropdown-link" style="color:#3CB3F0">
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item> <el-button type="text" @click="del(index,rule.id)">删除</el-button></el-dropdown-item>                        
                          <el-dropdown-item> <el-button type="text" @click.stop="copy(index,rule.id)">复制</el-button></el-dropdown-item>                        
                        </el-dropdown-menu>
                      </el-dropdown>    
                  </el-col>
                </el-row>
              <!-- </div>                -->
            </template>
            <div>
              <!-- {{rule}} -->
                <edit-rule :ref="'edit_rule_'+ index" :rule="rule" :cinemaList="cinemaList">
                    <el-button type="primary" @click="saveRuleInList(index)">保存</el-button>
                    <el-button @click="initRuleInList(index)">取消</el-button>
                </edit-rule>
            </div>            
        </el-collapse-item>              
      </el-collapse> 
    </el-card>
      

  </div>
</template>

<script>
import EditRule from './EditRule'
import { deepClone } from '@/utils'
// import { copyRule } from '@/api/mallCenter'
export default {
  name: 'settlement_price_rule_list',
  components: { EditRule },
  props: {
    // value: [String, Object],
    // hallType: String,
    // cinemaIds: Array,
    outRuleList: {// 需要显示的规则列表
      type: Array,
      default: []
    },
    cinemaList: Array // 父组件传过来的影院列表
  },
  data() {
    return {
      activeName: '',
      editRuleShow: '',
      ruleList: this.outRuleList
    }
  },
  watch: {

    outRuleList: function(val) {
      this.ruleList = this.outRuleList
    },
    cinemaList: function(val) {
      if (!val || val.length === 0) {
        this.ruleList = []
        this.editRuleShow = false
      }
    }
  },
  methods: {
    // 保存列表中的规则
    async saveRuleInList(index) {
      const temp = await this.$refs['edit_rule_' + index][0].getReturn()
      this.ruleList[index] = temp
      this.activeName = ''
    },
    initRuleInList(index) {
      this.$refs['edit_rule_' + index][0].initData()
      this.activeName = ''
    },
    // 保存单条规则
    saveRule() {
      this.handleRuleList()
    },
    // 处理单条规则列表
    async handleRuleList() {
      const rule = await this.$refs.editRule.getReturn()

      // todo 数据提交到后台前需要将这个方法删除
      rule.getRuleStatusName = function() {
        // const startTimeLong = new Date(this.startTime).getTime()
        const endTimeLong = new Date(this.endTime).getTime()
        const current = new Date().getTime()
        if (current < endTimeLong) {
          return '正常'
        } else {
          return '已过期'
        }
      }
      // console.log('allRule======', rule)
      this.ruleList.push(rule)
      this.hideEditRule()
    },
    showEditRule() {
      if (this.cinemaList && this.cinemaList.length > 0) {
        this.editRuleShow = true
      } else {
        this.$message.warning('请选择影院')
      }
    },
    hideEditRule() {
      this.editRuleShow = false
      this.$refs.editRule.clearData()
    },
    del(index, id) {
      this.ruleList.splice(index, 1)
      // if (id) {
      //   deleteRule(id)
      // }
    },
    async copy(index, id) {
      // if (this.$route.query.id) {
      //   this.$message.warning('开发中')
      //   return
      // }
      const temp = deepClone(this.ruleList[index])
      temp.getRuleStatusName = function() {
        const endTimeLong = new Date(this.endTime).getTime()
        const current = new Date().getTime()
        if (current < endTimeLong) {
          return '正常'
        } else {
          return '已过期'
        }
      }
      // if (id) {
      //   temp.id = await copyRule(id)
      // }
      this.ruleList.push(temp)
    },
    getReturn() {
      return new Promise(async(resolve, reject) => {
        const result = []
        for (let i = 0; i < this.ruleList.length; i++) {
          const e = this.ruleList[i]
          if (e) {
            const refName = 'edit_rule_' + i
            const temp = this.$refs[refName][0]
            const oneRule = await temp.getReturn()
            // delete oneRule.getRuleStatusName
            delete oneRule.typeName
            delete oneRule.statusName

            result.push(oneRule)
          }
        }
        // 判断各规则间时间有没有交集
        this.ruleList.forEach((e, index) => {
          if (e) {
            this.ruleList.forEach((rule, ruleIndex) => {
              if (index !== ruleIndex) {
                const startTime = new Date(e.startTime).getTime()
                const endTime = new Date(e.endTime).getTime()
                const ruleStartTime = new Date(rule.startTime).getTime()
                const ruleEndTime = new Date(rule.endTime).getTime()
                if ((startTime > ruleStartTime && startTime < ruleEndTime) || (endTime > ruleStartTime && endTime < ruleEndTime)) {
                  this.$message.warning('各规则间时间不能有交集,请重新设置')
                  reject('各规则间时间不能有交集,请重新设置')
                  return
                }
              }
            })
          }
        })
        resolve(result)
      })
    }
  },
  created() {

  }
}
</script>

<style scoped lang="scss">
.red{
  color: red
}
</style>
