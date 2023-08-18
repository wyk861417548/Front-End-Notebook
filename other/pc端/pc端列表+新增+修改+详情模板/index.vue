<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="行业" prop="xxx">
        <el-input v-model.trim="queryParams.xxx" placeholder="请输入" maxlength="15" clearable />
      </el-form-item>
      <el-form-item label="企业名称" prop="xxx">
        <el-input v-model.trim="queryParams.xxx" placeholder="请输入" maxlength="15" clearable />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="mb-15">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleEdit">新增</el-button>
      <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
    </div>

    <Table ref="table" :index='true' :currentPage='queryParams.pageNum' v-loading="loading" :tableHeadConfig="tableHead" :tableLoadData="tableData" :total="queryParams.total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"> 
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
  mixins:[table],
  components:{
    Edit,
    Detail
  },
  data() {
    return {
      loading:false,

      // checked:表格某列是否能够点击  value:后端穿过来的值所对应的名称 slot:'name'(动态生成插槽)
      tableHead:[
        {prop:'xxx',label:"企业名称"},
        {prop:'xxx',label:"行业"},
        {prop:'xxx',label:"面积（平方米）"},
        {prop:'xxx',label:"能耗"},
      ],

      // table 表格数据
      tableData:[{}],

      queryParams:{
        pageNum: 1,
        pageSize: 10
      },

      dialog:{
        type:1,  //1：新增 2：修改

        title:'新增',

        data:{}
      }
    }
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
      this.$config.confirm({callback:(close)=>{
        $http.del(id).then((res) => {
          close();
          this.$message.success("删除成功");
          this.getTableData();
        }).catch(()=>close());
      }})
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