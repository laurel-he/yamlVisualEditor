import * as React from 'react';
import { AnonymousDynaimicReq } from 'src/utils/dynamic/anonymous';
import { showErrorNotification } from 'src/utils/dynamic';
import { IconJson } from 'src/utils/common/showJsonView';
import { List, Popconfirm, message, Tag, Button, Divider } from 'antd';
import { DateTimeRenderer } from 'src/utils/common/customlizedTableRender';
import { SettingFileUploadBox } from './SettingFileUploadBox';
import { UploadFileInfo } from './BaseFileUploadBox';
import { Authorization } from 'src/systems/clusterCtrl/common/utils/Authorization';
import { UploadStatus } from 'src/systems/bibisender/common/UploadListView';
import { ImageUrlFormator } from "src/systems/clusterCtrl/common/utils/ImageUrlFormator";
import Promise, { resolve, reject } from 'bluebird';
import { parseSettingFiles } from '../photoInfo';
import { formatQiniuUrl, getPrivateUrl } from 'src/utils/common/JpImage';
import {BackendSceneListBlockItemList, BackendSceneListBlockItemListFiles} from 'src/systems/kzBackend/Scene/modules/dataDefine';
import {backendSceneUpdateBind } from 'src/systems/kzBackend/common/api/index'
import { AbstractProps } from 'src/utils/common/defines';
import { SceneFromModel } from 'src/systems/kzBackend/SceneRaw/components/form/SceneFrom'
import { JpImg } from "src/utils/common/JpImage";
import { sceneToStore } from "src/systems/kzBackend/SceneGroupManager/components/table/SceneToStore"

interface SceneDetailProps extends AbstractProps {
    sceneId: string
    onSceneRefreshCallback: () => any
}

interface SceneDetailState {
    detail?: BackendSceneListBlockItemList
    sceneId: string
    loading?: boolean
    sceneShow?: boolean,
    sceneUseData?: boolean
}

interface JsonInfo {
    isJson: boolean,
    contents?: string
}

const TABLE_NAME = 'scene'
const BUCKET_NAME = 'jiapin'
const SCENE_MAMANGER_TABLE = 'scene_manager'
export class SceneDetail extends React.Component < SceneDetailProps, SceneDetailState > {

    constructor(props: SceneDetailProps, context?: any) {
        super(props, context)
        this.state = {sceneId: props.sceneId, sceneShow: false , sceneUseData: true}
    }

    componentDidMount() {
        this.fetchSceneDetail(this.state.sceneId)
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<SceneDetailProps>) {
        if ( this.state.sceneId === nextProps.sceneId) return
        this.setState({sceneId: nextProps.sceneId})
        this.fetchSceneDetail(nextProps.sceneId)
    }

    fetchSceneDetail(sceneId: string) {
        if ( ! sceneId ) {
            this.setState({detail: null, loading: false})
            return
        }
        this.setState({loading: true})
        const req = new AnonymousDynaimicReq(TABLE_NAME)
        return req.dynamicFindById( sceneId ).then( (data: BackendSceneListBlockItemList) => {
            this.setState({detail: data, loading: false})
            this.props.applyCustomStateChange({detail: data})
        }).catch( () => {
            this.setState({loading: false})
            // 删除的时候会报错误, 需要忽略
            // showErrorNotification(err)
        });
    }

    renderThumb(detail?: BackendSceneListBlockItemList) {
      const data = detail as any;
      if (!data.sceneManager) {
        return <div><span>无样片展示</span><br/></div>
      }
      const lastTime = data.sceneManager.lastUpdate ? data.sceneManager.lastUpdate : 123456;
      return <div><JpImg width='100%' src={ImageUrlFormator.url300(data.sceneManager.url, lastTime)}/><br/></div>
    }

