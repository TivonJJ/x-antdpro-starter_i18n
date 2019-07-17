import numeral from 'numeral';

export default ({value = 0,children,format='0,0.00',isCent})=>{
    let amount = '';
    if((isNaN(value) || value==null || value==='') && children){
        amount = children;
    }else {
        if(isCent)value /=100;
        amount = numeral(value).format(format);
    }
    return amount
}
