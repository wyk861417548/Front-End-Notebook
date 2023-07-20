/***
 * 在JavaScript中，实现继承的方法有以下几种：
 * 1.原型链继承
 * 2.构造函数继承
 * 3.组合继承
 * 4.原型式继承
 * 5.寄生式继承
 * 6.寄生组合式继承
 */

/**原型链继承
 * 
 * 缺点：
 * 1.父类引用类型改变所有的实例都会跟着改变（但子类的引用类型不会改变）
 * 2.不能向父类传参
 * 
 * 原因：new创建了一个新的空间对象 每个实例都是一个不同的对象因此互不影响
 * (1) 创建一个新对象
 * (2) 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）
 * (3) 执行构造函数中的代码（为这个新对象添加属性）
 * (4) 返回新对象
 * 
 * 
 */

// 父类
function SuperType(){
  this.property = true;
  // 实例更改其引用类型，所有实例会跟随改变
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.getSuperValue = function(){
  return this.property;
}

// 子类
function SubType(){
  this.subproperty = false;
  // 实例更改其引用类型，所有实例不会跟随改变
  this.color_ = ["red", "blue", "green"];
}

SubType.prototype.getSubValue = function(){
  console.log(this);
  return this.subproperty;
}

SubType.prototype = new SuperType();

var instance1 = new SubType();
var instance2 = new SubType(); 
instance1.colors.push("black");

console.log(instance1.getSuperValue()); //true

console.log(instance1.colors); //"red,blue,green,black"
console.log(instance2.colors); //"red,blue,green,black" 


/**借用构造函数
 *
 * 在子类型构造函数的内部调用超类型构造函数。别忘了，函数只不过是在特定环境中执行代码的对象，因此通过使用 apply()和 call()方法也可以在（将来）新创建的对象上执行构造函数
 *  
 * 解决了向父类传参问题
 * 
 * 缺点：每个方法在每个实例上都重新创建了一遍
 */
// 父类
function SuperType(name){
  this.name = name;
  // 实例更改其引用类型，所有实例会跟随改变
  this.colors = ["red", "blue", "green"];

  this.sayName = function(){
    console.log(this.name);
  }
}

// 子类
function Son(){
  SuperType.call(this,'name')
}

console.log('son',new Son);
var instance1 = new Son();
var instance2 = new Son(); 
instance1.colors.push("black");

console.log(instance1.colors); //"red,blue,green,black"
console.log(instance2.colors); //"red,blue,green"


/**组合继承
 * @param {*} name 
 */
function SuperType(name){
  console.log("11");
  this.name = name;

  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
  console.log(this.name);
}

function Son(name,age){
  // 继承属性
  SuperType.call(this,name)
  this.age = age;
}

// 继承方法(这里优缺点,SuperType会调用用两次，所以一般采用Object.create()原型继承) //下面注释的这种写法子类会具有父类实例的方法，不推荐
// Son.prototype = new SuperType();

// 这两句就是 寄生组合继承原理  解决了SuperType调用了两次问题
Son.prototype = Object.create(SuperType.prototype)
Son.prototype.constructor = Son;

Son.prototype.sayAge = function(){
  console.log(this.age);
}

var instance1 = new Son("Nicholas", 29);
instance1.colors.push("black"); 
console.log('instance1.colors',instance1,instance1.colors); //"red,blue,green,black" 
instance1.sayName(); //"Nicholas"; 
instance1.sayAge(); //29 

var instance2 = new Son("Greg", 27); 
console.log('instance2.colors',instance2.colors); //"red,blue,green" 
instance2.sayName(); //"Greg"; 
instance2.sayAge(); //27


// object 函数 相当于 Object.create()
function object(o){
  function F(){}
  F.prototype = o;
  return new F();
}

/**原型式继承
 * 借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型
 */
var person = { 
  name: "Nicholas", 
  friends: ["Shelby", "Court", "Van"] 
};

var anotherPerson = object(person); 
anotherPerson.name = "Greg"; 
anotherPerson.friends.push("Rob"); 

var yetAnotherPerson = object(person); 
yetAnotherPerson.name = "Linda"; 
yetAnotherPerson.friends.push("Barbie");


/**寄生式继承
 * @param {*} original 
 * @returns 
 * 
 * 寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。
 * 
 * 缺点:使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降低效率；这一点与构造函数模式类似。
 */
function createAnother(original){ 
  var clone = object(original); //通过调用函数创建一个新对象
  clone.sayHi = function(){ //以某种方式来增强这个对象
    console.log('hi');
  }; 
  return clone; //返回这个对象
}

var person = { 
  name: "Nicholas", 
  friends: ["Shelby", "Court", "Van"] 
}; 
var anotherPerson = createAnother(person); 
anotherPerson.sayHi(); //"hi"


/**寄生组合式继承
 * @param {*} subType 
 * @param {*} superType 
 * 
 * 
 * inheritPrototype  用于解决组合继承最大的问题就是无论什么情况下，都会调用两次超类型构造函数
 */
function inheritPrototype(subType,superType){
  var prototype = Object.create(superType.prototype);  //创建对象
  prototype.constructor = subType;              //增强对象
  subType.prototype = prototype;                 //指定对象
}

function SuperType(name){ 
  this.name = name; 
  this.colors = ["red", "blue", "green"]; 
} 

SuperType.prototype.sayName = function(){ 
  console.log(this.name); 
}; 

function SubType(name, age){ 
  SuperType.call(this, name); 
  
  this.age = age; 
}

inheritPrototype(SubType, SuperType); 

SubType.prototype.sayAge = function(){ 
  console.log(this.age); 
};