import { message } from 'antd';

export function config() {
    return {
        onError(err) {
            if(err && err.type === 'RequestError'){
                setTimeout(()=>{
                    // eslint-disable-next-line no-underscore-dangle
                    if(!err._dontReject){
                        message.error(err.message);
                    }
                });
            }
        }
    };
}
