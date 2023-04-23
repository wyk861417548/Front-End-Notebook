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
      // page 的入口
      entry: 'src/views/code/main.js',
      // 模板来源
      template: 'public/code.html',
      // 在 build/code.html 的输出
      filename: 'code.html',
    }
  },

  productionSourceMap:false,
}
```