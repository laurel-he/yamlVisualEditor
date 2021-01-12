import * as React from "react";
import { UploadListView, UploadListFileItem, UploadStatus } from "src/systems/bibisender/common/UploadListView";
import { List, Button, Skeleton, Progress, Tooltip } from "antd";
export class SrUploadList extends UploadListView {
  constructor(props) {
    super(props)
  }

  renderListItem(item: UploadListFileItem, index: number) {
    const progressStatus = item.status === UploadStatus.uploaded ? 'success' : item.status === UploadStatus.error ? 'exception' : 'active'
    return <List.Item>
        <Skeleton avatar title={false} loading={false} active>
          <List.Item.Meta
            // avatar={<Avatar icon="picture" size="small" style={{backgroundColor: "#37b941"}} />}
            title={
              <span style={{fontSize: 10}}>
              #{index}&nbsp;
              {item.file.name}
              {item.status === UploadStatus.error ? <Tooltip title={item.error.message}><span style={{color: 'red'}}>上传出错</span></Tooltip> : null}
            </span>}
            description={item.status === UploadStatus.cancel ? null : <Progress size="small" strokeWidth={2} percent={item.progress} status={progressStatus} />}
          />
          {item.status === UploadStatus.error || item.status === UploadStatus.cancel ? <Button size="small" onClick={() => this.props.onReupload(index)}>重试</Button> : null}
        </Skeleton>
      </List.Item>
  }
}
