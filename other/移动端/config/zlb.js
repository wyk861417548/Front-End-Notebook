

/**
 * 支付宝或者浙里办扫一扫 	
 * @param {*} type 不传默认扫描二维码 传值为真 扫描条形码
 * @returns 
 */
export function scan(type){
  // 0:普通 1:微信 2:支付宝 3:浙里办 4：微信端浙里办  5:支付宝浙里办
  const brower = checkBrowser();

  if([3,4].includes(brower)){
    return scanZLB(type);
  }else if([2,5].includes(brower)){
    return scanZFB(type);
  }else if(brower == 1){
    return scanWX();
  }
}

/**
 * @param {*} boolean 当微信令牌失效  再次获取令牌并且调用
 * @returns 
 */
export function scanWX(){
  return new Promise(resolve=>{
    // 签名成功
    wx.ready(function () {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          resolve(res.resultStr)
        },
        error: function (err) {
          console.log('err',err);
        }
      });
    })

    // 签名失败或者失效
    wx.error(function(err){
      console.log('wx.err',err);
      // config信息验证失败会执行 error 函数，如签名过期导致验证失败，具体错误信息可以打开 config 的debug模式查看，也可以在返回的 res 参数中查看，对于 SPA 可以在这里更新签名。
      wx_jsapi();
    });
  })
}

/**
 * 扫码支付宝 
 * @param {*} type 不传默认扫描二维码,传值为真 扫描条形码
 * @returns 
 */
export function scanZFB(type){
  return new Promise(resolve=>{
    window.ap.scan({
      type: type?'qr':'bar'
    },(res)=>{
      res.code && resolve(res.code)
    });
  })
}

/**
 * 扫码浙里办
 * @param {*} type 不传默认扫描二维码 ,传值为真 扫描条形码
 * @returns 
 */
export function scanZLB(type){
  return new Promise(resolve=>{
    ZWJSBridge.scan({
      type: type?'qrCode':'barCode',
    }).then((data) => {
      resolve(data.text)
    });
  })
}

// 浙里办拨打电话
export function call(phone){
  if(window.ZWJSBridge){
    ZWJSBridge.phoneCall({
      corpId:phone
    });
  }else{
    window.location.href = `tel:${phone}`
  }
  
}

// 0:普通 1:微信 2:支付宝 3:浙里办 4：微信端浙里办  5:支付宝浙里办
export function checkBrowser() {
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  if(userAgent.indexOf('miniprogram') > -1 && userAgent.indexOf('alipay') > -1){
    return 5
  }if(userAgent.includes('miniprogram/wx') || window.__wxjs_environment === 'miniprogram'){
    return 4
  } else if (/alipay/.test(userAgent)) {
    return 2;
  } else if (/dtdreamweb/.test(userAgent)) {
    return 3;
  }else if (/micromessenger/.test(userAgent)) {
    return 1;
  } else {
    return 0;
  }
}