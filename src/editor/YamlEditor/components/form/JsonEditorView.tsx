///<reference path="../../../../../utils/thirdParty/monaco-editor/monaco.d.ts"/>
import { MonacoProviderService } from 'src/utils/thirdParty/monaco-editor/MonacoProviderService';
import { MonacoEditorConfig } from 'src/utils/thirdParty/monaco-editor/MonacoEditorConfig';
import YamlEditorView from 'src/systems/IaaS/K8sDeployment/components/form/YamlEditorView';

// apid
export default class JsonEditorView extends YamlEditorView {
  constructor(props) {
    super(props)
    this.state = {
      initVersion: 0,
      lastVersion: 0,
      currentVersion: 0,
      undoable: false,
      redoable: false,
      loadingEditor: false,
    }
  }

  get elementId() {
    return 'JsonEditorView'
  }

  async initMonaco(): Promise<any> {
    // console.log('initMonaco')

    const service = new MonacoProviderService(new MonacoEditorConfig())
    await service.initMonaco()
    await service.loadModule([
      "vs/basic-languages/monaco.contribution",
      "vs/language/json/monaco.contribution"
    ])
    this.editor = service.create(document.getElementById(this.elementId), {
      value: this.props.value || '',
      showFoldingControls: 'always',
      language: 'json',
      formatOnType: true,
      formatOnPaste: true,
      minimap: {
        enabled: true,
      }
    })

    const initVersion = this.editor.getModel().getAlternativeVersionId()
    this.setState({
      initVersion,
      currentVersion: initVersion,
      lastVersion: initVersion,
    })

    this.editor.onDidChangeModelContent(e => {
      const version = this.editor.getModel().getAlternativeVersionId();
      const { initVersion, lastVersion, currentVersion } = this.state
      this.setState({
        currentVersion: version,
        lastVersion: currentVersion > lastVersion ? currentVersion : lastVersion,
        undoable: version > initVersion,
        redoable: version < lastVersion,
      })
    })

    this.loadSchema('https://public.jiapinai.com/files_manager/1575704033383_schema.json')

    this.editor.setValue(this.props.value || '');
    await this.initQuickOpen(this.editor)
  }

  loadSchema(uri: string) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      enableSchemaRequest: true,
      validate: true,
      schemas: [
        {
          uri,
          fileMatch: ["*"]
        }
      ]
    });
  }

}
