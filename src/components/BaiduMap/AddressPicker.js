'use strict';
import React, {Fragment} from 'react';
import {Modal, message, Icon, Spin} from 'antd';
import { FormattedMessage,formatMessage } from 'umi/locale';
import {Base, Map, Marker, Navigation, Constants, MapType, CustomControl, AutoComplete, BMapUtil} from "rc-bmap";
const { Point, Events, Size } = Base;
const { MAP_TYPE,CONTROL_ANCHOR } = Constants;
import './AddressPicker.less';
import {isPromise} from "@/utils";
import PropTypes from "prop-types";

export default class AddressPicker extends React.PureComponent{
    static propTypes = {
        zoom: PropTypes.number,
        height: PropTypes.number,
        width: PropTypes.number,
        title: PropTypes.string,
        placeholder: PropTypes.string,
        initialMarker: PropTypes.object,
        initialCenter: PropTypes.object
    };
    state={
        showMap: false,
        positioning: false,
        center: {lng: 116.402544, lat: 39.928216},
        marker: null,
        location:null,
        confirmBusy:false
    };
    static defaultProps={
        title: '选择地址',
        placeholder: '请输入关键词搜索地址',
        zoom: 12,
        height: 460,
        width: 800
    };
    searchInputId = 'comp-bmap_picker_search_input_' + Date.now();

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
    handleOk=()=>{
        if(!this.props.onOk)return;
        const prom = this.props.onOk(this.state.location);
        if(isPromise(prom)){
            this.setState({confirmBusy:true});
            prom.then(()=>{
                this.hideMap();
            }).finally(()=>{
                this.setState({confirmBusy:false})
            })
        }else {
            this.hideMap();
        }
    };
    handleMapClick=(evt)=>{
        this.setState({marker:evt.point,/*center:evt.point*/});
        this.onPoint(evt.point);
    };
    handleSearch= (address)=>{
        if(!address)return;
        BMapUtil.getPoint(address).then(point=>{
            this.setState({
                center:point,
                marker:point,
            });
            this.onPoint(point);
        },e=>{
            message.error(e?e.message:'地址无法解析，请尽量输入详细地址');
        })
    };
    onPoint= (point)=>{
        BMapUtil.getLocation(point).then(res=>{
            const location = {
                ...res.addressComponents,
                point:res.point,
                surroundingPois: res.surroundingPois,
                formatted_address:res.address
            };
            location.street = [location.street,location.streetNumber].join('');
            this.setState({location});
        },e=>{
            message.error(e?e.message:'无法解析坐标点');
        })
    };
    onMapMounted=(ref)=>{
        let watchId,watchStep=0;
        const watchLoaded = ()=>{
            watchId = setInterval(()=>{
                watchStep++;
                let mapInstance = ref.getMapInstance();
                if(mapInstance){
                    clearInterval(watchId);
                    this.map = mapInstance;
                    this.onMapLoaded(mapInstance);
                }
                if(watchStep>600){//一分钟无返回超时
                    console.warn('Baidu Map may load out of time');
                    clearInterval(watchId);
                }
            },100);
        };
        if(ref){
            watchLoaded();
        }else {
            this.map = undefined;
        }
    };
    onMapLoaded=()=>{
        this.autoCenter();
    };
    autoCenter=()=>{
        if(this.props.initialMarker){
            this.setState({marker:this.props.initialMarker});
            // 如果有标记点，默认放大到18
            this.map.zoomTo(18);
            setTimeout(()=>{
                this.onPoint(new BMapUtil.BPoint({
                    lng: this.props.initialMarker.lng,
                    lat: this.props.initialMarker.lat
                }));
            },100)
        }
        if(this.props.initialCenter){
            this.setState({center:this.props.initialCenter});
        }else {
           this.autoLocationPosition();
        }
    };
    autoLocationPosition=()=>{
        if(AddressPicker.$cacheLocationPosition){
            this.setState({center:AddressPicker.$cacheLocationPosition});
        }else {
            this.setState({positioning:true});
            BMapUtil.getCurrentPosition().then(({point}) => {
                AddressPicker.$cacheLocationPosition = point;
                this.setState({center:point});
                this.setState({positioning:false});
            },e=>{
                message.error(e?e.message:'定位失败');
                this.setState({positioning:false});
                delete AddressPicker.$cacheLocationPosition;
            })
        }
    };
    render(){
        const {
            title,
            width,
            height,
            children,
            zoom,
            placeholder,
            ...mapProps
        } = this.props;
        const {center,marker,showMap,location,confirmBusy,positioning} = this.state;
        const mapTypes = [MAP_TYPE.NORMAL, MAP_TYPE.SATELLITE];
        return <Fragment>
            {React.cloneElement(children,{onClick:this.showMap})}
            <Modal
                confirmLoading={confirmBusy}
                width={width}
                title={title}
                visible={showMap}
                onCancel={this.hideMap}
                onOk={this.handleOk}>
                <Spin spinning={positioning}>
                    <div style={{ height: height}} className={'comp-bmap_picker__container'}>
                        <Map zoom={zoom}
                             scrollWheelZoom
                             {...mapProps}
                             center={center}
                             ref={this.onMapMounted}
                             click={this.handleMapClick}>
                            {marker&&<Marker position={marker}>
                                <Point lng={marker.lng} lat={marker.lat}/>
                            </Marker>}
                            <MapType mapTypes={mapTypes} anchor={CONTROL_ANCHOR.BOTTOM_RIGHT}/>
                            <Navigation anchor={CONTROL_ANCHOR.TOP_RIGHT}/>
                            <SearchControl id={this.searchInputId}
                                           placeholder={placeholder}
                                           onSearch={this.handleSearch}
                                           anchor={CONTROL_ANCHOR.TOP_LEFT}>
                                <Size name="offset" width="0" height="0" />
                            </SearchControl>
                            <Events click={this.handleMapClick}/>
                        </Map>
                    </div>
                    <div className={'comp-bmap_picker_current_location'}>
                        当前选中：
                        {location ? <span>
                            {location.formatted_address}
                            <span className={'text-primary'}> {location.point.lng} , {location.point.lat}</span>
                        </span> : '无'}
                    </div>
                </Spin>
            </Modal>
        </Fragment>
    }
}


@CustomControl
class SearchControl extends React.PureComponent{
    handleKeyPress=(evt)=>{
        if(evt.keyCode===13){
            this.handleSearch(evt.currentTarget.value);
        }
    };
    handleSearch=(val)=>{
        this.setState({value:val});
        this.props.onSearch(val);
    };
    handleSearchIconClick=()=>{
        this.handleSearch(this.input.value);
    };
    render() {
        const {id,placeholder} = this.props;
        return (
            <AutoComplete input={id}>
                <div className={'comp-bmap_picker_search_container'}>
                    <span className={'ant-input-search ant-input-affix-wrapper comp-bmap_picker_search_input'}>
                        <input onKeyUp={this.handleKeyPress}
                               placeholder={placeholder}
                               className={'ant-input'}
                               id={id}
                               ref={ref=>this.input=ref}
                        />
                        <span className={'ant-input-suffix'}
                              role={'button'}
                              onClick={this.handleSearchIconClick}>
                            <Icon type={'search'}/>
                        </span>
                    </span>
                </div>
                {/*<Events confirm={({item})=>{
                    const {value} = item;
                    this.handleSearch(value.province +  value.city +  value.district +  value.business)
                }}/>*/}
            </AutoComplete>
        );
    }
}
