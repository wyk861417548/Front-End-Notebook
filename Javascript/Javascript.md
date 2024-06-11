#### 1.数据类型
参考：https://juejin.cn/post/7061588533214969892#heading-26
```
ECMAScript标准规定了8种数据类型，其把这8种数据类型又分为两种：
- 基本类型(7种)：string,boolean,undefined,number,null 以及es6 symbol es10的bigint
  - symbol 创建独一无二且不可变的数据类型
  - bigint 可以表示任意精度的整数

- 引用类型：object（数组、对象、函数）

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

#### 4.闭包
```
MDN对闭包的定义：
闭包是指那些能够访问自由变量的函数.

那什么是自由变量呢？
自由函数是指在函数中使用，但既不是函数参数也不是函数的局部变量的变量；

由此，我们可以看出闭包共有两部分组成：
闭包 = 函数 + 函数能够访问的自由变量组成

！！！从理论上来说所有函数都是闭包

ECMAScript，闭包指的是：
1.从理论的角度：所有的函数。因为他们都在创建的时候都把上下文的数据保存起来了，哪怕是简单的全局变量也一样，因为函数中访问全局变量就相当于是在访问自由变量，这和时候使用最外层的作用域。

2.从实践角度以下函数才叫闭包
  I.即使创建它（自由变量）的上下文已经销毁，它依然存在（比如，内部函数从父函数中返回）
  II.在代码中引用了自由变量


在JavaScript中，根据词法作用域的规则，内部函数总是可以访问其外部函数当中声明的变量；当调用通过外部函数返回的内部函数时，此时外部函数已经执行结束，但是内部函数所引用外部函数的变量依然保存在内存中，我们把这些变量的集合称为闭包

3.闭包是怎么产生的？
当函数存在对其所在词法作用域的引用，而该函数被拿到当前词法作用域外执行，此时就产生了闭包。

```

#### 5.new操作符具体干了什么 如何实现？
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

  let rType = typeof result;
  return (result != null && (['object','function'].includes(rType)))?result:object;
}
```

#### 6.内部属性 [[Class]] 是什么？
所有typeof 返回值为 object的对象都包含一个内部属性Class,他返回这个对象的具体类型名称

#### 7.原型和原型链
原型:每个js对象(除null)创建的时候,都会与之关联另一个对象,这个对象就是我们说的原型

原型链：当调用这个对象的方法的时候，如果对象上没有就会去原型上找，如果还没有就回去原型的原型上找，这个就是原型链

#### 8.js创建对象有哪些方式，继承又有哪些？
- 对象创建
  - 工厂模式
  - 构造函数模式
  - 原型模式
  - 组合模式
  - 动态原型模式
  - 寄生构造函数模式
  - 稳妥构造函数模式

- 继承
  - 原型链继承 
  - 借用构造函数继承
  - 组合式继承
  - 原型式继承
  - 寄生式继承
  - 寄生组合式继承

#### 9. Ajax 是什么? 如何创建一个 Ajax？
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

#### 10.xxx？

#### 11.前端模块化
- `CommonJs` (module.exports  require)与 `es6模块` (import export)：
  - CommonJs 输出的是值的拷贝（浅拷贝），输出的时候是加载整个模块，生成一个对象，然后在从这个对象上读取方法，这种加载被称为 ‘运行时加载’

  - es6模块 是对模块的引用，在import时可以指定加载某个值，而不是加载整个模块，这种加载被称为 ‘编译时加载’

- AMD 与 CMD区别：
```
- 依赖：
  AMD 推崇依赖前置，在定义模块的时候就要声明起依赖的模块。
  CMD 推崇就近依赖，只有在用到某个模块的时候在用require

- 依赖模块的执行顺序：
  AMD：在依赖模块加载完后执行依赖模块，依赖模块的执行顺序和我们书写依赖模块执行代码的顺序不一致
  CMD：在所有的依赖模块进入回调函数，遇到require的语句才执行对应的模块，模块执行顺序和书写顺序一致

栗子：AMD
define(["./a", "./b"], function(a, b) {
  // 依赖必须一开始就写好
  a.doSomething();
  // 此处略去 100 行
  b.doSomething();
  // ...
});

栗子：CMD
define(function(require,exports,module){
  var a = require('./a')
  a.fn()
  // 此处略去 100 行
  var b = require('./b')
  b.fn()
})
```

#### 12.哪些操作会照成内存泄漏
- 意外的全局变量
- 定时器
- dom的引用
- 闭包

