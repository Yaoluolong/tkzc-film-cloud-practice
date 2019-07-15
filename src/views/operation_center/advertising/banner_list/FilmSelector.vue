<template>
    <div>      
      <span>选择影片&nbsp; : &nbsp;</span>
      <el-select v-model="film.id" @clear="clear" @change="handleChange" clearable filterable remote :remote-method="querySearch" placeholder="请输入影片名称模糊搜索" style="width:320px" :loading="loading">
        <el-option v-for="item in film.options" :key="item.value" :label="item.name" :value="item.value"></el-option>
      </el-select>     
    </div>
</template>

<script>
import { getFilmList } from '@/api/mallCenter'
import { getFilmIdList } from '@/api/priceCenter'
export default {
  props: {
    value: String,
    contentList: Array, // 用于编辑的时候初始化数据显示
    getFilmId: { // 是否使用返回  value为id的接口
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      film: {
        options: [],
        id: this.value
      },
      loading: false
      // options: []
    }
  },
  methods: {
    clear() {
      this.film.options = []
      this.querySearch(undefined, undefined)
    },
    async querySearch(val, filmId) {
      if (val) {
        let options
        if (this.getFilmId) {
          options = await getFilmIdList({ filmName: val })
        } else {
          options = await getFilmList({ filmName: val })
        }
        this.film.options = options.filter(e => e.value)
        this.$forceUpdate()
      } else if (filmId) {
        if (this.getFilmId) {
          getFilmIdList({ filmName: '' }).then(res => {
            this.film.options = res
            this.film.id = filmId
            this.$forceUpdate()
          })
        }
      } else {
        if (this.getFilmId) {
          this.film.options = await getFilmIdList({ filmName: '' })
        } else {
          this.film.options = await getFilmList({ filmName: '' })
        }
      }
    },
    querySearchAsync(film) {
      film.getFilmId = this.getFilmId
      return async(val) => {
        if (val) {
          let options
          if (film.getFilmId) {
            options = await getFilmIdList({ filmName: val })
          } else {
            options = await getFilmList({ filmName: val })
          }
          film.options = options.filter(e => e.value)
        } else {
          film.options = []
        }
      }
    },
    async handleChange(val) {
      this.$emit('input', this.film.id)
    }
  },
  created() {
    if (this.value) {
      this.querySearch(undefined, this.value)
    } else {
      this.querySearch(undefined, undefined)
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
