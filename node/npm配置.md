#### npm 配置（yarn设置镜像一样）
要设置`node-sass`的镜像，并且检查是否设置成功，可以按照以下步骤进行操作：

1.设置`node-sass`镜像：

```bash
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass
```

2.设置`npm`淘宝镜像：

```bash
npm config set registry https://registry.npm.taobao.org
```

3.检查`node-sass`镜像设置是否成功：

```bash
npm config get sass_binary_site
```

这将显示当前的`node-sass`镜像配置。如果返回的值是`https://npm.taobao.org/mirrors/node-sass`，则说明设置成功。

4.检查`npm`镜像设置是否成功：

```bash
npm config get registry
```

这将显示当前的`npm`镜像配置。如果返回的值是`https://registry.npm.taobao.org`，则说明设置成功。

你可以按照以上步骤进行设置和验证，确保镜像设置成功。