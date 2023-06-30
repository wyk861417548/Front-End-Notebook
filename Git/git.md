#### 1.查看git账户

```
git config user.name
```

#### 2.查看git邮箱

```
git config user.email
```

#### 3.设置全局账户名和邮箱

```
git config --global user.name “账户名”
git config --global user.email “邮箱”
```

#### 4.生成公钥

```
ssh-keygen -t rsa -C "XXX XX @qq.com"
```


#### github 443问题
```
git config --global https.proxy "127.0.0.1:xxxx"
-- 其中xxxx为科学上网梯子的端口号，如我的端口号是7890

```

#### git push时报错：fatal: unable to access OpenSSL SSL_read: Connection was reset, errno 10054
```
git config --global http.sslVerify "false"
```

#### 分支管理
```
  分支删除
    -删除本地 git branch --delete xxx
    -删除远程分支 git push origin --delete xxx

```