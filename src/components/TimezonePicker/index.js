import React from 'react';
import PropTypes from 'prop-types';
import timezones from './timezones';
import {Select} from "antd";
import classnames from 'classnames';
import controllable from '@/components/react-controllables';

@controllable(['value'])
class TimezonePicker extends React.Component {
    static propTypes = {
        value: PropTypes.string,
        offset: PropTypes.oneOf(['GMT', 'UTC']),
        onChange: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.shape({}),
    };
    static defaultProps = {
        offset: 'UTC',
        value: undefined
    };
    state={
        timezones,
    };

    static stringifyZone(zone, offset) {
        return zone.name;
        // const ensure2Digits = num => (num > 9 ? `${num}` : `0${num}`);
        // return `(${offset}${zone.offset < 0 ? '-' : '+'}${ensure2Digits(Math.floor(Math.abs(zone.offset)))}:${ensure2Digits(Math.abs((zone.offset % 1) * 60))}) ${zone.label}`;
    }

    handleZoneChange = (zone) => {
        if(this.props.onChange)this.props.onChange(zone);
    };

    handleSearch=(keywords)=>{
        const search = ()=>{
            if (!keywords.trim()) return timezones;
            return timezones.filter(zone =>
                zone.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(keywords.toLowerCase().replace(/\s+/g, '')));
        };
        this.setState({timezones:search()})
    };

    render() {
        const {timezones,} = this.state;
        const { offset,className,style,allowClear,showSearch=true,value } = this.props;
        return <Select onChange={this.handleZoneChange} className={classnames('comp-timezone_picker',className)}
                       style={style} allowClear={allowClear} showSearch={showSearch}
                       value={value}
                       onSearch={this.handleSearch}>
            {timezones.map((zone) => (
                <Select.Option key={zone.name}>
                    {TimezonePicker.stringifyZone(zone, offset)}
                </Select.Option>
            ))}
        </Select>
    }
}

export { TimezonePicker as default, timezones };
