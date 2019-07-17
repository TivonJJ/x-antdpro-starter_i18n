import React from 'react';
import {Form, Input} from 'antd';
import {FormattedMessage} from "umi/locale";
import PermissionsTreeSelect from './PermissionsTreeSelect';

export default
@Form.create()
class EditForm extends React.Component {
    state = {
        expandedPermissions: [],
    };

    handlePermissionExpand=(expandedPermissions)=> {
        this.setState({expandedPermissions});
    };

    handleFormChange = (evt) => {
        this.props.onChange && this.props.onChange(evt);
    };

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
                {getFieldDecorator('role_id', {})(<Input type={"hidden"}/>)}
                <Form.Item {...formItemLayout} label={labels.roleName}>
                    {getFieldDecorator('role_name', {
                        rules: [
                            {
                                required: true,
                                message: (
                                    <FormattedMessage
                                        id={'Validator.required'}
                                        values={{name: labels.roleName}}
                                    />
                                ),
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>
                <Form.Item {...formItemLayout} label={labels.roleDesc}>
                    {getFieldDecorator('description')(<Input type={"textarea"} rows={"5"}/>)}
                </Form.Item>
                <Form.Item {...formItemLayout} label={labels.permissionList}>
                    {getFieldDecorator('res_list', {
                        initialValue: [],
                        rules: [
                            {
                                required: true,
                                message: (
                                    <FormattedMessage
                                        id={'Validator.required'}
                                        values={{name: labels.permissionList}}
                                    />
                                ),
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
