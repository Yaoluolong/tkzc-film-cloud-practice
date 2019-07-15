<template>
    <div>
        <el-table :data="params" size="mini">
            <el-table-column min-width="300" align="center" label="周期" prop="week">
                <template slot-scope="{row}">
                  <div class="checkbox-plane">
                    <el-checkbox @change="selectAll($event,row)">全选</el-checkbox>&nbsp;&nbsp;&nbsp;
                    <el-checkbox-group v-model="row.week">
                      <el-checkbox :label="index+''" v-for="(i,index) in 7" :key="i">{{index|week}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="开始时间" prop="startTime">
                <template slot-scope="{row}">
                      <el-time-picker v-model="row.startTime" value-format="HH:mm"  :picker-options="{format: 'HH:mm'}" placeholder="请选择" style="width:140px"></el-time-picker>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="结束时间" prop="endTime">
                <template slot-scope="{row}">
                    <el-time-picker v-model="row.endTime" value-format="HH:mm" :picker-options="{format: 'HH:mm'}" placeholder="请选择" style="width:140px"></el-time-picker>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="" prop="oper">
                <template slot-scope="{$index}">
                    <i class="el-icon-remove-outline oper" v-if="params.length!=1" @click="removeRule($index)"></i>&nbsp;&nbsp;
                    <i class="el-icon-circle-plus-outline oper" @click="addRule" v-if="$index==params.length-1"></i>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
      props: {
        value: Array // [{week,startTime,endTime}]
      },
      data() {
        return {
          params: []
        }
      },
      watch: {
        value(val) {
          // this.valueToParams(val)
        },
        params: {
          handler() {
            this.paramsToValue()
          },
          deep: true
        }
      },
      methods: {
        addRule() {
          this.params.push({ week: [], startTime: '', endTime: '' })
        },
        removeRule(index) {
          this.params.splice(index, 1)
        },
        selectAll(val, row) {
          row.week = val ? ['0', '1', '2', '3', '4', '5', '6'] : []
        },
        paramsToValue() {
          const value = JSON.parse(JSON.stringify(this.params))
          value.forEach(e => {
            e.week = e.week.join(',')
          })
          if (JSON.stringify(value) !== JSON.stringify(this.value)) {
            this.$emit('input', value)
          }
        },
        valueToParams(val) {
          if (val) {
            const params = JSON.parse(JSON.stringify(val))
            params.forEach(e => {
              e.week = e.week ? e.week.split(',') : []
            })
            this.params = params
          }
        }
      },
      filters: {
        week(val) {
          const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          return week[val]
        }
      },
      created() {
        if (!this.params || this.params.length === 0) {
          this.params = [{ week: [], startTime: '', endTime: '' }]
        }
        this.valueToParams(this.value)
      }
    }
</script>

<style scoped>
.checkbox-plane{
  display: flex;
}
.oper{
  font-size: 26px;
  color:#F56C6C;
  cursor: pointer;
}
</style>
