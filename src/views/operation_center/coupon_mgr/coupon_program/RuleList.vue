<template>
  <div class="app-container">
    <el-button type="text" @click="addRule">+添加电影券使用规则</el-button>
    <el-collapse accordion v-model="activeNames" style="margin-top:20px;">
      <el-collapse-item  :name="index" v-for="(rule,index) in rules" :key="index">
        <template slot="title">
          <el-row style="padding-left:5px;background-color:#F7F7F7;font-size:14px;" inline>
              <el-col :span="6">
                <span><i ></i>规则名称 : {{rule.ruleName||'未命名'}}</span>
              </el-col>
              <el-col :span="7">
                <span>结算规则：{{rule.settlementType==1? '影厅':'制式'}}</span>
              </el-col>
              <el-col :span="6">
                <span>方案内规则优先级：{{rule.sort}}级</span>
              </el-col>
              <el-col :span="4" style="text-align: right;">
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
          
          
        </template>
        <rule-info ref="ruleInfo" :disableSort="getDisableSort(index)" :disableStandards="getDisableStandards(index)" :disableHallIds="getDisableHallIds(index)" :saveFun="saveFun" v-model="rules[index]" :cinema-id="cinemaId"></rule-info>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

import RuleInfo from './RuleInfo'
import Bus from './bus.js'
import { deepClone } from '@/utils'
export default {
  name: 'edit_category',
  components: { RuleInfo },
  props: {
    outSideData: Array
  },
  data() {
    return {
      activeNames: '',
      rules: this.outSideData,
      cinemaId: ''
    }
  },
  watch: {
    outSideData(val) {
      if (val) {
        this.rules = val
      }
    },
    rules(val) {
      Bus.$emit('rules', this.rules)
    },
    activeNames(val) {

    }
  },
  methods: {
    getDisableStandards(index) {
      let disableStandards = []
      for (let i = 0; i < this.rules.length; i++) {
        if (i === index) continue
        const e = this.rules[i]
        if (e.settlementType === '2') {
          if (e.standard) {
            const array = e.standard.split(',')
            disableStandards = [...disableStandards, ...array]
          }
        }
      }
      return disableStandards
    },
    getDisableHallIds(index) {
      let disableHallIds = []
      for (let i = 0; i < this.rules.length; i++) {
        if (i === index) continue
        const e = this.rules[i]
        if (e.settlementType === '1') {
          if (e.hallId) {
            const array = e.hallId.split(',')
            disableHallIds = [...disableHallIds, ...array]
          }
        }
      }

      return disableHallIds.filter(e => e)
    },
    getDisableSort(index) {
      const disableSort = []
      for (let i = 0; i < this.rules.length; i++) {
        if (i === index) continue
        const e = this.rules[i]
        if (e.sort) {
          disableSort.push(e.sort)
        }
      }
      return disableSort
    },
    saveFun() {
      this.closeAllCollapse()
    },
    closeAllCollapse() {
      this.activeNames = ''
    },
    del(index, id) {
      this.rules.splice(index, 1)
    },
    copy(index, id) {
      if (this.rules.length === 3) {
        this.$message.warning('一个方案至多可配置3条规则')
        return
      }
      const temp = deepClone(this.rules[index])
      if (temp.id) {
        delete temp.id
      }
      this.rules.push(temp)
    },
    getResult() {
      return new Promise((resolve, reject) => {
        const temp = { ruleList: this.rules.filter(e => !e.unSave) }
        temp.ruleList.forEach(e => {
          delete e.unSave
        })
        resolve(temp)
      })
    },
    addRule() {
      if (this.rules.length === 3) {
        this.$message.warning('一个方案至多可配置3条规则')
        return
      }
      this.rules.push({ ruleName: '', settlementType: '1', sort: '0', unSave: true })
      this.activeNames = this.rules.length - 1
    },
    removeRule(obj) {
      const index = this.rules.findIndex(e => e === obj)
      if (index > -1) {
        this.rules.splice(index, 1)
      }
    }
  },
  async created() {
    Bus.$on('cinemaId', val => { this.cinemaId = val })
    Bus.$on('cancleRule', val => { this.closeAllCollapse() })
  }
}
</script>

<style scoped lang="scss">
.app-container{
  margin: 0px;
}
</style>
