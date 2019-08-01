<template>
  <div>
    <el-dialog
      width="70%"
      append-to-body
      title="选择城市信息"
      :close-on-click-modal="false"
      :visible="value"
      :before-close="closeCilck"
      class="dialogContainer"
    >
      <!-- 已选省市标签 -->
      <div class="area-tags mb15">
        <span>可选择多项:</span>
        <div class="vm" v-for="(item,index) in areaInfo.children" :key="index">
          <el-tag
            class="mr15"
            closable
            @close="isChoosed(item,'allCity',false)"
            v-if="item.isAll"
          >{{item.name}}</el-tag>
          <template v-if="item.indeterminate">
            <div class="vm" v-for="(cityItem,cityIndex) in item.children" :key="cityIndex">
              <el-tag
                class="mr15"
                size="medium"
                closable
                @close="chooseCity(item,cityItem,false)"
                v-if="cityItem.isAll"
              >{{cityItem.name}}</el-tag>
            </div>
          </template>
        </div>
      </div>
      <!-- 省市选项卡 -->
      <el-tabs type="border-card" v-model="editTags" class="area-box" @tab-remove="closeTag">
        <el-tab-pane label="省份" name="area">
          <p class="fb mb15">全部省份</p>
          <div class="all-box">
            <div
              class="province-box vm w150 mb10"
              :class="{isChecked:item.isAll}"
              v-for="(item,index) in areaInfo.children"
              :key="index"
              @click="isChoosed(item,'province')"
            >
              <span class="flex-one">{{item.name}}</span>
              <span class="checked-num vm" v-if="!item.isAll&&item.ids.length">{{item.ids.length}}</span>
            </div>
          </div>
        </el-tab-pane>
        <!-- 市选择 -->
        <el-tab-pane
          :label="item.name"
          :name="item.value"
          closable
          v-for="(item,index) in areaInfo.children"
          :key="index"
          v-if="item.cityShow"
        >
          <el-checkbox
            class="hideInput choose-item"
            :class="{isChecked:item.isAll}"
            v-model="item.isAll"
            @change="isChoosed(item,'allCity')"
          >{{item.name}}</el-checkbox>
          <el-checkbox-group class="choose-box mt15" v-model="item.ids">
            <el-checkbox
              class="hideInput w120 mb15 choose-item"
              :class="{isChecked:cityItem.isAll}"
              v-for="(cityItem,cityIndex) in item.children"
              :key="cityIndex"
              :label="cityItem.value"
              @change="chooseCity(item,cityItem)"
            >{{cityItem.name}}</el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCilck">取消</el-button>
        <el-button type="primary" @click="saveClick">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRegion, getCityRegion } from '@/api/mallCenter'