    get settingFiles(): string[] {
        if ( ! this.state.detail ) return []
        return parseSettingFiles(this.state.detail.settingFiles)
    }
    onHandleSettingFileDel(file: BackendSceneListBlockItemListFiles) {
        this.setState({loading: true})
        const detail = this.state.detail
        const req = new AnonymousDynaimicReq(TABLE_NAME)
        const settingFiles = this.settingFiles.filter( name => name !== file.name )
        const files = detail.files.filter( item => item.name !== file.name)
        const updates: Partial<BackendSceneListBlockItemList> = {
            _id: detail._id,
            settingFiles,
            files,
        }
        return req.dynamicUpdate( updates as any ).then( (data) => {
            message.success(`删除成功:${file.name}`);
            return this.fetchSceneDetail(this.state.sceneId)
        }).catch(err => {
            showErrorNotification(err)
        });
    }

    readJsonContents(file: File): Promise<JsonInfo> {
        return new Promise((resolve, reject) => {
            if (file.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const contents: string = reader.result as string;
                    resolve({
                        isJson: true,
                        contents
                    })
                }
                reader.readAsText(file);
            } else {
                resolve({
                    isJson: false
                })
            }
        })
    }

    updateBind(storeId: string) {
      backendSceneUpdateBind({storeId: storeId}).then((data) => {
        if (data.data) {
          message.success('更新成功')
          this.props.refresh()
        } else {
          message.error('更新失败')
        }
      })
    }

    onSingleFileUploaded(info: UploadFileInfo): any {
        this.setState({loading: true})
        const detail = this.state.detail
        return this.readJsonContents(info.file).then((jsonInfo: JsonInfo) => {
            const settingFiles = this.settingFiles
            if ( settingFiles.indexOf(info.name) === -1 ) {
                settingFiles.push(info.name)
            }
            const files = (detail.files || []).filter( item => item.name !== info.name)
            files.push( {
                name: info.name,
                url: jsonInfo.isJson ? null : info.fullUrl,
                size: info.file.size,
                lastUpdate: info.file.lastModified,
                etag: '',
                editor: Authorization.userName,
                contents: jsonInfo.isJson ? jsonInfo.contents : null
            } )
            return this.updateScene(settingFiles, files)
        }).catch(err => showErrorNotification(err));
    }

    updateScene(settingFiles, files) {
        const detail = this.state.detail
        const req = new AnonymousDynaimicReq(TABLE_NAME)
        const updates: Partial<BackendSceneListBlockItemList> = {
            _id: detail._id,
            settingFiles,
            files,
        }
        return req.dynamicUpdate( updates as any ).then( (data) => {
            // message.success(`上传成功:${info.name}`);
            return data
        }).then( () => this.fetchSceneDetail(detail._id))
    }

    delScene() {
      this.setState({loading: true})
      const detail = this.state.detail as any
      const req = new AnonymousDynaimicReq(TABLE_NAME)
      const mamangerReq = new AnonymousDynaimicReq(SCENE_MAMANGER_TABLE)
      return req.dynamicDelete(detail._id).then((data) => {
        message.success(`删除成功:${detail.name}`);
        if (detail.sceneManager) {
          mamangerReq.dynamicFindById(detail.sceneManager.sceneId).then((data) => {
             const data2 = data as any
            if (data2 && data2.storeId === detail.storeId) {
              mamangerReq.dynamicDelete(detail.sceneManager.sceneId).then((result) => {
                this.props.onSceneRefreshCallback()
              }).catch(err => {
                this.props.onSceneRefreshCallback()
              })
            } else {
              this.props.onSceneRefreshCallback()
            }
          })
        } else {
          this.props.onSceneRefreshCallback()
        }
      }).catch(err => {
        showErrorNotification(err)
      });
    }

    addNewScene() {
      this.setState({sceneUseData: false, sceneShow: true})
    }

    render() {
        if ( !this.state.detail ) {
          return <div>
            <div style={ styleFlex }>
              <span>未找到该场景</span>
            </div>
            <Button type="primary" size="small" onClick={() => this.addNewScene()}>创建新场景</Button>
            &nbsp;
            <Button type="primary" size="small" onClick={ () => sceneToStore(this.props.refresh, this.state.detail.storeId)}>选择公共场景</Button>
          </div>
        }
        const detail = this.state.detail
        return (
        <div>
        <h2>{detail.name} / {detail.sceneMapID}</h2>
        <div style={ styleFlex }>
          {detail.sceneMapID === "0" ?
            <Button type="primary" size="default" onClick={ () => this.updateBind(this.state.detail.storeId)}>更新绑定</Button> :
            <span>
                <IconJson data={detail} />
              &nbsp;&nbsp;
              <a style={{opacity: 0.4}} onClick={() => {this.setState({sceneUseData: true, sceneShow: true})}}>编辑</a>
              &nbsp;&nbsp;
              <Popconfirm title='删除操作不可逆, 确定要删除?' onConfirm={ () => this.delScene()} okText="确定" cancelText="算了,手抖了">
                    <a style={ {opacity: 0.4} }>删除</a>
                </Popconfirm>
            </span>
          }
          <Button type="primary" size="default" onClick={ () => this.addNewScene()}>创建新场景</Button>
          &nbsp;
          <Button type="primary" size="default" onClick={ () => sceneToStore(this.props.refresh, this.state.detail.storeId)}>选择公共场景</Button>
        </div>
        <br/>
        {this.renderThumb(detail)}
        <br/>
        <div>
        {this.state.detail['lr'] ? <Tag color="green">LR预设</Tag> : <Tag color="gray">LR预设</Tag>} &nbsp;&nbsp;
        配置文件列表</div>
        <br/>
        {this.renderUploadZone(detail)}
        <br/>
        {this.renderFileList(detail)}
          <SceneFromModel key="sceneManager" sceneShow={this.state.sceneShow} props={this.props} data={this.state.detail}
                          changeShow={(e, ref) => this.changeSceneShow(e, ref)}
                          create={this.state.sceneUseData}
                          editData={this.getEditData()}/>
        </div>)
    }

    getEditData() {
      const data = this.state.detail as any
      const storeId = data.storeId;
      const name = data.name ? data.name : null;
      const referImgUrl = data.sceneManager && data.sceneManager.url ? data.sceneManager.url : null;
      const lut = (data.files || []).find(item => item.name === data.sceneFile)
      const lutUrl = lut && lut.url ? lut.url : null
      return {storeId, name, referImgUrl, lutUrl}
    }

    changeSceneShow(enabled: boolean, refresh: boolean) {
      this.setState({sceneShow: enabled})
      if (refresh) {
        this.props.onSceneRefreshCallback()
      }
    }

    openJsonEditor(detail: BackendSceneListBlockItemList, file: BackendSceneListBlockItemListFiles) {
        return new Promise((resolve, reject) => {
            if (file.structuredContent) {
                resolve(file.structuredContent)
            } else if (file.url) {
                getPrivateUrl(file.url).then(data => fetch(data.url))
                .then(res => resolve(res.status === 200 ? res.text() : ''))
            } else {
                resolve('')
            }
        }).then((contents: any) => {
            // console.log(' openJsonEditor', contents)
            this.props.applyCustomStateChange({
            jsonData: {
                name: file.name,
                show: true,
                contents: JSON.stringify(contents) || '',
                onOk: (contents: string) => {
                    const settingFiles = this.settingFiles
                    if ( settingFiles.indexOf(file.name) === -1 ) {
                        settingFiles.push(file.name)
                    }
                    const files = (detail.files || []).filter( val => val.name !== file.name)
                    files.push( {
                        name: file.name,
                        url: null,
                        size: 0,
                        lastUpdate: new Date().valueOf(),
                        etag: '',
                        editor: Authorization.userName,
                        structuredContent: JSON.parse(contents),
                        contents
                    } )
                    return this.updateScene(settingFiles, files).catch(err => showErrorNotification(err))
                }
            }
        })
    })
    }
    openFormEditor(detail: BackendSceneListBlockItemList, file: BackendSceneListBlockItemListFiles) {
        return new Promise((resolve, reject) => {
            if (file.structuredContent) {
                resolve(file.structuredContent)
            } else if (file.url) {
                getPrivateUrl(file.url).then(data => fetch(data.url))
                .then(res => resolve(res.status === 200 ? res.text() : ''))
            } else {
                resolve('')
            }
        }).then((contents: any) => {
            // console.log('openJsonEditor', JSON.stringify(contents))
            this.props.applyCustomStateChange({
            jsonData: {
                name: file.name,
                showForm: true,
                contents: JSON.stringify(contents) || '',
                onOk: (contents: string) => {
                    const settingFiles = this.settingFiles
                    if ( settingFiles.indexOf(file.name) === -1 ) {
                        settingFiles.push(file.name)
                    }
                    const files = (detail.files || []).filter( val => val.name !== file.name)
                    files.push( {
                        name: file.name,
                        url: null,
                        size: 0,
                        lastUpdate: new Date().valueOf(),
                        etag: '',
                        editor: Authorization.userName,
                        structuredContent: JSON.parse(contents),
                        contents
                    } )
                    return this.updateScene(settingFiles, files).catch(err => showErrorNotification(err))
                }
            }
        })
    })
    }

    renderFileList(detail?: BackendSceneListBlockItemList ) {
        const settings = this.settingFiles
        // const list: BackendSceneListBlockItemListFiles[] = settings.map( item => detail.files.find(file => file.name === item)).filter( item => !!item)
        //name !== detail.sceneFile
        const list: BackendSceneListBlockItemListFiles[] = (detail.files || []).filter( file => file !== null )
        return (
            <List itemLayout="horizontal" loading={this.state.loading} dataSource={list} renderItem={ (item: BackendSceneListBlockItemListFiles) => (
                <List.Item>
                    <div style={{width: '100%'}} key={item.name}>
                        <div style={styleFlex}>
                            <div>
                            {
                                item.contents || /^.*\.json$/i.test(item.name)
                                ? <a onClick={() => this.openJsonEditor(detail, item)}>{item.name}</a>
                                : <a href={formatQiniuUrl(item.url)} target='_blank'>{item.name}</a>
                            }
                            {
                                (item.name === 'params.json') ? <a onClick={() => this.openFormEditor(detail, item)}>&nbsp;&nbsp;编辑</a> : ''
                            }
                            </div>
                            <div>
                            <Popconfirm title='删除操作不可逆, 确定要删除?' onConfirm={ () => this.onHandleSettingFileDel(item)} okText="确定" cancelText="算了,手抖了">
                                <a style={ {opacity: 0.4} }>删除</a>
                            </Popconfirm>
                            </div>
                        </div>
                        <div style={styleFlex}>
                            <div>{item.editor}</div>
                            <div><DateTimeRenderer data={item.lastUpdate} /></div>
                        </div>
                    </div>
                </List.Item>
            )} />
        );
    }
    renderUploadZone(detail?: BackendSceneListBlockItemList) {
        return <div><SettingFileUploadBox hashInKey={true} bucketName={BUCKET_NAME} sceneId={detail._id} sceneMapID={detail.sceneMapID}
            onSingleFileUploaded={ (info) => this.onSingleFileUploaded(info)}
            onUploadComplete={ (list) => {
                this.fetchSceneDetail(detail._id)
                const failCount = list.filter(item => item.status !== UploadStatus.uploaded ).length
                const doneCount = list.length - failCount
                message.success( failCount > 0 ? `上传成功:${doneCount}, 上传失败:${failCount}` : `全部上传完成:${doneCount}`)
            }} /></div>
    }
}

const styleFlex = {fontSize: 12, width: '100%', color: '#888888', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}
