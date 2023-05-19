<template>
  <el-cascader ref="cascader" v-model="valueList" :options="options" :props="props" collapse-tags clearable></el-cascader>
</template>

<script>
import * as $http  from '@/api/pages/enterprise/business.js'
export default {
  props: {
    value: {
      type: Array | String
    },
  },
  data() {
    return {
      //级联选择器
      options: [],

      valueList: [],

      props: {
        multiple: true,
        emitPath: true,
        lazyLoad: this.lazyLoads,
        lazy: true,
        expandTrigger: 'hover'
      },
    };
  },

  watch:{
    value:{
      handler(newVal){
        if(newVal){
          this.valueList = Array.isArray(newVal)?newVal:JSON.parse(newVal);
        }
      },
      immediate:true
    },
  },

  created(){
    if(this.valueList.length > 0){
      this.init()
    }
  },

  methods: {
    // getData(type,id){
    //   let vdata,data;
    //   switch (type) {
    //     case 0:
    //       data = [{level:0,value: '1',label: '一级能源'}, {level:0,value: '2',label: '一级空气'}]
    //       vdata = data;
    //       break;
    //     case 1:
    //       data = {
    //         1:[
    //           {level:1,value: '1',label: '二级能源1'}, 
    //           {level:1,value: '2',label: '二级能源2'},
    //         ],
    //         2:[
    //           {level:1,value: '1',label: '二级空气1'}, 
    //           {level:1,value: '2',label: '二级空气2'},
    //         ],
    //       }
    //       vdata = data[id]
    //       break;
    //     case 2:
    //       data = {
    //         1:[
    //           {level:2,value: '1',label: '三级能源1',leaf:true}, 
    //           {level:2,value: '2',label: '三级能源2',leaf:true},
    //           {level:2,value: '3',label: '三级能源3',leaf:true}, 
    //           {level:2,value: '4',label: '三级能源4',leaf:true},
    //           {level:2,value: '5',label: '三级能源5',leaf:true}, 
    //           {level:2,value: '6',label: '三级能源6',leaf:true},
    //         ],
    //         2:[
    //           {level:2,value: '1',label: '三级空气1',leaf:true}, 
    //           {level:2,value: '2',label: '三级空气2',leaf:true},
    //         ],
    //       }
    //       vdata = data[id]
    //       break;
    //   }
    //   return new Promise((resolve)=>{
    //     setTimeout(()=>{
    //       resolve(vdata)
    //     },Math.random()*1000)
    //   })
    // },
    getData(level,id){
      return new Promise((resolve)=>{
        $http['factor'+level]({id}).then((res) => {
          let nodes = res.rows.map(item=>({
            label:item.firstName || item.secondName || item.factorName,
            value:item.id,
            level,
            leaf: level >= 2
          }));
          resolve(nodes)
        })
      })
    },

    async lazyLoads(node, resolve){
      const {level} = node;

      // 如果是最后一级不再触发
      if(level > 2)return resolve();

      let res = await this.getData(level,node.value)

      if(level == 0)return resolve(res);
      // 后续还没有懒加载过的接着加载
      node.data && !node.data.children?resolve(res):resolve()
    },

    // 数据回显处理,递归获取数据
    async init(){
      let res = await this.getData(0)
      let p = [];const dict = {}; //防止数据重复加载
     
      this.valueList.forEach((item) => {
        const len = item.length -1;
        item.forEach((id, index) => {
          if(index == len || dict[index+'-'+id])return;
          dict[index+'-'+id] = true;

          p.push(
            this.getData(index+1,id).then(children=>({
              level:index+1,
              parentId:id,
              children
            }))
          )
        });
      })

      Promise.all(p).then((data)=>{
        data.forEach(child=>this.findItem(res,child))
        this.options = res;
        this.setParetNodetLoad()
      })
    },

    // 递归数据塞入
    findItem(res,child){
      const {level,parentId,children} = child;
      for (let i = 0; i < res.length; i++) {
        if(res[i].value == parentId && res[i].level === level-1){
          res[i].children = children;
        }
        if (res[i].children) {
          this.findItem(res[i].children,child);
        }
      }
    },

    // 设置默认值已加载完成,防止再次加载数据
    setParetNodetLoad(){
      this.$nextTick(_=>{
        var node =this.$refs.cascader.getCheckedNodes(); //获取当前选中节点
        for (let i = 0; i < node.length; i++) {
          node[i].loaded = true
        }
      })
    },
    
    change(value){
      this.$emit('input',JSON.stringify(value))
      this.$emit('inputLast',value.map(item=>item[item.length-1]).join(','))
    },
  },
  
}
</script>

<style></style>