<template>
    <div class="app-container">
    
      <el-form inline-message ref="form" :model="submitData" :rules="rules">
        <el-form-item label="检测影院:" prop="cinemaId">
              <cinema-id-selector v-model="submitData.cinemaId" style="width:200px;"></cinema-id-selector>
        </el-form-item>
        <el-form-item label="检测类型:">
            <el-radio-group v-model="submitData.type">
              <el-row v-for="pType in checkPType" :key="pType" style="margin-top:3%">
                <el-radio v-if="checkType.pType === pType" v-for="checkType in checkTypes" :label="checkType.type" :key="checkType.type">{{checkType.name}}</el-radio>               
              </el-row>   
            </el-radio-group>          
        </el-form-item>
      </el-form> 
           <el-button @click="doCheck" type="primary" style="margin-left:5%">开始检测</el-button>
      <el-form style="margin-top:3%">
        <el-form-item label="系统商返回结果：">
            <el-table v-if="checkResult && checkResult.length > 0" :data="checkResult">
                <el-table-column label="影厅编码" align="center" prop="hallNo"></el-table-column>
                <el-table-column label="影厅名称" align="center" prop="hallName"></el-table-column>
                <el-table-column label="影厅座位数" align="center" prop="seatCount"></el-table-column>
            </el-table>
            <div v-else-if="tipShow">暂无该影院影厅相关数据</div>
        </el-form-item>
      </el-form>
      

        
    </div>
</template>

<script>
import { cinemaCheck } from '@/api/mallCenter'
export default {
  name: 'cinema_check',
  data() {
    return {
      tipShow: false,
      checkPType: ['1'
      // '2',   后面两种暂时不开放
      // '3'
      ],
      checkTypes: [
        {
          pType: '1',
          name: '检测影厅',
          type: 'hall'
        },
        {
          pType: '2',
          name: '检测影院卡等级',
          type: 'cardPolicy'
        },
        {
          pType: '2',
          name: '检测影院卡登录',
          type: 'cardLogin'
        },
        {
          pType: '2',
          name: '检测影院卡充值',
          type: 'cardRecharge'
        },
        {
          pType: '3',
          name: '检测卖品',
          type: 'goods'
        }

      ],
      submitData: {
        type: 'hall',
        cinemaId: ''
      },
      rules: {
        cinemaId: { required: true, message: '请选择检测影院', trigger: 'blur' }
      },
      checkResult: []
    }
  },
  methods: {
    doCheck() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.checkResult = await cinemaCheck(this.submitData)
          this.tipShow = true
        }
      })
    }

  },
  watch: {

  }
}
</script>

<style scoped>

</style>
