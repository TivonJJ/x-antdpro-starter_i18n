'use strict';

export default class ConstantCodesMap{
    __code_map__={};
    constructor(obj){
        Object.keys(obj).map(key=>{
            const data = obj[key];
            this[key] = data;
            this.__code_map__[data.code] = data;
        })
    }
    get codesMap(){
        return this.__code_map__;
    }
    get codesList(){
        return Object.keys(this.__code_map__);
    }
    getByCode(code){
        return this.__code_map__[code];
    }
    getNameByCode(code){
        const current = this.getByCode(code);
        return current?current.name:null;
    }
}
