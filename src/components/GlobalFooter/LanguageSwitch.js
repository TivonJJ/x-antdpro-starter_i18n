import React from 'react';
import { Button } from 'antd';
import { FormattedMessage,getLocale,setLocale } from 'umi/locale';

export default class LanguageSwitch extends React.Component{
    changeLanguage=(language)=>{
        setLocale(language)
    };

    render(){
        const {setting=false} = this.props;
        const otherLanguage = getLocale() === 'zh-CN' ? 'en-US' : 'zh-CN';
        return (
            <Button
                loading={setting}
                type={'primary'}
                size={'small'}
                ghost
                onClick={()=>this.changeLanguage(otherLanguage)}
            >
                <FormattedMessage id={`Common.language.${otherLanguage}`}/>
            </Button>
        )
    }
}
