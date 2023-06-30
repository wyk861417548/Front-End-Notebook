/**
   * 根据身份证号码获取性别，性别是根据身份证的倒数第二位来判断的，奇数为男，偶数为女
   * @param {*} idCard
   * @returns
  */
 export function getSexFromIdCard(idCard) {
  let sex = "";
  if (parseInt(idCard.slice(-2, -1) % 2) == 1) {
    sex = "male";
  } else {
    sex = "female";
  }
  return sex;
}

/**
 * 根据出生年月日获取年龄
 * @param {*} birthday
 * @returns
 */
export function getAgeFromBirthday(birthday) {
  let birthDate = new Date(birthday)
  let nowDateTime = new Date()
  let age = nowDateTime.getFullYear() - birthDate.getFullYear()
  if (nowDateTime.getMonth() < birthDate.getMonth() ||
    (nowDateTime.getMonth() == birthDate.getMonth() &&
      nowDateTime.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

/**
 * 根据身份证号码获取出生年月日
 * @param {*} idCard
 * @returns
 */
export function getBirthdayFromIdCard (idCard) {
  let birthday = "";
  if (idCard != null && idCard != "") {
    if (idCard.length == 15) {
      birthday = "19" + idCard.substr(6, 6);
    } else if (idCard.length == 18) {
      birthday = idCard.substr(6, 8);
    }
    birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
  }
  return birthday;
}


/**
   * // 获取文件页数 (暂时只支持pdf 正则的问题,如果文件有图片可能导致错误)
   * @param {*} file 
   */
export function getFilePages(file) {
  var reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onloadend = function() {
    return reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
  };
}

 /**
   * @param {*} arr  需要去重的对象
   * @param {*} key  根据对象中的某个值来去重
   * @returns 
   */
export function distinct(arr,key) {
  var obj ={}
  return arr.reduce(function (item,next) {
    obj[next[key]]?"":obj[next[key]]=true&&item.push(next)
    return item;
  },[])
}

/**小数不四舍五入
   * @param {*} num 需要转换金
   * @param {*} type 0：元  1：万元  2:亿元 以此类推
   * @param {*} fixed 保留小数位数
   * @returns 
   */
 export function unitConvert(num,type=1,fixed=2) {
  var dividend = Math.pow(10000,type)
  var curNum = num;
  //转换金额位数
  curNum = curNum / dividend 
  let curNumArr = (curNum+'').split('.');
  return curNumArr[0] +'.'+ (curNumArr[1]*0.01+'').slice(0,fixed);

  // //转换金额位数 四舍五入
  // curNum = curNum / dividend 
  // return curNum.toFixed(fixed);
}

/**
   * 生成随机字母  
   * @param {*} min 只传min 生成min位随机数
   * @param {*} max 传了min和max 生成min~max之间的随机数
   * @returns 
   */
export function randomWord(min, max) {
  var str = "",range = min,
  arr = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f",];
  //随机产生 如果max存在随机产生min到max之间的随机数长度
  if (max) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  
  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

/**
   * 下载图片
   * @param {*} src 图片地址
   * @param {*} name 自定义下载图片名称
   */
export function downLoadImg(src,name){
  var image = new Image();
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

    var a = document.createElement("a"); // 生成一个a元素
    var event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = src;
}

/**
   * 数据脱敏显示
   * str 脱敏字符串
   * start 开始位置留字符数量
   * end 结束位置留字符数量
   * fixflag 脱敏显示字符
   */
export function StringTakeoff(str, start, end, fixflag = '*') {
  const fixStr = []
  const endPoint = str.length - end

  for (let i = 0; i < str.length; i++) {
    if (i < start || (i >= endPoint && str.length > 2)) {
      fixStr.push(str[i])
    } else {
      fixStr.push(fixflag)
    }
  }

  return fixStr.join('')
}

/**
 * 两数相加
 * @param {*} arg1 
 * @param {*} arg2 
 * @returns 
 */
export function add(arg1, arg2) {
  arg1 = arg1.toString(), arg2 = arg2.toString();
  var arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "", d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
  var maxLen = Math.max(d1.length, d2.length);
  var m = Math.pow(10, maxLen);
  var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
  var d = arguments[2];
  return typeof d === "number" ? Number((result).toFixed(d)) : result;
}

/**
 * 两数相乘
 * @param {*} arg1 
 * @param {*} arg2 
 * @returns 
 */
export function mul(arg1,arg2){
  let m = 0,s1=String(arg1),s2=String(arg2);
  m+=s1.split('.')[1]?s1.split('.')[1].length:0;
  m+=s2.split('.')[1]?s2.split('.')[1].length:0;
  return Number(s1.replace('.',''))*Number(s2.replace('.',''))/Math.pow(10,m)
}