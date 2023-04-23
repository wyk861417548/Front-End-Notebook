<template>
  <el-upload
    style="width:100%;"
    class="upload-demo"
    drag
    multiple
    action="xxx"
    :limit='limit'
    :on-remove="handleRemove"
    :before-upload="beforeUpload"
    :file-list="fileList">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip">只能上传{{fileType.join(',')}}格式文件，且不超过{{maxSize}}M</div>
  </el-upload>
</template>
<script>
import * as $http from '@/api/pages/common.js'
import request from '@/utils/request'
export default {
  props:{
    // 用于父组件接受已上传的图片名称
    name:{
      type:String,
      default:"upload"
    },

    fileType:{
      type:Array,
      default:()=>{
        return ['pdf','doc','docx']
      }
    },

    maxSize:{
      type:Number,
      default:2
    },

    // 上传限制数量
    limit:{
      type:Number,
      default:2
    },
  },

  data() {
    return {
      // 上传文件
      fileList: [],
    };
  },
    methods: {
    // 移除文件  由于 before-upload返回false自动调用before-remove和on-remove钩子问题解决方法
    handleRemove(file) {
      if(file.status == 'success'){
        this.fileList = [];
      }
    },

    // 上传文件之前
    beforeUpload(file) {
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

      console.log('file',file,$http.uploadFile);
  
      var param = new FormData();
      param.append('file',file);

      this.upload(param);

      return false;
    },

    // 上传图片
    upload(param){
      const configs = {
        headers: {'Content-Type': 'multipart/form-data'},

        onUploadProgress: (progressEvent)=>{
          if (progressEvent.lengthComputable) {   //是否存在进度
            var complete = Math.round( ((progressEvent.loaded * 100) / progressEvent.total) | 0,10);
            console.log('percentCompleted',percentCompleted);
            file.onProgress({percent:complete})
            // this.progress = percentCompleted;
          }
        },
      }
      
      request({
        url: $http.uploadFile,
        method: 'post',
        data:param,
        configs
      }).then(({data})=>{
        this.fileList.push(data);
      })
    },
  },
  watch:{
    fileList:{
      handler(newVal){

        var param = new FormData();

        param.append('file',newVal[0]);

        var data = {
          name:this.name,
          value:param,
          boolen:newVal.length > 0?true:false
        }
        
        this.$emit('input',param)
        this.$emit("change",data)
      },
      deep:true
    }
  }
}
</script>
<style lang="scss" scoped>
  :v-deep.el-upload{
    width: 100%;
    .el-upload-dragger{
      width: 100%;
    }
  }
  .el-upload__tip{
    text-align: left;
  }
</style>