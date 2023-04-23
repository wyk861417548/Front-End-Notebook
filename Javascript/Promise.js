const PENDING = 'pending',
      FULFILLED = 'fulfilled',
      REJECTED = 'rejected';

class MyPromise {
  constructor(executor){
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;

    this.onFulfilledCallback = [];
    this.onRejectedCallback = [];
    console.log('1-----');

    // 发布 
    let resolve = (val)=>{
      console.log('3-----',this.status);
      if(this.status === PENDING){
        this.status = FULFILLED;
        this.value = val;
        console.log('4-----',this.onFulfilledCallback);
        this.onFulfilledCallback.forEach(fn=>fn())
      }
    }
    // 发布 
    let reject = (val)=>{
      console.log('3.1-----',this.status);
      if(this.status === PENDING){
        this.status = REJECTED;
        this.reason = val;
        console.log('4.1-----');
        this.onRejectedCallback.forEach(fn=>fn())
      }
    }
    console.log('2-----');
    try {
      executor(resolve,reject);
    } catch (err) {
      console.log('11111',err);
      // throw(err)
    }
  }

  then(onFulfilled,onRejected){
    console.log('5-----',this.status);
    let promise2 =new Promise((resolve,reject)=>{
      if(this.status === FULFILLED){
        // 必须是异步  保证不能干扰其他外界代码的执行
        setTimeout(()=>{
          try {
            console.log('6-----');
            let x = onFulfilled(this.value)
            resolve(x)
          } catch (err) {
            throw err;
          }
        },0)
      }
      if(this.status === REJECTED){
        // 必须是异步  保证不能干扰其他外界代码的执行
        console.log('7-----');
        setTimeout(()=>{
          try {
            let x = onFulfilled(this.reason)
            reject(x)
          } catch (err) {
            throw err;
          }
        })
      }
      
      // 订阅
      if(this.status === PENDING){
        this.onFulfilledCallback.push(()=>{
          onFulfilled(this.value)
        });
        this.onFulfilledCallback.push(()=>{
          onRejected(this.value)
        });
      }
    })

    return promise2;
  }
}

new MyPromise((res,rej)=>{
  console.log(1);
  res(1)
}).then(res=>{
  console.log(2,res);
  return 2;
},rej=>{
  console.log(2.1,rej)
}).then((res)=>{
  console.log(3,res);
})

// setTimeout(()=>{
//   console.log(6666666666);
// },0)
console.log(6666666666);

// new Promise((res,rej)=>{
//   console.log(1);
//   res(1)
// }).then(res=>{
//   console.log(2,res);
//   return 2;
// },rej=>{
//   console.log(2.1,rej)
// }).then((res)=>{
//   console.log(3,res);
// })

// setTimeout(()=>{
//   console.log(6666666666);
// },0)