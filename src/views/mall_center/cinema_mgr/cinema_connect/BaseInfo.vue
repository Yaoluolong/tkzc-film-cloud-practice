<template>
  <div class="app-container cinema-base-info-box">
    <el-form
      label-width="120px"
      label-position="left"
      style="width:1000px;"
      :model="params"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="影院编码" prop="cinemaId">
        <el-input
          v-model.trim="params.cinemaId"
          :disabled="cinemaIdInput"
          placeholder="请输入广电下发影院编码"
          style="width:320px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="影院名称" prop="cinemaName">
        <el-input
          v-model.trim="params.cinemaName"
          placeholder="请输入影院名称,最多20个字"
          style="width:320px;"
        ></el-input>
      </el-form-item>
      <div class="form-item-row">
        <el-form-item label="影院所在地区" prop="area">
          <city-cascader
            ref="city"
            v-model="params.area"
            :rang="2"
            placeholder="请选择"
            style="width:320px;"
          ></city-cascader>
        </el-form-item>
        <el-form-item label="影院详细地址" prop="address">
          <el-input v-model.trim="params.address" placeholder="如道路,门牌号,楼栋号等"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="地址经纬度" prop="longitudeAndlatitude">
        <el-input
          v-model="params.longitudeAndlatitude"
          placeholder="维度前经度后,若南纬西经值前加'-',如:-23.03"
          style="width:320px;"
        ></el-input>
        <el-button type="primary" @click="openMap()">标注</el-button>
      </el-form-item>
      <!-- <el-form-item label="影院官网" prop="website" >
        <el-input v-model.trim="params.website"   placeholder="请输入影院官网" style="width:320px;"></el-input>
      </el-form-item>-->
      <el-form-item label="影院简介/公告" prop="summary">
        <el-input v-model.trim="params.summary" type="textarea" :rows="4" placeholder="输入影院简介/公告"></el-input>
      </el-form-item>
      <el-form-item label="接入有效期" prop="time">
        <el-date-picker
          unlink-panels
          v-model="params.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:320px;"
        ></el-date-picker>
      </el-form-item>
      <div class="form-item-row">
        <el-form-item label="同步影院排期" prop="requestPlanDays">
          <tip content="可从影院对接的系统商处同步回最大的影片排期天数">
            <el-input v-model.trim="params.requestPlanDays" placeholder="请输入">
              <template slot="prepend">系统当前时间往后</template>
            </el-input>
          </tip>
        </el-form-item>
        <el-form-item label="同步排期间隔" prop="requestPlanTimes">
          <tip content="每次从影院对接的系统商处同步排期的时间间隔。">
            <el-input v-model.trim="params.requestPlanTimes" placeholder="请输入">
              <template slot="append">分钟</template>
            </el-input>
          </tip>
        </el-form-item>
      </div>
      <div class="form-item-row">
        <el-form-item label="保留排期数据" prop="remainPlanDays">
          <tip content="对放映过后的影片排期在数据库内保存的时间周期。">
            <el-input v-model.trim="params.remainPlanDays" placeholder="请输入">
              <template slot="append">天</template>
            </el-input>
          </tip>
        </el-form-item>
        <el-form-item label="排期停售时间" prop="stopTime">
          <el-input v-model.trim="params.stopTime" placeholder="请输入">
            <template slot="prepend">开映前</template>
            <template slot="append">分钟停止售卖</template>
          </el-input>
        </el-form-item>
      </div>
      <!-- <div class="form-item-row">
        <el-form-item label="商务对接人" prop="businessName" >
          <el-input v-model.trim="params.businessName"   placeholder="请输入商务对接人姓名" ></el-input>
        </el-form-item>
        <el-form-item label="商务对接人电话" prop="businessTel" >
          <el-input v-model.trim="params.businessTel"   placeholder="请输入商务对接人联系方式,如手机,固话,QQ" ></el-input>
        </el-form-item>
      </div>
      <div class="form-item-row">
        <el-form-item label="影院负责人" prop="leadingName" >
          <el-input v-model.trim="params.leadingName"   placeholder="请输入影院负责人,如:店长" ></el-input>
        </el-form-item>
        <el-form-item label="影院负责人电话" prop="leadingTel" >
          <el-input v-model.trim="params.leadingTel"   placeholder="请输入影院负责人联系方式,如手机,固话,QQ" ></el-input>
        </el-form-item>
      </div>-->
      <el-form-item label="影院客服电话" prop="serviceTelType">
        <title-plane>
          <template slot="header">
            <el-radio v-model="params.serviceTelType" label="1">统一方式</el-radio>
            <el-radio v-model="params.serviceTelType" label="2">分终端方式</el-radio>
          </template>
          <template v-if="params.serviceTelType==2">
            <el-form-item label="微信H5" prop="wap1" class="inner-item">
              <el-input v-model.trim="params.wap1" placeholder="请输入客服电话1"></el-input>
              <el-input v-model.trim="params.wap2" placeholder="请输入客服电话2" style="margin-left:20px"></el-input>
            </el-form-item>
            <el-form-item label="移动APP" prop="app1" class="inner-item">
              <el-input v-model="params.app1" placeholder="请输入客服电话1"></el-input>
              <el-input v-model="params.app2" placeholder="请输入客服电话2" style="margin-left:20px"></el-input>
            </el-form-item>
            <el-form-item label="小程序" prop="web1" class="inner-item">
              <el-input v-model="params.web1" placeholder="请输入客服电话1"></el-input>
              <el-input v-model="params.web2" placeholder="请输入客服电话2" style="margin-left:20px"></el-input>
            </el-form-item>
          </template>
          <el-form-item v-else prop="serviceTel1" class="inner-item">
            <el-input v-model.trim="params.serviceTel1" placeholder="请输入客服电话1"></el-input>
            <el-input
              v-model.trim="params.serviceTel2"
              placeholder="请输入客服电话2"
              style="margin-left:20px;"
            ></el-input>
          </el-form-item>
        </title-plane>
      </el-form-item>
      <!-- <div class="form-item-row">
        <el-form-item label="影院LOGO" prop="logo" >
          <pic-upload content="建议尺寸200*200" v-model="params.logo" :delShow="true"></pic-upload>
        </el-form-item>
        <el-form-item label="影院公众号" prop="publicNumber" >
          <pic-upload content="建议尺寸200*200" v-model="params.publicNumber" :delShow="true"></pic-upload>
        </el-form-item>
      </div>-->
    </el-form>
    <el-dialog title="标注" :visible.sync="dialogVisible">
      <div style="margin-bottom:20px;">
        <el-input v-model.trim="mapAddress" placeholder="请输入详细地址" style="width:50%;"></el-input>
        <el-button type="primary" @click="searchMap()">查询</el-button>
        <el-button type="success" @click="mapLabel()" style="float:right">标注</el-button>
      </div>
      <div class="baidu-map" id="Bmap"></div>
    </el-dialog>
  </div>
