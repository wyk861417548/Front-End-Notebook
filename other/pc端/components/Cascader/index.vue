<template>
  <el-cascader ref="cascader" v-model="list" :options="options" filterable :props='props' collapse-tags clearable @change="change"></el-cascader>
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

        if(this.props.emitPath == false){
          this.$emit('input',value)
          this.$emit("change",{name:label,value})
          return;
        }

        this.$emit('input',value.join(','))
        this.$emit("change",{name:label,value})
      },

      clear(){
        if(!this.$refs.cascader)return;
        try{
          this.$refs.cascader.clearValue()
        }catch(err){
          this.$refs.cascader.handleClear()
        }
      }
    },

    watch:{
      // 默认值设置
      value:{
        handler(newVal){
          if(newVal){
            if(this.props.emitPath == false){
              this.list = newVal;
              return;
            }
            this.list = !Array.isArray(newVal) ? newVal.split(',') : newVal;
          }else{
            this.clear();
          }
        },
        immediate: true
      },
    }
  }
</script>