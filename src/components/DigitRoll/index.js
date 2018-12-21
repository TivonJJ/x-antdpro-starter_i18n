import React from 'react';
import CountUp from 'react-countup';

export class NumberRollUp extends React.Component {
    render() {
        let {value}=this.props;
        if(!value) return '-';
        const {startValue=value*0.2,duration=1.5} = this.props;
        return (<CountUp duration={duration} start={startValue} end={value} separator={','}/>)
    }
}
export class AmountRollUp extends React.Component{
    render() {
        let {value}=this.props;
        if(!value)return '-';
        const {startValue=value*0.2,duration=1.5} = this.props;
        return (<CountUp duration={duration} decimals={2}  decimal="." start={startValue} end={value} separator=","/>)
    }
}
