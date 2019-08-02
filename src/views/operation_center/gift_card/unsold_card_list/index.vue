<template>
    <div class="app-container">
         <el-form inline label-width="120px">
            <el-form-item label="电影卡批次号">
              <el-input v-model="query.batchNo" clearable placeholder="请输入电影卡批次号" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="电影卡号码">
              <el-input v-model="query.cardCode" clearable placeholder="请输入电影卡号码" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="电影卡种类">
              <remote-select v-model="query.type" showAllOption clearable placeholder="请选择电影卡种类" action="/systemApi/dict/getList" :query="{type:'cardType'}" style="width:230px;"></remote-select>
            </el-form-item>
            <el-form-item label="电影卡类型">
              <remote-select v-model="query.style" showAllOption clearable placeholder="请选择电影卡类型" action="/systemApi/dict/getList" :query="{type:'cardStyle'}" style="width:230px;"></remote-select>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" icon="el-icon-search"  @click="refreshTable">查询</el-button>
              <el-button type="success" icon="el-icon-tickets" @click="dialogFormVisible = true">生成电影卡</el-button>
            </el-form-item>
         </el-form>
         <page-table ref="table" index :query="query" :fetch="queryTable">
            <el-table-column min-width="180"  label="生成单号" align="center" prop="orderNo" show-overflow-tooltip></el-table-column>

            <el-table-column min-width="100"  label="电影卡批次号" align="center" prop="batchNo" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="180"  label="电影卡种类" align="center" prop="typeName"></el-table-column>
            <el-table-column min-width="110"  label="电影卡类型" align="center" prop="styleName"></el-table-column>
            <el-table-column min-width="180"  label="生成时间" align="center" prop="createTime"></el-table-column>
            <el-table-column min-width="110"  label="生成总数" align="center" prop="num"></el-table-column>
            <el-table-column min-width="110"  label="已销售总数" align="center" prop="saleNum"></el-table-column>
            <el-table-column min-width="120"  label="生成人员" align="center" prop="operator" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="250"  label="操作" align="center" prop="oper" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$router.push({path:'/operation_center/gift_card/unsold_card_detail',query:{orderNo:row.orderNo}})">查看</el-button>
                <el-button type="text" @click="openExportEdit(row)">导出卡</el-button>
              </template>
            </el-table-column>
         </page-table>
         <!-- 生成卡 -->
         <el-dialog title="生成电影卡" :visible.sync="dialogFormVisible" width="40%">
            <el-form label-width="120px" :model="params" :rules="rules" ref="form">
              <el-form-item label="电影卡种类" prop="type">
                <el-radio v-model="params.type" label="1">电影卡--点卡</el-radio>
              </el-form-item>
              <el-form-item label="电影卡类型" prop="style">
                <el-radio v-model="params.style" label="Z">纸质卡</el-radio>
              </el-form-item>
              <!-- <el-form-item label="电影卡类型">
                <remote-select v-model="params.style" clearable placeholder="请选择电影卡类型" action="/systemApi/dict/getList" :query="{type:'cardStyle'}"></remote-select>
              </el-form-item> -->
              <el-form-item label="生成数量" prop="num">
                <el-input clearable  v-model="params.num" text="number" value="0" :min="1" label="输入数字" style="width:200px;"></el-input>&nbsp;&nbsp;张<span style="margin-left: 8px;color:#8e8e8e;" size="medium">只能是数值，且必须大于0</span>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="createCadeUnsoldOrder()">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog :visible="centerDialogVisible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" modal width="30%" >
            <div slot="title" class="el-dialog-title">
                服务器正在努力生成卡，请稍后...
            </div>
            <span style="text-align:center">
                <el-progress :percentage="percentage" ></el-progress>
            </span>
            <span slot="footer" class="el-dialog-footer">
                生成卡的速度取决于销售订单中出售数量，请耐心等候！
            </span>
        </el-dialog>
        <!-- 导出卡 -->
        <el-dialog title="导出卡" :visible.sync="exportFormVisible" width="40%">
          <el-form label-width="120px" :model="agur" :rules="exportRules" ref="exportForm">
              <el-form-item label="电影卡批次号" prop="batchNo">
                {{agur.batchNo||'--'}}
              </el-form-item>
              <el-form-item label="电影卡数量" prop="num">
                {{agur.num||'--'}}张
              </el-form-item>
              <el-form-item label="销售订单号" prop="saleOrderNo">
                <el-input clearable  v-model="agur.saleOrderNo" label="输入销售订单号" class="w200"></el-input>
                <span class="db" style="margin-left: 8px;color:#8e8e8e;" size="medium">销售订单号未输入则导出整个批次！</span>
              </el-form-item>
              <el-form-item label="导出字段" prop="fieldList">
                <div class="checkbox-plane">
                  <div class="header">
                    <el-checkbox v-model="selectAll" @change="doSelectAll">全选</el-checkbox>
                  </div>
                  <div class="content" id="content">
                    <div class="check-item" v-for="field in agur.fieldList" :key="field.value" style="width:30%;display:inline-block;">
                        <el-checkbox v-model="field.checked" @change="fieldChange">{{field.name}}</el-checkbox>
                    </div>
                    <!-- <el-checkbox-group v-model="selectFieldList">
                          <el-checkbox  
                            v-for="(field,index) in agur.fieldList" 
                            :label="field.name"   
                            :key="field.value"  
                            @change="fieldChange"
                            style="width:30%;display:inline-block;margin-left:0px;">{{field.name}}</el-checkbox>
                     </el-checkbox-group> -->
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="导出方式" prop="exportType">
                <el-radio v-model="agur.exportType" label="1">直接导出</el-radio>
              </el-form-item>
              <el-form-item label="接收校验码" prop="mobile">
                <el-input clearable  v-model="agur.mobile" placeholder="输入接收校验码" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label="导出备注" prop="remark">
                <el-input clearable  type="textarea" :row="5" v-model="agur.remark" placeholder="请输入内容"></el-input>
              </el-form-item>           
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="resetExportForm">取 消</el-button>
              <el-button type="primary" @click="exportOrders(agur.orderNo)">导 出</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { realDeepClone } from '@/utils'
