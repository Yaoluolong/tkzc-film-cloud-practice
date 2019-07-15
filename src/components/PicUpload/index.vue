<template>
<div class="pic-upload">

  <el-upload
  :style="styleObject"
  v-bind="$attrs"
  v-on="$listeners"
  :class="uploadStyle"
  action="/api/systemApi/upload/uploadImg"
  :show-file-list="false"
  :on-success="handleSuccess"
  accept="image/*"
  name="fileData"
  :before-upload="beforeUpload">
      <div v-if="imageUrl">
        <img :style="styleObject" :src="imageUrl" :class="imgStyle">
      </div>
      <i v-else :style="styleObject" :class="iStyle"></i>
  </el-upload>
  <i class="uploadClose el-icon-close" @click="handleRemove" v-if="imageUrl && delShow"></i>
  <span v-if="content" class="content">{{content}}</span>
</div>
</template>

<script>
  export default {
    props: {
      content: String,
      classSize: { // 样式大小   值 big small
        type: String,
        default: 'big'
      },
      size: {
        type: Number,
        default: 2
      },
      delShow: {
        type: Boolean,
        default: false
      },
      value: String,
      outHeight: String,
      outWidth: String
    },
    data() {
      return {
        styleObject: {
          height: this.outHeight,
          width: this.outWidth,
          lineHeight: this.outHeight
        },
        iStyle: this.classSize === 'big' ? 'el-icon-plus avatar-uploader-icon' : 'el-icon-plus avatar-uploader-icon-two',
        imgStyle: this.classSize === 'big' ? 'avatar' : 'avatar-two',
        uploadStyle: this.classSize === 'big' ? 'avatar-uploader' : 'avatar-uploader-two',
        imageUrl: ''
      }
    },
    watch: {
      value(val) {
        if (val !== this.imageUrl) {
          this.imageUrl = val
        }
      }
    },
    methods: {
      handleSuccess(res, file) {
        if (res.status === 0) {
          this.$emit('input', res.data.url)
          this.imageUrl = URL.createObjectURL(file.raw)
        } else {
          this.$message.error('上传失败')
          this.$emit('input', '')
        }
      },
      handleRemove(file, fileList) {
        this.imageUrl = ''
        this.$emit('input', '')
      },
      beforeUpload(file) {
        const isLtSize = file.size / 1024 / 1024 < this.size

        if (!isLtSize) {
          this.$message.error(`上传图片大小不能超过 ${this.size}MB!`)
        }
        return isLtSize
      }
    }
  }
</script>
<style lang="scss" scoped>
.pic-upload{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.avatar-uploader{
  height: 152px;
  width: 152px;
}
.avatar-uploader-two{
  height: 52px;
  width: 52px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar-uploader-icon-two {
  font-size: 28px;
  color: #8c939d;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.avatar-two {
  width: 40px;
  height: 40px;
  display: block;
}
.content{
  color:#C0C4CC;
  font-size: 14px;
}
.uploadClose {
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  left: 140px;
  top: -8px;
  color: #fff;
  border-radius: 50%;
  background: rgba(0, 0, 0, .3); 
}
</style>
<style lang="scss">
.pic-upload{
  .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409EFF;
      }
  }
}
</style>
