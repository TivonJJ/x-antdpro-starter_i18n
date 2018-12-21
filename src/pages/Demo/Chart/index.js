import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import LineChart from './charts/Line';
import ColumnChart from './charts/Column';
import PieA from './charts/PieA';
import PieB from './charts/PieB';

class Chart extends Component {
    render() {
        return (
            <div className={'card-group'}>
                <Card bordered={false}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <PieA/>
                        </Col>
                        <Col span={12}>
                            <PieB/>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={false}>
                    <LineChart/>
                </Card>
                <Card bordered={false}>
                    <ColumnChart/>
                </Card>
            </div>
        );
    }
}

export default Chart;
