import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

export default class extends React.Component{
    static propTypes={
        date:PropTypes.any,
        utcOffset:PropTypes.oneOfType([PropTypes.number,PropTypes.bool]),
        format:PropTypes.string
    };

    static defaultProps={
        date:null,
        utcOffset:false,
        format:'lll'
    };

    render(){
        const {date,format,utcOffset,emptyContent='-',tz='locale'} = this.props;
        if(!date)return emptyContent;
        if(utcOffset===false)return moment(date).format(format);
        let m = moment.utc(date).utcOffset(utcOffset);
        if(tz){
            if(tz==='locale'){
                m = m.local();
            }else{
                m = m.tz(tz);
            }
        }
        return m.format(format);
    }
}
