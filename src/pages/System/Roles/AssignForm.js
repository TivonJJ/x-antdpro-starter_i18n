'use strict';
import React from 'react';
import {Modal, Transfer} from 'antd';
import {getUserByRole} from '@/services/system';
import {FormattedMessage} from "umi/locale";

export default class extends React.Component {
    state = {
        dataSource: [],
        selectedKeys: [],
        targetKeys: []
    };

    componentWillReceiveProps(nextProps) {
        if ('role' in nextProps && this.props.role !== nextProps.role) {
            this.handleRoleChange(nextProps.role);
        }
    }

    componentDidMount() {
        this.handleRoleChange(this.props.role);
    }

    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
        this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
    }

    handleRoleChange(role) {
        if (!role) return this.setState({dataSource: [], selectedKeys: [], targetKeys: []});

        getUserByRole(role.role_id).then(
            users => {
                const dataSource = [], targetKeys = [];
                users.able_alloc_userlist.map(item => {
                    dataSource.push({
                        key: item.user_id.toString(),
                        title: `${item.real_name} (${item.username})`,
                    });
                });
                users.already_alloc_userlist.map(item => {
                    dataSource.push({
                        key: item.user_id.toString(),
                        title: `${item.real_name} (${item.username})`,
                    });
                    targetKeys.push(item.user_id.toString());
                });
                console.log(targetKeys, 'one')
                this.setState({dataSource, selectedKeys: [], targetKeys});
            },
            err => {
                Modal.error({
                    content: err.message,
                });
            }
        );
    }

    handleChange = nextTargetKeys => {
        this.setState({targetKeys: nextTargetKeys});
        this.props.onChange && this.props.onChange(nextTargetKeys);
    };

    render() {
        const {dataSource, selectedKeys, targetKeys} = this.state;
        console.log(targetKeys, 'two')
        return (
            <div className="user-role-transfer">
                <Transfer
                    dataSource={dataSource}
                    titles={[<FormattedMessage id={'Page.system.roles.label.unassigned'}/>,
                        <FormattedMessage id={'Page.system.roles.label.assigned'}/>]}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={this.handleChange}
                    onSelectChange={this.handleSelectChange.bind(this)}
                    render={item => item.title}
                    showSearch
                    listStyle={{
                        width: 250,
                        height: 300,
                    }}
                />
            </div>
        );
    }
}
