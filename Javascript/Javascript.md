#### 1.数据类型
参考：https://juejin.cn/post/7061588533214969892#heading-26
```
ECMAScript标准规定了7种数据类型，其把这7种数据类型又分为两种：原始类型和对象类型。
- 基本类型(7种)：string,boolean,undefined,number,null 以及es6 symbol es10的bigint
  - symbol 创建独一无二且不可变的数据类型
  - bigint 可以表示任意精度的整数

- 引用类型：数组、对象、函数

- 基本类型与引用类型的区别
  - 基本类型：存储在栈中，占据空间小，大小固定
  - 引用类型：存储在堆中，但是在栈中存储了指向堆中改实体的指针

```
#### 2.隐式转换
ToPrimitive 参考：https://juejin.cn/post/6844903854882947080
```
- 我们在对各种非Number类型运用数学运算符(- * /)时，会先将非Number类型转换为Number类型;

- NaN和其他任何类型比较永远返回false(包括和他自己)。

- Boolean和其他任何类型比较，Boolean首先被转换为Number类型。

- String和Number比较，先将String转换为Number类型。

- null == undefined比较结果是true，除此之外，null、undefined和其他任何结果的比较值都为false。

- 当原始类型和引用类型做比较时，对象类型会依照ToPrimitive规则转换为原始类型
```

注意+是个例外，执行+操作符时：
```
1.当一侧为String类型，被识别为字符串拼接，并会优先将另一侧转换为字符串类型。

2.当一侧为Number类型，另一侧为原始类型，则将原始类型转换为Number类型。

3.当一侧为Number类型，另一侧为引用类型，将引用类型和Number类型转换成字符串后拼接。

123 + '123' // 123123   （规则1）
123 + null  // 123    （规则2）
123 + true // 124    （规则2）
123 + {}  // 123[object Object]    （规则3）
```


#### 3.类型判断
typeof：能判断所有值类型，函数。不可对 null、对象、数组进行精确判断，因为都返回 object 。
```
console.log(typeof undefined); // undefined
console.log(typeof 2); // number
console.log(typeof true); // boolean
console.log(typeof "str"); // string
console.log(typeof Symbol("foo")); // symbol
console.log(typeof 2172141653n); // bigint
console.log(typeof function () {}); // function
// 不能判别
console.log(typeof []); // object
console.log(typeof {}); // object
console.log(typeof null); // object
```

instanceof：能判断对象类型，不能判断基本数据类型，其内部运行机制是判断在其原型链中能否找到该类型的原型
```
class People {}
class Student extends People {}

const vortesnail = new Student();

console.log(vortesnail instanceof People); // true
console.log(vortesnail instanceof Student); // true

其实现就是顺着原型链去找，如果能找到对应的 Xxxxx.prototype  即为 true 。比如这里的 vortesnail  作为实例，顺着原型链能找到 Student.prototype  及 People.prototype ，所以都为 true 。

```

Object.prototype.toString.call()：所有原始数据类型都是能判断的，还有 Error 对象，Date 对象等。
```
Object.prototype.toString.call(2); // "[object Number]"
Object.prototype.toString.call(""); // "[object String]"
Object.prototype.toString.call(true); // "[object Boolean]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(Math); // "[object Math]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(function () {}); // "[object Function]"
```

### 4.闭包
```
MDN对闭包的定义：
闭包是指哪些能够访问自由变量的函数.

那什么是自由变量呢？
自由函数是指在函数中使用，但既不是函数参数也不是函数的局部变量的变量；

由此，我们可以看出闭包共有两部分组成：
闭包 = 函数 + 函数能够访问的自由变量组成

！！！从理论上来说所有函数都是闭包

ECMAScript，闭包指的是：
1.从理论的角度：所有的函数。因为他们都在创建的时候都把上下文的数据保存起来了，哪怕是简单的全局变量也一样，因为函数中访问全局变量就相当于是在访问自由变量，这和时候使用最外层的作用域。

2.从实践角度一下函数才叫闭包
  I.即使创建它（自由变量）的上下文已经销毁，它依然存在（比如，内部函数从父函数中返回）
  II.在代码中引用了自由变量


在JavaScript中，根据词法作用域的规则，内部函数总是可以访问其外部函数当中声明的变量；当调用通过外部函数返回的内部函数时，即使此时外部函数已经执行结束，但是内部函数所引用外部函数的变量依然保存在内存中，我们把这些变量的集合称为闭包

3.闭包是怎么产生的？
当函数存在对其所在词法作用域的引用，而该函数被拿到当前词法作用域外执行，此时就产生了闭包。

```

