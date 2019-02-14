---
title:
  en-US: Authorized
  zh-CN: Authorized
subtitle: 权限控制组件
---

# 权限控制组件


## index.js    
 
### 参数说明

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| onlyCheckSign | 是否只检查登录状态 |  Boolean | false |
| route | 权限资源路径 | String | - |
| noMatch | 无权限的时候渲染内容 | Any | - |


## CheckPermissions.js

函数返回是否具有对应的权限
   
#### 参数说明

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| route | 资源地址 |  String | - |
| onlyCheckSign | 是否只检查登录状态，如果为true只会检测当前用户是否登录，不会检查权限资源 | Boolean | false |

## AuthMap.js
    
权限资源统一配置的位置
    
