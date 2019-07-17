/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';
import { Input, Modal } from 'antd';
import { FormattedMessage,formatMessage } from 'umi/locale';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import Marker from 'react-google-maps/lib/components/Marker';
import GoogleMap from './index';

export default class extends React.Component{
    state={
        showMap: false,
        center: this.props.center,
        marker: this.props.value,
        bounds: null
    };

    componentWillReceiveProps(nextProps){
        if(this.props.value !== nextProps.value){
            this.setState({marker:nextProps.value})
        }
    }

    showMap=()=>{
        this.setState({showMap:true})
    };

    hideMap=()=>{
        this.setState({showMap:false})
    };

    onBoundsChanged=() => {
        const bounds = this.map.getBounds();
        this.setState({bounds});
        this.props.onBoundsChanged && this.props.onBoundsChanged(bounds)
    };

    onPlacesChanged=(places)=>{
        if(!places || places.length<=0)return;
        const pos = places[0].geometry.location;
        this.setState({
            center: pos.toJSON(),
            // marker: pos.toJSON()
        });
        this.props.onPlacesChanged && this.props.onPlacesChanged(pos);
    };

    onPickAddress=(latLng)=>{
        this.setState({/* center:latLng, */marker:latLng});
    };

    handleOk=()=>{
        this.props.onChange(this.state.marker,this.hideMap)
    };

    render(){
        const {
            title=<FormattedMessage id={'Component.googleMap.title'}/>,
            searchPlaceholder=formatMessage({id:'Component.googleMap.search.placeholder'}),
            modalWidth=800,children,confirmLoading,...restProps} = this.props;
        const {bounds,center,marker,showMap} = this.state;
        return (
            <Fragment>
                <span onClick={()=>this.showMap()}>{children}</span>
                <Modal
                    confirmLoading={confirmLoading}
                    width={modalWidth}
                    title={title}
                    visible={showMap}
                    onCancel={this.hideMap}
                    onOk={this.handleOk}
                >
                    <Maps
                        onMapMounted={map=>{this.map=map}}
                        onBoundsChanged={this.onBoundsChanged}
                        onPickAddress={this.onPickAddress}
                        onPlacesChanged={this.onPlacesChanged}
                        searchPlaceholder={searchPlaceholder}
                        {...restProps}
                        marker={marker}
                        bounds={bounds}
                        center={center}
                    />
                </Modal>
            </Fragment>
        )
    }
}

@GoogleMap.create({
    height:window.innerHeight/2
})
class Maps extends React.Component{
    handlePickAddress=(evt)=>{
        evt.stop();
        this.props.onPickAddress&&this.props.onPickAddress(evt.latLng.toJSON());
    };

    render(){
        const {onPlacesChanged,onMapMounted,bounds,marker,searchPlaceholder,...restProps} = this.props;
        return (
            <GoogleMap
                {...restProps}
                ref={onMapMounted}
                onClick={this.handlePickAddress}
            >
                <SearchBox
                    controlPosition={google.maps.ControlPosition.TOP_LEFT}
                    bounds={bounds}
                    onPlacesChanged={()=>{
                        onPlacesChanged(this.searchBox.getPlaces())
                    }}
                    ref={ref=>{this.searchBox=ref}}
                >
                    <Input
                        placeholder={searchPlaceholder}
                        style={{
                            width: 240,
                            marginTop: 11,
                        }}
                    />
                </SearchBox>
                {marker&&(
                    <div>
                        <Marker position={marker}/>
                        <div><FormattedMessage id={'Component.googleMap.currentLocation'}/>: {marker.lat},{marker.lng}</div>
                    </div>
                )}
            </GoogleMap>
        )
    }
}
