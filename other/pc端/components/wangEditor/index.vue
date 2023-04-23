<template>
  <div>
    <upLoad @change='setImg' @focus="focus"></upLoad>
    <div ref="editor" id="editor—wrapper">
      <div id="toolbar-container"><!-- 工具栏 --></div>
      <div id="editor-container"><!-- 编辑器 --></div>
    </div>
  </div>
</template>

<script>
let EDITOR = null;
import upLoad from './upLoad.vue'
export default {
  props:{
    defaultHtml:{
      type:String,
      default:'<p></p>'
    }
  },
  components:{
    upLoad
  },
  data(){
    return {
      htmlStr:'',

      initHtml:''
    }
  },

  created(){
    console.log('this.defaultHtml',this.defaultHtml);
    this.initHtml = this.defaultHtml;
  },

  mounted(){
    this.init()
  },
  methods:{
    init(){
      var that = this;
      const { createEditor, createToolbar } = window.wangEditor;

      const editorConfig = {
        onChange(editor) {
          that.htmlStr = editor.getHtml();
          that.$emit('change',that.htmlStr)
        },
      };
 
      EDITOR = createEditor({
        selector: "#editor-container",
        html: that.initHtml,
        config: editorConfig,
        mode: "simple", // or 'simple'
      });
      
      
      const toolbarConfig = {
        // 排除掉某些菜单
        excludeKeys:["headerSelect","blockquote","codeBlock","header1","header3","header2","group-image"],
        // 插入的位置，基于当前的 toolbarKeys
        insertKeys:{
          index: 10,
          keys: ["color","fontSize","fontFamily","lineHeight","insertImage"]
        },
      };
      
      const toolbar = createToolbar({
        editor:EDITOR,
        selector: "#toolbar-container",
        config: toolbarConfig,
        mode: "simple", //default or 'simple'
      });
      // console.log('toolbar.getConfig()',toolbar.getConfig());
    },

    // 动态插入图片
    setImg(url){
      EDITOR.dangerouslyInsertHtml(`<img src="${url}" alt="">`)
    },

    // 每次上传图片前 聚焦富文本框
    focus(){
      if(!EDITOR.isFocused()){
        EDITOR.focus()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep#editor—wrapper {
  border: 1px solid #ccc;
  z-index: 100; /* 按需定义 */
  #toolbar-container {
    border-bottom: 1px solid #ccc;
  }
  #editor-container {
    height: 400px;
  }
}

</style>