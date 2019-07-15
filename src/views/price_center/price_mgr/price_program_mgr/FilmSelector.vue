<template>
    <div class="film-selector-box">
      <div v-for="(film,index) in films" :key="index" class="film-select-plane">
        <span>选择影片</span>
        <el-select v-model="film.id" @clear="options=[]" @change="handleChange" clearable filterable remote :remote-method="querySearchAsync(film)" placeholder="请输入影片名称模糊搜索" style="width:320px" :loading="loading">
          <el-option v-for="item in film.options" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <div class="oper">
          <i class="el-icon-remove info" title="删除" @click="removeFilm(index)" v-if="films.length!=1"></i>
          <i class="el-icon-circle-plus danger" title="添加" @click="newFilm" v-if="index==films.length-1"></i>
        </div>
      </div>
    </div>
</template>

<script>
import { getFilmList } from '@/api/mallCenter'
export default {
  props: {
    value: String,
    contentList: Array
  },
  data() {
    return {
      films: [],
      loading: false,
      options: []
    }
  },
  methods: {
    querySearchAsync(film) {
      return async(val) => {
        if (val) {
          const options = await getFilmList({ filmName: val })
          film.options = options.filter(e => e.value)
        } else {
          film.options = []
        }
      }
    },
    newFilm() {
      this.films.push({ id: '', options: [] })
    },
    removeFilm(index) {
      this.films.splice(index, 1)
    },
    async handleChange(val) {
      const result = this.films.filter(e => e.id).map(e => e.id)
      this.$emit('input', result.join(','))
    }
  },
  created() {
    this.newFilm()
    if (this.contentList) {
      this.films = this.contentList.map(e => {
        return { id: e.value, options: [e] }
      })
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
