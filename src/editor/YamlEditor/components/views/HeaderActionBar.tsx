import * as React from "react";
import { ModuleProps, ModuleData } from 'src/systems/kzBackend/SceneRaw/modules';
import { Divider, message, Alert } from "antd";
import { BackendSceneListBlockItemList } from "src/systems/kzBackend/Scene/modules/dataDefine";
import { EnumCascadeSelect } from "../form/MainFormElements";
import { UrlSlash } from "src/utils/UrlSlash";
import Promise from 'bluebird';
import { jiapinApiSceneTestingView,
  jiapinApiSceneTestingAddSceneTestingTask,
  JiapinApiSceneTestingAddSceneTestingTaskRequest,
  JiapinApiSceneTestingAddSceneTestingTaskRequestTaskData
} from "src/systems/clusterCtrl/common/api";
import { sceneFileNameFormat } from "../photoInfo";
import { showErrorNotificationDetailed, showErrorNotification } from "src/utils/dynamic";
import { clusterLocalStore } from "src/systems/clusterCtrl/common/clusterLocalStore";
const md5 = require('blueimp-md5');
interface TestServer {
  /** id */
  _id: string,
  /** 服务器名称 */
  name: string,
  /** 服务器网址 */
  url: string,
  /** 集群id */
  clusterId: string,
}
export interface HeaderActionBarProps extends ModuleProps {
  sceneId: string
  detail?: BackendSceneListBlockItemList
}
interface HeaderActionBarState {
  testServer?: TestServer
  addTaskProgressTotal?: number
  addTaskProgressIndex?: number
  succees?: number
  adding?: boolean
  autoRefreshing?: boolean
  autoRefreshTimer?: any
  countDown?: number
}

const PATH : string = '/ai/watcher/photos/processing';
export class HeaderActionBar extends React.Component<HeaderActionBarProps, HeaderActionBarState> {

  constructor(props: any, context?: any) {
    super(props, context)
    this.state = {
      countDown: 0,
      succees: 0,
      testServer: {
        "_id": "5bed140a1403c3002124a941",
        "clusterId": "00000000-0000-0000-3333-000000000000",
        "name": "场景测试",
        "url": "https://control.aijiapin.com/"
      }
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.autoRefreshTimer)
  }

  UNSAFE_componentWillReceiveProps?(nextProps: Readonly<HeaderActionBarProps>, nextContext: any): void {
    this.triggleFetchStatus(nextProps)
  }

  triggleFetchStatus(nextProps: Readonly<HeaderActionBarProps>) {
    if ( !nextProps.data.customs.detail ) return
    if ( nextProps.data.customs.detail === this.props.data.customs.detail) {
      return
    }
    this.fetchStatus(nextProps.data.customs.detail)
  }

  render() {
    const hasPhotos = this.props.data.list && this.props.data.list.length
    if ( !hasPhotos) {
      return <Alert type='warning' message='请上传测试图片' />
    }

    const settingFiles = this.checkSettingFiles()
    if ( !settingFiles ) {
      return <Alert type='warning' message='请先上传标准片配置文件' />
    }

    const target = this.props.data.list.find( item => item.clusterId && item.groupId ? true : false )
    return (
      <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <span>
           <a onClick={ () => this.addTaskAll()}>全部作图({
             this.state.adding ? ( ( this.state.addTaskProgressTotal - this.state.addTaskProgressIndex) + '/' + this.state.addTaskProgressTotal)
              : (this.props.data.list ? this.props.data.list.length : 0)
            })</a>
          <Divider type='vertical' />
          <a onClick={ () => this.addTaskWitchFailed()}>触发作图({ this.props.data.list ? (this.props.data.list.length - this.state.succees) : 0})</a>
          <Divider type='vertical' />
          <a onClick={ () => this.fetchStatus()}>刷新</a>
          <Divider type='vertical' />
          <a onClick={ () => this.autoFetchStatus()}>{ this.state.autoRefreshing ? `停止刷新${this.state.countDown}` : '自动刷新' }</a>
          <Divider type='vertical' />
          { target ? <a href={`#/clusterCtrl/photos`}
                      onClick={ () => clusterLocalStore.setClusterAndGroup(target.clusterId, target.groupId)}
                      target='_blank'>查看照片</a>
                    : <a style={{color: 'gray'}}>查看照片</a> }
        </span>
        <span>
        <EnumCascadeSelect style={ {width: 200} } cascadeTable='testing_server_config' valueColumn='_id'
            labelColumn='name' value={this.state.testServer && this.state.testServer._id} isReturnObject
            onChange={ (value) => this.onTestingServerChanged(value)} mode='default' placeholder='请选择服务器' allowClear={false} />
        </span>
      </div>
    )
  }

