# 更新记录 #

### 3.1.2
    修复EasyTable的筛选条件未清除的BUG
    EasyTable新增fixedParams参数

### 3.1.1
    EasyTable增加options配置

### 3.1.0
    增加IconFont组件
    集成PWA功能
    升级一些依赖组件版本

---

### 3.0.4
    更新EasyTable，修复一些已知BUG

---

### 3.0.3
    移除PageHeaderLayout，请直接使用components里面的PageHeaderWrapper

---

### 3.0.2
    更新EasyTable,新增 after和before属性，优化header渲染

---

### 3.0.1
    调整用户权限相关功能到一个目录下
    调整权限角色相关的命名
    使用EsayTable重新实现用户管理界面
    更新FileUploader组件
    
---

### v3.0

- 移除Model自动扩展$RESET方法，为了性能和可靠性及代码易读性，重置功能自行在Model内的reducer实现
- SeesawRoute改名为SeesawView，属性传递发生变化 （具体见文档）
- 移除component内的_utils工具，统一使用utils下面的工具方法
- AdvancedDataTable移除，新增EasyTable组件，增加easyTableProvider的redux store存储,并提供注解连接，数据分离到store内
- 增加两个列表和详情DEMO数据
- utils内 createNormalPagination 改为 createPagination
