### 版本管理 fnm 
##### !!!注意：把全局的`node`删除
##### !!!注意：fnm（Fast Node Manager）目前不支持在 Windows 的命令提示符（cmd）中使用，只能使用`PowerShell`
- 打开PowerShell快捷方式  `Shift + 右键`
- `fnm use xxx` 切换node版本不支持，以及安装的node在 `cmd` 中运行也是 不是内部命令提示
- so 使用`PowerShell`吧， vscode终端是`PowerShell`

#### 安装 方法一（推荐）
前方 https://github.com/Schniz/fnm/releases 下载对应的包

放入 D 盘 `D:\fnm`（自定义），将其目录加入环境变量 path 中 ` D:\fnm`

#### 配置PowerShell配置文件
- 1.打开 PowerShell 输入 `notepad $PROFILE` 打开配置文件， 如果没有创建过配置文件会让你创建一个

- 1.1 如果`notepad $PROFILE`输入后， 系统提示 `找不到指定路径` ,使用 `if (!(Test-Path $PROFILE)) { New-Item -Type File -Path $PROFILE -Force }`创建，然后步骤一操作。

- 2.将内容添加到您的配置文件的末尾：`fnm env --use-on-cd | Out-String | Invoke-Expression` 然后保存关闭

- 3.运行 `. $PROFILE` 重新运行配置文件

#### fnm 命令
###### 常用命令
```
# 命令帮助
fnm --help

# node 已安装列表
fnm list

# node 安装
fnm install 版本号(支持模糊/lts)

# node 卸载
fnm uninstall 版本号

# node 切换
fnm use 版本号

# node 设置默认
fnm default 版本号
```

###### 安装
```
# 安装 LTS 版本
$ fnm install --lts

# 安装指定大版本的最新版本
$ fnm install 18

# 安装指定版本
$ fnm install 18.16.1

```

###### 别名
```
# 形式如：fnm alias <指定版本号> <别名>
$ fnm alias 18.21.1 v18

# 设置别名后，可以简化指令为：
$ fnm use v18
```

##### 问题：
vue create 创建项目报错 `ERROR  ~/.vuerc may be outdated. Please delete it and re-run vue-cli in manual mode.`
```
  将~/.vuerc文件删除（路径：C:\Users\Administrator）
```

#### fnm 为对应的node版本 安装 其他包管理
选择 node 版本 `fnm use xxx` 输入以下命令
```
# 安装yarn（1.22.19）
npm install -g yarn@<version>

# 安装pnpm（8.6.5）
npm install -g pnpm@<version>

# 安装vue（4.5.11）
npm install -g @vue/cli@<version>
```

#### 安装 方法二
###### 使用Chocolatey安装fnm
若要在Windows上安装`Chocolatey`，请按照以下步骤进行操作：

1. 以管理员身份运行 PowerShell：
  - 按下Win + X，然后选择"Windows PowerShell（管理员）"，以打开以管理员身份运行的PowerShell。

2. 确保执行策略是允许脚本运行：
  - 在管理员PowerShell中，运行以下命令：
  
    ```
    Set-ExecutionPolicy Bypass -Scope Process -Force
    ```

3. 安装`Chocolatey`：
  - 在管理员PowerShell中，运行以下命令以安装`Chocolatey`：
    ```
    iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    ```
4. 验证安装：
  - 在管理员PowerShell中，运行以下命令以验证`Chocolatey`是否正确安装：
    ```
    choco
    ```

现在，你已成功安装了`Chocolatey`。你可以使用`Chocolatey`来安装各种软件包和工具。记住，每次打开新的PowerShell窗口时，都需要进行步骤 1 和步骤 2 以使`Chocolatey`生效。

###### 安装fnm
```
choco install -y fnm
```

打开 `cmd` 验证是否安装完成
```
fnm -V

```