  onTestingServerChanged(value: any): any {
    this.setState({testServer: value})
  }
  autoFetchStatus(): void {
    clearInterval(this.state.autoRefreshTimer)
    if ( this.state.autoRefreshing ) {
      this.setState({autoRefreshTimer: 0, autoRefreshing: false, countDown: 1})
      return
    }
    const autoRefreshTimer = setInterval( () => {
      if ( this.state.countDown >= 5 ) {
        this.setState({countDown: 1})
        this.fetchStatus()
      } else {
        this.setState({countDown: 1 + this.state.countDown})
      }
    }, 1000)
    this.setState({autoRefreshTimer, autoRefreshing: true, countDown: 1})
  }
  fetchStatus(detail = null): void {
    if (!detail) {
      detail = this.props.data.customs.detail
    }
    if (! detail ) return
    if ( !this.state.testServer ) {
      message.warn('没有供刷新的服务器')
      return
    }
    jiapinApiSceneTestingView({query: {clusterId: this.state.testServer.clusterId, groupId: this.getGroupId(detail)}}).then( data => {
      let succees = 0
      const taskStatus: Map<string, string> = new Map<string, string>()
      data.dataList.forEach( item => {
        taskStatus[item.data.fileName] = item.status.status
        taskStatus[sceneFileNameFormat(item.data.filePath)] = item.status.status
        item._id && (taskStatus[item._id] = item.status.status)
        succees += item.status.status === 'done' || item.status.status === 'uploadDebugPhoto' ? 1 : 0
      })
      this.props.applyCustomStateChange({taskStatus})
      this.setState({succees})
      // console.log('jiapinApiSceneTestingView', succees, taskStatus)
    })
  }
  addTaskWitchFailed(): void {
    if ( !this.props.data.list || !this.props.data.list.length) {
      message.warn('没有供刷新的测试文件')
      return
    }
    if ( !this.state.testServer ) {
      message.warn('没有供刷新的服务器')
      return
    }
    if ( !this.props.data.customs.taskStatus ) {
      message.warn('未准备好')
      return
    }

    const settingFiles = this.checkSettingFiles()
    if ( !settingFiles ) {
      message.warn('请先上传标准片配置文件')
      return
    }
    const taskStatus = this.props.data.customs.taskStatus
    const list = this.props.data.list.filter( item => {
      const status: string = (item.photoId ? taskStatus[item.photoId] : taskStatus[sceneFileNameFormat(item.file.name)])
      return ! (status === 'done' || status === 'uploadDebugPhoto')
    })
    if ( !list.length ) {
      message.warn('没有可以作图的图')
      return
    }
    this.setState({adding: true, addTaskProgressIndex: 1, addTaskProgressTotal: this.props.data.list.length})
    Promise.map(list, (item, index) => this.addTask(item, index, this.props.data.list.length), {concurrency: 3} )
      .then( () => this.setState({adding: false}, () => this.props.refresh()) )
      .then( () => this.fetchStatus() )
  }
  addTaskAll(): void {
    if ( !this.props.data.list || !this.props.data.list.length) {
      message.warn('没有供刷新的测试文件')
      return
    }
    if ( !this.state.testServer ) {
      message.warn('没有供刷新的服务器')
      return
    }

    const settingFiles = this.checkSettingFiles()
    if ( !settingFiles ) {
      message.warn('请先上传标准片配置文件')
      return
    }
    this.setState({adding: true, addTaskProgressIndex: 1, addTaskProgressTotal: this.props.data.list.length})
    Promise.map(this.props.data.list, (item, index) => this.addTask(item, index, this.props.data.list.length), {concurrency: 3} )
      .then( () => this.setState({adding: false}, () => this.props.refresh()) )
      .then( () => this.fetchStatus() )
  }

