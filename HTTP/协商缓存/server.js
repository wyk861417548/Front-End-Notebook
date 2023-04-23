const http = require('http');
const fs = require('fs');
const path = require('path');
const md5 = require('js-md5');

http.createServer(function(req,res){
  console.log('req come',req.url);
  if(req.url === '/'){
    const html = fs.readFileSync('test.html','utf8');

    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(html);
  }

  // 模拟Last-Modified If-Modified-Since
  if(req.url === '/modified.js'){
    
    const filePath = path.join(__dirname,req.url);// 拼接当前脚本文件地址
    const stat = fs.statSync(filePath);// 获取当前脚本状态
    const mtime = stat.mtime.toGMTString();// 文件的最后修改时间
    const reqMtime = req.headers['if-modified-since']; // 来自游览器传值

    console.log('stat',stat);
    console.log('mtime',mtime, reqMtime)

    // 走协商缓存
    if(mtime == reqMtime){
      console.log('Last-Modified 缓存成功');
      res.statusCode = 304;
      res.end();
      return;
    }

   
    console.log('协商缓存 Last-Modified 失效');
     // 协商缓存失效，重新读取数据设置 Last-Modified 响应头
    res.writeHead(200,{
      'Content-type':'text/javascript',
      'Last-Modified':mtime
    })

    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)
  }

  // 模拟ETag
  if(req.url === '/etag.js'){
    const filePath = path.join(__dirname,req.url);// 拼接当前脚本文件地址
    const buffer = fs.readFileSync(filePath);//获取当前脚本状态
    const fileMd5 = md5(buffer);// 文件的 md5 值
    const noneMatch = req.headers['if-none-match']// 来自浏览器端传递的值
    console.log('noneMatch',noneMatch);
    if(noneMatch === fileMd5){
      console.log('Etag 缓存成功');
      res.statusCode = 304;
      res.end();
      return;
    }

    console.log('Etag 缓存失效');
    res.writeHead(200,{
      'Content-Type':'text/html',
      'Cache-Control':'max-age=0',
      'ETag':fileMd5
    })
    
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  }


}).listen(8888);

console.log('server listening on 8888');
