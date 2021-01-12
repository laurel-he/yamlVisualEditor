import * as React from 'react';
import * as Antd from 'antd'
import { ModuleProps, ModuleData } from 'src/systems/kzBackend/SceneRaw/modules';
import {TableProps} from "antd/lib/table";
import {createColumns} from "src/systems/kzBackend/SceneRaw/components/table/createColumns";
import {fieldArray} from "src/systems/kzBackend/SceneRaw/components/table/TableColumnData";
import {AbstractMainTable, AbstractMainTableState, AbstractMainTableTitle} from "src/utils/common/AbstractMainTable";
/*@TagStart@ImportBlock@@*/
// import block
import { Icon as LegacyIcon } from '@ant-design/compatible';
const RadioButton = Antd.Radio.Button;
const RadioGroup = Antd.Radio.Group;
import {createColumnsSimple} from "src/systems/kzBackend/SceneRaw/components/table/createColumns";
import { BackendSceneRawBlockItemList } from '../../modules/dataDefine';
import { sceneFileNameFormat } from '../photoInfo';
/*@TagEnd@ImportBlock@@*/
export interface MainTableProps extends ModuleProps {
  tabelProps: TableProps<ModuleData>
/*@TagStart@MainTablePropsBlock@@*/
// MainTableTitle block
/*@TagEnd@MainTablePropsBlock@@*/
}
export interface MainTableTitleProps extends MainTableProps {
  currentPageData: Object[],
  tableState: AbstractMainTableState
/*@TagStart@MainTableTitlePropsBlock@@*/
// MainTableTitle block
/*@TagEnd@MainTableTitlePropsBlock@@*/
}
export interface MainTableTitleState {
/*@TagStart@MainTableTitleState@@*/
// MainTableTitle block
/*@TagEnd@MainTableTitleState@@*/
}
export class MainTableTitle extends AbstractMainTableTitle<MainTableTitleProps, MainTableTitleState> {
/*@TagStart@MainTableTitleBlock@@*/
renderLeftSpan (props: any = null, children: React.ReactNode[] = null ) {
  return super.renderLeftSpan(props, Object.assign([
    <RadioGroup key='viewMode' onChange={(evt) => this.props.applyCustomStateChange({viewMode: evt.target.value})} defaultValue={this.props.data.customs.viewMode}>
        <RadioButton value="default"><LegacyIcon type="bars" /></RadioButton>
        <RadioButton value="simple"><LegacyIcon type="picture" /></RadioButton>
      </RadioGroup>
  ], children))
}
/*@TagEnd@MainTableTitleBlock@@*/
}
export class MainTable extends AbstractMainTable<MainTableProps> {
  constructor(props: MainTableProps, context?: any) {
    super(props, context)
    this.state = Object.assign({}, this.state, {
      columns: [],
      fieldArray: fieldArray,
      createColumns: createColumns,
/*@TagStart@StateEndBlock@@*/
// State block
      isCreateEnabled: false,
      isSearchEnabled: false,
/*@TagEnd@StateEndBlock@@*/
    })
  }

  renderTableTitle = (currentPageData: Object[]): any => {
    return <MainTableTitle {... this.props} currentPageData={currentPageData} tableState={this.state} />
  }

/*@TagStart@CodeEndBlock@@*/
renderTable(props : any = null) {
  const columns = this.props.data.customs.viewMode === 'simple' ? createColumnsSimple(this.props, this) : this.state.columns
  return super.renderTable(Object.assign({ columns, dataSource: this.filter(this.props.data.list || []) }, props))
}
  filter(list: BackendSceneRawBlockItemList[]): BackendSceneRawBlockItemList[] {
    const taskStatus = this.props.data.customs.taskStatus
    if ( !taskStatus ) return list
    return list.map( record => {
      const name = record.photoId || sceneFileNameFormat(record.file.name)
      record.perfection = taskStatus[name] || ''
      return record
      // return Object.assign({}, record, {perfection: taskStatus[name] || ''})
    });
  }
/*@TagEnd@CodeEndBlock@@*/

}
