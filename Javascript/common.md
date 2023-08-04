#### 1.复制（js控制的禁用不能解除）
```
var style=document.createElement("style"); style.innerHTML='*{user-select: auto!important;}'; document.head.appendChild(style)
```
#### 2.excel随机数
```
=ROUND(RAND()*(99.99-98)+98,2)
```

#### 3.echart地图修改文字显示位置
```
在区域json文件下的properties属性下添加"cp":[119.772,30.6962], 修改地区名称显示位置
```

#### 4.手机console调试工具
```
<script src="https://cdn.bootcss.com/vConsole/3.3.0/vconsole.min.js"></script>
<script>
  var vConsole = new VConsole();
</script>
```

#### 5.计算距离( lat,lng（自己的位置坐标）,aimLat,amiLng（目标位置的坐标）)
```
export function getDistance(lat,lng,aimLat,amiLng){
  var radLat1 = this.getRad(lat);
  var radLat2 = this.getRad(aimLat)
  var a = radLat1 - radLat2;
  var b = this.getRad(lng) - this.getRad(amiLng);

  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  console.log(s);
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  s = s.toFixed(1); 
  return s;
}
```