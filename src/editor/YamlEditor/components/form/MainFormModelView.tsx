import * as React from 'react';
import { Tag, Badge } from 'antd'
import { Modal, Button } from 'antd';
import { createMainForm } from "src/systems/kzBackend/SceneRaw/components/form/MainForm";
import { ModuleProps } from "src/systems/kzBackend/SceneRaw/modules";
/*@TagStart@ImportBlock@@*/
// import block
/*@TagEnd@ImportBlock@@*/
class MainFormModelView extends React.Component <ModuleProps, any > {

    render() {
      if ( ! this.props.data.formShowUp ) return null
      const WrappedRegistrationForm = createMainForm()
      return <Modal
        visible={true}
        title={this.props.data.editData ? ('编辑场景测试原图 ' + this.props.data.editData.raw) : "创建场景测试原图"}
        onCancel={() => this.props.displayModalForm(false)}
        footer={null}
        maskClosable={false}
      >
        <WrappedRegistrationForm {...this.props}/>
      </Modal>
    }
}

export default MainFormModelView

/*@TagStart@CodeEndBlock@@*/
// Code block
/*@TagEnd@CodeEndBlock@@*/
