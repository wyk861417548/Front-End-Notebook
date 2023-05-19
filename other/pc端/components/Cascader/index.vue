<template>
  <el-cascader v-model="list" :options="options" :props='props' collapse-tags clearable></el-cascader>
</template>

<script>
  export default {
    props:{
      props:{
        type:Object,
        default:()=>{}
      },
      value:{
        type:String,
        default:''
      },

      options:{
        type:Array,
        default:()=>[]
      }
    },
    data(){
      return {
        list:[],
      }
    },

    watch:{
      // 默认值设置
      value:{
        handler(newVal){
          if(newVal){
            this.list = !Array.isArray(newVal) ? newVal.split(',') : newVal;
          }
        },
        immediate: true
      },


      list(newVal){
        this.$emit('input',newVal.join(','))
      }
    }
  }
</script>