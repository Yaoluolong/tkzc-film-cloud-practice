<template>
  <div class="app-container">
    <el-form label-width="130px" label-position="left" style="width:1000px;" :model="params" :rules="rules" ref="form">
      <el-form-item label="调价方案名称" prop="name" >
          <el-input clearable  v-model="params.name" placeholder="请输入调价方案名称" style="width:320px"></el-input>
      </el-form-item>
      <el-form-item label="归属影院策略组" prop="policyGroupId">
        <el-select clearable v-model="form.policyGroupId" placeholder="请选择" style="width:320px">
          <el-option v-for="item in groupOptions" :key="item.index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调价渠道商" prop="channelId">
        <channel-id-selector style="width:320px;" v-model="params.channelId"></channel-id-selector>
      </el-form-item>
      <el-form-item label="调价适用影院" prop="cinemaId" >
        <cinema-selector v-model="cinemaIds" :group-id="form.policyGroupId"></cinema-selector>
       </el-form-item>
      <div class="active" v-for="Item in ajustForm" :key="Item.index">
        <el-form-item label="调价场次" prop="type">
          <el-select clearable v-model="form.type" style="width:320px;margin-right:20px;" :disabled="ajustForm.length > 1 && Item.index > 0 ? true : false">
            <el-option value="-1" label="不限场次"></el-option>
            <el-option value="day" label="场次区间每天"></el-option>
            <el-option value="week" label="场次区间每周"></el-option>
          </el-select>
          <span v-if="form.type == 'week'">
            <el-select clearable v-model="Item.week" multiple placeholder="请选择星期" style="width:150px;margin-right:20px;">
              <el-option v-for="item in weekOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <el-time-picker is-range v-model="Item.weekTime" value-format="HH:mm" format="HH:mm" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" style="width:320px;"></el-time-picker>
          </span>
          <el-time-picker v-if="form.type == 'day'" is-range v-model="Item.dayTime" value-format="HH:mm" format="HH:mm" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" style="width:320px;"></el-time-picker>
        </el-form-item>

        <el-form-item v-if="form.type" label="调整票价" prop="type">
          <el-select clearable v-model="Item.floatType" style="width:320px;margin-right:20px;">
            <el-option value="add" label="增加"></el-option>
            <el-option value="sub" label="减少"></el-option>
          </el-select>
          <label style="font-weight:normal">平台票价</label>
          <el-input clearable  v-model="Item.ticketPrice" placeholder="0.00" style="width:80px;"></el-input>
          <span>&nbsp;元</span>
          <span class="add-button">           
            <el-tooltip content="最多添加3条立减规则！" placement="right-start" effect="dark">
              <el-button v-if="addButon && Item.index == 0"  @click="addAjust" :disabled="ajustForm.length > 2 ? true : false" type="primary" icon="el-icon-plus" style="width:35px;padding:10px;"></el-button>
            </el-tooltip>           
            <el-button v-if="delButon && Item.index > 0" @click="delAjust(Item.index)" type="info" icon="el-icon-minus" style="width:35px;padding:10px;"></el-button>
          </span>
        </el-form-item>  
      </div>

      <el-form-item style="text-align:center;margin-top:50px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="closeTab" >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPriceGroupList, createPriceModify, getPriceModifyInfo } from '@/api/priceCenter'
import CinemaSelector from '@/views/price_center/price_program_mgr/CinemaSelector'

export default {
  name: 'edit_plan_price_program',
  components: { CinemaSelector },
  data() {
    return {
      params: {
      },
      form: {},
      weekOptions: [],
      groupOptions: [],
      // cinemaIds: [],
      cinemaList: [],
      addButon: false,
      delButon: false,
      i: 0,
      ajustForm: [
        { index: 0 }
      ],
      rules: {
        name: { required: true, max: 10, message: '请输入方案名称,最多10个字', trigger: 'blur' },
        policyGroupId: { required: true, message: '请选择影院策略组', trigger: 'blur' },
        channelId: { required: true, message: '请选择渠道商', trigger: 'blur' }
      },
      isEdit: false
    }
  },
  watch: {
    'form.type'(val) {
      this.buttonShow(val)
    }
  },
  computed: {
    cinemaIds() {
      return this.cinemaList.map(e => e.value)
    }
  },
  methods: {
    save() {
      this.formToParams()

      createPriceModify(this.params)
    },
    formToParams() {
      const Params = this.params
      const Ajust = this.ajustForm

      Params.policyGroupId = this.form.policyGroupId
      Params.cinemaId = this.cinemaIds.join(',')
      Params.priceRule = []

      for (let i = 0; i < Ajust.length; i++) {
        Params.priceRule.push({
          type: this.form.type,
          floatType: Ajust[i].floatType,
          ticketPrice: Ajust[i].ticketPrice
        })

        if (this.form.type === 'day') {
          Params.priceRule[i].startTime = Ajust[i].dayTime[0]
          Params.priceRule[i].endTime = Ajust[i].dayTime[1]
        } else if (this.form.type === 'week') {
          Params.priceRule[i].startTime = Ajust[i].weekTime[0]
          Params.priceRule[i].endTime = Ajust[i].weekTime[1]
          Params.priceRule[i].week = Ajust[i].week.join(',')
        }
      }
      Params.priceRule = JSON.stringify(Params.priceRule)
      // console.log(Params, 1212132)
    },
    dateCreate() {
      for (let j = 0; j < 7; j++) {
        let week = ''
        switch (j) {
          case 0: week = '一'
            break
          case 1: week = '二'
            break
          case 2: week = '三'
            break
          case 3: week = '四'
            break
          case 4: week = '五'
            break
          case 5: week = '六'
            break
          case 6: week = '日'
            break
        }
        this.weekOptions.push({ value: j, name: '星期' + week })
      }
    },
    addAjust() {
      this.i++
      this.ajustForm.push({ index: this.i, type: this.ajustForm[0].type })
      console.log(this.ajustForm, 1)
    },
    delAjust(index) {
      const del = this.ajustForm.filter(e => e.index === index)[0]
      this.arrRemove(this.ajustForm, del)
      this.i--
    },
    arrRemove(Arr, removeItem) {
      for (let i = 0; i < Arr.length; i++) {
        if (Arr[i] === removeItem) {
          Arr.splice(i, 1)
          return
        }
      }
    },
    buttonShow(val) {
      if (val === '-1') {
        this.ajustForm = [{ index: 0 }]
        this.addButon = false
        this.delButon = false
      } else {
        this.addButon = true
        this.delButon = true
      }
    },
    async groupData() {
      const data = await getPriceGroupList()
      this.groupOptions = data.filter(e => e.priceRight === '1' || e.priceRight === '3')
    }
  },
  async created() {
    // 编辑
    if (this.$route.query.id) {
      this.isEdit = true
      this.params = await getPriceModifyInfo(this.$route.query.id)
    }
    // 生成月天数
    this.dateCreate()
    this.groupData()
  }
}
</script>

<style scoped lang="scss">
.sub-menu{
  margin: 10px;
}
.add-button {
  margin-left: 70px;
}
.tip {
  font-size: 20px;
  color: #409EFF;
}
.active {
  border-bottom: 1px solid #f1f1f1;
  margin-bottom: 50px;
}
</style>