import { getCanChooseIds } from '@/utils'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    cityParams: {
      type: Object,
      default: () => {
        return {
          provinceId: '',
          cityId: ''
        }
      }
    }
  },
  data() {
    return {
      editTags: 'area',
      areaInfo: {
        // 全国数据
        isAll: false, // 全选省
        indeterminate: false, // 全选状态
        ids: [], // 被选择的省id
        children: [
          // {
          //   // 省列表
          //   id: '', // 省id
          //   name: '', // 省名称
          //   isAll: false, // 全选市
          //   indeterminate: false, // 全选状态
          //   ids: [], // 被选择的市id
          //   children: [
          //     // 市列表
          //     {
          //       id: '', // 市id
          //       name: '', // 市名称
          //       isAll: false // 选择市
          //     }
          //   ]
          // }
        ]
      }
    }
  },
  // watch: {
  //   value(val) {
  //     if (val) this.getRegion()
  //   }
  // },
  created() {
    this.getRegion()
  },
  methods: {
    // 回填并获取父级已选值和全选状态
    getInfo(info, ids) {
      if (!ids || !ids.length) return
      const dataIds = Array.isArray(ids) ? ids : ids.split(',')
      info.ids = dataIds
      this.getIsAll(info)
    },
    async getRegion() {
      const data = this.areaInfo.children
      // 不重置组件时，进入时候判断value是否true,省份数组是否已存在，没有则调用接口,并赋初始值
      const res = await getAllRegion()
      this.areaInfo.children = res.data || res || data
      this.getInfo(this.areaInfo, this.cityParams.provinceId)
      this.areaInfo.children.forEach(e => {
        this.$set(e, 'ids', [])
        this.$set(e, 'isAll', false)
        this.$set(e, 'indeterminate', false)
        // 获取外部传入的省id
        const provinceId = this.cityParams.provinceId ? this.cityParams.provinceId.split(',') : []
        if (provinceId.length) {
          // 有已选的省id，则把对应的省的isAll转为true，做这部防止只有省id没有市id的情况
          provinceId.forEach(province => {
            if (e.value === province) {
              this.$set(e, 'isAll', true)
              this.$set(e, 'ids', getCanChooseIds(e.children, true))
            }
          })
        }
        // 获取外部传入的市id
        const cityId = this.cityParams.cityId ? this.cityParams.cityId.split(',') : []
        if (cityId.length) {
          const cityIds = [] // 筛出对应省ids，可用getInfo直接获取省状态
          // 编辑子集，把子id筛入
          e.children && e.children.length && e.children.forEach(child => {
            cityId.forEach(city => {
              if (child.value === city) {
                this.$set(child, 'isAll', true) // 需要到区级就加入ids的判断
                cityIds.push(city)
              }
            })
          })
          // 将获取到的ids筛入省中，并做省的全选状态判断
          this.getInfo(e, cityIds)
        }
      })
    },
    async isChoosed(item, type, boolean) {
      switch (type) {
        case 'province':
          this.areaInfo.children.forEach(e => {
            this.$set(e, 'cityShow', false)
          })
          this.$set(item, 'cityShow', true)
          if (!(item.children && item.children.length)) {
            const cityList = await getCityRegion({ parentId: item.value })
            this.$set(item, 'children', cityList)
          }
          item.children &&
              item.children.length &&
              item.children.forEach(e => {
                // 接口获取的赋初始的isAll值，如果后期增加区，要获取ids和indeterminate
                this.$set(e, 'isAll', e.isAll)
              })

          this.editTags = item.value
          break
        case 'allCity':
          this.chooseAllCity(item, boolean)
          break
      }
    },
    // 全选市
    chooseAllCity(item, boolean) {
      this.$set(
        item,
        'isAll',
        typeof boolean === 'boolean' ? boolean : item.isAll
      )
      this.$set(item, 'indeterminate', false)
      const ids = getCanChooseIds(item.children, item.isAll)
      this.$set(item, 'ids', item.isAll ? ids : [])
      // 从tags关闭时，需要手动将父级中的ids进行操作
      const povinceIndex = this.areaInfo.ids.findIndex(e => e === item.value)
      if (typeof boolean === 'boolean' && !boolean && povinceIndex !== -1) this.areaInfo.ids.splice(povinceIndex, 1)
      this.setAreaInfo()
    },
    // 全选时获取状态
    getIsAll(item) {
      item.isAll = item.ids.length === item.children.length
      item.indeterminate =
        item.ids.length > 0 && item.ids.length < item.children.length
    },
    // 单选市
    chooseCity(item, cityItem, boolean) {
      this.$set(
        cityItem,
        'isAll',
        typeof boolean === 'boolean' ? boolean : !cityItem.isAll
      )
      // 从tags关闭时，需要手动将父级中的ids进行操作
      const cityIndex = item.ids.findIndex(e => e === cityItem.value)
      if (typeof boolean === 'boolean' && !boolean && cityIndex !== -1) item.ids.splice(cityIndex, 1)
      this.getIsAll(item)
      this.setAreaInfo()
    },
    // 为全国数据添加参数
    setAreaInfo() {
      this.areaInfo.children.forEach(e => {
        const index = this.areaInfo.ids.findIndex(item => item === e.value)
        // 添加所有有选择市的省id，不包括未全选的省
        if (index === -1 && (e.isAll)) this.areaInfo.ids.push(e.value)
      })
      this.getIsAll(this.areaInfo)
    },
    // 手动关闭tag
    closeTag(val) {
      this.areaInfo.children.forEach(e => {
        if (e.value === val) this.$set(e, 'cityShow', false)
      })
      this.editTags = 'area'
    },
    closeCilck() {
      this.$emit('cancel')
    },
    saveClick() {
      // 发送给父级的id
      console.log('this.areaInfo', this.areaInfo)
      const provinceId = []
      const provinceName = []
      const cityId = []
      const cityName = []
      // let num = 0 // 判断所有省中是否有未全选省的情况
      this.areaInfo.children.forEach(province => {
        // num = province.indeterminate ? num + 1 : num
        // 省被全选时获取省信息
        if (province.isAll) {
          provinceId.push(province.value)
          provinceName.push(province.name)
        }
        province.children && province.children.length && province.children.forEach(city => {
          // 省没有被全选时获取市id
          if (city.isAll && province.indeterminate) {
            cityId.push(city.value)
            cityName.push(city.name)
          }
        })
      })
      const areaInfo = {
        provinceId: provinceId.join(','),
        provinceName: provinceName.join(','),
        cityId: cityId.join(','),
        cityName: cityName.join(',')
      }
      this.$emit('change', areaInfo)
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.area-box {
  height: 45vh;
  overflow: auto;
}
.all-box {
  display: flex;
  flex-wrap: wrap;
}
.province-box {
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  .checked-num {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background-color: #3ca0ec;
    color: #fff;
  }
  &.isChecked {
    border-radius: 2px;
    background-color: #3ca0ec;
    color: #fff;
  }
  &:not(:last-child) {
    margin-right: 20px;
  }
  &:hover {
    cursor: pointer;
    border-radius: 2px;
    justify-content: center;
    background-color: #d5e9f2;
    color: #3ca0ec;
  }
}
.choose-item {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  &.isChecked {
    border-radius: 2px;
    background-color: #3ca0ec;
    //文字颜色在style-element-ui-reset中
  }
  &:hover {
    cursor: pointer;
    border-radius: 2px;
    justify-content: center;
    background-color: #d5e9f2;
    color: #3ca0ec;
  }
}
</style>

