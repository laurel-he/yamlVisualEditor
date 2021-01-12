import * as React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, message } from 'antd';
import JsonEditorView from './JsonEditorView';
import createMainForm from './JsonEditorForm';
import { AbstractProps } from 'src/utils/common/defines';
interface JsonEditorModalProps extends AbstractProps {
}

export class FormEditorModal extends React.Component<JsonEditorModalProps, any> {
  constructor(props: JsonEditorModalProps) {
    super(props)
    // this.refs = React.createRef();
  }

  editorView: JsonEditorView
  get customs() {
    return this.props.data.customs
  }
  state = {
    msg: 'start',
    cancle: true,
  };
transferMsg(msg) {
  this.setState({
    msg
  });
  const resObj = this.changeContens(this.customs.jsonData.contents, msg);
  this.props.applyCustomStateChange({jsonData: {show: false}})
  this.customs.jsonData.onOk && this.customs.jsonData.onOk(JSON.stringify(resObj, null, 4));
}
cancle(cancle) {
  this.setState({
    cancle
  });
  this.props.applyCustomStateChange({jsonData: {showForm: false}})
}
/** 需要优化!!! */
changeContens(contents: string, msg: any) {
  const res = contents;
  let resObj = JSON.parse(res)
  for (let items in msg) {
    const value = msg[items]
    let ret = items.split('=')
    let resData = (typeof value === 'boolean') ? value : Number(value)
    // 由于age一栏里有type属性，需要替换
    if (ret[3] === 'age') {
      ret[3] = 'yeHua'
    }
    switch (ret.length) {
      case 2:
          resObj[ret[1]] = resData;
        break;
      case 3:
          resObj[ret[1]][ret[2]] = resData;
        break;
      case 4:
          resObj[ret[1]][ret[2]][ret[3]] = resData;
        break;
      case 5:
          resObj[ret[1]][ret[2]][ret[3]][ret[4]] = resData;
        break;
      default:
        alert('层级超长！请联系技术人员修改代码');
        break;
    }
  }
    return resObj;
}
  render() {
    const JsonEditorForm = createMainForm()
    if (this.customs.jsonData.name === 'params.json') {
      return (
        <Modal
          title={`编辑 ${this.customs.jsonData.name || ''}`}
          visible={this.customs.jsonData.showForm}
          width="90%"
          footer={null}
          onCancel={() => this.props.applyCustomStateChange({jsonData: {show: false}})}
        >
        <JsonEditorForm {...this.props} value={this.customs.jsonData && this.customs.jsonData.contents || null} transferMsg = {msg => this.transferMsg(msg)} cancle = {cancle => this.cancle(cancle)}/>
        </Modal>
      )
    } else {
      return (
        <Modal
          title={`编辑 ${this.customs.jsonData.name || ''}`}
          visible={this.customs.jsonData.show}
          width="90%"
          onOk={() => {
            this.props.applyCustomStateChange({jsonData: {show: false}})
            this.customs.jsonData.onOk && this.customs.jsonData.onOk(this.editorView.editor.getValue());
          }}
          onCancel={() => this.props.applyCustomStateChange({jsonData: {show: false}})}
        >
        <JsonEditorView value={this.customs.jsonData && this.customs.jsonData.contents || null} ref={ref => this.editorView = ref} />
        </Modal>
      )
    }
  }
}
