<template>
  <!-- :before-upload="beforeUpload" -->
<div class="custom-upload">
  <el-upload
    class="upload-demo"
    :class="{disabled:uploadDisabled}"
    action="xxx"
    list-type="text"
    :before-upload="beforeUpload"
    :limit='limit'
    v-loading="loading">
    <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
    <div slot="tip" class="el-upload__tip">只能上传{{fileType.join(',')}}图片，且不超过{{maxSize}}M</div>
  </el-upload>
</div>
</template>
<script>
import * as $http from '@/api/pages/common.js'
export default {
props:{
  // 用于父组件接受已上传的图片名称
  name:{
    type:String,
    default:"upload"
  },

  // 上传限制数量
  limit:{
    type:Number,
    default:1
  },

  // 后端返回图片路径
  url:{
    type:String,
    default:'fullUrl'
  },

  // 后端返回图片id
  uid:{
    type:String,
    default:'uid'
  },

  // 默认展示图片
  defaultFileList:{
    type:Array,
    default:()=>[]
  },

  // 上传图片类型
  fileType:{
    type:Array,
    default:()=>{
      return ['jpg','png','jpeg']
    }
  },

  maxSize:{
    type:Number,
    default:2
  },

  // 文件列表的类型
  listType:{
    type:String,
    default:'picture-card'
  }
},

data() {
  return {
    loading:false,
    // 弹窗显示图片
    dialogImageUrl: '',

    // 是否显示预览图片弹窗
    dialogVisible: false,

    // 是否禁用图片上预览 删除操作
    disabled: false,
    
    // 上传图片列表
    fileList: []
  };
},

computed:{
  // 是否已达到上传最大数
  uploadDisabled(){
    return this.fileList.length >= this.limit;
  }
},

methods: {
  // 上传图片之前
  beforeUpload(file) {
    this.$emit('focus')
    const Max = file.size / 1024 / 1024 < this.maxSize;

    let msg  = `只支持${this.fileType.join(',')}格式的文件`

    const flieArr = file.name.split('.'); // 根据.分割数组
    let suffix = flieArr[flieArr.length - 1]; // 取最后一个
    suffix = suffix && suffix.toLocaleLowerCase(); // 将后缀所有字母改为小写方便操作

    if(this.fileType.indexOf(suffix) == -1){
      this.$message.error(msg);
      return;
    }

    if (!Max) {
      this.$message.error(`上传文件大小不能超过${this.maxSize}MB!`);
      return;
    }

    var param = new FormData();

    this.$Common.kCompass({fileinput:file}).then(({result}) => {
      var files = this.$Common.dataURLtoFile(result,file.name)

      param.append('file',files);

      this.upload(param);
    }).catch((err) => {console.log('err',err);});
    return false;
  },

  // 上传图片
  upload(param){
    this.loading = true;
    $http.upload(param).then(res=>{
      this.$emit("change",res.data[this.url])
      this.loading = false;
    })
  },
},
}
</script>
<style lang="scss" scoped>
::v-deep.custom-upload{
  .el-upload--picture-card{
    background-color: #fff;
  }
  .disabled .el-upload--picture-card{
    display: none; 
  }
  // 去除动画 上传框框 偏移问题
  .el-upload-list__item {
    transition: none !important;
  }
  
  .el-upload-list__item.is-ready {
    display: none;
  }
  

}

</style>