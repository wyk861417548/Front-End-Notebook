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
 * 步骤和call差不多，接受参数和传递参数不同而已
 */
Function.prototype.myApply = function(obj,args){
  const fn = Symbol('fn');

  const O = obj || window;
  O[fn] = this;

  const result = O[fn](...args);
  delete O[fn];

  return result;
}

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
  var that = this;
  var fbound = function(){
    that.myApply(this instanceof that?this:obj,args.concat(Array.prototype.slice.call(arguments)))
  }
  // 继承属性和方法
  fbound.prototype = Object.create(that.prototype)
  return fbound;
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
    let that = this,args=arguments;
    if(timeout)clearTimeout(timeout);

    timeout = setTimeout(()=>{
      fn.apply(that,args)
    },wait)
  }
}

function throttle(fn,wait=1000){
  let timeout = null;

  return function(){
    let that = this,args = arguments;
    
    if(timeout)return;

    timeout = setTimeout(()=>{
      timeout = null;
      fn.apply(that,args)
    },wait)
  }
}