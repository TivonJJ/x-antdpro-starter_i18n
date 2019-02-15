---
title:
  en-US: DrawerConfirm 
  zh-CN: DrawerConfirm
subtitle: 带确认按钮的抽屉
cols: 1
order: 10
---

基于Drawer抽屉组件增加了底部的取消确定按钮。

## API

参数 | 说明 | 类型 | 默认值
----|------|-----|------
cancelText | 取消按钮文字 | string,ReactNode | 取消
confirmLoading | 确定按钮 loading | boolean | false
okText | 确认按钮文字 | string,ReactNode | 确定
okType | 确认按钮类型 | string | primary
okButtonProps | ok 按钮 props | object | -
cancelButtonProps | cancel 按钮 props | object | -
onCancel | 点击遮罩层或右上角叉或取消按钮的回调 | function | -
onOk | 点击确定回调 | function | -
