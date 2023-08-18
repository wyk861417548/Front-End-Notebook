<template>
  <div v-loading='loading' class="pr-20">
    <el-form ref="form" :rules='rules' :model="form" label-width="140px" label-suffix="：">
      <el-form-item label="企业名称" prop="xxx">
        <el-input v-model.trim="form.xxx" maxlength="25" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="行业分类" prop="xxx">
        <el-input v-model.trim="form.xxx" maxlength="15" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="面积（平方米）" prop="xxx">
        <el-input v-model.trim="form.xxx" maxlength="15" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="区域" prop="xxx">
        <el-input v-model.trim="form.xxx" maxlength="15" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="地址" prop="xxx">
        <el-input v-model.trim="form.xxx" maxlength="30" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="联系人" prop="xxx">
        <el-input v-model.trim="form.xxx" maxlength="15" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="联系电话" prop="xxx">
        <el-input v-model.trim="form.xxx" maxlength="15" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>

    <div style="text-align:right;">
      <el-button @click="$parent.$parent.show = false">取 消</el-button>
      <el-button type="primary" @click="confirmEdit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import * as $http  from '@/api/xxx.js'
export default {
  dicts: [],
  props:['vdata','type'],
  data(){
    return{
      form:{},

      loading:false,

      rules: {
        xxx: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        xxx: [{ required: true, message: '请输入行业分类：', trigger: 'blur' }],
        xxx: [{ required: true, message: '请输入面积', trigger: 'blur' }],
        xxx: [{ required: true, message: '请输入区域', trigger: 'blur' }],
        xxx: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        xxx: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        xxx: [{ required: true, message: '请选择产生能耗', trigger: 'change' }],
      }
    }
  },

  created(){
    if(this.type == 2){
      this.form = JSON.parse(JSON.stringify(this.vdata))
    }
  },

  methods:{
    // 弹窗确定按钮
    confirmEdit(){
      this.$refs['form'].validate((valid) => {
        if(valid) {
          const $REQUEST = this.type ==1?$http.add:$http.edit;

          $REQUEST(this.form).then(() => {
            this.$message.success(this.type==1?"添加成功":'修改成功')
            this.$emit('change')
            this.$parent.$parent.show = false
          });
        }
      });
    },
  }
}
</script>

<style lang='scss' scoped>
// .el-form{
//   display: flex;
//   flex-wrap: wrap;
//   .el-form-item{
//     width: 50%;
//   }
// }
</style>