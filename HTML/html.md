##### 1. DOCTYPE 的作用是什么？  
- 用于告诉游览器的解析器以什么标准来解析文档，如果不存在或者格式不正确会导致文档以兼容的模式呈现

##### 2. 标准模式与兼容模式各有什么区别？
- 标准模式：渲染方式和js 引擎解析方式是以游览器支持的最高标准运行
- 兼容模式：页面以宽松向后兼容的方式显示，模拟老游览的行为以防止站点无法运行

##### 3.link 与 @import有什么区别？
- 从属关系：@import 是css提供的语法规则，只有导入样式表的作用。link是html提供的标签，不仅可以导入css样式，还能够定义rss,rel属性，引入网站图标。

- 加载顺序：加载页面时，link引入的css被同时加载，@import引入的css等到页面加载完成后加载。

- 兼容性： link是html标签无兼容性，@import是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别

- 可控性：通过js操作DOM，动态的的插入link改变css样式，而@import不可以。

##### 4.defer和async
- 1.没有defer和async游览器会立即加载并执行指定脚本，会阻塞后面的dom解析
- 2.async的加载和dom的解析是并行进行的（异步），但是当async加载完成后，会立即执行阻塞后面的dom解析
- 3.defer的加载和dom的解析是并行进行的（异步），会在所有dom解析完成后，才执行


##### 5.游览器的渲染原理？
- 1.首先解析文档生成dom树
- 2.然后根据css解析生成CSSOM规则树
- 3.根据dom树喝CSSOM树构建成渲染树。渲染树的节点被称为渲染对象，渲染对象和节点相对应（但不是一对一关系）
- 4.然后根据渲染树来进行布局（layout），最后进行绘制（paint）

##### 6.css如果阻塞文档的解析？（游览器解析过程）
理论上样式表不改变dom树，也就没有必要停下文档解析它们，但是如果游览器尚未完成cssom的下载和构建，此时执行javascript脚本并存在文档的解析过程中请求样式信息，那么游览器将延迟javascript脚本执行和文档解析，知道cssom构建完成。

##### 7.渲染页面时常见哪些不良现象？
FOUC（游览器页面闪烁）：
  机制：由于游览器渲染机制（比如firefox）在css加载之前，先呈现了html
  原因：原因是css加载时间过长，或则css被放在了文档底部
白屏：
  机制：有些游览器机制（比如chrome）要先构建DOM树和CSSOM树，构建完成后在进行渲染
  原因：如果把css部分放在html底部游览器迟迟为渲染，或者将js文件放在头部，脚本加载阻塞后面的文档内容解析，从而导致白屏

#### 8.如何理解html语义化 
参考：https://juejin.cn/post/7061588533214969892#heading-26
```
- 用正确的标签做正确的事情！

- 让人更容易读懂（增加代码可读性）

- 让搜索引擎更容易读懂，有助于爬虫抓取更多的有效信息，爬虫依赖于标签来确定上下文个各个关键字的权重（SEO）

- 在没有css样式下页面也能够呈现出很好的内容结构、代码结构
```

#### 9.水平垂直居中多种实现方式
Flex 布局教程：语法篇 https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html
```
1.绝对定位（还有配合margin）
.j-full-center{position: absolute;top:50%;left: 50%;transform: translate(-50%,-50%);}

flex垂直居中
.j-flex{display: flex;justify-content: center;align-items: center;}
 
flex + margin(子元素设置)
.flex{display: flex;}

flex多行垂直居中
.j-v-c{display: flex;flex-direction: column;justify-content: center;align-items: center;}
/* .j-v-c{display: flex;flex-wrap: wrap; justify-content: center;align-content: center;} */

table-cell + vertical-align  inline-block/margin: auto(子元素设置)
.j-table{display: table-cell;text-align: center;vertical-align: middle;}
```


#### 10.BFC 
BFC 的特性：
```
- BFC 内部的块级盒会在垂直方向上一个接一个排列 ①

- 同一个 BFC 下的相邻块级元素可能发生外边距折叠，创建新的 BFC 可以避免的外边距折叠 ②

- 每个元素的外边距盒（margin box）的左边与包含块边框盒（border box）的左边相接触（从右向左的格式化，则相反），即使存在浮动也是如此 ③

- 浮动盒的区域不会和 BFC 重叠 ④

- 计算 BFC 的高度时，浮动元素也会参与计算 ⑤
```

以下元素会创建 BFC：
```
- 根元素（<html>）

- 浮动元素（float 不为 none）

- 绝对定位元素（position 为 absolute 或 fixed）

- 表格的标题和单元格（display 为 table-caption，table-cell）

- 匿名表格单元格元素（display 为 table 或 inline-table）

- 行内块元素（display 为 inline-block）

- overflow 的值不为 visible 的元素

- 弹性元素（display 为 flex 或 inline-flex 的元素的直接子元素）

- 网格元素（display 为 grid 或 inline-grid 的元素的直接子元素）

```

BFC使用：
``` 
- 水平的margin永远不会重叠。

- 设置了overflow属性（visible除外）的元素和它的子元素之间的margin不会重叠。

- 设置了绝对定位（position:absolute;）的盒模型，垂直margin不会重叠，和子元素之间也不会重叠。

- 设置了display：inline-block的元素，垂直的margin不会重叠，和子元素之间也不会重叠。

- 根元素（如html）与body的margin不会重叠。

```

#### 11.主流浏览器及其内核以及前缀如下：

在前端开发中，当需要使用某些 CSS 属性或特性时，可能需要考虑不同浏览器的兼容性，并添加相应的浏览器前缀以确保在各个浏览器中正确渲染。这些前缀一般会在 CSS 属性前添加，并且需要根据具体的属性和浏览器进行选择添加。除了上述主流浏览器的前缀外，还可能需要添加其他特定浏览器的前缀，如Opera的前缀`-o-`等。同时，随着浏览器的更新和标准的统一，一些新的 CSS 属性可能不再需要添加前缀，需要根据具体情况进行判断。为了简化前缀的添加过程，可以使用自动添加前缀的工具（如Autoprefixer）来自动处理浏览器前缀的兼容性。

```
1. Google Chrome：
   - 内核：Blink（基于Webkit）
   - CSS前缀：-webkit-

2. Mozilla Firefox：
   - 内核：Gecko
   - CSS前缀：-moz-

3. Apple Safari：
   - 内核：Webkit
   - CSS前缀：-webkit-

4. Microsoft Edge（自Edge 79版本起）：
   - 内核：Chromium
   - CSS前缀：-webkit- (部分兼容Webkit的特性)

5. Opera（自Opera 15版本起）：
   - 内核：Blink（基于Webkit）
   - CSS前缀：-webkit-

6. Internet Explorer：
   - 内核：Trident
   - CSS前缀：-ms-
```

#### 12.为什么利用多个域名来存储网站资源会更有效？
```
1. 突破浏览器并发限制
现代浏览器对同一个域名下的资源并行下载的数量是有限的（通常为4-8个），而通过使用多个域名，可以突破这个限制，实现更多资源的并行下载。这样可以加快网页的加载速度，提升用户的体验。

2. 节约主域名的连接数，优化页面响应速度
将网站的资源分散存储在多个域名下，可以降低每个域名下的资源数量，从而减小单个域名下资源的请求大小。这有助于减轻服务器的负载压力，并提高资源的下载速度。

3. 缓存优化
不同的域名可以为不同类型的资源设置不同的缓存策略，如图片可以设置更长时间的缓存过期时间，而动态内容可以设置较短的缓存时间。这样可以最大程度地利用缓存机制，减少服务器的负载和网页加载时间。
```