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
  ###### 1.查看远程和本地所有分支
    git branch -a
  ###### 2. 使用如下git命令查看所有远程分支
    git branch -r
  ###### 3.拉取远程分支创建本地分支
    git checkout -b 本地分支名 origin/远程分支名
  ###### 4.切换到dev的分支
    git checkout dev
  ###### 5.删除远程分支
    git push origin --delete xxx
  ###### 6.删除本地分支dev
    git branch --delete xxx