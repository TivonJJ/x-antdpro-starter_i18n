---
title:
  en-US: AssociativeSearch
  zh-CN: AssociativeSearch
subtitle: 异步数据Select组件
---
 Select下拉框，异步获取数据，支持异步检索，滑动加载
 
### 参数说明

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| onFetch | 加载函数，必须返回一个Promise |  function(): Promise | - |
| trim | 输入框内搜索关键字是否trim | Boolean | true |
| autoSelectFirst | 是否在加载完成后自动选中第一条 | Boolean | false |
| onReady | 首次数据加载完成后回调 | function(data) | - |
| onData | 每次数据加载后都会回调，如搜索，触底加载等 | function(data) | - |
| onScrollBottom | 滚动到底部回调 | function() | - |
| optionProps | 每个Option元素的props属性 | function()、object | - |
| ... | 其他属性和Ant的Select组件一样 | ... | - |
