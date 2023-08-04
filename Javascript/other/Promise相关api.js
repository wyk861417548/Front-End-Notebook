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