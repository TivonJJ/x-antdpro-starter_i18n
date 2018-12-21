'use strict';
import React from 'react';
import { compose, withProps } from 'recompose';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from "react-google-maps";
import config from 'config';
const mapConfig = config.googleMap;
import qs from 'querystring';
import { Spin } from 'antd';

GoogleMap.create = function(options) {
    return function (WrappedComponent){
        return createMap(options,WrappedComponent)
    };
};

export function createMap(options={},ChildComponent) {
    return compose(
        withProps({
            googleMapURL: options.googleMapURL || mapConfig.url+'?'+qs.stringify({
                key:mapConfig.key,
                version:mapConfig.version,
                libraries:mapConfig.libraries,
                language:'en-US'
            }),
            loadingElement:<div style={{ height: `100%` }}><Spin/></div>,
            containerElement:<div style={{ height: options.height || 400 }}/>,
            mapElement:<div style={{ height: `100%` }}/>,
            defaultZoom: 15,
            defaultCenter: { lat: 43.6017247, lng: -79.6409004 },
            ...options
        }),
        withScriptjs,
        withGoogleMap,
    )(props =>(<ChildComponent {...props}/>));
}

GoogleMap.geocodeLatLng = (latlng)=> {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject)=>{
        geocoder.geocode({location: latlng},(results, status)=> {
            if (status === 'OK') {
                if (results[0]) {
                    resolve(results[0]);
                } else {
                    reject(new Error('No results found'));
                }
            } else {
                reject(new Error('Geocoder failed due to: ' + status));
            }
        });
    });
};
GoogleMap.geocodeAddress = (address)=> {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject)=>{
        geocoder.geocode({address},(results, status)=> {
            if (status === 'OK') {
                if (results[0]) {
                    resolve(results[0]);
                } else {
                    reject(new Error('No results found'));
                }
            } else {
                reject(new Error('Geocoder failed due to: ' + status));
            }
        });
    });
};

export default GoogleMap;