##### 5.new操作符具体干了什么 如何实现？
- 1.首先创建了一个空对象
- 2.将对象的原型设置为函数的原型
- 3.让函数的this指向这个对象，执行函数的代码（为这个对象添加属性）
- 4.判断函数返回值的类型，如果是值类型返回这个对象，如果是引用类型则返回函数返回值

实现
```
function objectFactory(){
  let object = new Object();
  let fn = [].shift.call(arguments)

  object.__proto__ = Object.create(fn.prototype)

  let result = fn.apply(object,arguments)

  let rType = typeof rType;
  return (result != null && (['object','function'].includes(rType)))?result:object;
}
```

##### 6.内部属性 [[Class]] 是什么？
所有typeof 返回值为 object的对象都包含一个内部属性Class,他返回这个对象的具体类型名称

##### 7.原型和原型链
原型:每个js对象(除null)创建的时候,都会与之关联另一个对象,这个对象就是我们说的原型

原型链：当调用这个对象的方法的时候，如果对象上没有就会去原型上找，如果还没有就回去原型的原型上找，这个就是原型链

##### 8.js创建对象有哪些方式，继承又有哪些？
- 对象创建
  - 工厂模式
  - 构造函数模式
  - 原型模式
  - 组合模式
  - 动态原型模式
  - 寄生构造函数模式
  - 稳妥构造函数模式

- 继承
  原型链继承 
  借用构造函数继承
  组合式继承
  原型式继承
  寄生式继承
  寄生组合式继承

###### 9. Ajax 是什么? 如何创建一个 Ajax？
ajax是一种异步通讯，通过js脚本像服务端发起通讯，然后根据服务器返回的数据，更新网页的相应部分，而不用刷新整个页面。

```
function request({url,method,headers}){
  return new Promise(function(resolve,reject){
    // 创建
    let xhr = new XMLHttpRequest();
    
    xhr.open(method,url,true) //true是否异步

    xhr.onreadystatechange = function(){
      // 0: 请求未初始化 1: 服务器连接已建立 2: 请求已接收 3: 请求处理中 4: 请求已完成，且响应已就绪
      if(this.readyState !== 4)return;
      
      this.status === 200?resolve(this.response):reject(new Error(this.statusText))
    }

    xhr.responseType = "json";// 设置响应的数据类型

    if(headers){
      for (const key in headers) {
        xhr.setRequestHeader(key,headers[key]); // 设置请求头信息
      }
    }
    xhr.send();
  })
}
```

##### 10.游览器缓存机制？
- 强缓存：
  通过设置Expires时间 和 Cache-Control 的 max-age

- 协商缓存:
  - 1.ETag（服务端） 和 if-none-match（来自游览器传值）
    通过比对文件内容有没有改变（获取文件的md5字）

  - 2.Last-modified 和 if-modified-since
    通过比对文件上次修改时间（获取文件最后修改的时间）

##### 11.前端模块化
```
- CommonJs  
  module.exports  require

- AMD
define(["./a", "./b"], function(a, b) {
  // 依赖必须一开始就写好
  a.doSomething();
  // 此处略去 100 行
  b.doSomething();
  // ...
});

- CMD
  define(function(require,exports,module){
    var a = require('./a')
    a.fn()
    // 此处略去 100 行
    var b = require('./b')
    b.fn()
  })

- es6模块
import export
```

