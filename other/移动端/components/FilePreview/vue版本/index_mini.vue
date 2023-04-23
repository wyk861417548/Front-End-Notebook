<template>
<!-- @scroll="onScroll" -->
  <div id="FILE_BOX" ref="pdf">
    <template v-if="show">
      <pdf ref="pdf" :src="src" v-for="index in pageNum" :key="index" :page='index'></pdf>
    </template>
    <div class="j-vh j-v-c" v-if="!show">
      <van-loading type="spinner" />
    </div>
  </div>

</template>

<script>
// "pdfjs-dist": "2.5.207",  "vue-pdf": "4.2.0",
import pdf from 'vue-pdf'
import alloyfinger from '@/static/js/alloyfinger.js'
export default {
  props:{
    pdfUrl:{
      type:String,
      default:'https://img.cdn.vihost.cn/vue_cli/zhubb/template_file/cs2.pdf',
    }
  },
  components: {pdf},
  data () {
    return {
      show:false,

      pageNum:0,
    };
  },

  created(){
    this.loadPdf();
  },

  mounted(){
    this.initTouch();
  },

  methods: {
    loadPdf(){
      this.src= pdf.createLoadingTask({
        url:this.pdfUrl,
        withCredentials: false,
        renderType:'canvas'
      })
      
      // 获取
      this.src.promise.then(pdf => {
        this.pageNum = pdf.numPages;
        this.$nextTick(()=>{
          this.show = true;
        })
      }).catch(()=>{})
    },

    ease(x){
      return Math.sqrt(1 - Math.pow(x - 1, 2))
    },

    initTouch(){
      var dom = document.querySelector('#FILE_BOX')
      
      alloyfinger.Tranform(dom)
      new alloyfinger.AlloyFinger(dom,{
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
          console.log('evt',evt);
          dom.scaleY = this.initScale * evt.zoom;
          dom.scaleX = this.initScale * evt.zoom;
        },

        // 只有放大的情况才能够左右偏移查看
        pressMove: evt => {
          // evt.preventDefault()
          evt.preventDefault()
          dom.translateX += evt.deltaX;
          dom.translateY += evt.deltaY;
        },
      })
    }
  }
}
</script>
<style lang='less' scoped>
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
  top: 15px;
  right: 20px;
  z-index: 9999;
  color: #333;
  font-size: 14px;
  text-decoration: none;
}
</style>