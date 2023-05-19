<template>
  <div class="my-upload flex">
    <!-- 已上传图片展示区域 -->
    <div class="fileList upBox" :class="!mode?'upBoxDefault':'dash'" @click="handleView" v-for='(item,index) in fileList' :key='index'>
      <img :src="item[path]" alt="图片">
      <p class="upBox-del" @click.stop="handleRemove(index)"><van-icon name="cross"/></p>
    </div>

    <!-- 选择图片区域 -->
    <label v-if="limit > fileList.length" class="upBox" :class="!mode?'upBoxDefault':'dash'">
      <!-- 可自定义icon -->
      <p class="j-full-center">
        <slot name='icon'><van-icon name="plus" /></slot>
      </p>
      
      <input ref="inputer" type="file" accept="image/*" multiple style="display: none;" @change="beforeRead">
    </label>
  </div>

</template>

<script>
export default {

  props:{
    // 最大上传数
    limit:{type:Number,default:1},

    // 上传接口返回图片字段
    path:{type:String,default:'path'},

    // 上传图片类型
    fileType:{type:Array,default:()=>['jpg','png','jpeg']},

    // 默认展示图片
    value:{type:[String,Array]},

    // 样式模式 false：背景模式  true：线条模式
    mode:{type:Boolean,default:false}
  },
  data () {
    return {
      // 已上传图片
      fileList:[],
    };
  },

  methods: {
    // 上传图片
    beforeRead(){
      var file = this.$refs.inputer.files;

      if(!this.handleFileType(file))return;
      
      this.$config.kCompass({fileinput:file[0]}).then(({result}) => {
        var files = this.$config.dataURLtoFile(result,file.name)
        
        // 手机拍照图片旋转90度修复
        this.$config.compressorImage(files).then(res=>{
          this.upload(res)
        })
      })
    },

    // 上传图片
    upload(files){
      var param = new FormData();
      param.append('file',files);

      this.$api.common.upload(param).then(res=>{
        this.$refs.inputer.value = null;
        this.fileList.push({...res.data,url:res.data[this.path]});
        this.change();
      })
    },

    handleFileType(file){
      if(file.length < 1){
        this.$toast("请选择图片");
        return false;
      }

      let msg  = `只支持${this.fileType.join(',')}格式的文件`

      if(this.fileType.indexOf(file[0].type.split('/')[1]) == -1){
        this.$toast(msg);
        return false;
      }
      return true;
    },

    // 预览
    handleView(){
      const imgs = this.fileList.map(item=>item[this.path])
      this.$ImagePreview(imgs)
    },

    // 移除图片
    handleRemove(index){
      this.fileList.splice(index,1)
      this.change()
    },

    // 组件使用v-model绑定 直接处理成字符串拼接返回
    listToString(list){
      return list.map(item=>item[this.path]).join(',')
    },

    // 是否删除或者新增
    change(){
      this.$emit('input',this.listToString(this.fileList))
    }
  },

  watch:{
    // 默认值设置
    value:{
      handler(newVal){
        if(newVal){
          this.fileList = !Array.isArray(newVal) ? newVal.split(',').map(item=>({[this.path]:item})) : newVal;
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang='less' scoped>
  @bg-color-upload: rgba(0, 0, 0, 0.3);
  .my-upload{
    .upBox{
      position: relative;
      display:inline-block;
      width: 80px;
      height: 80px;
      margin-right: 10px;
      border-radius:2px;
      i{color: #ddd;}
      .upBox-del{
        position: absolute;
        top: 0;
        right: 0;
        width: 15px;
        height: 15px;
        background-color: rgba(0,0,0,.7);
        border-radius: 0 0 0 15px;
        i{
          position: absolute;
          top: -1px;
          right: -2px;
          font-size: 14px;
          color: #fff;
          transform: scale(.5);
        }
      }

      &.upBoxDefault{
        background-color: #f7f8fa;
        &:active{
          background-color: #f2f3f5;
        }
      }
      &.dash{
        border: 1px dashed #ddd;
        &:active{
          border-color:#108ee9;
          i{color: #108ee9;}
        }
      }
    }

    .fileList{
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
        object-fit:cover
      }
      .mask{
        opacity: 0;
        i{
          flex:1;
          color: #000;
          text-align: center;
        }
        &:hover{
          opacity: 1;
          background: @bg-color-upload;
        }
      }
    }
  }
  
</style>