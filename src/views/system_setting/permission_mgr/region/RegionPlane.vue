<template>
  <div class="menu-plane-box">
    <div class="header">
      <span>{{title}}</span>
      <div>
        <!-- <el-button type="primary" @click="$emit('create',{title,parentId,level})" v-if="!selectDel">新增</el-button> -->
        <el-button type="danger" size="mini" @click="deleteRegion">{{selectDel? '确认删除':'删除'}}</el-button>
        <el-button type="warning" size="mini" v-if="selectDel" @click="selectDel=false">取消</el-button>
      </div>
    </div>
    <div class="content">
      <div style="margin-top:2%;">
        <el-button style="width:100%" @click="showAddInput">新增</el-button>
      </div>
      <div style="margin-top:2%;" v-show="showAdd">
        <el-form :model="addRegionObj" :rules="rules" ref="regionForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label-width="0px" prop="regionName" style="display:inline-block;">
            <el-input clearable  v-model.trim="addRegionObj.regionName" placeholder="请输入地区名称" style="width:239px;"></el-input>
          </el-form-item>
          <el-form-item label-width="0px" prop="initials" style="display:inline-block;">
            <el-input clearable  v-model.trim="addRegionObj.initials" placeholder="大写首字母" style="width:110px;"></el-input>
          </el-form-item>
          <el-form-item>
          <el-button type="text" @click="createRegion">保存</el-button>
          <el-button type="text" @click="hideAddInput">取消</el-button>
        </el-form-item>
        </el-form>
      </div>
      <div class="menu-item" :class="{active:selectRegionId==region.id}" v-for="(region,index) in regions" :key="index" title="单击选择" @click="selectRegion(region)">
        <el-checkbox v-model="region.checked" v-if="selectDel">{{region.regionName}}</el-checkbox>
        <span v-else>{{region.regionName}}</span>
        <div class="oper">
          <!-- <switch-confirm v-model="menu.status" v-if="!selectDel" :id="menu.id" action="/systemApi/systemMenu/setStatus"></switch-confirm> -->
          <!-- <i class="el-icon-edit-outline" title="编辑" v-if="!selectDel" @click="$emit('edit',{title,id:menu.id,level})"></i> -->
        </div>
      </div>
      
      
    </div>
  </div>
</template>

<script>
  import { getRegionList, createRegion, deleteRegion } from '@/api/systemSetting'
  export default {
    props: {
      title: String,
      parentId: String,
      regionLevel: String,
      level: String,
      value: [String, Number]
    },
    data() {
      return {
        showAdd: false,
        regions: [],
        selectRegionId: '',
        selectDel: false, // 进入删除状态,
        addRegionObj: { regionName: '', initials: '' },
        rules: {
          regionName: [{
            required: true, max: 20, message: '请输入地区名称,最多20个字符', trigger: 'blur'
          }],
          initials: { required: true, message: '请输入地区大写字母', trigger: 'blur' }
        }
      }
    },
    watch: {
      parentId(val) {
        if (val === '-2') {
          this.regions = []
          this.$emit('input', '-2')
        } else {
          this.fetchRegion(val)
          this.$emit('input', '-2')
        }
      }
    },
    methods: {
      createRegion() {
        this.$refs['regionForm'].validate((valid) => {
          if (valid) {
            this.addRegionObj.pId = this.parentId
            createRegion(this.addRegionObj).then(res => {
              this.addRegionObj.regionName = ''
              this.fetchRegion(this.parentId)
              this.hideAddInput()
            })
          } else {
            return false
          }
        })
      },
      showAddInput() {
        this.$set(this.addRegionObj, 'regionName', '')
        this.$set(this.addRegionObj, 'initials', '')

        if (this.parentId !== '-2') {
          this.showAdd = true
        } else {
          this.$message.warning('请先选择父级地区')
        }
      },
      hideAddInput() {
        this.showAdd = false
      },
      async fetchRegion(pId) {
        const query = {}
        // if (this.regionLevel) {
        //   query.regionLevel = this.regionLevel
        // }
        if (pId) {
          query.pId = pId
        }
        this.regions = await getRegionList(query)
      },
      selectRegion(region) {
        this.$emit('input', region.id)
        this.selectRegionId = region.id
      },
      async deleteRegion() {
        if (this.selectDel) {
          const checkedRegions = this.regions.filter(e => e.checked)
          const checkedIds = checkedRegions.map(e => e.id)
          if (checkedIds.length <= 0) {
            this.$message.warning('请勾选要删除的菜单')
            return
          }
          await deleteRegion(checkedIds.join(','))
          this.$message.success('删除成功')
          this.selectDel = false
          this.fetchRegion(this.parentId)
        } else {
          this.selectDel = true
        }
      }
    },
    created() {
      if (this.parentId === '0') { this.fetchRegion(this.parentId) }
    }
  }
</script>

<style scoped lang="scss">
.menu-plane-box{
  flex:1;
  .header{
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: #F2F6FC;
    span{
      font-size: 13px;
      font-weight: bold;
    }
  }
  .content{
    padding: 20px;
  }
  .menu-item{
    cursor: pointer;
    height: 48px;
    border-bottom: 1px solid #EBEEF5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      font-size: 14px;
    }
    .el-icon-edit-outline{
       font-size: 20px;
       display: none;
    }
    .oper{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row-reverse;
      width: 75px;
    }
    &.active{
      border-bottom: 1px solid #409EFF;
      span{
        color:#409EFF;
      }
    }
    &:hover{
      border-bottom: 1px solid #409EFF;
      span{
        color:#409EFF;
      }
      .el-icon-edit-outline{
        display: block;
      }
    }
  }
}
</style>
