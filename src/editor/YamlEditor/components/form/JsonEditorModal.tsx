import * as React from 'react';
import { Button, Modal } from 'antd';
import JsonEditorView from './JsonEditorView';
import { AbstractProps } from 'src/utils/common/defines';

interface JsonEditorModalProps extends AbstractProps {
}

export class JsonEditorModal extends React.Component<JsonEditorModalProps, any> {
  constructor(props: JsonEditorModalProps) {
    super(props)
  }

  state = {
  }

  editorView: JsonEditorView

  get customs() {
    return this.props.data.customs
  }

  render() {
    return (
      <Modal
        title={`编辑 ${this.customs.jsonData.name || ''}`}
        visible={this.customs.jsonData.show}
        width="90%"
        onOk={() => {
          this.props.applyCustomStateChange({jsonData: {show: false}})
          this.customs.jsonData.onOk && this.customs.jsonData.onOk(this.editorView.editor.getValue())
        }}
        onCancel={() => this.props.applyCustomStateChange({jsonData: {show: false}})}
      >
        <JsonEditorView value={this.customs.jsonData && this.customs.jsonData.contents || null} ref={ref => this.editorView = ref} />
      </Modal>
    )
  }
}
