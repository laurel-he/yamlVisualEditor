import * as React from "react";
import { DropBoxBase, DropBoxProps, DropBoxState } from "src/systems/bibisender/common/DropBox";
import { InboxOutlined } from '@ant-design/icons';

export class SrDropBox extends DropBoxBase<DropBoxProps, DropBoxState> {
  constructor(props) {
    super(props)
    // console.log('SrDropBox', this.state)
  }

  renderIcon() {
    return (
      <p style={{
              fontSize: 12,
              marginTop: 16,
              color: 'rgba(0, 0, 0, 0.45)'
      }}>
        <InboxOutlined style={{ color: '#40a9ff' }} />{!this.props.title ? '拖动文件到此区域进行上传' : this.props.title}
      </p>
    );
  }

  render() {
    return <div
      style={ DropBoxBase.containerInactive}
      onDragLeave={(event) => !this.props.disable && this.onDragLeaveHandler(event)}
      onDragOver={(event) => !this.props.disable && this.onDragOverHandler(event)}
      onDrop={(event) => !this.props.disable && this.onDropHandler(event)}
      >
      {
        this.state.scanning ? this.renderScanningNotice() : (this.props.children || this.renderIcon())
      }
    </div>
  }
  renderScanningNotice(): React.ReactNode {
    return <p style={{
      fontSize: 12,
      marginTop: 16,
      color: 'rgba(0,0,0,.45)'
    }}>正在扫描{this.state.fileCount}个候选文件/文件夹</p>
  }
}
