import * as React from "react";
import { SrUploadList } from "./SrUploadList";
import { SrDropBox } from "./SrDropBox";
import { FileUploadBox, FileUploadBoxProps, FileUploadBoxState } from "./FileUploadBox";
import { ModuleProps, ModuleData } from 'src/systems/kzBackend/SceneRaw/modules';
import { UploadListFileItem } from "src/systems/bibisender/common/UploadListView";
import { sceneFileNameFormat } from "../photoInfo";
import { Alert } from "antd";

interface SceneRawUploadBoxProps extends FileUploadBoxProps {
  fileThatAlreadyExists: ModuleData[]
}
interface SceneRawUploadBoxState extends FileUploadBoxState {
  // -
}
export class SceneRawUploadBox extends FileUploadBox<SceneRawUploadBoxProps, SceneRawUploadBoxState> {
  constructor(props: any, context?: any) {
    super(props, context)
  }

  render() {
    const hasFile = this.state.fileList && this.state.fileList.length > 0
    return (
      <div>
          { this.state.uploading ? <Alert
            message="请注意"
            description="文件上传过程中不能有其他操作, 否则容易造成上传失败"
            type="warning"
          /> : <SrDropBox onFileScanEnd={(list: File[]) => this.onFileScanEnd(list)} disable={this.state.uploading} title='拖拽文件或文件夹,上传测试图' /> }
          <br/>
          { hasFile ?
          <SrUploadList list={this.doFileFilter(this.state.fileList)} onCancel={(index: number) => this.onCancel(index)}
            onReupload={(index: number) => this.onReupload(index)} />
            : null }
      </div>
    )
  }
  doFileFilter(fileList: UploadListFileItem[]): UploadListFileItem[] {
    const fileExists: string[] = this.props.fileThatAlreadyExists.map( item => sceneFileNameFormat(item.file.name) )
    return fileList.filter( item => fileExists.indexOf(item.file.name) === -1 )
  }
}
