<template>
    <!-- :before-upload="beforeUpload" -->
  <div class="custom-upload">
    <el-upload
      :class="{disabled:uploadDisabled}"
      action="xxx"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :limit='limit'
      :file-list="fileList"
      v-loading="loading">
      <div slot="file" slot-scope="{file}" style="width:100%;height:100%;">
        <img class="el-upload-list__item-thumbnail" style="object-fit:cover" :src="file[url]" alt="" >
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)" >
            <i class="el-icon-zoom-in"></i>
          </span>

          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)" >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <i slot="default" class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">只能上传{{fileType.join(',')}}图片，且不超过{{maxSize}}M</div>
    </el-upload>

    <Dialog ref="dialog" :title="title">
      <img width="100%" :src="dialogImageUrl" alt="">
    </Dialog>
  </div>
</template>
<script>
import * as $http from '@/api/pages/common.js'
export default {
  props:{
    title:{
      type:String,
      default:"预览"
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

    value:{
      type: String | Array,
      default:''
    },
  },

  data() {
    return {
      loading:false,

      // 弹窗显示图片
      dialogImageUrl: '',

      // 是否禁用图片上预览 删除操作
      disabled: false,
      
      // 上传图片列表
      fileList: [],
    };
  },

  computed:{
    // 是否已达到上传最大数
    uploadDisabled(){
      return this.fileList.length >= this.limit;
    }
  },

  methods: {
    // 预览照片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file[this.url];
      this.$refs.dialog.show = true;
    },
  
    // 移除文件  由于 before-upload返回false自动调用before-remove和on-remove钩子问题解决方法
    handleRemove(file,fileList) {
      this.fileList.map((item,index)=>{
        if(item[this.uid] == file[this.uid]){
          this.fileList.splice(index,1);
        }
      })
    },

    // 上传图片之前
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

      var param = new FormData();

      this.$config.kCompass({fileinput:file}).then(({result}) => {
        var files = this.$config.dataURLtoFile(result,file.name)

        param.append('file',files);

        this.upload(param);
      }).catch((err) => {console.log('err',err);});
      return false;
    },

    // 上传图片
    upload(data){
      this.loading = true;
      $http.upload(data).then((res)=>{
        this.fileList.push(res.data);
        this.loading = false;
      }).catch(()=>{this.loading= false})
    },

    // 组件使用v-model绑定 直接处理成字符串拼接返回
    listToString(list){
      return list.map(item=>item[this.url]).join(',')
    }
  },

  watch:{
    value:{
      handler(newVal){
        if(newVal){
          this.fileList = !Array.isArray(newVal) ? newVal.split(',').map(item=>({[this.url]:item})) : newVal;
        }
      },
      immediate: true
    },

    fileList(newVal){
      this.$emit('input',this.listToString(newVal))
      this.$emit("change",{value:newVal})
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep.custom-upload{
    .el-upload--picture-card{
      background-color: #fff;
      margin: 0 8px 8px 0;
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