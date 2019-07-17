import React from 'react';
import { Input, Modal } from 'antd';
import config from 'config';

window.appMeta = APP_METADATA;

// 初始化百度地图的配置
const BmapConfig = config.baiduMap;
Map.defaultProps = Object.assign({
    ak:BmapConfig.key,
    version: Number(BmapConfig.version)
},Map.defaultProps);

// 模态窗上扩展prompt 弹出输入组件
Modal.prompt = function prompt(opts) {
    const {inputProps,onOk,content,...restProps} = opts;
    const ref = React.createRef();
    return Modal.confirm({
        ...restProps,
        content: (
            <div className={"gutter-v_lg"} ref={ref}>
                {content}
                <Input.TextArea {...inputProps} />
            </div>
        ),
        onOk:()=>{
            const {value} = ref.current.querySelector('.ant-input');
            return onOk(value);
        }
    })
};
