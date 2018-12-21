import React from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Button, Icon } from 'antd';
import { FormattedMessage,getLocale,setLocale } from 'umi/locale';

export default class GlobalFooter extends React.Component{
    render(){
        const { className, links } = this.props;
        const clsString = classNames(styles.globalFooter, className);
        const {buildVersion=0} = appMeta;
        return (
            <div className={clsString}>
                {links && (
                    <div className={styles.links}>
                        {links.map(link => (
                            <a key={link.key} target={link.blankTarget ? '_blank' : '_self'} href={link.href}>
                                {link.title}
                            </a>
                        ))}
                    </div>
                )}
                <div className={styles.copyright}>
                    <span>Copyright <Icon type="copyright"/> <FormattedMessage id={'App.copyright'}/></span>
                    <span><FormattedMessage id={'App.version'}/> : {buildVersion}</span>
                    <span><LanguageSwitch {...this.props}/></span>
                </div>
            </div>
        );
    }
}

class LanguageSwitch extends React.Component{
    changeLanguage=(language)=>{
        setLocale(language)
    };
    render(){
        const {setting=false} = this.props;
        const otherLanguage = getLocale() === 'zh-CN' ? 'en-US' : 'zh-CN';
        return <Button loading={setting} type={'primary'} size={'small'} ghost
                       onClick={()=>this.changeLanguage(otherLanguage)}>
            <FormattedMessage id={'Common.language.'+otherLanguage}/>
        </Button>
    }
}
