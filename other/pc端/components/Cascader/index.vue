<template>
  <el-cascader popper-class='custom-cascader' style="width:100%" ref="cascader" v-model="list" :options="options" filterable :props='props' collapse-tags clearable @change="change"></el-cascader>
</template>

<script>
export default {
  props:{
    props:{
      type:Object,
      default:()=>{}
    },

    value:{
      type:String | Number,
      default:''
    },

    options:{
      type:Array,
      default:()=>[]
    },

    // 是否拼接返回
    montage:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      list:[],
    }
  },

  methods: {
    change(value){
      let label = this.$refs['cascader'].getCheckedNodes()[0];
      if(label){
        label = label.pathLabels.join('');
      }

      if(this.montage){
        this.$emit('input',value.join(','))
      }else{
        this.$emit('input',value)
      }

      // 如果是多选
      // if(this.props.multiple){
      //   this.$emit('input',value)
      // }else{
      //   // 单选  emitPath:false 只返回最后一级数据
      //   this.props.emitPath == false?this.$emit('input',value):this.$emit('input',value.join(','))
      // };

      this.$emit("change",{label,value})
    },

    clear(){
      if(!this.$refs.cascader)return;
      try{
        this.$refs.cascader.clearValue()
      }catch(err){
        this.$refs.cascader.handleClear()
      }
    },

    // 处理默认数据
    handleInitValue(val){
      if(this.montage){
        this.list = !Array.isArray(val) ? val.split(',') : val;
      }else{
        this.list = val
      }
    }
  },

  watch:{
    // 默认值设置
    value:{
      handler(newVal){
        if(newVal){
          this.handleInitValue(newVal)
        }else{
          this.clear();
        }
      },
      immediate: true
    },
  }
}
</script>

<style lang='scss'>
// .custom-cascader{
//   .el-cascader-menu:first-child .el-checkbox{
//     display: none !important;
//   }
//   .el-cascader-menu:nth-child(2) .el-checkbox{
//     display: none !important;
//   }
// }
</style>