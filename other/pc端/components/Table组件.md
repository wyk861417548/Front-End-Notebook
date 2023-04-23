#### 基于Element-Ui
// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}
Vue.prototype.resetForm = resetForm

### Table组件
```
<el-form :model="data" ref="queryForm" size="small" :inline="true">
  <el-form-item label="所属机构" prop="orgName">
    <el-input
      v-model.trim="data.orgName"
      placeholder="请输入机构名称"
      clearable
    />
  </el-form-item>

  <el-form-item>
    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
  </el-form-item>
</el-form>

<Table :currentPage='data.page' v-loading="loading" :tableHeadConfig="tableHead" :tableLoadData="tableData" :total="data.total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"> 
  
  <template v-slot:cc='scope'>
    <p>{{JSON.stringify(scope.value)}},{{JSON.stringify(scope.row)}},{{JSON.stringify(scope.item)}}</p>
  </template>

  <!-- 默认插槽在最后面 一般用于按钮 -->
  <el-table-column label="操作" >
    <template slot-scope="scope">
      <el-button type="text" @click="scope.index++">处置</el-button>
    </template>
  </el-table-column>
</Table>

data () {
  return {
  
    // checked:表格某列是否能够点击  value:后端穿过来的值所对应的名称 slot:'name'(动态生成插槽) off:是否脱敏
    tableHead:[
      {prop:'earlyName',label:"xxx1",value:{1:"未处置",2:"处置中",3:"已处置"},width:100},
      {prop:'orgName',label:"xxx2",width:200},
      {prop:'oName',label:"机构",width:200,slot:'cc'},
    ],

    // table 表格数据
    tableData:[]
  }
}

// ---------------------------search-----------------------------
/** 搜索按钮操作 */
handleQuery(){
  this.data.page = 1;
  this.getTableData();
},
/** 重置按钮操作 */
resetQuery(){
  this.resetForm("queryForm");
  this.handleQuery();
},

//------------------------------分页监听---------------------------
// 每页数量更改
handleSizeChange(val){
  this.data.limit = val;
  this.data.page = 1;
  this.getTableData();
},

// 页码更改
handleCurrentChange(val){
  this.data.page = val;
  this.getTableData();
},
```