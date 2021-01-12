import * as React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import * as Antd from 'antd';
import { FormComponentProps, WrappedFormUtils } from '@ant-design/compatible/lib/form/Form';
import { DataSourceItemType } from "antd/lib/auto-complete";
import { ModuleProps, ModuleData } from 'src/systems/kzBackend/SceneRaw/modules';
import { Button } from 'antd';
import * as ElementDic from "src/systems/kzBackend/SceneRaw/components/form/MainFormElements";
import { FormItemState } from 'src/utils/common/FormItemBase';
/*@TagStart@ImportBlock@@*/
// import block
/*@TagEnd@ImportBlock@@*/

const FormItem = Form.Item;

const FIELDS: string[] = ['_id', 'sceneId', ]
export interface MainFormProps extends ModuleProps {
  form: WrappedFormUtils
}

class MainForm extends React.Component < MainFormProps , any > {

  state: any = {
    confirmDirty: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && values) {
/*@TagStart@handleSubmit@@*/
        // console.log('Received values of form: ', values);
        values.route && values.route[0] !== '/' && (values.route = '/' + values.route)
/*@TagEnd@handleSubmit@@*/
        Object.keys(values).filter(key => values[key] && (typeof(values[key]) === 'string') ).forEach( key => values[key] = values[key].trim() )
        const promise: any = this.props.data.editData ? this.props.update(values) : this.props.create(values)
        if ( this.props.data.formCallback ) {
          promise.then((data) => this.props.data.formCallback(values, data, this.props.data) )
        }
      }
    });
  }

  parseFormFields(obj: any, fields: string[]): any {
    const ret = {}
    if ( !obj ) return ret;
    fields.map( key => ret[key] = obj[key])
    return ret;
  }

  createDefaultObj = (editData: ModuleData) => {
    const defaultValue: any = this.props.data.editData
      ? this.parseFormFields(this.props.data.editData, FIELDS)
      : { // default fields
          'sceneId': '',
        }
/*@TagStart@createDefaultObj@@*/
    // your code here
/*@TagEnd@createDefaultObj@@*/
    return defaultValue;
  }

  componentDidMount() {
    const value: any = this.createDefaultObj(this.props.data.editData);
    this.props.form.setFieldsValue(value)
  }

  onFormValueChanged = (formItemState: FormItemState, event) => {
/*@TagStart@onFormValueChanged@@*/
    const val = this.props.form.getFieldValue(formItemState.propName)
    // console.log('onFormValueChanged', formItemState, val)
    switch ( formItemState.propName ) {
        case '_id':
          break;
        case 'sceneId':
          break;
      default:
        break;
    }
/*@TagEnd@onFormValueChanged@@*/
  }

/*@TagStart@CodeBlock@@*/
// Code block
/*@TagEnd@CodeBlock@@*/
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {/*@TagStart@RenderBlock@@*/}
        {this.props.data.editData ? <ElementDic.IdFormItem {...this.props} formItemLayout={ElementDic.formItemLayout} /> : null}

        <ElementDic.SceneIdFormItem {...this.props} formItemLayout={ElementDic.formItemLayout} />

        <FormItem {...ElementDic.tailFormItemLayout}>
        <Button onClick={() => this.props.displayModalForm(false)}>Cancel</Button>&nbsp;&nbsp;
        <Button type="primary" htmlType="submit" loading={this.props.data.isLoading}>Submit</Button>
        </FormItem>
        {/*@TagEnd@RenderBlock@@*/}
      </Form>
    )
  }
}

export function createMainForm(): React.ComponentClass<any> {
  const form: any = MainForm
  return Form.create<any>()(form)
}

/*@TagStart@CodeEndBlock@@*/
// Code block
/*@TagEnd@CodeEndBlock@@*/
