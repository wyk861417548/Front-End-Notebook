<template>
  <el-dialog class="custom-dialog" v-if="show" :title="title" :top="top" :visible.sync="show" :width="width"  :close-on-click-modal="close" :append-to-body="appendToBody" @close="closeDialog" >
    <slot>

    </slot>
  </el-dialog>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:"提示"
    },
    width:{
      type:String,
      default:'50%'
    },

    top:{
      type:String,
      default:'10vh'
    },

    // 是否允许点击阴影关闭弹窗
    close:{
      type:Boolean,
      default:false
    },

    //是否允许将 Dialog 自身是否插入至 body 元素上。
    appendToBody:{
      type:Boolean,
      default:true
    },
  },
  data () {
    return {
      show:false
    };
  },

  created(){
    console.log('this',this.top);
  },

  methods: {
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>
<style lang='scss' scoped>
  ::v-deep.custom-dialog{
    // 修改弹窗样式
    .el-dialog{
      position: relative;
      color: #fff;
      box-shadow:0 0 1px #fff inset;
      .el-dialog__header{
        position: relative;
        // padding: 10px 20px;
        box-sizing: border-box;
        // .el-dialog__headerbtn{
        //   top: 50%;
        //   transform: translateY(-50%);
        // }
      }
      .el-dialog__body{
        padding: 20px;
        position: relative;
      }
      
    }
  }
</style>