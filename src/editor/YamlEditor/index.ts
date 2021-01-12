export default {
    path: "/editor/yamleditor",
    getComponent(nextState, cb) {
      // tslint:disable-next-line: no-floating-promises
      import(/* webpackChunkName: "InstanceSegmentationStatistics" */'src/editor/YamlEditor/components').then(obj => {
        cb(null, obj.default);
      })
    }
  }
  