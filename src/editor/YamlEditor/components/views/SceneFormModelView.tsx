import * as React from 'react';
import { Tag, Badge } from 'antd'
import { Modal, Button } from 'antd';
import { createSceneMainForm } from './SceneMainForm';
import { AbstractProps } from 'src/utils/common/defines';
/*@TagStart@ImportBlock@@*/
// import block
/*@TagEnd@ImportBlock@@*/
class SceneFormModelView extends React.Component <AbstractProps, any > {

    render() {
      const customs = this.props.data.customs
      if ( ! this.props.data.formShowUp ) return null
      const WrappedRegistrationForm = createSceneMainForm()
      return <Modal
        visible={true}
        title={customs.sceneForEdit ? ('编辑场景 ' + customs.sceneForEdit.name) : "创建场景"}
        onCancel={() => this.props.displayModalForm(false)}
        footer={null}
        maskClosable={false}
      >
        <WrappedRegistrationForm {...this.props}/>
      </Modal>
    }
}

export default SceneFormModelView

/*@TagStart@CodeEndBlock@@*/
// Code block
/*@TagEnd@CodeEndBlock@@*/
