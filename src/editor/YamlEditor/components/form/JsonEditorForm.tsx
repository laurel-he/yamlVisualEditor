///<reference path="../../../../../utils/thirdParty/monaco-editor/monaco.d.ts"/>
import { MonacoProviderService } from 'src/utils/thirdParty/monaco-editor/MonacoProviderService';
import { MonacoEditorConfig } from 'src/utils/thirdParty/monaco-editor/MonacoEditorConfig';
import YamlEditorView from 'src/systems/IaaS/K8sDeployment/components/form/YamlEditorView';
import * as React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Row, Col } from 'antd';
import {HighPassForm} from './HighPass'
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import modules from '../data/modules'

interface JsonEditorProps extends FormComponentProps {
  value: object,
  transferMsg: any,
  cancle: any
}
interface ResValueProps {
  name: string,
  show: boolean,
  chinese: string,
  type: string,
  id: number,
  route: string,
  child: object,
  /** 映射表字段 */
  abridge?: string,
  /** 参数类型 */
  scalar?: string,
  /** 同时保存参数，例如右侧脸 */
  associat?: string,
  /** 多字段控制参数，例如锐化 */
  related?: object
}
// apid
class JsonEditorForm extends React.Component <JsonEditorProps, any > {
  constructor(props) {
    super(props)
    this.state = {
      initVersion: 0,
      lastVersion: 0,
      currentVersion: 0,
      undoable: false,
      redoable: false,
      loadingEditor: false,
    }
  }

  get elementId() {
    return 'JsonEditorView'
  }

  routesValue: Map<string, string> = new Map()
  /** 格式化初始数据 */
formatJsonData = (obj: any, name: string, moduleName?: string, getModuleName?: string): any[] => {
  const arr: any[] = []
    if (Object.keys(obj)) {
      let keys = Object.keys(obj);
      let i = 0;
      return keys.map((items) => {
        i++;
        if (obj[items] instanceof Object) {
          let itemRes = items;
          if (obj[items]['type']) {
            itemRes = obj[items]['type'];
          }
          const names = name + '=' + itemRes
          return this.formatJsonData(obj[items], names, moduleName);
        } else {
          const resItems = name + '=' + items;
          this.routesValue.set(resItems, obj[items])
          if (getModuleName && resItems === getModuleName) {
            return obj[items];
          }
        }
      });
    }
    return arr
}

  /** 根据启用的模块配置展示 */
  getForm (contens: any): any[] {
    const ifNull = !contens;
    const view = [];
    if (ifNull === false) {
      const res = JSON.parse(contens)
      this.formatJsonData(res, 'data')
      const list = res.params.list;
      view.push (
        <HighPassForm key="hightPassForm" {...this.props} value={this.routesValue}/>
      );
    }
    return view;
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const setSameValueRes = this.setSameValueIfRightParams(values)
        this.props.transferMsg(setSameValueRes);
      }
    });
  };
  setSameValueIfRightParams(value: object) {
    const moduleParams: ResValueProps[] = modules.modules;
    moduleParams.forEach((menuParam) => {
      if (menuParam.associat) {
        const route = menuParam.route
        const associat = menuParam.associat
        value[associat] = value[route]
      }
    })
    return value
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 32 },
        sm: { span: 20 },
      },
    };
    return (
      <Form key="login-form" {...formItemLayout} className="login-form" id={this.elementId} onSubmit={this.handleSubmit} >
      {this.getForm(this.props.value || null)}
      <Form.Item key="submit-form">
      <Row key="submit-form-row">
          <Col key="submit-form-col" style={{ textAlign: 'right' }}>
            <Button key="submit-form-button" type="primary" htmlType="submit">
              ok
            </Button>
          </Col>
        </Row>
        </Form.Item>
    </Form>);
  }
}
export default function createMainForm(): React.ComponentClass<any> {
  const form: any = JsonEditorForm
  return Form.create<any>()(form)
}
