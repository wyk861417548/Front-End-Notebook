/**工厂模式
 * @param {*} name 
 * @param {*} age 
 * @param {*} job 
 * @returns 
 * 
 * 1.显示的创建对象，显示的赋予对象属性值，显示的返回值
 * 
 * 缺点：没有对象识别，不能通过 instanceof 来确定是否是右侧的构造函数构造出来的实例对象
 *
 * 使用: let obj1 = createPerson('xx',18,'学习');  obj1 instanceof createPerson
 */
function createPerson(name,age,job){
  var o = new Object();
  
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function(){
    console.log(this.name);
  }

  return o;
}

/**构造函数模式
 * @param {*} name 
 * @param {*} age 
 * @param {*} job 
 * 
 * 要创建 Person 的新实例，必须使用 new 操作符。以这种方式调用构造函数实际上会经历以下 4个步骤：
 * (1) 创建一个新对象；
 * (2) 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
 * (3) 执行构造函数中的代码（为这个新对象添加属性）；
 * (4) 返回新对象。
 * 
 * 对比工厂模式：没有显示的创建对象，直接将属性和方法赋值给this，没有return语句，而且解决了对象识别
 * 
 * 缺点：每个方法在每个实例上都重新创建了一遍
 * 
 * 使用: let obj1 = new Person('xx',18,'学习') 
 * 
 */
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;
  // this.sayName = new Function("alert(this.name)"); // 与声明函数在逻辑上是等价的
  this.sayName = function(){
    console.log(this.name);
  }
}

/**原型模式
 * 
 * 缺点：每次添加新的属性都要添加一个 Person.prototype，属性如果是引用类型，会导致所有实例的的该属性都跟着一起变化
 * 
 * 改进1：
 *  Object.defineProperty(Person.prototype, "constructor", { 
      enumerable: false, 
      value: Person 
    });
 * 
 * 改进2：
 * Person.prototype = { 
    constructor : Person, 
    name : "Nicholas", 
    age : 29, 
    job: "Software Engineer", 
    sayName : function () { 
      console.log(this.name);
    } 
  };
 * 
 */
function Person(){}
Persoon.prototype.name = 'xx';
Persoon.prototype.age = 18;
Persoon.prototype.job = '学习';
Person.prototype.sayName = function(){ 
  console.log(this.name); 
};

/**组合模式
 * @param {*} name 
 * @param {*} age 
 * @param {*} job 
 * 
 * 每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存。另外，这种混成模式还支持向构造函数传递参数；可谓是集两种模式之长
 * 
 * 解决了原型模式的引用属性问题
 */
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends = ['1','2']
}
Person.prototype.sayName = function(){
  console.log(this.name);
}


/**动态原型模式
 * @param {*} name 
 * @param {*} age 
 * @param {*} job 
 */
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends = ['1','2']

  if(typeof this.sayName != 'function'){
    Person.prototype.sayName = function(){
      console.log(this.name);
    }
  }
}

/**寄生构造函数模式
 * @param {*} name 
 * @param {*} age 
 * @param {*} job 
 * @returns 
 * 
 * 模式：这种模式的基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象；
 * 
 * 与工厂模式在创建上一模一样，区别在调用时使用 new 
 * 
 * 缺点：没有对象识别，不能依赖 instanceof 操作符来确定对象类型
 */
function SpecialArray(name,age,job){
  var o = new Object(); 
  o.name = name; 
  o.age = age; 
  o.job = job; 
  o.sayName = function(){ 
    console.log(this.name); 
  }; 
  return o;
}

// 例子:这个模式可以在特殊的情况下用来为对象创建构造函数。假设我们想创建一个具有额外方法的特殊数组。由于不能直接修改 Array 构造函数，因此可以使用这个模式。
function SpecialArray(){ 
  //创建数组
  var values = new Array(); 
  //添加值
  values.push.apply(values, arguments); 
  //添加方法
  values.toPipedString = function(){ 
    return this.join("|"); 
  }; 
  
  //返回数组
  return values; 
} 
var colors = new SpecialArray("red", "blue", "green"); 
console.log(colors.toPipedString()); //"red|blue|green"



/**稳妥构造函数模式
 * @param {*} name 
 * @param {*} age 
 * @param {*} job 
 * 
 * 所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。稳妥对象最适合在一些安全的环境中（这些环境中会禁止使用 this 和 new），或者在防止数据被其他应用程序（如 Mashup程序）改动时使用。
 * 
 * 注意：在以这种模式创建的对象中，除了使用 sayName()方法之外，没有其他办法访问 name 的值
 */
function Person(name,age,job){
  //创建要返回的对象
  var o = new Object();
  //可以在这里定义私有变量和函数

  //添加方法
  o.sayName = function(){
    console.log(name,age,job);
  }

  //返回对象
  return o;
}
var friend = Person("Nicholas", 29, "Software Engineer"); 
friend.sayName(); //"Nicholas"