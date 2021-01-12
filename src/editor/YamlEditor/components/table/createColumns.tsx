import * as React from 'react';
import * as Antd from 'antd'
import { Divider, Tag, Badge, Button, Table, Popconfirm } from 'antd';
import {ModuleData, ModuleProps} from "src/systems/kzBackend/SceneRaw/modules";
import {tableColumnCreator} from "src/systems/kzBackend/SceneRaw/components/table/TableColumnData";
import { MainTable } from "src/systems/kzBackend/SceneRaw/components/table";
import * as Renderer from "src/utils/common/customlizedTableRender";
/*@TagStart@ImportBlock@@*/
// import block
import { IconJson } from 'src/utils/common/showJsonView';
import Image from "react-image-resizer";
import { JpImage, JpImg, formatQiniuUrl } from "src/utils/common/JpImage";
import { ImageUrlFormator } from 'src/systems/clusterCtrl/common/utils/ImageUrlFormator';
import { Authorization } from 'src/systems/clusterCtrl/common/utils/Authorization';
const renderActions = (record: ModuleData, props: ModuleProps) => {
    const cr2 = (record.file && record.file.url) || null
    return <div>
        <span>
            <IconJson data={record} />
            <Divider type="vertical" />
            <Popconfirm title='删除操作不可逆, 确定要删除?' onConfirm={ () => props.del(record._id) } okText="确定" cancelText="算了,手抖了">
                <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            { cr2 ? <a href={formatQiniuUrl(cr2)} target='_blank'>下载</a> : null }
            </span>
        <br/>
        <br/>
    </div>
}
const Customlized = {Env: Renderer.Env}
const statusInfo = { render: 'cascadeUrl', cascadeUrl:  Customlized.Env.CONTROL_HOST_ENV + '/jiapin/api/photo/readable-status', valueColumn: 'key', labelColumn: 'val', cascadeRequestMethod: 'post', cascadeResponseProp: 'dataList', cascadeRequestParam:  {limit: 999} }
const renderStatus = (record: ModuleData) => {
    const status = record.perfection
    const color = status === 'done' || status === 'uploadDebugPhoto' ? 'green' : (status === 'error' ? 'red' : 'cyan')
    return record.perfection ? <Tag color={color}>
    <Renderer.CascadeUrlRenderer data={status} {... statusInfo}/>
    </Tag> : null
}
/*@TagEnd@ImportBlock@@*/

export function createColumns(props: ModuleProps, _this: MainTable) {
  /*@TagStart@RenderBlock@@*/

  return tableColumnCreator < ModuleData > ([], (item) => {
    return item
}, [
    {
      key: 'raw',
      render: (text: string, record: ModuleData, index: number) => <div>#{1 + index}&nbsp;&nbsp;
        {text.length > 35 ? <Antd.Tooltip title={text}>...{text.substr(text.length - 30)}</Antd.Tooltip> : text}
        <br/>
        <br/>
        {renderStatus(record)}
        </div>
    },
    {
        title: 'Action',
        key: 'action',
        render: (text: any, record: ModuleData, index: number) => <div>{renderActions(record, props)}</div>
    }
])
  /*@TagEnd@RenderBlock@@*/
}
/*@TagStart@CodeEndBlock@@*/
// Code block
export function createColumnsSimple(props: ModuleProps, _this: MainTable) {
    const size = 80
    const showDetail = (record: ModuleData, key: string) => {
        props.applyCustomStateChange({photoIdImageView: record._id, keyImageView: key})
    };
    return tableColumnCreator<ModuleData>(
        [],
        item => {
            return item;
        },
        [
            {
                width: 200,
                key: "sceneId",
                render: (text: any, record: ModuleData, index: number) => (<span style={{display: 'flex', alignItems: 'center'}}>
                    <a onClick={() => showDetail(record, '原片')}><JpImage width={size} height={size} src={ImageUrlFormator.url300(record.thumb, record.updatedDatetime)}/></a>
                    <Divider type='vertical' />
                    <a onClick={() => showDetail(record, '初选片')}><JpImage width={size} height={size} src={ImageUrlFormator.url300(record.jiapin, record.updatedDatetime)} /></a>
                    </span>
                )
            },
            {
              key: 'raw',
              render: (text: string, record: ModuleData, index: number) => <div>#{1 + index}&nbsp;&nbsp;
                {text.length > 35 ? <Antd.Tooltip title={text}>...{text.substr(text.length - 30)}</Antd.Tooltip> : text}
                <br/>
                <br/>
                {renderStatus(record)}
              </div>
            },
            {
                title: 'Action',
                key: 'action',
                render: (text: any, record: ModuleData, index: number) => <div>{renderActions(record, props)} </div>
            }
        ]
    );
}
/*@TagEnd@CodeEndBlock@@*/
