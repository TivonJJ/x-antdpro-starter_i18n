import React, {Component} from 'react';
import {BMapUtil, Map, Marker, Base} from "rc-bmap";
import PropTypes from 'prop-types';
import {message} from "antd";

const {Point} = Base;

export default class AddressPreview extends Component {

    static propTypes = {
        address: PropTypes.oneOfType([PropTypes.string,PropTypes.object])
    };

    static defaultProps = {
        address: null
    };

    state={
        point:{lng: 116.402544, lat: 39.928216}
    };

    componentDidMount() {
        this.center2Point(this.props.address);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.address !== nextProps.address){
            this.center2Point(nextProps.address)
        }
    }

    center2Point(address){
        if(typeof address === 'string'){
            BMapUtil.getPoint(address).then(point=>{
                this.setState({
                    point
                });
            },e=>{
                message.error(e?e.message:'地址无法解析，请尽量输入详细地址');
            })
        }else {
            this.setState({point:address})
        }
    }

    render() {
        const {zoom=12,...mapProps} = this.props;
        const {point} = this.state;
        return (
            <Map
                zoom={zoom}
                scrollWheelZoom
                {...mapProps}
                center={point}
            >
                {point &&
                <Marker position={point}>
                    <Point lng={point.lng} lat={point.lat}/>
                </Marker>
                }
            </Map>
        );
    }
}