import CustomerSelector from '@/components/CustomerSelector'
import OperatorIdSelector from '@/components/OperatorIdSelector'
import { getUnsoldCardOrderPageList, createCadeUnsoldOrder, countUnsoldCardPercent, exportCardDetail, getUnsoldExportCardField } from '@/api/operationCenter'
export default {
  components: { CustomerSelector, OperatorIdSelector },
  name: 'gift_card_unsold_card_list',
  data() {
    const checkPhoneNum = (rule, value, cb) => {
      const reg = /^1(3|4|5|7|8)\d{9}$/
      if (!reg.test(value)) {
        cb(new Error('请填写正确手机号码'))
      }
      cb()
    }
    const checkCheckedBox = (rule, value, cb) => {
      let num = 0
      value.forEach(e => {
        if (e.checked) {
          num++
        }
      })
      if (num === 0) {
        cb(new Error('请选择导出字段'))
      }
      cb()
    }
    return {
      query: {
        batchNo: '',
        couponCode: '',
        type: '-1',
        style: '-1'
      },
      percentage: 0, // 进度条进度
      params: {
        type: '1',
        style: 'Z',
        num: ''
      },
      agur: {
        orderNo: '',
        fieldList: [],
        exportType: '1',
        mobile: '',
        remark: ''
      },
      selectFieldList: [],
      selectAll: false,
      dialogFormVisible: false,
      centerDialogVisible: false,
      exportFormVisible: false,
      rules: {

      },
      exportRules: {
        fieldList: [
          { required: true, message: '请选择导出字段', trigger: 'change' },
          { validator: checkCheckedBox, message: '请选择导出字段', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入接收文件校验码的手机号', trigger: 'blur' },
          { validator: checkPhoneNum, message: '请填写正确手机号', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'query.type'(val) {
      if (this.query.type === undefined) {
        this.query.type = ''
      }
      if (this.query.style === undefined) {
        this.query.style = ''
      }
    },
    'query.style'(val) {
      if (this.query.style === undefined) {
        this.query.style = ''
      }
      if (this.query.type === undefined) {
        this.query.type = ''
      }
    }
  },
  methods: {
    queryTable(query) {
      const req = realDeepClone(query)
      return getUnsoldCardOrderPageList(req)
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    createCadeUnsoldOrder() {
      const _this = this
      const reg = /^[1-9]\d*$/
      if (!reg.test(this.params.num)) {
        this.$message.warning('请填写正确数量')
        return false
      }
      createCadeUnsoldOrder(this.params).then((res) => {
        this.dialogFormVisible = false
        this.centerDialogVisible = true
        const temp = setInterval(function() {
          countUnsoldCardPercent(res).then((count) => {
            if (count !== 100) {
              _this.percentage = parseInt(count)
            } else {
              clearInterval(temp)
              _this.centerDialogVisible = false
              _this.percentage = 0
              _this.$set(_this, 'params', { type: '1',
                style: 'Z',
                num: '' })
              _this.refreshTable()
            }
          })
        }, 6000)
      })
    },
    async openExportEdit(row) {
      this.exportFormVisible = true
      this.$set(this.agur, 'batchNo', row.batchNo)
      this.$set(this.agur, 'num', row.num)
      this.$set(this.agur, 'orderNo', row.orderNo)
    },
    exportOrders(orderNo) {
      this.$refs.exportForm.validate(flag => {
        if (flag) {
          const temp = this.agur
          this.$set(temp, 'fields', [])
          if (this.agur.fieldList.length > 0) {
            this.agur.fieldList.map(e => {
              if (e.checked) {
                temp.fields.push(e.value)
              }
            })
          }

          exportCardDetail({ orderNo: orderNo, saleOrderNo: temp.saleOrderNo, batchNo: temp.batchNo, fields: temp.fields, mobile: temp.mobile, remark: temp.remark }).then(e => {
            this.exportFormVisible = false
            this.$refs.exportForm.resetFields()
            this.agur.fieldList.map(e => { e.checked = false })
            this.selectAll = false
            this.$router.push({ path: '/system_setting/task_mgr/task_mgr', query: { id: orderNo }})
          })
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
      this.$set(this, 'params', { type: '1',
        style: 'Z',
        num: '' })
    },
    resetExportForm() {
      this.exportFormVisible = false
      this.$set(this.agur, 'saleOrderNo', '')
      this.agur.fieldList.map(e => {
        e.checked = false
      })
      this.$set(this.agur, 'mobile', '')
      this.$set(this.agur, 'remark', '')
      // this.$refs['exportForm'].resetFields()
    },
    doSelectAll(val) {
      this.agur.fieldList.map(e => {
        this.$set(e, 'checked', val)
      })
    },
    fieldChange(val) {
      this.selectedFieldList = this.agur.fieldList.filter(e => {
        return e.checked
      })
      this.selectAll = this.selectedFieldList.length === this.agur.fieldList.length
    }
  },
  async created() {
    this.agur.fieldList = await getUnsoldExportCardField()
  }
}
</script>

<style scoped>

</style>
