<template>
  <div id="FILE_BOX" class="j-full-curbox">
    <div class="tip">操作说明：双击复原,双指拉伸缩放</div>
    <div id="pdf"></div>

    
    <div class="download j-flex" @click="getReport">
      <img :src="$RESOURE + 'icon/download.png'" width="30px" alt="">
      <p class="ml-5">下载报告</p>
    </div>
  </div>

</template>

<script>
import Pdfh5 from 'pdfh5'
import 'pdfh5/css/pdfh5.css'
import alloyfinger from '@/static/js/alloyfinger.js'
export default {
  props:{
    //  pdf地址  base64 (显示两者都支持  但是下载 只支持地址格式)
    pdfUrl:{
      type:String,
      default:''
    },
  },
  data () {
    return {
      initScale:1
    };
  },

  mounted(){
    this.loadPdf();
    this.initTouch();
  },

  methods: {
    loadPdf(){
      this.pdfh5 = new Pdfh5('#pdf',{
        pdfurl:this.pdfUrl,
        lazy:true,
        scale:3,	// 最大比例5，默认1.5	pdf渲染的比例	
        zoomEnable:false,	//是否允许pdf手势缩放 默认true
      })
    },

    // 生成报告
    getReport(){
      this.$api.physicalExamination.createReport(this.$parent.data).then(() => {
        let url = `https://axy-service.vihost.cn/tjbgfile/${this.$parent.data.physicalexaminationCode}.pdf`;
        this.download(url)
      })
    },

    download(url,fileName = '体检报告.pdf'){
      let a =document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = fileName
      a.click()
      document.body.removeChild(a);
    },
    
    // base64转pdf
    // convertDataURIToBinary(dataURI) {
    //   const BASE64_MARKER = ';base64,'; //声明文件流编码格式
    //   //[RFC2045]中有规定：Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符，回车符给去掉。
    //   var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    //   var newUrl = dataURI.substring(base64Index).replace(/[\n\r]/g, '');
    //   var raw = window.atob(newUrl); //这个方法在ie内核下无法正常解析。
    //   var rawLength = raw.length;
    //   //转换成pdf.js能直接解析的Uint8Array类型
    //   const uInt8Array = new Uint8Array(new ArrayBuffer(rawLength));
    //   for (let i = 0; i < rawLength; i++) {
    //     uInt8Array[i] = raw.charCodeAt(i) & 0xff;
    //   }
    //   console.log(new Blob([uInt8Array], { type: 'application/pdf' }));
    //   return new Blob([uInt8Array], { type: 'application/pdf' })
    // },
    
    ease(x){
      return Math.sqrt(1 - Math.pow(x - 1, 2))
    },

    initTouch(){
      var dom = document.querySelector('#pdf'),FILE_BOX=document.querySelector('#FILE_BOX'); 
      
      alloyfinger.Tranform(dom)
      new alloyfinger.AlloyFinger(FILE_BOX,{
        multipointStart:function(evt){
          evt.preventDefault();
          this.initScale = dom.scaleX;
        },

        doubleTap:function(){
          new alloyfinger.To(dom,'translateY',0,300,this.ease)
          new alloyfinger.To(dom,'translateX',0,300,this.ease)
          new alloyfinger.To(dom,'scaleY',1,300,this.ease)
          new alloyfinger.To(dom,'scaleX',1,300,this.ease)
        },

        pinch:function(evt){
          evt.preventDefault();
          dom.scaleY = this.initScale * evt.zoom;
          dom.scaleX = this.initScale * evt.zoom;
        },

        // 只有放大的情况才能够左右偏移查看
        pressMove: evt => {
          // evt.preventDefault()
          if(dom.scaleY > 1){
            evt.preventDefault()
            dom.translateX += evt.deltaX;
            dom.translateY += evt.deltaY;
          }
        },
      })
    }
  }
}
</script>
<style lang='less' scoped>
::v-deep .pdfjs{
  z-index: 10;
  .pdfViewer{padding:0 !important;}
  .viewerContainer{overflow-x: hidden !important}
}
#FILE_BOX{
  background: #999;
  margin: 0;
  padding: 0;
}
#app .nodata{
  text-align: center;
  margin: 0;
  color: rgba(255,255,255,.5);
}

#FILE_BOX .tip{
  position: absolute;
  z-index: 1;
  left: 10px;
  right: 10px;
  top: 20px;
  border-radius: 50%;
  color: rgba(255,255,255,.5);
  font-size: 14px;
  text-align: center;
}

.download{
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 9999;
  color: #333;
  font-size: 14px;
  text-decoration: none;
}
</style>