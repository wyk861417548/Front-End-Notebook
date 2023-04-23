<template>
  <div></div>
</template>

<script>
export default {
  props:['mid'],
  data () {
    return {
      // webSocket 对象
      ws:null,

      //连接标识 避免重复连接
      isConnect:false,

      // 服务器ws地址
      wsUrl:'ws://192.168.0.246:9111/ws',
      // wsUrl : api.baseUrl.replace("http",'ws') + ''

      //断线重连后，延迟5秒重新创建WebSocket连接  rec用来存储延迟请求的代码
      timer:null,

      //服务器和客户端收到的信息内容如果如下 就识别为心跳信息 不要做业务处理
      checkMsg:'heartbeat',

      //每段时间发送一次心跳包 这里设置为20s
      timeout: 20000,

      //延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）
      timeoutObj: null,
    };
  },

  created(){},


  methods: {

    // 创建连接webScoket
    createWebSocket(){
      try{
        this.ws = new WebSocket(this.wsUrl)

        //初始化webSocket连接
        this.initWebSocket();

      }catch(e){

        //如果无法连接上webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
        this.reConnect();
      }
    },

    // 重新连接
    reConnect(){
      //如果已经连上就不在重连了
      if(this.isConnect) return;

      this.timer && clearTimeout(this.timer);


      this.timer = setTimeout(()=>{
        this.createWebSocket();
      },5000)
    },


    // 初始化webSocket连接

    initWebSocket(){
      //WebSocket连接建立之后会调用onopen方法
      this.ws.onopen = (e)=>{
        console.log("WebSocket连接成功");

        //连接建立后修改标识
        this.isConnect=true;

        console.log("建立连接成功获取的mid",this.mid);
        
        // 告诉服务器身份识别
        this.ws.send(JSON.stringify({"type":"register", "mid":this.mid}));

        //定时发送数据  告诉服务器保持连接
        this.heartCheckStart();
      }

      //当websocket收到服务器发送的信息之后  会调用onmessage方法  getMsg用来封装获取到服务器的消息进行处理，下面会说明
      this.ws.onmessage  = (e)=>{
        this.getMsg(e);
        //获取消息后 重置心跳
        // this.heartCheckReset();
      }

      //当websocket因为异常原因（比如服务器部署、断网等）关闭之后，会调用onerror方法  在onerror中需要调用reConnect方法重连服务器
      this.ws.onerror = (e)=>{
        console.log("websocket连接失败");

        //连接断开后修改标识
        this.isConnect=false;

        //连接错误 需要重连
        this.reConnect();
      }

      //当websocket因为各种原因（正常或者异常）关闭之后，会调用onclose方法
      this.ws.onclose = (e)=>{
        console.log("websocket断开了连接");

        //连接断开后修改标识
        this.isConnect=false;

      }
    },

    //获得消息之后   区别是心跳还是业务信息  如果是业务信息特殊处理
    getMsg(e){
      this.$emit("getMsg",e)
    },



    //一段时间后发送心跳包
    heartCheckStart(){
      this.timeoutObj = setInterval(()=>{
        console.log('发送心跳包',this.isConnect);
        if(this.isConnect) {
          this.ws.send(JSON.stringify({"type":this.checkMsg}))
        };
      }, this.timeout);
    },

     // 接收到服务器的信息之后要重置心跳发送的方法
    heartCheckReset(){
      clearInterval(this.timeoutObj);
      console.log("清除上一个发送心跳包的定时器");
      this.heartCheckStart();
    },

    // 清除心跳
    heartCheckClear(){
      console.log("清除心跳");
      clearInterval(this.timeoutObj);
    },


    //关闭连接
    closeWebSocket(){
      this.heartCheckClear();
      this.ws.close();
    }


  }
}
</script>
<style lang='less' scoped>

</style>