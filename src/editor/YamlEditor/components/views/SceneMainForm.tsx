import * as React from 'react';
import { WrappedFormUtils } from '@ant-design/compatible/lib/form/Form';
import { ModuleProps, ModuleData } from 'src/systems/kzBackend/SceneRaw/modules';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message } from 'antd';
import * as ElementDic from "src/systems/kzBackend/Scene/components/form/MainFormElements";
import { AnonymousDynaimicReq } from 'src/utils/dynamic/anonymous';
import { BackendSceneListBlockItemList } from 'src/systems/ai/common/api';
import pinyin from 'pinyin'
import { sceneListStorage } from '../SceneList';
import { Authorization } from 'src/systems/clusterCtrl/common/utils/Authorization';
import { usersetting, makeup } from './senceFile';

const FormItem = Form.Item;

const FIELDS: string[] = ['_id', 'name', 'sceneMapID', ]
export interface SceneMainFormProps extends ModuleProps {
  form: WrappedFormUtils
}

const TABLE_NAME = 'scene'
class SceneMainForm extends React.Component < SceneMainFormProps , any > {
  create(values: BackendSceneListBlockItemList): any {
    if ( !this.customs.storeId ) {
      message.warning('请先选择门店')
      return null
    }
    const settingFiles: string[] = [
      // "usersetting.json",
      // "makeup.json"
    ]
    const py: string[][] = pinyin(values.name, { style: pinyin.STYLE_INITIALS }) || [[]]
    const p: string = (py.map( item => item ? item.join('') : '').join('') + 'a').toUpperCase()
    const req = new AnonymousDynaimicReq(TABLE_NAME)
    values.storeId = this.customs.storeId
    values.pinyin = p[0]
    values.files = settingFiles.map((item) => ({
      name: item,
      url: null,
      size: 0,
      lastUpdate: new Date().valueOf(),
      etag: '',
      editor: Authorization.userName,
      contents: JSON.stringify(item === 'usersetting.json' ? usersetting : item === 'makeup.json' ? makeup : ""),
      structuredContent: item === 'usersetting.json' ? usersetting : item === 'makeup.json' ? makeup : "",
    }))
    values.settingFiles = settingFiles
    return req.dynamicCreate( values ).then( (data: BackendSceneListBlockItemList) => {
      sceneListStorage.setCachedSceneId(data.storeId, data._id)
      this.props.applyCustomStateChange({selectedSceneId: data._id})
      this.customs.formDone()
      message.success(`场景${values.name}创建成功`)
    } )
  }
  update(values: BackendSceneListBlockItemList): any {
    if ( !this.customs.storeId ) {
      message.warning('请先选择门店')
      return null
    }
    const py: string[][] = pinyin(values.name, { style: pinyin.STYLE_INITIALS }) || [[]]
    const p: string = (py.map( item => item ? item.join('') : '').join('') + 'a').toUpperCase()
    const req = new AnonymousDynaimicReq(TABLE_NAME)
    values.storeId = this.customs.storeId
    values.pinyin = p[0]
    return req.dynamicUpdate( values ).then(data => this.customs.formDone() )
  }

  get customs() {
    return this.props.data.customs
  }

  state: any = {
    confirmDirty: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && values) {
        Object.keys(values).filter(key => values[key] && (typeof(values[key]) === 'string') ).forEach( key => values[key] = values[key].trim() )
        const promise: any = this.customs.sceneForEdit ? this.update(values) : this.create(values)
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
    const defaultValue: any = this.customs.sceneForEdit
      ? this.parseFormFields(this.customs.sceneForEdit, FIELDS)
      : { // default fields
          'name': '',
          'sceneMapID': '',
        }
/*@TagStart@createDefaultObj@@*/
    // your code here
/*@TagEnd@createDefaultObj@@*/
    return defaultValue;
  }

  componentDidMount() {
    const value: any = this.createDefaultObj(this.customs.sceneForEdit as any);
    this.props.form.setFieldsValue(value)
  }
/*@TagStart@CodeBlock@@*/
// Code block
/*@TagEnd@CodeBlock@@*/
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {/*@TagStart@RenderBlock@@*/}
        {this.customs.sceneForEdit ? <ElementDic.IdFormItem {...this.props as any} formItemLayout={ElementDic.formItemLayout} /> : null}

        <ElementDic.NameFormItem {...this.props as any} formItemLayout={ElementDic.formItemLayout} />

        <ElementDic.SceneMapIDFormItem {...this.props as any} formItemLayout={ElementDic.formItemLayout} />

        <FormItem {...ElementDic.tailFormItemLayout}>
        <Button onClick={() => this.props.displayModalForm(false)}>Cancel</Button>&nbsp;&nbsp;
        <Button type="primary" htmlType="submit" loading={this.props.data.isLoading}>Submit</Button>
        </FormItem>
        {/*@TagEnd@RenderBlock@@*/}
      </Form>
    )
  }
}

export function createSceneMainForm(): React.ComponentClass<any> {
  const form: any = SceneMainForm
  return Form.create<any>()(form)
}
