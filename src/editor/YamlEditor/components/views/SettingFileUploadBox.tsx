import * as React from "react";
import { SrUploadList } from "./SrUploadList";
import { SrDropBox } from "./SrDropBox";
import { FileUploadBox, FileUploadBoxProps, FileUploadBoxState } from "./FileUploadBox";

export class SettingFileUploadBox extends FileUploadBox<FileUploadBoxProps, FileUploadBoxState> {
  constructor(props: any, context?: any) {
    super(props, context)
  }

  render() {
    const hasFile = this.state.fileList && this.state.fileList.length > 0
    return (
      <div>
          <SrDropBox onFileScanEnd={(list: File[]) => this.onFileScanEnd(list)} accept={ /image\/*|json\/*|(^$)/ } disable={this.state.uploading} />
          <br/>
          { hasFile ?
          <SrUploadList list={this.state.fileList} onCancel={(index: number) => this.onCancel(index)}
            onReupload={(index: number) => this.onReupload(index)} />
            : null }
      </div>
    )
  }
}
