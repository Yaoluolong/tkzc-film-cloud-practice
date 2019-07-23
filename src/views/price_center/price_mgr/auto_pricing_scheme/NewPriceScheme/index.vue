<template>
  <div class="app-container">
    <div class="tr">
      <el-radio-group v-model="info.programType" @change="handleChangeProgramType">
        <el-radio-button :label="'1'">基础</el-radio-button>
        <el-radio-button :label="'2'">高级</el-radio-button>
      </el-radio-group>
    </div>
    <div class="mt10">基本信息</div>
    <el-form :model="info" :rules="infoRules" label-width="90px" ref="infoForm" class="mt20">
      <el-form-item label="方案名称" prop="name">
        <el-input
          v-model="info.name"
          size="small"
          maxlength="20"
          clearable
          class="w400"
          placeholder="智能定价方案名称，不超过20个字"
        ></el-input>
      </el-form-item>
      <el-form-item label="有效期" prop="startDate">
        <el-date-picker
          v-model="baseDateRange"
          type="daterange"
          size="small"
          clearable
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="w400 rest-range"
          value-format="yyyy-MM-dd"
          @change="handleChangeDateRange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="系统商" prop="interfaceId">
        <common-select
          v-model="info.interfaceId"
          :select-type="'interfaceType'"
          :default-selection="defaultInterfaceType"
          class="w400"
        ></common-select>
      </el-form-item>
      <template v-if="+info.programType===2">
        <el-form-item
          label="区域"
          prop="cinemaGroupId"
          :rules="+info.areaType===1?otherRules.cinemaGroupId:[]"
        >
          <el-radio-group v-model="info.areaType" clearable @change="changeAreaType">
            <el-radio :label="'0'">全部</el-radio>
            <el-radio :label="'1'">指定分组</el-radio>
          </el-radio-group>
          <common-select
            v-if="+info.areaType===1"
            v-model="info.cinemaGroupId"
            :select-type="'cinemaGroup'"
            :default-selection="defaultAreaType"
            class="w400"
          ></common-select>
        </el-form-item>
        <el-form-item label="影片" prop="filmNo" :rules="+info.filmType===1?otherRules.filmNo:[]">
          <el-radio-group v-model="info.filmType" clearable @change="changeFilmType">
            <el-radio :label="'0'">全部</el-radio>
            <el-radio :label="'1'">指定影片</el-radio>
          </el-radio-group>
          <div class="mt10">
            <common-select
              v-if="+info.filmType===1"
              v-model="info.filmNo"
              :attr-options="{multiple:true}"
              :select-type="'filmList'"
              :action-query="{type:1}"
              :default-selection="defaultFilms"
              class="w400"
            ></common-select>
          </div>
        </el-form-item>
        <el-form-item label="制式" prop="copyType" :rules="otherRules.copyType">
          <el-checkbox v-model="checkAllHall" class="mr15" @change="handleCheckAllChangeHall">全选</el-checkbox>
          <el-checkbox-group v-model="info.copyType">
            <el-checkbox
              v-for="(item,index) in defaultCopyType"
              :key="index"
              :label="item.value"
            >{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </template>
    </el-form>
    <rules-list v-model="info.rule" :program-id="id" ref="ruleList"></rules-list>
    <div class="mt50 tr">
      <el-button @click="closeTab">取消</el-button>
      <el-button type="primary" @click="onSubimt">保存</el-button>
    </div>
  </div>
</template>
<script>
import RulesList from './components/RulesList'
import CommonSelect from '@/components/CommonSelect'
import { getSelectValue } from '@/utils'
import { createRuleItem } from '@/views/price_center/price_mgr/auto_pricing_scheme/constant'
import {
  getAutoPriceInfo,
  createAutoPrice,
  updateAutoPrice
} from '@/api/priceCenter'
export default {
  name: 'new_auto_pricing_scheme',
  components: {
    RulesList,
    CommonSelect
  },
  data() {
    return {
      id: null,
      ruleMaxNumber: 3,
      info: {
        id: null,
        name: null,
        programType: '1',
        interfaceId: null,
        areaType: 0,
        cinemaGroupId: null,
        filmType: 0,
        filmNo: null,
        copyType: [],
        startDate: '',
        endDate: '',
        rule: []
      },
      infoRules: {
        name: { required: true, trigger: 'blur', message: '请输入方案名称' },
        startDate: { required: true, trigger: 'change', message: '请选择时间' },
        interfaceId: {
          required: true,
          trigger: 'change',
          message: '请选择系统商'
        }
      },
      otherRules: {
        cinemaGroupId: {
          required: true,
          trigger: 'change',
          message: '请选择分组'
        },
        filmNo: { required: true, trigger: 'change', message: '请选择影片' },
        copyType: { required: true, trigger: 'change', message: '请选择制式' }
      },
      filmList: [],
      baseDateRange: null,
      interfaceList: [],
      // checkAllHall: false,
      defaultCopyType: [
        { value: '2D', label: '2D' },
        { value: '3D', label: '3D' },
        { value: 'IMAX2D', label: 'IMAX 2D' },
        { value: 'IMAX3D', label: 'IMAX 3D' },
        { value: 'DMAX2D', label: 'DMAX 2D' },
        { value: 'DMAX3D', label: 'DMAX 3D' }
      ],
      defaultInterfaceType: null,
      defaultAreaType: null,
      defaultFilms: []
    }
  },
  computed: {
    checkAllHall: {
      set(newVal) {
        return newVal
      },
      get() {
        return (
          this.info.copyType &&
          this.info.copyType.length === this.defaultCopyType.length
        )
      }
    }
  },
  // watch: {
  //   'info.filmType'(val, oldVal) {
  //     if (+oldVal === 1 && +val === 0) {
  //       this.info.filmNo = ''
  //     }
  //   }
  // },
  mounted() {
    if (this.$route.query && this.$route.query.id) {
      this.id = this.$route.query.id
      this.info.id = this.id
      this.getDetial()
    } else {
      this.info.rule.push(createRuleItem())
    }
  },
  methods: {
    getSelectValue,
    changeAreaType(val) {
      if (+val === 0) {
        this.info.cinemaGroupId = null
      }
    },
    changeFilmType(val) {
      if (+val === 0) {
        this.info.filmNo = null
      }
    },
    async getDetial() {
      const info = await getAutoPriceInfo({
        id: this.id
      })
      this.info = {
        ...this.info,
        ...info
      }
      this.defaultInterfaceType = {
        id: info.interfaceId,
        name: info.interfaceName
      }
      if (+info.cinemaGroupId) {
        this.defaultAreaType = {
          id: info.cinemaGroupId,
          name: info.cinemaGroupName
        }
      }
      if (info.filmNo) {
        const filmNoArr = info.filmNo.split(',')
        const filmNameArr = info.filmName.split(',')
        this.defaultFilms = filmNoArr.map((v, i) => {
          return {
            value: filmNoArr[i],
            name: filmNameArr[i]
          }
        })
      }
      this.baseDateRange =
        info.startDate && info.endDate ? [info.startDate, info.endDate] : null
    },
    handleChangeDateRange(val) {
      if (val) {
        this.info.startDate = val[0]
        this.info.endDate = val[1]
      } else {
        this.info.startDate = ''
        this.info.endDate = ''
      }
    },
    handleCheckAllChangeHall(val) {
      this.$set(
        this.info,
        'copyType',
        val === false ? [] : this.defaultCopyType.map(v => v.value)
      )
    },
    handleChangeProgramType(val) {
      this.handleCheckAllChangeHall(false)
      if (+val === 1) {
        this.info = {
          ...this.info,
          areaType: null,
          cinemaGroupId: null,
          filmType: null,
          filmNo: null,
          copyType: []
        }
      } else {
        this.info = {
          ...this.info,
          areaType: '0',
          cinemaGroupId: null,
          filmType: '0',
          filmNo: null,
          copyType: []
        }
      }
    },
    async onSubimt() {
      await this.$refs.infoForm.validate()
      await this.$refs.ruleList.validateAll()
      if (this.id) {
        await updateAutoPrice(Object.assign({}, this.info, { id: this.id }))
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      } else {
        await createAutoPrice(Object.assign({}, this.info))
        this.$message({
          type: 'success',
          message: '新建成功!'
        })
      }
      this.closeTab(true)
    }
  }
}
</script>
<style lang="scss">
.rest-range {
  &.el-date-editor {
    .el-range-separator {
      width: auto !important;
    }
  }
}
</style>