- AMD 与 CMD区别：
  - 依赖：
    AMD 推崇依赖前置，在定义模块的时候就要声明起依赖的模块。
    CMD 推崇就近依赖，只有在用到某个模块的时候在用require
  
  - 依赖模块的执行顺序：
    AMD：在依赖模块加载完后执行依赖模块，依赖模块的执行顺序和我们书写依赖模块执行代码的顺序不一致
    CMD：在所有的依赖模块进入回调函数，遇到require的语句才执行对应的模块，模块执行顺序和书写顺序一致
>
- CommonJs 与 es6模块区别：
  - CommonJs 输出的是值的拷贝（浅拷贝），输出的时候是加载整个模块，生成一个对象，然后在从这个对象上读取方法，这种加载被称为 ‘运行时加载’

  - es6模块 是对模块的引用，在import时可以指定加载某个值，而不是加载整个模块，这种加载被称为 ‘编译时加载’

<!-- ##### 9.简单介绍一下 V8 引擎的垃圾回收机制 -->


##### 12.哪些操作会照成内存泄漏
- 意外的全局变量
- 定时器
- dom的引用
- 闭包

##### 13.防抖节流
- 防抖：事件被触发n秒后，事件执行，如果再这段时间内事件再次被触发，重新计时
```
function debounce(fn,wait=1000){
  let timer = null;
  return function(){
    let that = this,args = argements;
    if(timer)clearTimerout(timer)
    timer = setTimerout(()=>{
      fn.apply(that,args)
    },wait)
  }
}
```
- 节流：在规定的时间内无论触发多少次事件，只会触发一次
```
function throttle(fn,wait){
  let timer = null;
  return function(){
    let that =this,args=arguments;
    if(!timer){
      timer = setTimerout(()=>{
        timer = null
        fn.apply(that,args)
      },wait)
    }
  }
}
```
##### 14.深浅拷贝
- 浅拷贝
  - 1.判断传入对象(target)类型是否是对象且不是null
  - 2.判断值是否是数组，初始拷贝cloneTarget对象是[]，还是{}
  - 3.遍历对象（target）并赋值给cloneTarget，
  - 4.遍历完成后返回cloneTarget

```
function cloneEasy(target){
  if(!(target !== null && typeof target === 'object'))return target;

  let cloneTarget = Array.isArray(target)?[]:{};
  for(let key in target){
    cloneTarget[key] = target[key]
  }
  return cloneTarget;
}
```

- 深拷贝
  - 1.判断传入对象(target)类型是否是对象且不是null
  - 2.判断值是否是数组，初始拷贝cloneTarget对象是[]，还是{}
  - 3.引入WeakMap（弱引用，当下次垃圾回收机制执行时，这块内容就会释放掉）处理是否是自身调用自身
  - 4.遍历对象（target）并递归调用，赋值给cloneTarget
  - 5.遍历完成后返回cloneTarget

```
function cloneDeep(target,map = new WeakMap()){
  if(!(target !== null && typeof target === 'object'))return target;

  let cloneTarget = Array.isArray(target)?[]:{}
  if(map.get(target))return map.get(target)
  map.set(target,cloneTarget)
  
  for(let key in target){
    cloneTarget[key] = cloneDeep(target[key],map)
  }
  return cloneTarget;
}
```

##### 15.call,apply,bind实现
- call,- apply
  - 1.创建唯一值避免属性覆盖
  - 2.如果没有传入目标对象默认指向window
  - 3.将函数挂载到目标对象，改变函数指向
  - 4.最后删除目标对象，返回结果
  
  区别：传参不一样
```
Function.prototype.myApply = function(obj,args){...}
Function.prototype.myCall = function(obj,...args){
  let fn = Symbol("fn")

  const o = obj || window;
  o[fn] = this;

  const result = o[fn](...args);
  delete o[fn]

  return result;
  
}

Function.prototype.myBind = function(obj,...args){
  let that = this;
  
  let fBound = function(){
    // 解决new 操作是this指向问题
    that.myApply(this instanceof that?this:obj,args.concat(Array.prototype.slice.call(arguments)))
  }
  // 继承属性和方法
  fBound.prototype = Object.create(that.prototype)
  return fBound;
}
```

