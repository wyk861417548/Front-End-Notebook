/**
 * 浅拷贝
 * @param {*} target 
 * @returns 
 */
function cloneEasy(target){
  if(typeof target === 'object'){
    const cloneTarget  = {};
    for (const key in target) {
      cloneTarget [key] = target[key];
    }
    return cloneTarget ;
  }

  return target;
}

var aim1 = {a:1,b:{ball:"篮球"}}

var clone1 = cloneEasy(aim1);
clone1.a = '2';
clone1.b.ball = '足球';
console.log('aim1',aim1);//aim1 { a: 1, b: { ball: '足球' } }
console.log('clone1',clone1);//clone1 { a: '2', b: { ball: '足球' } }


/**
 * 深拷贝（乞丐版：JSON.parse(JSON.stringify(target))）
 * @param {*} target 
 * @returns 
 * 问题：没有考虑数组拷贝
 * 解决: const cloneTarget  = Array.isArray(target) ? [] : {};
 * 
 * 问题：对象存在循环引用的情况 aimDeep.aimDeep = aimDeep;深拷贝递归进入死循环导致栈内存溢出了。
 */
function cloneDeep(target){
  if(typeof target === 'object'){
    // const cloneTarget  = Array.isArray(target) ? [] : {};
    const cloneTarget = {};
    for (const key in target) {
      cloneTarget [key] = cloneDeep(target[key])
    }
    return cloneTarget ;
  }

  return target;
}

var aim2 = {a:1,b:{ball:"篮球",mm:{sex:"男",arr:[1,2,3,4]}},fn:function(){console.log("----------")}}
// aim2.aim2 = aim2;  

var clone2 = cloneDeep(aim2);
clone2.a = '2';
clone2.b.ball = '足球';
clone2.b.mm.sex = '女';

console.log('aim2',aim2); //aim2 { a: 1, b: { ball: '篮球', mm: { sex: '男' } } }
console.log('clone2',clone2);// clone2 {a: '2',b: { ball: '足球', mm: { sex: '女', arr: [Object] } },fn: [Function: fn]}
console.log('clone2',clone2.b.mm.arr);//clone2 { '0': 1, '1': 2, '2': 3, '3': 4 }
clone2.fn();//----------


/**
 * 深拷贝 不计较 for in 性能问题
 * @param {*} target 
 * @param {*} map 
 * @returns 
 */
function deepN(target,map = new WeakMap()){
  if(!(typeof target === 'object' && target !== null))return target;

  const cloneTarget = Array.isArray(target)?[]:{};
  
  if(map.get(target))return map.get(target);
  map.set(target,cloneTarget);

  // 不计较性能版
  for (const key in target) {
    cloneTarget[key] = deepN(target[key],map)
  }
  return cloneTarget;
}

var aim3 = {a:1,xx:null,me:undefined,b:{ball:"篮球",mm:{sex:"男",arr:[1,2,3,4]}},fn:function(){console.log("----------")}}
aim3.aim3 = aim3;  

var clone3 = deepN(aim3);
clone3.a = '2';
clone3.b.ball = '足球';
clone3.b.mm.sex = '女';
console.log('aim3',aim3); 
console.log('clone3',clone3);
clone3.fn();



/**
 * 深拷贝 修复解决自身引用问题
 * @param {*} target 
 * @param {*} map  //WeakMap 弱引用  当下次垃圾回收机制执行时，这块内容就会释放掉
 * @returns 
 * 
 * 问题：for in执行效率低  改用for
 * 
 * 思路
 * 1.传入目标值，判断是否是对象，不是对象直接返回；
 * 2.是否数组判断，赋值cloneTarget对象，初始值为对象还是数组
 * 3.引入WeakMap处理自身引用问题，为什么用WeakMAp而不是Map,因为弱引用的关系。下次垃圾回收机制，这块内容就会被释放掉
 * 4.由于for in 在处理数据比较多的情况效率低，使用for循环代替，因此如果不是数组，使用Object.keys()获取键值数组，在进行遍历
 * 5.遍历加递归循环调用
 */

// 合理判断是否引用类型

function clone (target,map = new WeakMap()){
  // 特殊处理null类型直接返回  而且WeakMap只能有对象作为键值 但不接受null作为键值
  if(!(target !== null && typeof target === 'object'))return target;

  const isArray = Array.isArray(target);
  let cloneTarget = {};
  
  // 解决自身调用
  if(map.get(target))return map.get(target);
  map.set(target,cloneTarget);

  const arr = isArray?target:Object.keys(target);
  // 分别处理数组和对象
  if(isArray){
    cloneTarget = [];
    for(let i=0;i<arr.length;i++){
      cloneTarget[i] = clone(target[i],map)
    }
  }else{
    for(let i=0;i<arr.length;i++){
      let key = arr[i];
      cloneTarget[key] = clone(target[key],map)
    }
  }
  return cloneTarget;
}

var aimClone = {a:1,xx:null,me:undefined,b:{ball:"篮球",mm:{sex:"男",arr:[1,2,3,4]}},fn:function(){console.log("----------")}}
aimClone.aimClone = aimClone;  

var copy = clone(aimClone);
// copy.a = '2';
// copy.b.ball = '足球';
// copy.b.mm.sex = '女';
console.log('aimClone',aimClone); 
console.log('copy',copy);
copy.fn();



