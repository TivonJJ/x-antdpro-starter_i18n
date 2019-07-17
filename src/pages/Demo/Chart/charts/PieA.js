import React from "react";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Guide,
} from "bizcharts";
import DataSet from "@antv/data-set";

class Donut extends React.Component {
    render() {
        const { DataView } = DataSet;
        const { Html } = Guide;
        const data = [
            {
                item: "事例一",
                count: 40
            },
            {
                item: "事例二",
                count: 21
            },
            {
                item: "事例三",
                count: 17
            },
            {
                item: "事例四",
                count: 13
            },
            {
                item: "事例五",
                count: 9
            }
        ];
        const dv = new DataView();
        dv.source(data).transform({
            type: "percent",
            field: "count",
            dimension: "item",
            as: "percent"
        });
        const cols = {
            percent: {
                formatter: val => {
                    val = `${val * 100  }%`;
                    return val;
                }
            }
        };
        return (
            <div>
                <Chart
                    height={300}
                    data={dv}
                    scale={cols}
                    padding={'auto'}
                    forceFit
                >
                    <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                    <Axis name={"percent"} />
                    <Tooltip showTitle={false} />
                    <Guide>
                        <Html
                            position={["50%", "50%"]}
                            html={"<div class='text-center'>主机<br/>200台</div>"}
                            alignX={"middle"}
                            alignY={"middle"}
                        />
                    </Guide>
                    <Geom
                        type={"intervalStack"}
                        position={"percent"}
                        color={"item"}
                        tooltip={[
                            "item*percent",
                            (item, percent) => {
                                percent = `${percent * 100  }%`;
                                return {
                                    name: item,
                                    value: percent
                                };
                            }
                        ]}
                        style={{
                            lineWidth: 1,
                            stroke: "#fff"
                        }}
                    >
                        <Label
                            content={"percent"}
                            formatter={(val, item) => `${item.point.item  }: ${  val}`}
                        />
                    </Geom>
                </Chart>
            </div>
        );
    }
}

export default Donut;
