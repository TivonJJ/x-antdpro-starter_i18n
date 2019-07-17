import React from 'react';
import classNames from 'classnames';
import { Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';
import LanguageSwitch from './LanguageSwitch'

export default class GlobalFooter extends React.Component{
    render(){
        const { className, links } = this.props;
        const clsString = classNames(styles.globalFooter, className);
        const {buildVersion=0} = window.appMeta;
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
                    <span>Copyright <Icon type={"copyright"}/> <FormattedMessage id={'App.copyright'}/></span>
                    <span><FormattedMessage id={'App.version'}/> : {buildVersion}</span>
                    <span><LanguageSwitch {...this.props}/></span>
                </div>
            </div>
        );
    }
}
