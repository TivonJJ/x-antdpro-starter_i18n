# 日期格式化

> 由于传输中统一使用的UTC0时间，所以所有时间默认都会被当做UTC-0来转换

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| format | 时间格式化规则，参考moment.format |String | lll |
| date | 时间 | string,number,date,moment| - |
| utcOffset  | UTC 时间偏移,如果为false则不会做UTC转换，故tz参数也会被忽略 | number | 0 |
| tz | 时间转换的目标时区(如果为locale将使用系统时区) | String | locale |
| emptyContent | 时间参数为空时显示的内容 | ReactNode| '-' |
