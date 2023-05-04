let COUNT = 0;

// 加载多个
export function loadScriptAll(arr,callback){
  arr.map(url=>{
    COUNT++;
    loadScript(url,callback,true)
  })
}

// 加载一个
export function loadScript(url,callback,type){
  let script = document.createElement('script');

  script.onload = function(){
    type?COUNT--:'';
    if(COUNT === 0){
      callback();
    }
  }
  script.onerror = function(){
    console.log('加载失败');
  }

  script.src = url;
  document.body.appendChild(script);
}