  getGroupId(scene: BackendSceneListBlockItemList): string {
    //  /ai/watcher/photos/processing/5ab39b4d9b3f9e000f33f2b5/翅膀-00/photos/CDA0003443_RE7A9279.CR2
    const path: string = UrlSlash.slash(this.getPathToSave(scene), 'photos');
    return md5(path);
  }

  getPhotoId(scene: BackendSceneListBlockItemList, clusterId: string, fileName: string): string {
    const path: string = UrlSlash.slash(this.getPathToSave(scene), 'photos', fileName);
    return md5(clusterId + '_' + path);
  }

  getPathToSave(scene: BackendSceneListBlockItemList): string {
    return UrlSlash.slash(PATH, scene.storeId, scene.name + "-" + scene.sceneMapID);
  }
  getModeFromTasks(mode: string , tasks: any[]): any {
    if (!tasks)return null;
    return tasks.find( item => item.param.mode === mode)
  }
  addTask(item: ModuleData, index: number, total: number) {
    const clusterId = this.state.testServer.clusterId
    const detail = this.props.data.customs.detail
    const settingFiles = this.checkSettingFiles()
    const taskData: JiapinApiSceneTestingAddSceneTestingTaskRequestTaskData = {
      ...item.photoInfo,
      clusterId,
      filenameMd5: this.getPhotoId(detail, clusterId, item.file.name),
      pathToSave: this.getPathToSave(this.props.detail)
    }
    const req: JiapinApiSceneTestingAddSceneTestingTaskRequest = {
      clusterId,
      scene: detail.sceneMapID,
      sceneFiles: settingFiles.map(item => detail.files.find(file => file.name === item)).filter( item => !!item).map(item => item.url),
      taskData,
      sceneUrl: (detail.files.find(file => file.name === detail.sceneFile) || {} as any).url
    }

    return jiapinApiSceneTestingAddSceneTestingTask(req).then(data => {
      const detail = this.props.data.customs.detail
      const taskQa = this.getModeFromTasks('qa', data.tasks)
				// !sample.thumb && (sample.thumb = UploadDto.HOST+taskQa.param.jpg);
				// sample.jiapin = UploadDto.HOST+taskQa.param.thumb;
      const doc: Partial<ModuleData> = {
        _id: item._id,
        thumb: item.thumb || ( 'https://jiapin.c360dn.com/' + taskQa.param.jpg),
        jiapin: 'https://jiapin.c360dn.com/' + taskQa.param.thumb,
        clusterId: this.state.testServer.clusterId,
        groupId: this.getGroupId(detail),
        photoId: data.photo.filenameMd5,
      }
      this.props.update(doc as any, false, null)
    }).then(data => {
      this.setState({addTaskProgressIndex: index, addTaskProgressTotal: total})
      return data
    }).catch( err => showErrorNotification(err))
  }

  checkSettingFiles(): string[] {
    const detail = this.props.data.customs.detail
    if ( !detail ) return null
    const settingFiles = typeof detail.settingFiles === 'string' ? (detail.settingFiles + '' ).split(':') : detail.settingFiles
    if ( !settingFiles || settingFiles.length === 0 ) {
      return null
    }
    return settingFiles
  }
}
