// 内网穿透地址  前端页面地址
const URL = (function(){
  if (process.env.VUE_APP_MODE == 'dev') {
    return '';
  }
  return process.env.VUE_APP_URL;
})(); 

// 配置
const CONFIGURE = {
  zfb:{
    app_id:'', //开发者应用的 APPID
    redirect_uri:URL+'alipay/callback' //开发者需要先到开发者中心对应应用内，配置授权回调地址。
  }
}

export default {
  //拉起支付宝授权页面
  loginZFB(){
    let lastUrl = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?" +"app_id=" + CONFIGURE.zfb.app_id +"&scope=auth_user"+"&redirect_uri=" + encodeURIComponent(CONFIGURE.zfb.redirect_uri);
    location.href = lastUrl;
  },

 //拉起浙里办授权页面
  loginZLB(){
    // location.href = process.env.VUE_APP_URL + 'zlb/jumpZlbUrl'
    ZWJSBridge.openLink({url:process.env.VUE_APP_URL + 'zlb/jumpZlbUrl'})
  },

  //拉起微信授权 
  loginWx(){
    location.href = process.env.VUE_APP_URL + 'wechat/getCode';
  },

  // 微信支付
  payWX(obj){
    console.log('obj',obj);
    return new Promise((resolve) => {
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
        "appId": obj.appId,     //公众号ID，由商户传入     
        "timeStamp": obj.timeStamp,     //时间戳，自1970年以来的秒数     
        "nonceStr": obj.nonceStr,      //随机串     
        "package": obj.packageValue,
        "signType": obj.signType,     //微信签名方式：     
        "paySign": obj.paySign //微信签名 
      },
      function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          resolve()
        }
      });
    })
  },

  // 支付宝小程序支付支付
  payZFB(orderStr){
    return new Promise((resolve) => {
      AlipayJSBridge.call("tradePay", {
        orderStr: orderStr        
      }, (result)=> {
        if (result.resultCode == '6001') {
          return false;
        }
        resolve();
      });
    })
    
  },


  // 浙里办支付 1:支付宝  2：微信
  zlbPay(credential,platform='1'){
    return new Promise((resolve) => {
      ZWJSBridge.pay({
        platform:platform ,
        arg:{
          "credential":credential,
          "inSandBox": false
        }
      }).then(() => {
        resolve()
      }).catch((error) => {
        console.log('error',error);
      });
    })
  },
  

  // 浙里办支付 1:支付宝  2：微信
  zlbPaywx(credential,platform='1'){
    return new Promise((resolve) => {
      ZWJSBridge.pay({
        platform:platform ,
        arg:{
          timeStamp: new Date().getTime(), 
          nonceStr: '', 
          package: '', 
          signType: '', 
          paySign: '', 
        }
      }).then(() => {
        resolve()
      }).catch((error) => {
        console.log('error',error);
      });
    })
  }
}