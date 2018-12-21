'use strict';
import { deepClone } from '../utils';

function rewrite() {
    const _model = window.g_app.model;
    const newFn = function(m) {
        return _model(createResetableModel(m))
    };
    if(window.g_app.model !== newFn)window.g_app.model = newFn;
}
function createResetableModel(model) {
    const initialState = deepClone(model.state);
    if(!model.reducers)model.reducers = {};
    model.reducers["$RESET"] = function(){
        return deepClone(initialState)
    };
    return model;
}
rewrite();
/**
 * 延时再赋值两遍，避免异步model没有被重写的问题
 * TODO 看有没有其他更好的办法处理
  */
setTimeout(()=>{
    rewrite();
},0);
setTimeout(()=>{
    rewrite();
},1000);

export default {
}
