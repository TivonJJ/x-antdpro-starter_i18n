---
title:
---

快速易用的Table数据类表组件，自动加载和分页。
基于 redux 存储实现

## API

### EasyTable 组件属性

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| source | 源数据,URL地址或回调函数，回调函数需要返回promise | String/Function | - |
| name | table名，必须参数，每个Table保证唯一，这个name是store数据的key | String | - |
| title    | 左上角标题        | boolean/ReactNode/function(page){}  | true |
| extra       | 右上角显示内容          | ReactNode  | null |
| renderHeader | 自定义Table顶部渲染,使用这个后title和extra将无效 | function(title,extra,page) | - |
| autoFetch | 是否在组件初始化后自动加载数据 | Boolean | false |
| keepData | 保存数据，false的时候在table组件销毁时会清空store | Boolean | false |
| onError     | 接口返回错误后回调  | function(error)  | - |
| onDataLoaded | 获取到数据的回调  | function(page,action,params)  | - |
| wrappedComponentRef | 获取table真实的Ref | function(ref) | - |
| before | 表格前面的内容 | any | - |
| after | 表格后面的内容 | any | - |
| ... | 其他参数和ant的API一致，(dataSource会被忽略)| ... | - |

### 方法 这些方法在Component和Provider中都提供，建议使用Provider,使用connect注入Provider后 component的props将自动扩展这些方法

| 方法   | 参数 | 类型 | 说明
|----------|--------------|-------------|---------------|
| fetch | params,pagination | Object | 恢复到初始分页状态刷新数据 |
| refresh | pagination | Object | 刷新当前页数据 |
| paging | *pagination | Object | 切换分页(params,参数会保持) |
| clean | name | String | 清空数据,name是table名称，不填则清空所有 |
| update | data<Array> => data<Array> | Array | 会传入当前页的list数据，return一个新的list |

### 属性 使用connect注入Provider后 component的props将自动扩展这些属性，请不要直接修改这些属性！

|   属性 | 类型 | 说明
|----------|--------------|----------------------------|
| page | Object | 分页数据信息 |
| loading | Boolean | 加载状态 |
| params | Object | 筛选参数 |


### Provider连接
> 所有数据都保存在store中，可以使用 'easyTableProvider' 的默认命名空间访问Provider提供的数据驱动服务，但是这个服务是
全局的数据，需要对应的table 的 name来取值，EasyTable提供一个快速连接工具，直接通过name注入到props中。
Provider提供的方法和上面的方法一样，当然也可以直接获取对应的数据源，分别有 params,page,loading (!禁止直接修改数据源!)

##### 示列

``` javascript
 import React, { Component } from 'react';
 import EasyTable from '@/components/EasyTable';
 import Amount from '@/components/Amount';
 import { getList } from '@/services/demo';
 import Link from 'umi/link';
 import { Badge, Button } from 'antd';
 
 @EasyTable.connect(({demoList})=>({
     demoList
 }))
 class Table extends Component {
     columns=[
         {
             title:'编号',
             dataIndex:'no',
         },
         {
             title:'名称',
             dataIndex:"name"
         },
         {
             title:'金额',
             dataIndex: 'amount',
         }
     ];
     reload=()=>{
         // this.dataTable.refresh(); Ref调用
         this.props.demoList.refresh();
     };
     goPage=(num)=>{
         this.props.demoList.paging({current:num});
     };
     render() {
         return (
             <EasyTable
                 // wrappedComponentRef={ref=>this.dataTable=ref}
                 name={'demoList'}
                 autoFetch
                 extra={<div>
                     <Button onClick={this.reload} className={'gutter-right'}>刷新</Button>
                     <Button onClick={()=>this.goPage(3)} className={'gutter-right'}>到第三页</Button>
                     <Link to={'/demo/list/new'}><Button type={'primary'}>添加</Button></Link>
                 </div>}
                 source={getList}
                 rowKey={'no'}
                 columns={this.columns}/>
         );
     }
 }
 ``` 
