#### location

##### 1.命令 
```
1. start nginx // 启动ng服务器
2. nginx -s reload // 服务杀死后进行重启（每次修改配置需执行此操作）
3. nginx -s stop // 关闭nginx
4. nginx -t  //查看配置是否成功（一连串英文字符中出现successful）
5. tasklist /fi "imagename eq nginx.exe"  可以看到还没有被关闭的进程（pid）
6. taskkill -t -f /pid pid  通过pid来关闭还存在的服务
```

- nginx 配置示例 https://blog.csdn.net/qq_43382635/article/details/128085834

##### 1 接口代理 https://www.jianshu.com/p/fdf1331b1c5e
```
root与alias主要区别在于nginx如何解释location后面的uri，这会使两者分别以不同的方式将请求映射到服务器文件上。
root的处理结果是：root路径＋location路径
alias的处理结果是：使用alias路径替换location路径
alias是一个目录别名的定义，root则是最上层目录的定义。
还有一个重要的区别是alias后面必须要用“/”结束，否则会找不到文件的。。。而root则可有可无~~

root

location / {
  root  F:/project/myself/test/;
  location = /index {
    rewrite ^.*$ /index.html last;
  }
}

location /api {
  proxy_pass https://xxx.xxx/;
  # proxy_http_version 1.1;
  # proxy_redirect default;
  # #proxy_set_header Host $host;
  # proxy_set_header Connection "";
  # proxy_set_header X-Real-IP $remote_addr;
  # proxy_set_header REMOTE-HOST $remote_addr;
  # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  # proxy_connect_timeout 60;
  # proxy_send_timeout 60;
  # proxy_read_timeout 60;
  # proxy_buffer_size 64k;
  # proxy_buffers 16 16k;
  # proxy_busy_buffers_size 128k;
  # proxy_temp_file_write_size 128k;
  # proxy_next_upstream error timeout invalid_header http_500 http_503 http_404;
  # proxy_max_temp_file_size 128m;
}

alias

location /abc{
  alias  F:/project/myself/test/;
  index /index2.html;
}
```