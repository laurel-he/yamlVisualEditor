import * as React from 'react';
import * as Antd from 'antd';
import moment from 'moment';
import * as Customlized from 'src/systems/kzBackend/SceneRaw/components/form/CustomlizedFormItem';
export * from 'src/systems/kzBackend/SceneRaw/components/form/CustomlizedFormItem';
import { WrappedFormUtils } from '@ant-design/compatible/lib/form/Form';
import {InputProps} from 'antd/lib/input/Input';
import {MainFormProps} from 'src/systems/kzBackend/SceneRaw/components/form/MainForm';
import {BASE_URL} from 'src/systems/kzBackend/common/api';
import {FormItemBase, FormItemState, FormItemProps} from 'src/utils/common/FormItemBase';
/*@TagStart@ImportBlock@@*/
// import block
/*@TagEnd@ImportBlock@@*/

export interface MainFormElemProps extends MainFormProps {
  form: WrappedFormUtils
  inputProps?: object,
  formItemProps?: object,
  formItemLayout?: any,
  onChange?: (value: FormItemState, event?: any ) => void
}
export interface MainFormElemState extends FormItemState {
}

export class IdFormItem extends FormItemBase<MainFormElemProps, MainFormElemState> {
  constructor(props: MainFormElemProps) {
    super(props, '_id', '场景测试文件ID', '场景测试文件ID', 'value', true , 'string')
  }

  renderInput(props: any = null ) {
    !props && (props = {})
    return <Antd.Input readOnly={true} disabled={true} onChange={this.onChange} {...props}/>
  }
}

export class SceneIdFormItem extends FormItemBase<MainFormElemProps, MainFormElemState> {
  constructor(props: MainFormElemProps) {
    super(props, 'sceneId', '场景id', '场景id', 'value', true , 'string')
  }

  renderInput(props: any = null ) {
    !props && (props = {})
    return <Antd.Input onChange={this.onChange} {...props}/>
  }
}
/*@TagStart@CodeBlock@@*/
// Code block
/*@TagEnd@CodeBlock@@*/
