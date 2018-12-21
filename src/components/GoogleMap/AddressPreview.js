'use strict';
import React from 'react';
import GoogleMap from './index';
import Marker from 'react-google-maps/lib/components/Marker';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

@GoogleMap.create({
    height:window.innerHeight/2
})
export default class extends React.Component{
    static propTypes={
        address: PropTypes.oneOfType([PropTypes.string,PropTypes.object]).isRequired,
    };
    state={
        marker:null,
        loading:false,
        error:null
    };
    componentDidMount(){
        this.positionAddress(this.props);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.address !== nextProps.address)this.positionAddress(nextProps);
    }
    positionAddress({address}){
        if(typeof address === 'object'){
            this.setState({marker:address})
        }else {
            this.setState({error:null,loading:true});
            GoogleMap.geocodeAddress(address).then(({geometry})=>{
                this.setState({marker:geometry.location})
            },err=>{
                this.setState({error:err.message});
            }).finally(()=>{
                this.setState({loading:false})
            });
        }
    }
    render(){
        const {onMapMounted,...restProps} = this.props;
        const {marker,loading} = this.state;
        console.log(marker)
        if(loading)return <Spin/>;
        return <GoogleMap {...restProps} center={marker} ref={onMapMounted}
                          onRightClick={this.onRightClick}
                          onDragStart={this.hideContextMenu}>
            {marker&&<div>
                <Marker position={marker}/>
            </div>}
        </GoogleMap>
    }
}
