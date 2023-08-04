var obj = {
  name:"大抵"
}
function test1(type,sex='1',age='2'){
  console.log(type,this.name,sex,age,this.xxx);
}
test1.prototype.xxx = 88;

/**
 * 手写Call完善版
 * @param {*} obj 
 * @param  {...any} args 
 * @returns 
 * 
 * 1.创建唯一值避免属性覆盖
 * 2.如果没有传入目标对象默认指向window
 * 3.将函数挂载到目标对象上，改变函数指向
 * 4.最后删除目标对象上的函数，返回结果
 */

Function.prototype.myCall = function(obj,...args){
  const fn = Symbol('fn');

  const O = obj || window;
  O[fn] = this;

  const result = O[fn](...args);
  delete O[fn];

  return result;
}
test1.myCall(obj,'myCall','男',20)

/**
 * 手写apply
 * @param {*} obj 
 * @param {*} args 
 * @returns 
 * 
 * 步骤和call差不多，接受参数不同而已
 */
Function.prototype.myApply = function(obj,args){}

test1.myApply(obj,['myApply','男',20])

/**
 * 
 * @param {*} obj 
 * @param  {...any} args 
 * 1.bind接收参数  绑定后的函数也接收函数
 * 2.new会改变this指向.
 * 
 */
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

var fn = test1.myBind(obj,'myBind');
fn('参数二');
fn('参数二','参数三');
new fn('参数二','参数三') 

//-----------------------------
const bind = test1.bind(obj,'bind',)
bind('参数二');
bind('参数二','参数三');
new bind('参数二','参数三') 

/**
 * 防抖 （短时间内触发多次同一函数，只会触发一次）
 * @param {*} fn 
 * @param {*} wait 
 * @returns 
 */
function debounce(fn,wait=1000){
  let timeout = null;
  return function(){
    if(timeout)clearTimeout(timeout);

    timeout = setTimeout(()=>{
      fn.apply(this,arguments)
    },wait)
  }
}

/**
 * 节流 在规定时间内，无论事件触发多少次，只会触发一次
 * @param {*} fn 
 * @param {*} wait 
 * @returns 
 */
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


/**
 * - 1.首先创建了一个空对象
 * - 2.将对象的原型设置为函数的原型
 * - 3.让函数的this指向这个对象，执行函数的代码（为这个对象添加属性）
 * - 4.判断函数返回值的类型，如果是值类型返回这个对象，如果是引用类型则返回函数返回值
 */
function objectFactory(){
  let object = new Object();
  let fn = [].shift.call(arguments)

  object.__proto__ = Object.create(fn.prototype)

  let result = fn.apply(object,arguments)

  let rType = typeof rType;
  return (result != null && (['object','function'].includes(rType)))?result:object;
}

