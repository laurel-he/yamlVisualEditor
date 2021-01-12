import * as React from "react";
import { BaseFileUploadBox, BaseFileUploadBoxProps, BaseFileUploadBoxState } from "./BaseFileUploadBox";
export interface FileUploadBoxProps extends BaseFileUploadBoxProps {
  sceneId: string
  sceneMapID: string
}
export interface FileUploadBoxState extends BaseFileUploadBoxState {

}

export class FileUploadBox<P extends FileUploadBoxProps, S extends FileUploadBoxState> extends BaseFileUploadBox <P, S> {

  getFilename(name: string, hash?: string) {
    if (!hash || hash.trim().length === 0) {
      hash = '' + new Date().getTime()
    } else {
      hash = 'MD5' + hash
    }
    return `changjing/${this.props.sceneId}/${this.props.sceneMapID}/${name}/${hash}/${name}`
  }

}
