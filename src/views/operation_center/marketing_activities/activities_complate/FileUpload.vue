<template>
<div>

  <el-upload
  class="upload-demo"
  v-bind="$attrs"
  v-on="$listeners"
  :limit="1"
  action=""
  :http-request="uploadMethod"
  :show-file-list="false"
  :on-success="handleSuccess"
  accept=".xlsx"
  name="fileData">
    <!-- action="/api/systemApi/activity/importUsers" -->
  <!-- :before-upload="beforeUpload" -->
  <el-button size="small" type="primary">点击上传</el-button>
      <!-- <div v-if="txtUrl">
        <img :style="styleObject" :src="txtUrl" :class="imgStyle">
      </div>
      <i v-else :style="styleObject" :class="iStyle"></i> -->
  </el-upload>
  <!-- <i class="uploadClose el-icon-close" @click="handleRemove" v-if="txtUrl && delShow"></i> -->
  <!-- <span class="content">{{content}}</span> -->
  <div>
  	<ul style="padding:0px;">
  		<li class="content">请上传txt、xlsx格式，号码文件<el-button type="text" @click="exportData()">范例下载</el-button></li>
  		<li class="content">文件大小不超过3M，建议单次导入号码10万个以内</li>
  	</ul>
  </div>
</div>
</template>

<script>
  import { activityExampleDownload } from '@/api/activitySetting'
  import { exportData } from '@/utils'
  export default {
    props: {
      /* content: String,
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
      },*/
      value: String
    },
    data() {
      return {
        /* styleObject: {
          height: this.outHeight,
          width: this.outWidth,
          lineHeight: this.outHeight
        },*/
        txtUrl: ''
      }
    },
    watch: {
      value(val) {
        if (val !== this.txtUrl) {
          this.txtUrl = val
        }
      }
    },
    methods: {
      handleSuccess(res, file) {
        console.log(res)
        /* if (res.status === 0) {
          this.$emit('input', res.data.url)
          this.txtUrl = URL.createObjectURL(file.raw)
        } else {
          this.$message.error('上传失败')
          this.$emit('input', '')
        }*/
      },
      /* handleRemove(file, fileList) {
        this.txtUrl = ''
        this.$emit('input', '')
      },*/
      /* beforeUpload(file) {
        const isLtSize = file.size / 1024 / 1024 < this.size

        if (!isLtSize) {
          this.$message.error(`上传图片大小不能超过 ${this.size}MB!`)
        }
        return isLtSize
      },*/
      async uploadMethod(params) {
        const fileObj = params.file
        const form = new FormData()
        form.append('file', fileObj)
        this.$request.post('systemApi/activity/importUsers', form).then(res => {
          this.$message.success('上传成功')
          console.log(res.key)
          this.$emit('fileUploadKey', res.key)
        })
      },
      exportData() {
        const loading = this.$loading({
          lock: true,
          text: '正在下载',
          spinner: 'el-icon-loading'
        })
        exportData(activityExampleDownload, {}).then(e => {
          loading.close()
        }).catch(e => {
          loading.close()
          this.$message.warning(e)
        })
        /* activityExampleDownload({}).then(res => {
          loading.close()
          location.href = res
        }).catch(e => {
          loading.close()
          this.$message.warning(e)
        })*/
      }
    }
  }
</script>

<style lang="scss" scoped>
.content{
  color:#C0C4CC;
  font-size: 14px;
}
</style>