<template>
  <div>
    <el-form-item label="影院编码">
      <el-input v-model.trim="query.cinemaThirdNo" clearable placeholder="请输入编码、影院名称" class="w200"></el-input>
    </el-form-item>
    <el-form-item label="接口商">
      <remote-select-multiple
        collapse-tags
        v-model="interfaceTypeIdArray"
        showAllOption
        placeholder="选择接口商"
        action="/systemApi/interfaceType/getList"
        class="w200"
        @change="interfaceTypeChange"
      ></remote-select-multiple>
    </el-form-item>
    <el-form-item label="地区">
      <el-input
        v-model="area"
        placeholder="选择地区模糊查询"
        class="w200"
        @focus="onOperateClick('area')"
        @keyup.native="onOperateClick('keyupArea')"
      ></el-input>
    </el-form-item>
    <query-city
      v-model="areaVisible"
      v-if="areaVisible"
      :city-params="query"
      @cancel="closeCity"
      @change="saveArea"
    ></query-city>
  </div>
</template>

<script>
import queryCity from './queryCity'
export default {
  components: { queryCity },
  props: {
    queryParams: {
      type: Object,
      default() {
        return {}
      }
    },
    areaStr: {
      type: String,
      default: ''
    }
  },
  watch: {
    queryParams: {
      handler(val) {
        this.getInfo(val)
      },
      deep: true
    }
  },
  data() {
    return {
      query: {
        cinemaThirdNo: '',
        interfaceId: '',
        provinceId: '',
        cityId: ''
      },
      area: '',
      interfaceTypeIdArray: ['-1'], // 接口商数组，默认全选
      areaVisible: false
    }
  },
  mounted() {
    if (JSON.parse(JSON.stringify(this.queryParams) !== '{}')) this.getInfo(this.queryParams)
    this.interfaceTypeChange()
  },
  methods: {
    getInfo(val) {
      console.log(1111111111)
      this.query.cinemaThirdNo = val.cinemaThirdNo
      this.query.provinceId = val.provinceId
      this.query.cityId = val.cityId
      this.area = this.areaStr
      this.interfaceTypeIdArray = val.interfaceId ? val.interfaceId.split(',') : ['-1']
    },
    // 接口商点击全部时清除其他选项
    interfaceTypeChange() {
      this.interfaceTypeIdArray.forEach(e => {
        if (e === '-1') {
          this.interfaceTypeIdArray = ['-1']
          return false
        }
      })
    },
    onOperateClick(type) {
      switch (type) {
        case 'area':
          this.areaVisible = true
          break
        case 'keyupArea':
          break
      }
    },
    closeCity() {
      this.areaVisible = false
    },
    // 获取地区参数
    saveArea(areaInfo) {
      this.query.provinceId = areaInfo.provinceId
      this.query.cityId = areaInfo.cityId
      this.area =
        areaInfo.provinceName + (areaInfo.provinceName && areaInfo.cityName
          ? ','
          : '') + areaInfo.cityName
    },
    querySubmit() {
      this.query.interfaceId = this.interfaceTypeIdArray
        .filter(e => e)
        .join(',')
      const params = {
        query: this.query,
        area: this.area
      }
      this.$emit('change', params)
    }
  }
}
</script>
