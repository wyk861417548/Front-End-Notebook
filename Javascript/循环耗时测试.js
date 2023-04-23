var object = {
  file1:1,
  file2:{
    arr:1
  },
  file3:[1,2,3,4,5],
  file4:[{a:1,b:2,c:3}],
  file5:{
    1:[1,2,3,4,5]
  }
}

var arr = [];

for (let i = 0; i < 5000000; i++) {
  arr.push(i);
}

// test1
console.log('while循环耗时');
console.time('testTime');
const length = arr.length;
let j = 0;
sum = 0;
while(j<length){
  const el = arr[j];
  sum += el;
  j++;
}
console.timeEnd('testTime');


// test2
console.log('forin循环耗时');
console.time('testTime');
sum = 0;
for(let key in arr){
  const el = arr[key];
  sum += el;
}
console.timeEnd('testTime');

// test3
console.log('for循环耗时');
console.time('testTime');
sum = 0;
for(let i=0;i<arr.length;i++){
  const el = arr[i];
  sum += el;
}
console.timeEnd('testTime');


console.log('object.key',Object.keys(object));