import { DynamicRecord } from 'src/utils/dynamic';
import {ModuleProps, ModuleData} from "src/systems/kzBackend/SceneRaw/modules";
import * as React from 'react';
import { Tag, Badge, Button, Table } from 'antd';
import { tableColumnCreator } from 'src/systems/kzBackend/SceneRaw/components/table/TableColumnData';
import {AbstractRecordsTable, recordColumnCreator} from "src/utils/common/recordColumnCreator";
import {PaginationProps} from "antd/lib/pagination";
import * as Renderer from "src/utils/common/customlizedTableRender";
import { IconJson } from 'src/utils/common/showJsonView';
export * from "src/utils/common/recordColumnCreator";
const Customlized = {Env: Renderer.Env}
/*@TagStart@ImportBlock@@*/
// import block
/*@TagEnd@ImportBlock@@*/

function createColumns(props : ModuleProps) {
/*@TagStart@Code1Block@@*/
  return recordColumnCreator < DynamicRecord<ModuleData> > (null, (item: any) => {
    if (item.dataIndex === 'doc.name') {
        item.dataIndex = 'doc.name'
    }
    return item
}, [
    {
        title: 'Action',
        key: 'action',
        render: (text: any, record: DynamicRecord<ModuleData>, index: number) => <span>
        <IconJson data={record} />
    </span>
    }
  ], props)
/*@TagEnd@Code1Block@@*/
}
class RecordsTable extends AbstractRecordsTable<ModuleProps, any> {
  constructor (props: ModuleProps, context?: any ) {
    super(props, context);
    this.state = Object.assign({}, this.state, {
        columns: null,
        nestColumns: null,
        createColumns: createColumns,
        tableColumnCreator: tableColumnCreator,
    })
  }
/*@TagStart@ImportBlockRecordsTable@@*/
// import block
/*@TagEnd@ImportBlockRecordsTable@@*/
}
export default RecordsTable
