import * as React from 'react';
import * as Antd from 'antd'
import * as Renderer from "src/utils/common/customlizedTableRender";
import { ModuleData, ModuleProps } from 'src/systems/kzBackend/SceneRaw/modules';
import antdTableColumnProcessor, { Processor, ColumnProps } from 'src/utils/common/antd_table_column_processor';
const Customlized = { Env: Renderer.Env }
/*@TagStart@ImportBlock@@*/
// import block
/*@TagEnd@ImportBlock@@*/
export const fieldDetailListSceneRaw = {
   '_id': '场景测试文件ID', 'sceneId': '场景id', 'width': '照片宽度', 'height': '照片高度', 'raw': 'CR2文件', 'thumb': 'CR2缩略图', 'std': '初始片文件', 'first': '初选片', 'clusterId': '最近作图clusterId', 'groupId': '最近作图groupId', 'photoId': '最近作图photoId', 'perfection': '精修片', 'jiapin': '嘉品片', 'updatedDatetime': '更新时间', 'createDatetime': '创建时间', 'file.name': 'name', 'file.size': '图片大小', 'file.lastUpdate': '修改时间', 'file.etag': 'etag', 'file.editor': 'editor', 'file.url': 'url', 'photoInfo.height': '照片高', 'photoInfo.width': '照片宽', 'photoInfo.filePath': '照片路径', 'photoInfo.fileName': '照片名称', 'photoInfo.pathToSave': 'pathToSave', 'photoInfo.info': '照片信息', 'photoInfo.mode': '出图模式', 'photoInfo.filenameMd5': '照片md5', 'photoInfo.filemtime': '照片时间', 'photoInfo.fileSize': '照片大小', 'photoInfo.pathToWatch': 'pathToWatch', 'photoInfo.exif': '照片exif',
}
export const fieldArray = [

  {key: 'sceneId', desc: '场景id', type: 'string'},

]
const tableColumn: any = [

  {
    title: '场景id',
    dataIndex: ['sceneId'],
    key: 'sceneId',
    render: Renderer.renderCascade({ render: 'cascade', cascadeTable: 'scene', valueColumn: '_id', labelColumn: 'name', cascadeQuery: '' }),
  },

  {
    title: 'CR2文件',
    dataIndex: ['raw'],
    key: 'raw',
    sorter: (a: ModuleData, b: ModuleData) => a.raw > b.raw ? 1 : -1,
    render: null
  },

]
export function tableColumnCreator<T> ( fields: string[] = [], processor: Processor<T> = null, assign: ColumnProps<T>[] = [] ): ColumnProps<T>[] {
  return antdTableColumnProcessor<T>(tableColumn, fields, processor, assign)
}

/*@TagStart@CodeBlock@@*/
// Code block
/*@TagEnd@CodeBlock@@*/
