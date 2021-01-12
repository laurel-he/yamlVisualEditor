import * as React from "react";
import { SrUploadList } from "./SrUploadList";
import { SrDropBox } from "./SrDropBox";
import { FileUploadBox, FileUploadBoxProps, FileUploadBoxState } from "./FileUploadBox";
import { ImageUrlFormator } from "src/systems/clusterCtrl/common/utils/ImageUrlFormator";
import { BackendSceneListBlockItemListFiles } from "src/systems/kzBackend/Scene/modules/dataDefine";
import { JpImage, JpImg } from "src/utils/common/JpImage";
interface ThumbUploadBoxProps extends FileUploadBoxProps {
  thumb: BackendSceneListBlockItemListFiles
}
export class ThumbUploadBox extends FileUploadBox<ThumbUploadBoxProps, FileUploadBoxState> {
  constructor(props: any, context?: any) {
    super(props, context)
  }

  render() {
    const thumb = this.props.thumb
    return (
      <SrDropBox onFileScanEnd={(list: File[]) => this.onFileScanEnd(list)} accept={/image\/*/i} disable={this.state.uploading}>
        { thumb ? <JpImg width='100%' src={ImageUrlFormator.url300(thumb.url, thumb.lastUpdate)}/> : <span style={{
          fontSize: 12,
          margin: 20,
          color: 'rgba(0,0,0,.45)'
        }}>拖拽上传场景样片</span> }
      </SrDropBox>
    )
  }
}