#### 13.防抖节流
- 防抖：事件被触发n秒后，事件执行，如果再这段时间内事件再次被触发，重新计时
```
function debounce(fn,wait=1000){
  let timeout = null;
  return function(){
    if(timeout)clearTimeout(timeout);

    timeout = setTimeout(()=>{
      fn.apply(this,arguments)
    },wait)
  }
}
```
- 节流：在规定的时间内无论触发多少次事件，只会触发一次
```
function throttle(fn,wait=1000){
  let timeout = null;

  return function(){
    if(timeout)return;

    timeout = setTimeout(()=>{
      timeout = null;
      fn.apply(this,arguments)
    },wait)
  }
}
```
#### 14.深浅拷贝
```
/**
 * 浅拷贝
 * @param {*} target 
 * @returns 
 * 1.判断传入对象(target)类型是否是对象且不是null
 * 2.判断值是否是数组，初始拷贝cloneTarget对象是[]，还是{}
 * 3.遍历对象（target）并赋值给cloneTarget
 * 4.遍历完成后返回cloneTarget
 */
function cloneEasy(target){
  if(!(target !== null && typeof target === 'object'))return target;

  let cloneTarget = Array.isArray(target)?[]:{};
  for(let key in target){
    cloneTarget[key] = target[key]
  }
  return cloneTarget;
}
```

```
/**
 * 深拷贝
 * @param {*} target 
 * @param {*} map 
 * @returns 
 * 1.判断传入对象(target)类型是否是对象且不是null
 * 2.判断值是否是数组，初始拷贝cloneTarget对象是[]，还是{}
 * 3.引入WeakMap（弱引用，当下次垃圾回收机制执行时，这块内容就会释放掉）处理是否是自身调用自身
 * 4.遍历对象（target）并递归调用，赋值给cloneTarget
 * 5.遍历完成后返回cloneTarget
 */
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

#### 15.call,apply,bind实现
```
/**
 * call与apply 区别：传参不一样
 * @param {*} obj 
 * @param  {...any} args 
 * @returns 
 * 
 * 1.创建唯一值避免属性覆盖
 * 2.如果没有传入目标对象默认指向window
 * 3.将函数挂载到目标对象上，改变函数指向
 * 4.最后删除目标对象上的函数，返回结果
 */
Function.prototype.myApply = function(obj,args){...}
Function.prototype.myCall = function(obj,...args){
  let fn = Symbol("fn")

  const o = obj || window;
  o[fn] = this;

  const result = o[fn](...args);
  delete o[fn]

  return result;
  
}
```

```
Function.prototype.myBind = function(obj,...args){
  let that = this;
  
  let fBound = function(){
    // 解决new 操作 this指向问题
    that.myApply(this instanceof that?this:obj,args.concat([...arguments]))
  }
  // 继承属性和方法
  fBound.prototype = Object.create(that.prototype)
  return fBound;
}
```

#### 16.xxx


#### 17.从输入URL到看到页面发生了什么？（详细可见http.md）
- 1.游览器查找当前url是否存在缓存，并比较缓存是否过期
- 2.DNS解析url对应的ip
  - dns存在多级缓存，游览器缓存、系统缓存、路由器缓存、ips服务器缓存、根域名缓存、顶级域名服务器缓存、主域名服务器缓存
- 3.根据ip建立tcp链接（三次握手）
- 4.发送http请求
- 5.服务器处理请求，游览器接受http响应
- 6.游览器解析并渲染页面
- 7.关闭tcp链接（四次挥手）


#### 18.compose 函数
>函数是一个用于函数组合的高阶函数。它接受任意数量的函数作为参数，并返回一个新的函数，该函数可以将这些函数按照从右到左的顺序依次执行。
```
function compose(...fns){
  return function(...args){
    fns.reduceRight((pre,cur)=>{
      let ret = cur(...pre)
      return Array.isArray(ret)?ret:[ret]
    },args)
  }
}

function c1(x,y){
  console.log('c1',x,y);
  return [x+  1,y+1]
}
function c2(x,y){
  console.log('c2',x,y);
  return [x+  2,y+1]
}
function c3(x,y){
  console.log('c3',x,y);
  return [x+  3,y+1]
}

