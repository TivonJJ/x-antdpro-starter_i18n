import React from 'react';
import CountUp from 'react-countup';

export function NumberRollUp({value,startValue=value*0.2,duration=1.5}){
    if(!value) return '-';
    return (<CountUp duration={duration} start={startValue} end={value} separator={','}/>)
}

export function AmountRollUp({value,startValue=value*0.2,duration=1.5}){
    if(!value)return '-';
    return (<CountUp duration={duration} decimals={2} decimal={"."} start={startValue} end={value} separator={","}/>)

}
