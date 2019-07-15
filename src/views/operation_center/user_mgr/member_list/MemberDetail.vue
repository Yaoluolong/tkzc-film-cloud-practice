<template>
  <div class="app-container">
   <table cellspacing="0" cellpadding="0" border="0" class="member-table">
     <tr>
       <td rowspan="5" width="20%" >
         <div class="main-info">
           <img :src="memberInfo.headImg" v-default-img>
           <span class="mobile">{{memberInfo.mobile}}</span>
         </div>

       </td>
       <td class="point" width="15%">会员ID</td><td width="25%">{{memberInfo.id||'--'}}</td>
       <td class="point" width="15%">会员昵称</td><td width="25%">{{memberInfo.userName||'--'}}</td>
     </tr>
     <tr>
       <td class="point">注册时间</td><td>{{memberInfo.createTime||'--'}}</td>
       <td class="point">会员来源</td><td>{{memberInfo.sourceName||'--'}}</td>
     </tr>
     <tr>
       <td class="point">终端类型</td><td>{{memberInfo.consumerTerminal||'--'}}</td>
       <td class="point">性别</td><td>{{memberInfo.sexName||'--'}}</td>
     </tr>
     <tr>
       <td class="point">生日</td><td>{{memberInfo.birthday||'--'}}</td>
       <td class="point">城市</td><td>{{(memberInfo.province)||'--'}}/{{((memberInfo.city)||'--')}}</td>       
     </tr>
     <tr>
       <td class="point">绑定手机号</td><td>{{memberInfo.bindingMobile||'--'}}</td>
       <!-- <td class="point">城市</td><td>{{(memberInfo.province)||'--'}}/{{((memberInfo.city)||'--')}}</td>        -->
     </tr>
   </table>
   <title-plane title="绑定手机号记录" style="margin-top:20px">
      <el-table border :data="memberInfo.bindingMobileLog">
        <el-table-column min-width="180" align="center" label="绑定手机号" prop="newMobile" ></el-table-column>
        <el-table-column min-width="180" align="center" label="解绑手机号" prop="oldMobile"></el-table-column>
        <el-table-column min-width="150" align="center" label="更换时间" prop="addTime"></el-table-column>
      </el-table>
   </title-plane>
   <title-plane title="订单记录" style="margin-top:20px">
      <page-table ref="table" :query="query" :fetch="queryTable">
        <el-table-column min-width="180" align="center" label="订单编号" prop="orderNo" show-overflow-tooltip></el-table-column>
        <el-table-column min-width="180" align="center" label="提交时间" prop="orderTime" ></el-table-column>
        <el-table-column min-width="180" align="center" label="购票手机号" prop="mobile"></el-table-column>
        <el-table-column min-width="150" align="center" label="订单金额" prop="channelTiceketSum"></el-table-column>
        <el-table-column min-width="150" align="center" label="支付方式" prop="payType"></el-table-column>
        <el-table-column min-width="150" align="center" label="订单来源" prop="deviceType"></el-table-column>
        <el-table-column min-width="150" align="center" label="订单状态" prop="orderStatus"></el-table-column>
      </page-table>
   </title-plane>
  </div>
</template>

<script>
import { getMemberInfo, getMemberOrderPageList } from '@/api/operationCenter'
export default {
  name: 'edit_member',
  data() {
    return {
      query: {},
      memberInfo: {}
    }
  },
  methods: {
    queryTable(query) {
      query.id = this.$route.query.id
      return getMemberOrderPageList(query)
    }
  },
  async created() {
    // 编辑
    if (this.$route.query.id) {
      this.memberInfo = await getMemberInfo(this.$route.query.id)
      if (!this.memberInfo.bindingMobileLog) {
        this.memberInfo.bindingMobileLog = []
      }
    }
  }
}
</script>

<style scoped lang="scss">
.member-table{
  width:100%;
}
.member-table{
  border-top: 1px solid #DCDFE6;
  border-left: 1px solid #DCDFE6;
  height: 250px;
  td{
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
     padding:0 20px;
    &.point{
      background: #F2F6FC;
      text-align: right;

    }
  }
}
.main-info{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img{
    height: 100px;
    width: 100px;
  }
  .mobile{
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
  }
}
</style>