compose(c1,c2,c3)(10,5)
```

#### 19.简叙 event loop
> 因为 JS 是单线程的，单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。为了解决排除等待问题，JS 的任务分为同步任务（synchronous）和异步任务（asynchronous）。 所有同步任务都在主线程上执行，形成一个 Stack）。异步任务（如果是 WebAPI 则会进入 WebAPI，例如 ajax setTimeout）不进入主线程，而是进入另一 Callback Queue。同步任务顺序执行，只有执行栈中的同步任务执行完了，系统才会读取任务队列中可以执行的异步任务，才会把此异步任务从事件队列中放入执行栈中执行，如此循环，直至所有任务执行完毕。这就是 EventLoop


#### 20.Promise.race
```
/**
 * Promise.race
 * @param {*} arr 
 * @returns 
 * 核心就是遍历传入的Promise数组集合以及Promise.resolve，当任意项成功返回，使用Promise.resolve包裹一层，最后resolve
 * Promise.resolve() 静态方法将给定的值转换为一个 Promise。如果该值本身就是一个 Promise，那么该 Promise 将被返回；如果该值是一个 thenable 对象，Promise.resolve() 将调用其 then() 方法及其两个回调函数
 */
 Promise.race = (pArr)=>{
  return new Promise((resolve,reject)=>{
    pArr.forEach(v=>{
      Promise.resolve(v).then(
        res=>{resolve(res)},
        rej=>{reject(rej)}
      )
    })
  })
}
```

#### 21.Promise.all
```
/**
 * Promise.all
 * @param {*} pArr 
 * @returns 
 * 和Promise.race差不多，新增所有请求完成 以及 所有请求成功值的存储
 */
Promise.all = (pArr)=>{
  return new Promise((resolve,reject)=>{
    let ret = [];
    let count = 0;
    pArr.forEach(v=>{
      Promise.resolve(v).then(
        res => {
          count++;
          ret.push(res);

          if(count === pArr.length){
            resolve(ret)
          }
        },
        rej=>{reject(rej)}
      )
    })

    // 如果是空数组 直接返回
    if(pArr.length === 0){
      resolve(ret)
    }
  })
}
```

#### 22.关于事件循环，两道异步代码执行输出顺序问题
题1：：https://q.shanyue.tech/fe/js/727
题2：
```
setTimeout(() => {
  console.log("A");
  Promise.resolve().then(() => {
    console.log("B");
  });
}, 1000);

Promise.resolve().then(() => {
  console.log("C");
});

new Promise((resolve) => {
  console.log("D");
  resolve("");
}).then(() => {
  console.log("E");
});

async function sum(a, b) {
  console.log("F");
}

async function asyncSum(a, b) {
  await Promise.resolve();
  console.log("G");
  return Promise.resolve(a + b);
}
sum(3, 4);
asyncSum(3, 4);
console.log("H");
```

#### 23.网站开发如何实现图片懒加载
- 1.位置计算 + 滚动事件监听 + 自定义属性（data-*）
```
位置计算：clientTop，offsetTop，clientHeight 以及 scrollTop 各种关于图片的高度作比对
```

- 2.getBoundingClientRect + 滚动事件 + 自定义属性（data-*）


- 3.IntersectionObserver + 自定义属性（data-*）
```
// 创建一个IntersectionObserver实例
const observer = new IntersectionObserver(entries => {
  // 对每个交叉状态的元素进行处理
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 当元素进入视口时加载图片
      const imgElement = entry.target;
      const imgUrl = imgElement.getAttribute('data-src');
      imgElement.setAttribute('src', imgUrl);
      observer.unobserve(imgElement); // 停止观察已加载的图片
    }
  });
});

// 获取需要懒加载的图片元素
const lazyImages = document.querySelectorAll('.lazy');

// 遍历每个图片元素，并开始观察
lazyImages.forEach(img => {
  observer.observe(img);
});
```

#### 24.原型、原型链相等关系理解
```
1.js分为函数对象和普通对象，每个对象都有__proto__属性，但是只有函数对象才有prototype属性.

2.Object、Function都是js内置的函数, 类似的还有我们常用到的Array、RegExp、Date、Boolean、Number、String.

那么__proto__和prototype到底是什么，两个概念理解它们

3.属性__proto__是一个对象，它有两个属性，constructor和__proto__

4.原型对象prototype有一个默认的constructor属性，用于记录实例是由哪个构造函数创建；

js之父在设计js原型、原型链的时候遵从以下两个准则

1. Person.prototype.constructor == Person // **准则1：原型对象（即Person.prototype）的constructor指向构造函数本身**

2. person01.__proto__ == Person.prototype // **准则2：实例（即person01）的__proto__和原型对象指向同一个地方**

```