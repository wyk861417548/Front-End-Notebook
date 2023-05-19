<template>
  <div>
    <van-uploader v-model="fileList" :after-read="afterRead"  accept="video/mp4" @oversize="onOversize" :max-size="maxSize*1024*1024" capture="camera" :max-count="maxCount" multiple >
      <template #preview-cover="item">
        <!-- 以视频第一帧作为图片展示 -->
        <img class="j-img-fit" @click="showVideo(item.url)" v-if="item.url" :src="item.url + '?x-oss-process=video/snapshot,t_1,m_fast'" width="100%" height="100%" alt="">
      </template>
    </van-uploader>

    <div class="fullVideo" v-if="show">
      <video type="video/mp4" controls :src="currentVideo">
      </video>

      <van-icon @click="show =false" class="full-close" size="30px" color="#fff" name="close" />
    </div>
  </div>

</template>

<script>
export default {
  props:{
    // 最大上传数
    maxCount:{type:Number,default:1},

    // 上传图片类型
    fileType:{type:Array,default:()=>{return ['mp4']}},

    // 上传大小限制 默认 10M
    maxSize:{type:Number,default:10},

    // 用于父组件接受已上传的图片名称
    name:{type:String,default:"upload"},

    // 上传接口返回图片字段
    path:{type:String,default:'path'},
  },
  data(){
    return {
      fileList:[],

      currentVideo:'',

      show:false,
    }
  },

  methods:{
    afterRead(files){
      if(!this.handleFileType(files.file))return;

      this.handleStatus(files,'uploading','上传中')
      // 上传
      this.upload(files,files.file);
    },

    // 视频上传
    upload(files,file){
      var param = new FormData();
      param.append('file',file);

      // 上传完成  如果上传失败将当前上传移除
      this.$api.common.upload(param).then(res=>{
        this.handleStatus(files)
        files.url = res.data[this.path];
        this.change();
      }).catch(()=>{
        this.fileList.pop()
        this.change();
      })
    },

    // 图片上传状态处理
    handleStatus(files,status='done',message='上传成功'){
      files.status = status;
      files.message = message;
    },

    // 上传类型判断
    handleFileType(file){
      let msg  = `只支持${this.fileType.join(',')}格式的视频`

      const flieArr = file.name.split('.'); // 根据.分割数组
      let suffix = flieArr[flieArr.length - 1]; // 取最后一个
      suffix = suffix && suffix.toLocaleLowerCase(); // 将后缀所有字母改为小写方便操作

      if(this.fileType.indexOf(suffix) == -1){
        this.$toast(msg);
        this.fileList.pop()
        return false;
      }
      return true;
    },

    onOversize(){
      this.$toast(`上传文件大小不能超过${this.maxSize}MB!`);
    },

    showVideo(video) {
      this.currentVideo = video;
      this.show = true;
    },

    // 组件使用v-model绑定 直接处理成字符串拼接返回
    listToString(list){
      return list.map(item=>item[this.path]).join(',')
    },

    change(){
      this.$emit('input',this.listToString(this.fileList))
      this.$emit("change",{name:this.name,value:this.fileList})
    }
  }
}
</script>

<style lang='less' scoped>
.fullVideo{
  position: fixed;
  z-index: 999;
  background-color: #000;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  video{
    width: 100%;
    height: 100%;
  }
  .full-close{
    position: absolute;
    right: 15px;
    top: 12px;
    z-index: 9999;
  }
}
::v-deep.van-uploader{
  // display: block;
  .van-uploader__file{
    // width: 100%;
    // height: 100%;
    .van-icon,.van-ellipsis{
      display: none;
    }
  }
}
</style>