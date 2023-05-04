// 定位自己的位置
export function getLocationGD(){
  return new Promise((resolve,reject) => {
    const AMap = window.AMap

    // 检查浏览器环境是否为 https 不是则无法使用精准定位
    const geolocation = new AMap.Geolocation({
      //是否使用高精度定位，默认:true
      enableHighAccuracy: true,
      //超过10秒后停止定位，默认：无穷大
      timeout: 10000,  
      //定位结果缓存0毫秒，默认：0        
      maximumAge: 0,
      //自动偏移坐标，偏移后的坐标为高德坐标，默认：true        
      convert: true,
      //显示定位按钮，默认：true         
      showButton: true,
      //定位按钮停靠位置，默认：'LB'，左下角       
      buttonPosition: 'LB',  
      //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)  
      buttonOffset: new AMap.Pixel(10, 20),
      //定位成功后在定位到的位置显示点标记，默认：true
      showMarker: true, 
      //定位成功后用圆圈表示定位精度范围，默认：true       
      showCircle: true,
      //定位成功后将定位到的位置作为地图中心点，默认：true    
      panToLocation: true,
      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false     
      zoomToAccuracy:true      
    })
    
    geolocation.getCurrentPosition(function(status,result){
      status == 'complete'?resolve(result):reject();
    })
    
    // 成功后加载其他点数据
    // let onComplete = ({position})=>{
    //   console.log('complete',position);
    // }

    // let onError = ()=> {
    //   console.log('error');
    // }
    // AMap.event.addListener(geolocation, 'complete', onComplete)
    // AMap.event.addListener(geolocation, 'error', onError)
  })
  
}

/**
 * 跳转高德地图
 * @param {*} info 
 * lng:经度
 * lat:纬度
 * name:地址名称
 */

 export function jumpGdMap(info = {}){
  location.href = `https://uri.amap.com/marker?markers=${info.lng},${info.lat},${info.name}&src=mypage&callnative=0`
}