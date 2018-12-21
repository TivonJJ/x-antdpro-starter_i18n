---
title:
  en-US: BasicDataSelect
  zh-CN: BasicDataSelect
subtitle: 基础数据选择框
---
 基础数据选择框，基于AssociativeSearch实现
 index.js中已经内置了所有需要的基础数据下拉框
### 参数说明

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| labelKey | 每一项label对应的key |  String,Function(): any | - |
| valueKey | 每一项value对应的key | String,Function(): any | - |
| action | 数据请求调用 | Function():Promise | - |
| params | 请求携带的参数,当发生变化后会reload数据 | object | any |
| ... | 同AssociativeSearch | ... | - |
