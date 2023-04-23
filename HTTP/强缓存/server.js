const http = require('http');
const fs = require('fs');

http.createServer(function(req,res){
  console.log('req come',req.url);
  if(req.url === '/'){
    const html = fs.readFileSync('test.html','utf8');

    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(html);
  }
  if(req.url === '/script.js'){
    res.writeHead(200,{
      'Content-Type': 'text/javascript',
      // 缓存20s 多个值用逗号隔开
      'Cache-Control':'max-age=20,public'
      // 'Expires':new Date(Date.now() + 20)
    })
    
    res.end('console.log("script loaded")')
  }
}).listen(8888);

console.log('server listening on 8888');
