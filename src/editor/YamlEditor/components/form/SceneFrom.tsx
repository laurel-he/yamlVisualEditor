import * as React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import * as Antd from 'antd';
import { FormComponentProps, WrappedFormUtils } from '@ant-design/compatible/lib/form/Form';
import { Button } from 'antd';
import * as ElementDic from "src/systems/kzBackend/SceneManager/components/form/MainFormElements";
import { FormItemState } from 'src/utils/common/FormItemBase';
import * as Dynamic from 'src/utils/dynamic';
import pinyin from 'pinyin'
import {Authorization} from "src/systems/clusterCtrl/common/utils/Authorization";

const FormItem = Form.Item;

const FIELDS: string[] = ['_id', 'storeId', 'name', 'referImgUrl', 'lutUrl', ]

export interface MainFormProps {
  editData?: any
  form: WrappedFormUtils
  changeShow: (e: boolean, ref: boolean) => void
  props?: any
  data: any
  create: boolean
}

class MainForm extends React.Component < MainFormProps , any > {

  state: any = {
    confirmDirty: false,
    sceneShow: false,
    loading: false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.props.create) {
      let data = this.props.data;
      const formValues = this.props.form.getFieldsValue();
      const name = formValues.name;
      if (!name) {
        Antd.message.error('场景名称不能为空');
        return
      }
      const lutUrl = formValues.lutUrl;
      const imageUlr = formValues.referImgUrl;
      data.name = formValues.name;
      data.pinyin = this.getPinyin(data.name)
      if (imageUlr) {
        data.sceneManager.url = imageUlr.url
      }
      if (lutUrl) {
        data.files.map((item) => {
          if (item.name === 'lut.png') {
            item.url = lutUrl.url
          }
          return item
        })
      }
      this.update(data)
    } else {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }
        const lutData = values.lutUrl
        const ImgData = values.referImgUrl
        values.lutUrl = values.lutUrl.url;
        values.referImgUrl = values.referImgUrl.url;
        values.pinyin = this.getPinyin(values.name)
        values.route && values.route[0] !== '/' && (values.route = '/' + values.route)
        Object.keys(values).filter(key => values[key] && (typeof (values[key]) === 'string')).forEach(key => values[key] = values[key].trim())
        this.create(values, lutData, ImgData)
      });
    }
  }

  update = (data: any) => {
    this.setState({loading: true})
    Dynamic.dynamicUpdate('scene', data).then(data => {
      this.setState({loading: false})
      Antd.message.success('更新成功')
      this.props.changeShow(false, true)
    }).catch(err => {
      Antd.message.error('失败:' + err.toString())
      this.setState({loading: false})
    })
  }

  getPinyin(name: string): string {
    const py: string[][] = pinyin(name, {style: pinyin.STYLE_INITIALS}) || [[]]
    const p: string = (py.map(item => item ? item.join('') : '').join('') + 'a').toUpperCase()
    return p[0]
  }

  create = (data: any, lutData: any, ImgData: any) => {
    this.setState({loading: true})
    Dynamic.dynamicCreate('scene_manager', data).then(result => {
      const lastUpdate = (new Date()).valueOf();
      let sceneData = {
        "name": data.name,
        "sceneMapID": result._id,
        "pinyin": this.getPinyin(data.name),
        "storeId": this.props.form.getFieldValue('storeId'),
        "sceneManager": {
          "sceneId": result._id,
          "url": ImgData.url,
          "lastUpdate": lastUpdate,
          "pinyin": this.getPinyin(data.name)
        },
        "files": [
          {
            "name": 'lut.png',
            "url": lutData.url,
            "size": lutData.size,
            "lastUpdate": lastUpdate,
            "etag": "",
            "editor": Authorization.userName
          }
        ],
        "settingFiles": ['lut.png'],
        "sceneFile": 'lut.png'
      }
      Dynamic.dynamicCreate('scene', sceneData as any).then(data => {
        this.setState({loading: false})
        Antd.message.success('创建成功')
        this.props.changeShow(false, true)
      }).catch(err => {
        this.setState({loading: false})
        Antd.message.success('失败:' + err.toString())
      })
    }).catch(err => {
      this.setState({loading: false})
      Antd.message.success('失败:' + err.toString())
    })
  }

  formCallback = (data: any) => {

  }

  parseFormFields(obj: any, fields: string[]): any {
    const ret = {}
    if ( !obj ) return ret;
    fields.map( key => ret[key] = obj[key])
    return ret;
  }

  createDefaultObj = () => {
    const defaultValue: any = this.props.editData
      ? this.parseFormFields(this.props.editData, FIELDS)
      : {
          'storeId': '',
          'name': '',
          'referImgUrl': '',
          'lutUrl': '',
        }
    return defaultValue;
  }

  componentDidMount() {
    const value: any = this.createDefaultObj();
    this.props.form.setFieldsValue(value)
  }

  onFormValueChanged = (formItemState: FormItemState, event) => {
    const val = this.props.form.getFieldValue(formItemState.propName)
    switch ( formItemState.propName ) {
        case '_id':
          break;
        case 'storeId':
          break;
        case 'name':
          break;
        case 'referImgUrl':
          break;
        case 'lutUrl':
          break;
      default:
        break;
    }
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.props.form.getFieldValue('_id') ? <ElementDic.IdFormItem {...this.props as any} editData={this.props.editData} formItemLayout={ElementDic.formItemLayout} /> : null}

        <ElementDic.StoreIdCustomFormItem {...this.props as any} editData={this.props.editData} formItemLayout={ElementDic.formItemLayout} onChange={this.onFormValueChanged} />

        <ElementDic.NameFormItem {...this.props as any } editData={this.props.editData} formItemLayout={ElementDic.formItemLayout} onChange={this.onFormValueChanged} />

        {this.props.form.getFieldValue('storeId') && this.props.form.getFieldValue('name') ? <ElementDic.LutUrlFormCustomItem {...this.props as any} editData={this.props.editData} formItemLayout={ElementDic.formItemLayout} onChange={this.onFormValueChanged} /> : null}

        {this.props.form.getFieldValue('storeId') && this.props.form.getFieldValue('name') ? <ElementDic.ReferImgUrlFormCustomItem {...this.props as any} editData={this.props.editData} formItemLayout={ElementDic.formItemLayout} onChange={this.onFormValueChanged} /> : null}

        <FormItem {...ElementDic.tailFormItemLayout}>
        <Button onClick={() => this.props.changeShow(false, false)}>取消</Button>&nbsp;&nbsp;
        <Button type="primary" htmlType="submit" loading={this.state.loading}>保存</Button>
        </FormItem>
      </Form>
    )
    // onClick={() => this.props.displayModalForm(false)}
    // loading={this.props.isLoading}
  }
}

export function SceneFrom(): React.ComponentClass<any> {
  const form: any = MainForm
  return Form.create<any>()(form)
}

export interface SceneFromModelProps {
  sceneShow: boolean,
  editData?: any,
  changeShow: (e: boolean, ref: boolean) => void,
  props?: any,
  data: any,
  create: boolean
}

export class SceneFromModel extends React.Component <SceneFromModelProps, any > {
  render() {
    const WrappedRegistrationForm = SceneFrom()
    if (!this.props.sceneShow) return null
    return <Antd.Modal
      visible={this.props.sceneShow}
      title="添加场景"
      onCancel={() => this.props.changeShow(false, false)}
      footer={null}
      maskClosable={false}
    >
      <WrappedRegistrationForm {...this.props} changeShow={((e, ref) => this.props.changeShow(e, ref))}
                               create={!this.props.create}
                               editData={(!this.props.create) ? {storeId: this.props.editData.storeId} : this.props.editData}
                               props={this.props.props}
                               data={this.props.data}/>
    </Antd.Modal>
  }
}
