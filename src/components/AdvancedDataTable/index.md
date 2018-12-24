---
title:
---

高级Table数据类表组件，自动加载和分页。

## API

### AdvancedDataTable

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| uri | 源数据,URL地址或回调函数，回调函数需要返回promise | String|Function | - |
| params | 接口携带参数(发生变化后会自动刷新) | Object | - |
| title    | 左上角标题        | boolean/ReactNode/function(page){}  | true |
| extra       | 右上角显示内容          | ReactNode  | null |
| onError     | 接口返回错误后回调  | function(error)  | - |
| onDataLoaded     | 获取到数据的回调  | function(page)  | - |
| ... | 其他参数和ant的API一致，(dataSource会被忽略)| ... | - |

| 方法   | 说明
|----------|------------------------------------------|
| refresh | 刷新当前页数据 |
| reload | 恢复到初始分页状态刷新数据 |
