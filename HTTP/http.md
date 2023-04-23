1.下次 请求不缓存 强制刷新
```
- GET请求能缓存，POST不能
- 后端在header头中配置
- cache-control: no-cache, no-store, max-age=0, must-revalidate
- 在ios中跳h5公众号h5页面，回来还是会缓存，请求上设置随机值 timestamp:new Date().getTime(),
```