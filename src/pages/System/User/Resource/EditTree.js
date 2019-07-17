import React from 'react';
import {FormattedMessage,formatMessage,getLocale} from "umi/locale";
import {Tree,Icon,Modal,Dropdown,Menu} from 'antd';
import classNames from 'classnames';
import styles from './style.less';
import { filterPermissions } from './utils';

const {TreeNode} = Tree;

export default class extends React.Component {
    state={
        expandedKeys: [],
        autoExpandParent: true
    };

    componentDidMount(){
        if(this.props.filter)this.filter(this.props.filter);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.filter !== nextProps.filter){
            this.filter(nextProps.filter);
        }
        if(this.props.permission && nextProps.permission && this.props.permission !== nextProps.permission
            && nextProps.permission.selectedPermission
            && this.props.permission.selectedPermission !== nextProps.permission.selectedPermission){
            const dna = [...nextProps.permission.selectedPermission.$dna];
            dna.pop();
            const {expandedKeys} = this.state;
            if(dna.length){
                this.setState({
                    expandedKeys: expandedKeys.concat([dna.join('-')])
                });
            }
        }
    }

    filter=(keywords)=>{
        this.handleSelect([false]);
        const filteredKeys = filterPermissions(this.props.permission.permissions,keywords);
        this.setState({
            expandedKeys: filteredKeys,
            autoExpandParent: true
        });
    };

    handleExpand=(expandedKeys)=>{
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    };

    handleDrop=(info)=>{
        this.props.onChange('drop',info);
    };

    handleSelect=(selectedKeys)=>{
        selectedKeys = selectedKeys.splice(0,1);
        this.props.onSelect && this.props.onSelect(selectedKeys[0]);
    };

    del=(permission)=>{
        if(!permission.res_id){
            this.props.onChange('del',permission);
            return;
        }
        Modal.confirm({
            title:formatMessage({id:'Common.message.sure'}),
            content:(
                <div
                    style={{lineHeight:1.8}}
                    dangerouslySetInnerHTML={
                        {__html:formatMessage({id:'Page.system.permissions.deletePrompt'},{name:permission.name})}
                    }
                />
            ),
            onOk:()=>{
                this.props.onChange('del',permission);
            }
        });
    };

    add=(permission,level)=>{
        this.props.onChange('insert',{permission,level});
    };

    render(){
        const {permissions,selectedPermission,existsPermissionsID} = this.props.permission;
        const selectedKeys = [];
        if(selectedPermission)selectedKeys.push(selectedPermission.dna);
        const {expandedKeys,autoExpandParent} = this.state;
        const {filter} = this.props;
        const loop = data => data.map((item) => {
            let before = null;
                let after = null;
            item.name = item.res_name[getLocale()];
            switch (item.res_type){
                case 'Menu':before = <Icon type={'link'} className={"menu-icon"}/>;
                    break;
                case 'Action':before = <Icon type={'play-circle-o'} className={"menu-icon"}/>;
                    break;
                case 'Folder':before = <Icon type={'folder'} className={"menu-icon"}/>;
                    break;
                case 'StatusBar':before = <Icon type={'pushpin-o'} className={"menu-icon"}/>;
                    break;
                default:
                    break;
            }
            if(selectedKeys[0] === item.dna){
                after = (
                    <div className={"menu-item-bars inline"}>
                        <Icon type={"minus-circle-o"} className={"button"} onClick={()=>this.del(item)}/>
                        <Dropdown
                            trigger={["click"]}
                            placement={"bottomCenter"}
                            overlay={(
                                <Menu>
                                    <Menu.Item>
                                        <a onClick={()=>this.add(selectedPermission,1)}><FormattedMessage id={'Page.system.permissions.addBrother'}/></a>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <a onClick={()=>this.add(selectedPermission,2)}><FormattedMessage id={'Page.system.permissions.addChild'}/></a>
                                    </Menu.Item>
                                </Menu>
                            )}
                        >
                            <Icon type={"plus-circle-o"} className={"button"}/>
                        </Dropdown>
                    </div>
                )
            }
            let name = item.name || '';
            const isExists = existsPermissionsID.indexOf(item.id) !== -1;
            if(filter){
                const index = name.indexOf(filter);
                const beforeStr = name.substr(0, index);
                const afterStr = name.substr(index + filter.length);
                name = index > -1 ?
                    <span>{beforeStr}<span style={{ color: '#f50' }}>{filter}</span>{afterStr}</span>
                    :
                    <span>{name}</span>;
            }
            const title = (
                <span className={classNames({'text-primary':!isExists})}>
                    {before}{name}{after}
                </span>
            );
            const key = item.dna;
            if (item.children) {
                return (
                    <TreeNode key={key} title={title} className={styles.menuItem}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={key} title={title} className={styles.menuItem}/>;
        });
        return (
            <div>
                {permissions.length<=0&&(
                    <div className={"gutter-left-lg gutter-top"}>
                        <Icon type={"plus-circle-o"} role={"button"} onClick={()=>this.add(null,0)}/>
                    </div>
                )}
                {permissions.length?
                    <Tree
                        draggable
                        onExpand={this.handleExpand}
                        onDrop={this.handleDrop}
                        onSelect={this.handleSelect}
                        expandedKeys={expandedKeys}
                        selectedKeys={selectedKeys}
                        autoExpandParent={autoExpandParent}
                    >
                        {loop(permissions)}
                    </Tree>:null}
            </div>
        )
    }
}
