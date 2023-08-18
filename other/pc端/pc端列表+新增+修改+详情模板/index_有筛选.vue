<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="行业" prop="xxx">
        <el-input v-model.trim="queryParams.xxx" placeholder="请输入" maxlength="15" clearable />
      </el-form-item>
      <el-form-item label="日期" prop="appoTime">
        <el-date-picker v-model="queryParams.xxx" value-format="yyyy-MM-dd" type="daterange" style="width: 240px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="运营状况：" prop="businessTime">
        <el-select v-model="queryParams.businessTime" placeholder="请选择">
          <el-option v-for="dict in dict.type.homebed_manage_business_status" :key="dict.value" :label="dict.label" :value="dict.value" ></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="mb-15">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleEdit">新增</el-button>
      <el-button type="warning" plain icon="el-icon-download" size="mini" :disabled="Array.isArray(ids) && ids.length > 0?false:true" @click="handleExport" >导出</el-button>
    </div>

    <Table :selection='true' ref="table" rowKey='id' @handleSelectionChange='handleSelectionChange' @handleFilterChange='handleFilterChange' :currentPage='queryParams.pageNum' v-loading="loading" :tableHeadConfig="tableHead" :tableLoadData="tableData" :total="queryParams.total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"> 
      <!-- 默认插槽在最后面 一般用于按钮 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row,2)">编辑</el-button>
          <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </Table>

    <Dialog ref="edit" :title="dialog.title" width='600px' top='15vh'>
      <Edit :vdata='dialog.data' :type="dialog.type"></Edit>
    </Dialog>

    <Dialog ref="detail" title="详情">
      <Detail :vdata='dialog.data'></Detail>
    </Dialog>
  </div>

</template>

<script>
import * as $http  from '@/api/xxx.js'
import table from '@/mixins/table.js'
import Edit from './edit.vue'
import Detail from './detail.vue'
export default {
  // dicts:['sys_user_sex'],
  mixins:[table],
  components:{
    Edit,
    Detail
  },
  data() {
    return {
      loading:false,

      // table 表格数据
      tableData:[{}],

      queryParams:{
        pageNum: 1,
        pageSize: 10,
        appoTime:[]
      },

      dialog:{
        type:1,  //1：新增 2：修改

        title:'新增',

        data:{}
      },

      ids:[]
    }
  },

  computed:{
    // checked:表格某列是否能够点击  value:后端穿过来的值所对应的名称 slot:'name'(动态生成插槽) h自定义头部（插槽）
    tableHead(){
      // const dicts = ['sys_user_sex']
      
      // var obj ={};
      // dicts.map(item=>{
      //   obj[item] = this.dict.type[item] && this.dict.type[item].map(({label,value})=>({text:label,value}))
      // })

      const filtersData = [{ text: '家', value: '家' }, { text: '公司', value: '公司' }];

      return [
        {prop:'xxx',label:"食堂名称"},
        {prop:'xxx',label:"所属街道"},
        {prop:'xxx',label:"所属社区"},
        {prop:'xxx',label:"负责人及联系方式"},
        {prop:'xxx',label:"详细地址"},
        {prop:'xxx',label:"补贴期数"},
        {prop:'xxx',label:"补贴人数"},
        {prop:'xxx',label:"补贴人次"},
        {prop:'xxx',label:"补贴总金额"},
        {prop:'xxx',label:"个人支付总金额"},
        {prop:'xxx',label:"发起审核时间"},
        {prop:'xxx',label:"状态",filters:obj.sys_user_sex,slot:'status'},
      ]
    },
    
  },

  created(){
    console.log('this',this);
    // this.getTableData();
  },

  methods: {
    getTableData(){
      this.loading = true
      $http.list(this.queryParams).then(({rows,total}) => {
        this.loading = false
        this.tableData = rows;
        this.queryParams.total = total;
      })
    },

    handleEdit(row={},type=1){
      this.$refs.edit.show = true;
      this.dialog.title=type==1?'新增':'修改';
      this.dialog.type=type
      if(type == 2){
        this.dialog.data =JSON.parse(JSON.stringify(row));
      }
    },

    handleDetail(row){
      this.$refs.detail.show = true;
      this.dialog.data = row;
    },

    handleDel({id}){
      this.$Common.confirm({callback:(close)=>{
        $http.del(id).then((res) => {
          close();
          this.$message.success("删除成功");
          this.getTableData();
        }).catch(()=>close());
      }})
    },

    // tabel filters 筛选
    handleFilterChange(data){
      for (const key in data) {
        this.queryParams[key] = data[key].join(',')
      }
      this.getTableData();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.oldId)
    },

    /** 导出按钮操作 */
    handleExport() {
      this.downloadT('homebed/export/homebedElderAdmin', {
        ids:this.ids
      }, `appoint_elderly_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>
<style lang='scss' scoped>
</style>