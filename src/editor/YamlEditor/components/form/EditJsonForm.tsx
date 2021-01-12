import * as React from 'react';
import { Tag, Badge } from 'antd'
import { Modal, Button } from 'antd';
import { createYamlForm } from "src/systems/IaaS/K8sDeployment/components/form/YamlForm";
import { ModuleProps } from "src/systems/IaaS/K8sDeployment/modules";
/*@TagStart@ImportBlock@@*/
// import block
/*@TagEnd@ImportBlock@@*/
class EditJsonForm extends React.Component <ModuleProps, any > {

    render() {
      if ( ! this.props.data.customs.editYaml ) return null
      const WrappedRegistrationForm = createYamlForm()
      return <Modal
        width={1200}
        visible={true}
        title='编辑YAML'
        onCancel={() => this.props.applyCustomStateChange({editYaml: null})}
        footer={null}
        maskClosable={false}
      >
        <WrappedRegistrationForm {...this.props}/>
      </Modal>
    }
}

export default EditJsonForm
