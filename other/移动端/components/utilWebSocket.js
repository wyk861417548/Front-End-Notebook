import api from "@/static/js/api.js";

// webSocket 对象
let ws = null;

//连接标识 避免重复连接
let isConnect = false;

// 服务器ws地址
let wsUrl = 'ws://192.168.0.246:9111/ws'
// let wsUrl = api.baseUrl.replace("http",'ws') + ''

//断线重连后，延迟5秒重新创建WebSocket连接  rec用来存储延迟请求的代码
let timer;

//服务器和客户端收到的信息内容如果如下 就识别为心跳信息 不要做业务处理
let checkMsg='heartbeat';


// 创建连接webScoket
let createWebSocket = ()=>{
  try{
    ws = new WebSocket(wsUrl)

    //初始化websocket连接
    initWebsocket();

  }catch(e){
    console.log("创建连接失败");

    //如果无法连接上webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
    reConnect();
  }
}

// 重新连接
let reConnect = ()=>{
  //如果已经连上就不在重连了
  if(isConnect) return;

  timer && clearTimeout(timer);


  timer = setTimeout(()=>{
    createWebSocket();
  },5000)
}


// 初始化webSocket连接

let initWebsocket = ()=>{
  //WebSocket连接建立之后会调用onopen方法
  ws.onopen = function(e){
    console.log("WebSocket连接成功",e);

    //连接建立后修改标识
    isConnect=true;
    
    // 告诉服务器身份识别
    ws.send(JSON.stringify({"type":"register", "mid":2}));

    //定时发送数据  告诉服务器保持连接
    // heartCheck.start();
  }

  //当websocket收到服务器发送的信息之后  会调用onmessage方法  getMsg用来封装获取到服务器的消息进行处理，下面会说明
  ws.onmessage  = function(e){
    console.log("onmessage");
    getMsg(e);

    //获取消息后 重置心跳
    // heartCheck.reset();
  }

  //当websocket因为异常原因（比如服务器部署、断网等）关闭之后，会调用onerror方法  在onerror中需要调用reConnect方法重连服务器
  ws.onerror = function(e){
    console.log("WebSocket is open now.");

    //连接断开后修改标识
    isConnect=false;

    //连接错误 需要重连
    reConnect();
  }

  //当websocket因为各种原因（正常或者异常）关闭之后，会调用onclose方法
  ws.onclose = function(e){
    console.log("websocket断开了连接");

    //连接断开后修改标识
    isConnect=false;
  }
}

//获得消息之后   区别是心跳还是业务信息  如果是业务信息特殊处理
let getMsg = (e) => {
  console.log("msg",e);
};

//心跳设置
let heartCheck ={
  //每段时间发送一次心跳包 这里设置为20s
  timeout: 20000,

  //延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）
  timeoutObj: null,

  //一段时间后发送心跳包
  start: function () {
    this.timeoutObj = setTimeout(function () {
      if(isConnect) ws.send(checkMsg);
    }, this.timeout);
  },

  // 接收到服务器的信息之后要重置心跳发送的方法
  reset: function () {
    clearTimeout(this.timeoutObj);
    this.start();
  },
}


//关闭连接
let closeWebSocket = () => {
  ws.close();
};


export default {
  createWebSocket: createWebSocket,
  closeWebSocket: closeWebSocket,
  getMsg:getMsg
}