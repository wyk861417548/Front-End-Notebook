/**单列模式
 * 概念：保证一个类仅有一个实例，并提供一个访问它的全局访问点。
 * @param {*} name 
 */
var Singleton = function (name) {
  this.name = name;
  this.instance = null;
};

Singleton.prototype.getName = function () {
  console.log(this.name);
};

Singleton.getInstance = function (name) {
  //提供一个访问Singleton类的实例的接口
  if (!this.instance) {
    // 检测是否已经存在这个实例
    this.instance = new Singleton(name); //不存在则生成
  }
  return this.instance; // 已经存在则直接返回, 确保多次调用只会返回一次实例
};

var a = Singleton.getInstance("小王");
var b = Singleton.getInstance("小红");
console.log(a === b);

// 透明的单例模式 “透明”的单例类: 用户从这个类中创建对象的时候，可以像使用其他任何普通类一样。 ( 这个所说的透明是指从外观上,看不出普通的类和透明的类之间的区别是啥 )
let CreateUniqDiv = (function () {
  let instance;
  class createDiv {
    constructor(text) {
      this.text = text;

      if (instance) {
        return instance;
      }

      instance = this;
    }
  }
  return createDiv;
})();

let a1 = new CreateUniqDiv("sv1");
let b1 = new CreateUniqDiv("sv2");
console.log(a1 === b1);

// 用代理实现单例模式
var ProxySingletonCreateDiv = (function () {
  var instance;
  return function (text) {
    if (!instance) {
      //是否已经创造一个实例, 如果已经创造过,则直接返回之前创造的
      instance = new CreateDiv(text);
      //当第一次运行该函数后, 把生成的示例存储在闭包的数据之中
    }
    return instance;
  };
})();

class CreateDiv {
  constructor(text) {
    this.text = text;
  }
}

var a2 = new ProxySingletonCreateDiv("sv1");
var b2 = new ProxySingletonCreateDiv("sv2");

console.log(a2 === b2);

/**工厂模式
 * 概念：使用同一类别的类综合起来，以便接口统一方便调用，同事在修改以及扩展时更加方便
 */
class Shop {
  constructor(name) {
    return this[name].apply(this, [...arguments]);
  }
  Steak(name, price, time) {
    //内部很是自由, 可以随意使用各种方式
    this.name = name;
    this.price = price;
    this.time = time;
  }
  Grill(args) {
    //烧烤
    this.price = 20;
    this.time = 15;
  }
  Noodles(args) {
    //面条
    this.price = 15;
    this.time = 10;
  }
}
//统一方法调用
var a = new Shop("Steak", 90, 30); //老板来份牛排
var b = new Shop("Grill"); //老板来份烧烤
var c = new Shop("Noodles"); //老板来份面条



/** 建造者模式
 * 概念：将一个复杂对象的构建与它的表现分离，使得同样的构建过程可以创建不同的表示。
 * 
 */

//建造房子场景
//建造者 - 施工团队
let Builder = (function () {
  //成员01 -- 决定厅室
  function Rooms(member) {
    if (member <= 0) {
      throw new Error("入住人数错误！");
    }
    this.rooms = member >= 4 ? 4 : member;
  }
  //成员02 -- 决定面积
  function FloorSpace(budget) {
    if (typeof budget !== "number" || Number.isNaN(budget) || budget < 60) {
      throw new Error("预算过低或错误！");
    }
    this.budget = budget;
  }
  //成员03 -- 整体风格
  function Style(style) {
    this.style = style || "常规风格";
  }
  return class {
    //住几人，预算多少(万)，风格
    constructor(member, budget, style) {
      Rooms.call(this, member);
      FloorSpace.call(this, budget);
      Style.call(this, style);
    }
  };
})();
//包工头获取客户需求，然后建造房子
let house1 = new Builder(1, 100, "小清新"); //客户1的需求
let house2 = new Builder(4, 200, "欧美"); //客户2的需求

/** 原型模式
 *  概念：用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。
 */
//父类
class Parent {
  constructor(x) {
    this.x = x;
  }
  showX() {
    alert(this.x);
  }
}

