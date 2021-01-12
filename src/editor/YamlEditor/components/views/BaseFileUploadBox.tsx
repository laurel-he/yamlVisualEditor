import * as React from "react";
import Promise from "bluebird";
import { UploadTokenCache } from 'src/utils/common/customlizedFormItem/upload/UploadTokenCache';
import { BackendUploadGetTokenBlock } from "src/utils/dynamic";
import { SrDropBox } from "./SrDropBox";
import { UploadStatus, UploadListFileItem } from "src/systems/bibisender/common/UploadListView";
import * as CryptoJS from 'crypto-js'
export interface BaseFileUploadBoxProps {
  bucketName: string
  hashInKey?: boolean
  onUploadComplete?: (files: UploadListFileItem[]) => void
  onSingleFileUploaded?: (info: UploadFileInfo) => any
}
export interface BaseFileUploadBoxState {
  tokenFetcher?: UploadTokenCache
  pendingCount?: number
  isDragActive: boolean
  fileList: UploadListFileItem[]
  uploading: boolean
}

export interface UploadFileInfo {
  key: string
  file: File
  name: string
  fullUrl: string
  item: UploadListFileItem
}

interface QiniuUploadResp {
  hash: string,
  key: string
}

export abstract class BaseFileUploadBox<P extends BaseFileUploadBoxProps, S extends BaseFileUploadBoxState> extends React.Component <P, S> {
  state: S = {
    tokenFetcher: new UploadTokenCache(),
    isDragActive: false,
    fileList: [],
    uploading: false
  } as any

  constructor(props: P, context?: any) {
    super(props, context)
  }

  componentWillUnmount() {
    this.state.tokenFetcher.cancel()
  }

  abstract getFilename(file: string, hash?: string): string;

  getUploadKey(file: File): Promise<string> {
    if ( ! this.props.hashInKey ) {
      return Promise.resolve(this.getFilename(file.name))
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents: string = reader.result as string;
        const hash = CryptoJS.MD5(CryptoJS.lib.WordArray.create(contents));
        resolve(this.getFilename(file.name, '' + hash))
      }
      reader.readAsArrayBuffer(file);
    })
  }

  /**
   * 有新文件列表加入
   * @param list File[]
   */
  onFileScanEnd(list: File[]) {
    const tempList: UploadListFileItem[] = list.map( file => this.fileToUploadListFileItem(file)).sort((a , b) => a.file.name > b.file.name ? 1 : -1)
    const fileList = [...this.state.fileList, ...tempList]
    this.setState({fileList, pendingCount: fileList.length},
      () => !this.state.uploading && this.startUpload())
  }

  fileToUploadListFileItem(file: File): UploadListFileItem {
    return {
      file: file,
      status: UploadStatus.pending,
      progress: 0,
      url: ''
    }
  }

  /**
   * 取消上传
   * @param index number
   */
  onCancel(index: number) {
    //
  }

  /**
   * 文件上传到七牛
   * @param file 文件资源
   * @param onProgress 上传进度回调
   */
  fileUpload(token: BackendUploadGetTokenBlock, file: File, onProgress: (event: ProgressEvent) => void): Promise<QiniuUploadResp> {
    if ( !file.size ) {
      return Promise.reject(new Error('文件大小为零'))
    }
    // console.log('fileUpload', file)
    if (file.type === 'application/json') {
      return Promise.resolve({key: null, hash: null})
    }
    return this.getUploadKey(file).then( key => new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://up.qbox.me/', true )
      const formData = new FormData();
      formData.append("file", file);
      formData.append('token', token.token);
      formData.append('key', key)
      formData.append('fname', file.name)

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            resolve(JSON.parse(xhr.responseText))
          } catch (error) {
            reject(error)
          }
        } else if ( xhr.status === 614 ) {
          resolve({key: key, hash: null})
        } else {
          reject(new Error(xhr.responseText || xhr.statusText))
        }
      }
      xhr.onerror = reject
      xhr.upload.onprogress = onProgress; // 上传进度
      xhr.send(formData)
    }))
  }

  /**
   * 开始上传图片
   */
  startUpload() {
    this.setState({uploading: true})
    const list: UploadListFileItem[] = Object.assign([], this.state.fileList);
    const pending: UploadListFileItem[] = list.filter(item => item.status === UploadStatus.pending)
      .sort((a , b) => a.file.name > b.file.name ? 1 : -1)
    let uploadToken: BackendUploadGetTokenBlock = null
    Promise.each(pending, (item: UploadListFileItem) => this.state.tokenFetcher.getTokenData(this.props.bucketName)
      .then( token => {
        uploadToken = token
        item.status = UploadStatus.uploading
        this.setState({fileList: list})
        // 上传图片到七牛
        return this.fileUpload(token, item.file, (event) => {
          if (event.lengthComputable) {
            let par = (100 * event.loaded / event.total).toFixed(2)
            item.progress = Number(par)
            this.setState({fileList: list})
          }
        })
      }).then((data: QiniuUploadResp) => {
        item.url = uploadToken.host + data.key
        const info: UploadFileInfo = {
          key: data.key,
          file: item.file,
          name: item.file.name,
          fullUrl: uploadToken.host + data.key,
          item
        }
        return this.props.onSingleFileUploaded ? this.props.onSingleFileUploaded(info) : null
      }).then(data => {
        item.status = UploadStatus.uploaded
        const pendingCount = this.state.pendingCount - 1
        this.setState({fileList: list, pendingCount})
      }).catch(reason => {
        item.status = UploadStatus.error
        item.error = reason
        const pendingCount = this.state.pendingCount - 1
        this.setState({fileList: list, pendingCount})
      })) // Promise.each
      .then( () => {
        const fileList = list.filter(item => item.status !== UploadStatus.uploaded)
        this.setState({uploading: false, pendingCount: fileList.length, fileList})
        this.props.onUploadComplete(list)
      })
  }

  /**
   * 重试上传失败的图片
   * @param index number
   */
  onReupload(index: number) {
    if (!this.state.uploading) {
      this.startUpload()
    }
  }

  render() {
    return (
      <div>
          <SrDropBox onFileScanEnd={(list: File[]) => this.onFileScanEnd(list)} disable={this.state.uploading} />
      </div>
    )
  }
}
