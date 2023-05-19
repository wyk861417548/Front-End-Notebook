<template>
  <el-select  v-model="text" :placeholder="placeholder" :multiple='multiple' :disabled="disable" @change="$emit('input',text)" filterable>
    <el-option
      v-for="item in options"
      :key="item[custom.value]"
      :label="item[custom.label]"
      :value="item[custom.value]">
    </el-option>
  </el-select>

</template>

<script>
export default {
  props:{
    // 选择框内容
    option:{
      type:Array,
      default:()=>[]
    },

    // 提示语
    placeholder:{
      type:String,
      default:"请选择"
    },

    // 是否支持多选
    multiple:{
      type:Boolean,
      default:false
    },

    // 自定义 名字 值 字段
    custom:{
      type:Object,
      default:()=>{
        return {
          label:'label',
          value:'value'
        }
      }
    },

    // 是否禁用
    disable: {
      type: Boolean,
      default: false
    },

    value:{
      type:String | Number
    }
  },
  data () {
    return {
      text:'',
    };
  },

  computed:{
    options(){
      return this.option;
    }
  },

  watch: {
    value(newVal){
      this.text = newVal
    },
  }
}
</script>
<style lang='scss' scoped>
  
</style>
