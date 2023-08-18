#### 全局自动导入
```
// 自动注册组件
// 获取公共组件文件路径集合（只获取文件夹下面的index.vue）
const requireComponent = require.context('@/components/common', true, /index+\.(vue|js)$/)

// 遍历得到组件路径
requireComponent.keys().forEach(fileName => {
  
  // 组件内容
  const componentConfig = requireComponent(fileName).default;
  // 以文件夹名称作为公共组件的名字
  let arr = fileName.split('/');
  const componentName =  arr[arr.length-2].replace(/\.\w+$/, '');

  // 挂载全局
  Vue.component(componentName,componentConfig)
})

```

#### 局部自动加载
```
const requireComponent = require.context('./', false, /\w+.(vue|js)$/)
const cmps = {};
// 排除
const filterCmps = ['Dindex'];
// 遍历得到组件路径
requireComponent.keys().forEach(fileName => {
  // 组件内容
  const cmp = requireComponent(fileName).default;
  // 以文件名作为名称
  let cmp_ = fileName.slice(2,-4);

  !filterCmps.includes(cmp_) && (cmps[cmp_] = cmp)
})

export default {
  components:{
    ...cmps
  },
}
```

#### 多入口打包
```
module.exports = {
  publicPath:'./',

  outputDir:'build',
  
  pages: {
    index: {
      entry: "src/views/hospital/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
    code:{
      entry: 'src/views/code/main.js', // page 的入口
      template: 'public/code.html',// 模板来源
      filename: 'code.html',// 在 build/code.html 的输出
    }
  },

  productionSourceMap:false,
}
```