//子类1继承
class ChildA extends Parent {
  constructor(y, x) {
    super(x);
    this.y = y;
  }
  showY() {
    alert(this.y);
  }
}
//子类2继承
class ChildB extends Parent {
  constructor(x, z) {
    super(x);
    this.z = z;
  }
  showZ() {
    alert(this.z);
  }
}

var a = new ChildA("a1", "a2");
var b = new ChildB("b1", "b2");
console.log("a", a);



/** 策略模式
 *  概念：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。
 */
var strategies = {
  //策略类
  S: function (salary) {
    return salary * 4;
  },
  A: function (salary) {
    return salary * 3;
  },
  B: function (salary) {
    return salary * 2;
  },
};
//环境类Context
var calculateBonus = function (level, salary) {
  //接受客户的请求
  return strategies[level](salary); //委托类
};
console.log(calculateBonus("S", 20000)); // 输出：80000
console.log(calculateBonus("A", 10000)); // 输出：30000


/** 发布订阅模式（观察者模式）
 *  概念：它定义对象间的一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知
 * 
 *  基础版：缺点所有订阅者都接受到了发布者的消息
 * 
 */

// 基础版
var staff = {
  clientList:[], //存放订阅者的回调函数

  // 订阅
  listen:function(fn){
    this.clientList.push(fn)
  },
  
  // 发布消息
  trigger:function(){
    for(let i=0,fn;fn = this.clientList[i++];){
      fn.apply(this,arguments)
    }
  }
};
// 小明订阅
staff.listen((price,squareMeter)=>{console.log('小明订阅消息更新了',price,squareMeter)})
// 小红订阅
staff.listen((price,squareMeter)=>{console.log('小红订阅消息更新了',price,squareMeter)})

staff.trigger(10000,'1平')
staff.trigger(20000,'1平')


// 改进版  增加标识让订阅者只订阅自己感兴趣的消息
var event = {
  clientList:{},

  // 订阅
  listen:function(key,fn){
    if(!this.clientList[key]){
      this.clientList[key] = []
    }
    this.clientList[key].push(fn) // 订阅的消息添加进缓存列表
  },

  // 发布
  trigger:function(){
    var key = Array.prototype.shift.call(arguments),
        fns = this.clientList[key];
    
    if(!fns || fns.length < 1)return;  // 如果没有绑定对应的消息

    for (let i = 0,fn;fn = fns[i++];) {
      fn.apply(this,arguments)  // arguments 是trigger 时带上的参数
    }
  },

  // 取消订阅订阅
  remove:function(key,fn){
    const fns = this.clientList[key]
    
    // 如果没有被订阅过 直接返回
    if(!fns) return;

    if(!fn){ // 如果没有传入具体的回调函数，表示需要取消key 对应消息的所有订阅
      fns && (fns.length = 0)
    }else{
      for (let i = fns.length-1; i>=0; i--) {
        if(fns[i] === fn){
          fns.splice(i,1) // 删除订阅者的回调函数
        }
      }
    }
  }
}

// 将需要装载发布订阅的对象传入
var installEvent = function(obj){
  for (const key in event) {
    obj[key] = event[key]
  }
}


// 全局发布
var Event = (function(){
  let clientList={},
      listen,
      trigger,
      remove;

  // 订阅
  listen=function(key,fn){
    if(!clientList[key]){
      clientList[key] = []
    }
    clientList[key].push(fn) // 订阅的消息添加进缓存列表
  }

  // 发布
  trigger=function(){
    var key = Array.prototype.shift.call(arguments),
        fns = clientList[key];
    
    if(!fns || fns.length < 1)return;  // 如果没有绑定对应的消息

    for (let i = 0,fn;fn = fns[i++];) {
      fn.apply(this,arguments)  // arguments 是trigger 时带上的参数
    }
  }
  // 取消订阅订阅
  remove=function(key,fn){
    const fns = clientList[key]
    // 如果没有被订阅过 直接返回
    if(!fns) return;

    if(!fn){ // 如果没有传入具体的回调函数，表示需要取消key 对应消息的所有订阅
      fns && (fns.length = 0)
    }else{
      for (let i = fns.length-1; i>=0; i--) {
        if(fns[i] === fn){
          fns.splice(i,1) // 删除订阅者的回调函数
        }
      }
    }
  }

  return {listen,trigger,remove}
})()