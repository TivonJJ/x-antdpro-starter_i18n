'use strict';
import React from 'react';
import numeral from 'numeral';

export default ({className,style,value = 0,children,format='0,0.00',isCent})=>{
    let amount = '';
    if((isNaN(value) || null==value || ''===value) && children){
        amount = children;
    }else {
        if(isCent)value = value/100;
        amount = numeral(value).format(format);
    }
    return amount
}