##### 16.什么是xss攻击？如果防范？
- xss攻击：指的是跨站脚本攻击，是一种代码注入攻击，攻击者通过在网站注入恶意脚本，使之在用户的游览器上运行，从而获取用户信息。
- xss的本质是网站没有对恶意脚本进行过滤，导致与正常代码混合在一起，而游览器无法分辨哪些脚本是可信的。

- xss一般分为存储型，反射型，dom型
  - 存储型：是指提交到网站数据库中，但用户请求数据的时候，服务器将其拼接为html返回给用户，从而导致恶意代码执行
  - 反射型：是指攻击者构建了特殊的url，当服务器接收到请求后，从url中获取数据，拼接到html后返回，从而导致恶意代码执行
  - dom型：是指攻击者构建了特殊的url，用户打开网站后，js脚本从url中获取数据，从而导致恶意代码执行。

    - 反射型和存储型的区别是存储型存在数据库中，反射型存储在url中
    - dom型 和 其他两种的区别是，dom型取出和执行恶意代码都是前端执行，属于前端javascript的漏洞，另外两种属于服务端漏洞

- 防范：xss攻击防范从两方面入手，一个是恶意代码提交时，一个是游览器执行
  - 我们对存入数据库的数据进行转义处理，但是有的数据不止一个地方使用，有些地方使用又不需要转义，所以不可靠。所以我们可以使用游览器执行来进行预防，一种是使用纯前端，不用服务端拼接返回。另一种是对插入到html中的代码进行充分的转义

  - 还有一些方式，
    - 使用csp（即白名单），告诉游览器外部哪些资源可以加载执行，从而防止恶意脚本的注入攻击。
    - 对敏感信息进行保护，比如对cookie设置httpOnly 防止脚本获取，也可以使用验证码，避免脚本伪造用户操作。


##### 17.从输入URL到看到页面发生了什么？
- 1.游览器查找当前url是否存在缓存，并比较缓存是否过期
- 2.DNS解析url对应的ip
- 3.根据ip建立tcp链接（三次握手）
- 4.发送http请求
- 5.服务器处理请求，游览器接受http响应
- 6.游览器解析并渲染页面
- 7.关闭tcp链接（四次挥手）

- DNS
  - dns存在多级缓存，游览器缓存、系统缓存、路由器缓存、ips服务器缓存、根域名缓存、顶级域名服务器缓存、主域名服务器缓存


##### 18.什么是MVVM？和MVM有什么区别？什么又是MVP？
- MVC
  - M（model）用于封装业务逻辑相关得数据以及对数据得处理方法
  - V（view）视图层，主要负责数据得展示
  - C（controller）响应机制封装在此，当用户和应用产生交互，控制器中得触发器开始工作
    - M和V之间使用了观察者模式，V先在M上注册，进入观察M，以便更新在M上发生改变得数据
    - V和C之间使用了策略模式，V中引入了C得实例来实现特定得响应策略
      - 问题：每个事件都经过controller使得这层变得十分臃肿,而且V和C一般都是一一对应，这种紧密得连接让C得复用成了问题。

- MVP
  - P（Presenter），通过P来实现V和C的解耦，mvc中C只知道M的接口，因此没办法控制V的更新，MVP中，V层的接口暴露给P，因此我们可以在P层中将V和C的变化绑定在一起，以此来实现V和M的更新

- MVVM
 - VM（ViewModel视图模型）：和mvp思路是相同的，只不过通过双向绑定将V和M的同步更新给自动化，当M变化VM就会自动更新，VM变化了V也会更新，这样就将Presenter中的工作给自动化了。

##### 19.什么是Virtual DOM？为什么 Virtual DOM 比原生 DOM 快？
- Virtual DOM
  - 我们通过将模板经过一系列操作，生成一个与实际dom有着映射关系的一个ast树。

- 减少了DOM的操作次数，从而避免了频繁的回流与重绘
