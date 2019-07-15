<template>
    <div class="film-selector-box">
      <div v-for="(film,index) in films" :key="index" class="film-select-plane">
        <span>选择影片</span>
        <el-select v-model="film.id" @clear="options=[]" @focus="querySearchAsyncTwo(film)" @change="handleChange" clearable filterable remote :remote-method="querySearchAsync(film , index)" placeholder="请输入影片名称模糊搜索" style="width:320px" :loading="loading">
          <el-option v-for="(item,index) in film.options" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <div class="oper">
          <i class="el-icon-remove info" title="删除" @click="removeFilm(index)" v-if="films.length!=1"></i>
          <i class="el-icon-circle-plus danger" title="添加" @click="newFilm(index)" v-if="index==films.length-1"></i>
        </div>
      </div>
    </div>
</template>

<script>
import { getFilmList } from '@/api/mallCenter'
import { getActivityFilmList } from '@/api/activitySetting'
export default {
  props: {
    value: String,
    contentList: Array,
    getFilmId: { // 是否使用返回  value为id的接口
      type: Boolean,
      default: false
    },
    cinemaType: String,
    channelIds: [String, Array],
    interfaceTypeIds: Array,
    cinemaGroupId: String,
    area: Array
  },
  data() {
    return {
      films: [],
      loading: false,
      options: [],
      searchVal: '',
      query: {
        channelIds: this.channelIds,
        interfaceTypeIds: this.interfaceTypeIds,
        cinemaGroupId: this.cinemaGroupId,
        provinceId: '',
        cityId: '',
        countryId: ''
      }
    }
  },
  methods: {
    async querySearchAsyncTwo(film) {
      if (!this.searchVal) {
        film.getFilmId = this.getFilmId
        film.options = await getActivityFilmList(this.query)
        if (film.options.length === 0) {
          this.$message.warning('无执行影片')
          return
        }
      }
    },
    querySearchAsync(film, index) {
      film.getFilmId = this.getFilmId
      return async(val) => {
        if (val) {
          this.searchVal = val
          let options
          if (film.getFilmId) {
            this.query = Object.assign(this.query, { filmName: val })
            options = await getActivityFilmList(this.query)
          } else {
            options = await getFilmList({ filmName: val })
          }

          film.options = options.filter(e => e.value)
        } else {
          film.options = await getActivityFilmList(this.query)
        }
      }
    },
    async newFilm(index) {
      if (index === 2) {
        this.$message.warning('至多选择3部影片')
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '正在加载',
        spinner: 'el-icon-loading'
      })
      await getActivityFilmList(this.query).then(e => {
        loading.close()
        this.films.push({ id: '', name: '', options: e })
      }).catch(e => {
        loading.close()
      })
      // this.films.push({ id: '', name: '', options: await getActivityFilmList(this.query) })
    },
    removeFilm(index) {
      this.films.splice(index, 1)
      this.handleChange()
    },
    async handleChange(val) {
      const result = this.films.filter(e => e.id).map(e => e.id)
      this.$emit('input', result.join(','))
    }
  },
  mounted() {
    switch (this.cinemaType) {
      case '1':
        this.query = {
          channelIds: this.channelIds,
          interfaceTypeIds: this.interfaceTypeIds
        }
        break
      case '2':
        this.query = {
          channelIds: this.channelIds,
          cinemaGroupId: this.cinemaGroupId
        }
        break
      case '3':
        if (this.area.length === 1) {
          this.query = {
            channelIds: this.channelIds,
            provinceId: this.area[0]
          }
        } else if (this.area.length === 2) {
          this.query = {
            channelIds: this.channelIds,
            provinceId: this.area[0],
            cityId: this.area[1]
          }
        } else if (this.area.length === 3) {
          this.query = {
            channelIds: this.channelIds,
            provinceId: this.area[0],
            cityId: this.area[1],
            countryId: this.area[2]
          }
        }
        break
    }
  },
  async created() {
    const optionsTemp = await getActivityFilmList(this.query)
    if (this.value) {
      console.log(this.value)
      optionsTemp.map(el => {
        this.value.split(',').map(e => {
          if (el.value === e) {
            this.films.push({ id: e, name: el.name, options: optionsTemp })
          }
        })
      })
    } else {
      this.newFilm()
    }
  }
}
</script>

<style scoped lang="scss">
.film-selector-box{
  padding:-20px 0px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
}
.film-select-plane{
  display: flex;
  align-items: center;
  margin: 20px 0px;
  &>span{
    width: 120px;
    text-align: right;
    margin-right: 20px;
  }
  .oper{
    font-size: 28px;
    margin-left: 20px;
    i{
      cursor: pointer;
    }
  }
}
</style>
