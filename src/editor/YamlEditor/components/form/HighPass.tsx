import { CopyOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Tooltip, message, InputNumber, Switch } from 'antd';
import * as React from 'react';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import mapping from '../data/map';
import modules from '../data/modules'
interface HighPassFormProps extends FormComponentProps {
  value: any
}
import {CopyToClipboard} from 'react-copy-to-clipboard';
export class HighPassForm extends React.Component<HighPassFormProps, any> {
   constructor(props: HighPassFormProps) {
       super(props);
     }
     state = { visible: false, showValues: {} };
     showModal = () => {
       this.setState({
         visible: true,
         showValues: {}
       });
     };
     componentDidMount() {
       this.initValues()
     }
     handleSubmit() {
       this.props.form.validateFields((err, values) => {
         if (!err) {
           console.log('Received values of form: ', values);
         }
       });
     };
handleOk = (e: any) => {
   this.setState({
     visible: false,
   });
 };
 radioGroup(item: any, route: string) {
   return (<Radio.Group key={route + 'group'} buttonStyle="solid">
       {mapping[item].mapV.map((items) => {
           return (
               <Radio.Button key={route + items.label} value={items.label}>{items.label}</Radio.Button>
           );
       })}
        </Radio.Group>);
}
routes: string[] = []
initValues() {
 const values: any = {}
 const routesValue = this.props.value;
 this.routes.forEach((item: string) => {
   values[item] = String(routesValue.get(item))
   if (typeof(routesValue.get(item)) === 'boolean') {
     values[item] = routesValue.get(item)
   }
 })
 this.setState({
   showValues: values
 })
 this.props.form.setFieldsValue(values);
}

handleCancel = (e: any) => {
   this.setState({
     visible: false,
   });
 };
/** 渲染所有数据 */
renderData(menuObj: any, renderDom?: any[], ischild?: boolean): any[] {
 ischild = ischild || false
 const { getFieldDecorator } = this.props.form;
 let changeableMenuObj = menuObj;
 if (menuObj instanceof Array || menuObj instanceof Object) {
   /** 数据可以展示的情况：
    * 1 配置文件中这个属性存在，且makeup.json中有这个参数（isExists）,且这个参数不由两个参数控制
    * 2 配置文件存在这个属性，makeup.json需要两个参数控制，例如当data=params=list=HighPass=useFaceMask=blendMode值为10时才代表为锐化，此时锐化组件展示（ifShowWhenTwoParams）
    */
   // let sortChangeableMenuObj  = changeableMenuObj.compa
   changeableMenuObj.map((objModule) => {
     let isExists = this.checkParamExists(objModule);
     let ifShowWhenTwoParams = this.checkIfShowWhenTwoParams(objModule);
     if (isExists && this.checkIfShow(objModule, ifShowWhenTwoParams)) {
       if (objModule['route'] && objModule['show'] === true) {
         this.routes.push(objModule['route'])
         switch (objModule['type']) {
           case 'radio':
             renderDom = this.renderRadios(renderDom, objModule, ischild, getFieldDecorator)
             break;
           case 'input':
             renderDom = this.renderInput(renderDom, objModule, ischild, getFieldDecorator)
             break;
           case 'switch':
             renderDom = this.renderSwitch(renderDom, objModule, ischild, getFieldDecorator)
             break;
           default:
             renderDom = this.renderRadios(renderDom, objModule, ischild, getFieldDecorator)
             break;
         }
       }
     }
   if (objModule['child'] && objModule['child'].length > 0) {
     return this.renderData(objModule['child'], renderDom, true)
   }
   });
}
return renderDom;
}

compare(propertyName) {
 return function (object1, object2) {
   let value1 = object1[propertyName];
   let value2 = object2[propertyName];
   if (value2 < value1) {
     return -1;
   } else if (value2 > value1) {
     return 1;
   } else {
     return 0;
   }
   }
 }
checkIfShow(objModule: Object, ifShowWhenTwoParams: boolean) {
 if (this.paramExitstInConfigControlByOne(objModule, ifShowWhenTwoParams) || this.paramExistsInConfigControlByMulti(objModule, ifShowWhenTwoParams)) {
   return true;
 } else {
   return false;
 }
}
paramExitstInConfigControlByOne(objModule: Object, ifShowWhenTwoParams: boolean): boolean {
 if (objModule.hasOwnProperty('related') === false && ifShowWhenTwoParams === false) {
   return true;
 } else {
   return false;
 }
}
paramExistsInConfigControlByMulti(objModule: Object, ifShowWhenTwoParams: boolean): boolean {
 if (objModule.hasOwnProperty('related') && ifShowWhenTwoParams) {
   return true;
 } else {
   return false;
 }
}
/** 当配置文件存在这条数据时，实际makeup.json文件不存在这个参数时不渲染前端 */
checkParamExists(objModule) {
 if (this.props.value.size > 0) {
   let isExist = this.props.value.has(objModule['route']) ? true : false
   return isExist
 }
}

/** 渲染组件:radio */
renderRadios(renderDom: any[], objModule: object, ischild: boolean, getFieldDecorator: any) {
 if (Object.keys(objModule).length > 0) {
   renderDom.push(<Form.Item
     key={objModule['route']}
     label={
         <span>
         {objModule['chinese']}
         </span>
         }
     >
     {getFieldDecorator(objModule['route'])(
         this.radioGroup(objModule['abridge'], objModule['route']))}
     </Form.Item>)
 }
 return renderDom;
}

/** 渲染组件:input */
renderInput(renderDom: any[], objModule: object, ischild: boolean, getFieldDecorator: any) {
 if (Object.keys(objModule).length > 0) {
   renderDom.push(<Form.Item
     key={objModule['route']}
     label={
         <span>
         {objModule['chinese']}
         </span>
         }
     >
     {getFieldDecorator(objModule['route'])(
       <InputNumber min={1} max={110} />
       )}
     </Form.Item>)
 }
 return renderDom;
}

/** 渲染组件:swicth开关 */
renderSwitch(renderDom: any[], objModule: object, ischild: boolean, getFieldDecorator: any) {
 if (Object.keys(objModule).length > 0) {
   renderDom.push(<Form.Item
     key={objModule['route']}
     label={
         <span>
         {objModule['chinese']}
         </span>
         }
     >
     {getFieldDecorator(objModule['route'], { valuePropName: 'checked' })(
       <Switch />
       )}
     </Form.Item>)
 }
 return renderDom;
}

getChineseByRoute(route: string) {
 return modules.modules.find(item => item.route === route).chinese
}
getReflectValueByOrigin(route: string, value: string | number) {
 if (modules.modules.find(item => item.route === route).abridge) {
   const abridge = modules.modules.find(item => item.route === route).abridge
   const reflectValue = mapping[abridge].mapV.find(item => item.value === value)
   return reflectValue ? reflectValue.label : "3"
 } else {
   return value
 }
}
/** 当一个值需要由两个参数控制时判断是否需要渲染这个组件 */
checkIfShowWhenTwoParams(objModule) {
 if (objModule['related']) {
   let ifShow = (objModule['related']['value'] === this.props.value.get(objModule['related']['route'])) ? true : false
   return ifShow
 } else {
   return false
 }
}
     render() {
       const showValuesRender: object = this.state.showValues
       let keys = Object.keys(showValuesRender)
       let copyText = ''
       const renderData = this.renderData(modules.modules, [])
       keys.map((items) => {
         copyText += (String(this.getChineseByRoute(items)) + String(showValuesRender[items]) + ' ')
       })
       return (
         <div>
         <Form.Item
         key='copyText'
         label={
           <span>默认参数</span>
             }
         >
         <CopyToClipboard text={copyText} onCopy={() => message.success('复制成功') }>
             <span>
             <span>{copyText}</span>
             <Tooltip title={'复制'}><CopyOutlined /></Tooltip>
             </span>
             </CopyToClipboard>
         </Form.Item>
         { renderData }
         </div>
       );
     }
 }
