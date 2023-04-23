const Config = {
  getParams(search) {
    var r = {}
    if (search == undefined) {
      search = window.location.href.split('?')[1];
    } else {
      search = search.split('?')[1];
    }
    if (!search) return;
  
    // 解决参数拼在hash前面问题
    if(search && search.indexOf("#") != '-1'){
      search = search.slice(0,search.indexOf("#"));
    }
  
    var arr = search.split('&');
    if (!arr.length) return;
  
    for (var i = 0; i < arr.length; i++) {
      var s = arr[i].split('=');
      r[s[0]] = decodeURI(s[1]);
    }
    return r;
  }
}