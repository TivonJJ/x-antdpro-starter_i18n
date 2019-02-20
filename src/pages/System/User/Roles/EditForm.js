'use strict';
import React from 'react';
import {Form, Input, Tree, Spin, Icon} from 'antd';
import {FormattedMessage, formatMessage,getLocale} from "umi/locale";

const TreeNode = Tree.TreeNode;

@Form.create()
export default class EditForm extends React.Component {
    state = {
        expandedPermissions: [],
    };

    handlePermissionExpand=(expandedPermissions)=> {
        this.setState({expandedPermissions});
    };

    handleFormChange = (evt) => {
        this.props.onChange && this.props.onChange(evt);
    }

    render() {
        const {permissions=[]} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {expandedPermissions} = this.state;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        const labels = {
            roleName: <FormattedMessage id={'Model.system.role.name'}/>,
            roleDesc: <FormattedMessage id={'Model.system.role.description'}/>,
            permissionList:<FormattedMessage id={'Page.system.roles.edit.permissionList'}/>
        };
        return (
            <Form onChange={this.handleFormChange}>
                {getFieldDecorator('role_id', {})(<Input type="hidden"/>)}
                <Form.Item {...formItemLayout} label={labels.roleName}>
                    {getFieldDecorator('role_name', {
                        rules: [
                            {
                                required: true,
                                message: <FormattedMessage id={'Validator.required'}
                                                           values={{name: labels.roleName}}/>,
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>
                <Form.Item {...formItemLayout} label={labels.roleDesc}>
                    {getFieldDecorator('description')(<Input type="textarea" rows="5"/>)}
                </Form.Item>
                <Form.Item {...formItemLayout} label={labels.permissionList}>
                    {getFieldDecorator('res_list', {
                        initialValue: [],
                        rules: [
                            {
                                required: true,
                                message: <FormattedMessage id={'Validator.required'}
                                                           values={{name: labels.permissionList}}/>,
                            },
                        ],
                    })(
                        <PermissionsTreeSelect
                            permissions={permissions}
                            onChange={this.handleFormChange}
                            onExpand={this.handlePermissionExpand}
                            expandedKeys={expandedPermissions}
                        />
                    )}
                </Form.Item>
            </Form>
        );
    }
}

export class PermissionsTreeSelect extends React.Component {
    state = {
        expandedKeys: [],
        autoExpandParent: false,
        checkedKeys: [],
    };

    componentDidMount() {
        this.applyStateFromProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.applyStateFromProps(nextProps);
    }

    applyStateFromProps(nextProps) {
        const newState = {};
        if ('value' in nextProps) {
            newState.checkedKeys = nextProps.value || [];
        }
        if ('expandedKeys' in nextProps) {
            newState.expandedKeys = nextProps.expandedKeys || [];
        }
        this.setState(newState);
    }

    onExpand = expandedKeys => {
        const props = this.props;
        if (!('expandedKeys' in props)) {
            this.setState({
                expandedKeys,
            });
        }
        props.onExpand && props.onExpand(expandedKeys);
    };
    onCheck = checkedKeys => {
        const props = this.props;
        if (!('value' in props)) {
            this.setState({
                checkedKeys,
            });
        }
        props.onChange && props.onChange(checkedKeys);
    };

    render() {
        const permissions = this.props.permissions;
        if (!permissions) return null;
        const {autoExpandParent, checkedKeys, expandedKeys} = this.state;
        const loopTree = data =>
            data.map(item => {
                let before = null;
                item.name = item.res_name;
                try{
                    if(typeof item.name==='string'){
                        item.name = JSON.parse(item.name);
                    }
                }catch (e) {
                    item.name = {};
                    console.error('Invalid Res name',item.res_name);
                }
                item.name = item.name[getLocale()];
                switch (item.res_type) {
                    case 'Menu':before = <Icon type={'link'} className="menu-icon"/>;
                        break;
                    case 'Action':before = <Icon type={'play-circle-o'} className="menu-icon"/>;
                        break;
                    case 'Folder':before = <Icon type={'folder'} className="menu-icon"/>;
                        break;
                    case 'StatusBar':before = <Icon type={'pushpin-o'} className="menu-icon"/>
                }
                const key = String(item.res_id);
                const title = (
                    <span className="menu-item-title">
            {before} {item.name}
          </span>
                );
                if (item.children) {
                    return (
                        <TreeNode key={key} title={title}>
                            {loopTree(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={key} title={title}/>;
            });
        return (
            <div className="permissions-tree">
                {permissions&&permissions.length ? (
                    <Tree
                        checkable
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={checkedKeys}
                    >
                        {loopTree(permissions)}
                    </Tree>
                ):null}
            </div>
        );
    }
}
