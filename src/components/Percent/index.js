'use strict';

export default ({value,defaultValue=0,div=false,unit='%'})=>{
    if(unit===false)unit = '';
    if(!value || isNaN(value))return defaultValue + unit;
    return div?decimal(value).div(100).valueOf() + unit:value + unit;
}