</template>

<script>
import CityCascader from '@/components/CityCascader'
// import BMap from 'BMap'

export default {
  name: 'base_info',
  components: { CityCascader },
  data() {
    const serviceTelValidator = (type, serviceTelType = '2') => {
      return (rule, value, cb) => {
        if (
          this.params.serviceTelType === serviceTelType &&
          (!this.params[type + '1'] && !this.params[type + '2'])
        ) {
          cb(new Error('至少填写一个客服电话'))
        }
        cb()
      }
    }

    const longitudeAndlatitudeValidator = (rule, value, cb) => {
      if (!value || value === '') {
        cb(new Error('请输入地址经纬度'))
      }
      // if (!/^[-]{0,1}\d{2,3}.\d{2,3},[-]{0,1}\d{2,3}.\d{2,3}$/.test(value)) {
      //   cb(new Error('请填写正确格式的经纬度,如 23.03,113.75 或 -23.03,113.75'))
      // }
      cb()
    }

    const cinemaIdValidator = (rule, value, cb) => {
      if (!value || value === '') {
        cb(new Error('请输入广电下发影院编码'))
      } else {
        this.cinemaId = value
      }
      cb()
    }
    return {
      id: '',
      cinemaIdInput: false,
      mapAddress: '',
      dialogVisible: false,
      longitudeAndlatitude: '',
      cinemaId: '',
      params: {
        serviceTelType: '2',
        copyTypeConfig: []
        // ----
        // cinemaId: '3501231',
        // cinemaName: '测试影院',
        // area: '',
        // address: '测试地址',
        // longitudeAndlatitude: '23.03,113.75',
        // time: ['2018-07-08', '2018-09-32'],
        // requestPlanDays: '1',
        // requestPlanTimes: '2',
        // remainPlanDays: '3',
        // stopTime: '4',
        // businessName: '测试商务对接人',
        // businessTel: '13850100342',
        // leadingName: '测试影院负责人',
        // leadingTel: '13850100459',
        // wap1: '13850100342',
        // app1: '13850100342',
        // web1: '13850100342',
        // serviceTel1: '13850100342',
        // copyType: '',
        // copyTypeConfig1: '',
        // latitude: '23.03',
        // longitude: '113.75'
      },
      serviceTelParams: {},
      serviceTelRules: {},
      rules: {
        cinemaId: {
          required: true,
          validator: cinemaIdValidator,
          trigger: ['change', 'blur']
        },
        cinemaName: {
          required: true,
          max: 20,
          message: '请输入影院名称,最多20个字',
          trigger: 'blur'
        },
        area: {
          required: true,
          message: '请选择所在地区',
          trigger: ['blur', 'change']
        },
        address: {
          required: true,
          message: '请输入影院详细地址',
          trigger: 'blur'
        },
        longitudeAndlatitude: {
          required: true,
          validator: longitudeAndlatitudeValidator,
          trigger: 'blur'
        },
        time: {
          required: true,
          message: '请选择接入有效期',
          trigger: ['change', 'blur']
        },
        requestPlanDays: {
          required: true,
          message: '请输入同步影院排期',
          trigger: 'blur'
        },
        requestPlanTimes: {
          required: true,
          message: '请输入同步排期间隔',
          trigger: 'blur'
        },
        remainPlanDays: {
          required: true,
          message: '请输入保留排期数据',
          trigger: 'blur'
        },
        stopTime: {
          required: true,
          message: '请输入排期停售时间',
          trigger: 'blur'
        }
        // summary: { required: true, min:0, max: 100, message: '请输入影院公告,最多100个字', trigger: 'blur' },
        // businessName: { required: true, message: '请输入商务对接人', trigger: 'blur' },
        // businessTel: { required: true, message: '请输入商务对接人电话', trigger: 'blur' },
        // leadingName: { required: true, message: '请输入影院负责人', trigger: 'blur' },
        // leadingTel: { required: true, message: '请输入影院负责人电话', trigger: 'blur' },
        // wap1: { validator: serviceTelValidator('wap'), trigger: 'blur' },
        // app1: { validator: serviceTelValidator('app'), trigger: 'blur' },
        // web1: { validator: serviceTelValidator('web'), trigger: 'blur' },
        // serviceTel1: { validator: serviceTelValidator('serviceTel', '1'), trigger: 'blur' }
      }
    }
  },
  methods: {
    getTelStr(type) {
      const result = []
      if (this.params[type + '1']) {
        result.push(this.params[type + '1'])
      }
      if (this.params[type + '2']) {
        result.push(this.params[type + '2'])
      }
      return result.join(',')
    },
    setTelStr(params, type) {
      if (params.serviceTel) {
        const arr =
          type === 'serviceTel'
            ? params.serviceTel.split(',')
            : params.serviceTel[type].split(',')
        if (arr[0]) {
          params[type + '1'] = arr[0]
        }
        if (arr[1]) {
          params[type + '2'] = arr[1]
        }
      }
    },
    getResult() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(async valid => {
          if (valid) {
            let params = Object.assign({}, this.params)
            if (params.serviceTelType === '2') {
              params.serviceTel = JSON.stringify({
                wap: this.getTelStr('wap'),
                app: this.getTelStr('app'),
                web: this.getTelStr('web')
              })
            } else {
              params.serviceTel = this.getTelStr('serviceTel')
            }
            params.startTime = params.time[0]
            params.endTime = params.time[1]
            params.provinceId = params.area[0]
            params.cityId = params.area[1]
            params.countyId = params.area[2]
            params.longitude = params.longitudeAndlatitude.split(',')[0]
            params.latitude = params.longitudeAndlatitude.split(',')[1]
            params.cinemaId = this.cinemaId

            delete params.time
            resolve(params)
          } else {
            reject('validError')
          }
        })
      })
    },
    setResult(params) {
      params.time = [params.startTime, params.endTime]
      params.longitudeAndlatitude = params.longitude + ',' + params.latitude
      params.area = [params.provinceId, params.cityId, params.countyId].filter(
        item => item
      )

      if (params.serviceTelType === '2') {
        this.setTelStr(params, 'wap')
        this.setTelStr(params, 'app')
        this.setTelStr(params, 'web')
      } else {
        this.setTelStr(params, 'serviceTel')
      }
      if (params.copyType) {
        params.copyTypeRadio = '2'
      } else {
        params.copyTypeRadio = '1'
      }
      if (params.copyTypeConfig && params.copyTypeConfig instanceof Array) {
        // params.copyTypeConfig.forEach(e => { e.standard = e.standard.split(',') })
      } else {
        params.copyTypeConfig = []
      }

      this.params = params
      this.$refs.form.resetFields()
    },
    openMap() {
      this.dialogVisible = true
      if (this.params.address) {
        let temp = this.$refs.city.addressStr
        this.mapAddress = temp + this.params.address
      }

      this.$nextTick(function() {
        this.baiduMap()
      })
    },
    baiduMap() {
      const _this = this
      const map = new window.BMap.Map('Bmap')
      const point = _this.params.longitude
        ? new window.BMap.Point(_this.params.longitude, _this.params.latitude)
        : new window.BMap.Point(119.300526, 26.067815)

      const marker = new window.BMap.Marker(point) // 创建标注

      map.setDefaultCursor('crosshair') // 设置地图默认的鼠标指针样式
      map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用。

      map.centerAndZoom(point, 15)
      marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画

      map.addOverlay(marker) // 将标注添加到地图中

      map.addEventListener('click', function(e) {
        map.clearOverlays() //添加标注前清空以前的所有标注
        var marker = new window.BMap.Marker(
          new window.BMap.Point(e.point.lng, e.point.lat)
        ) // 创建标注
        map.addOverlay(marker)
        marker.setAnimation(BMAP_ANIMATION_BOUNCE)
        _this.longitudeAndlatitude = e.point.lng + ',' + e.point.lat
      })
    },
    searchMap() {
      const _this = this
      const map = new window.BMap.Map('Bmap')
      var localSearch = new window.BMap.LocalSearch(map)

      var keyword = this.mapAddress
      localSearch.setSearchCompleteCallback(function(searchResult) {
        var poi = searchResult.getPoi(0)

        if (typeof poi === 'undefined') {
          _this.$message.warning('没有找到，请重新填写或者手动选择')
          const point = new window.BMap.Point(119.300526, 26.067815)
          const marker = new window.BMap.Marker(point)
          map.addOverlay(marker)
          map.centerAndZoom(point, 15)
          return
        } else {
          map.clearOverlays()
        }

        map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用。
        var marker = new window.BMap.Marker(
          new window.BMap.Point(poi.point.lng, poi.point.lat)
        )
        map.addOverlay(marker)
        marker.setAnimation(BMAP_ANIMATION_BOUNCE)
        map.centerAndZoom(poi.point, 15)
        _this.longitudeAndlatitude = poi.point.lng + ',' + poi.point.lat
      })
      localSearch.search(keyword)
      localSearch.enableAutoViewport()
      map.addEventListener('click', function(e) {
        map.clearOverlays() //添加标注前清空以前的所有标注
        map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用。
        var marker = new window.BMap.Marker(
          new window.BMap.Point(e.point.lng, e.point.lat)
        ) // 创建标注

        map.addOverlay(marker)
        marker.setAnimation(BMAP_ANIMATION_BOUNCE)
        _this.longitudeAndlatitude = e.point.lng + ',' + e.point.lat
      })
    },
    mapLabel() {
      this.dialogVisible = false
      this.params.longitudeAndlatitude = this.longitudeAndlatitude
    }
  },
  async created() {
    if (this.$route.query.id) {
      // this.cinemaIdInput = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.cinema-base-info-box {
  .inner-item {
    margin-bottom: 20px !important;
    .el-form-item__content {
      display: flex;
    }
  }
}
.baidu-map {
  width: 100%;
  height: 400px;
}
</style>
