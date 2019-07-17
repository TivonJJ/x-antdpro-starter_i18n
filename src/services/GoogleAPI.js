import axios from 'axios';
import config from 'config';

const googleMapConfig = config.googleMap;

export async function getTimeZoneByLatLng(latLng) {
    return axios.get('https://maps.googleapis.com/maps/api/timezone/json',{
        params:{
            location:`${latLng.lat},${latLng.lng}`,
            timestamp:String(Date.now()).substr(0,10),
            key:googleMapConfig.apiKey
        }
    }).then(res=>{
        if(res.data.status === 'OK'){
            return res.data;
        }
            return Promise.reject(new Error(res.data.status))
        
    })
}
