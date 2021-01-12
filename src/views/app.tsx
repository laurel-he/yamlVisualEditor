import * as React from 'react'
import { Provider } from 'react-redux'
import { Router, hashHistory, PlainRoute, Route } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import * as importHistory from "history"
const createHistory = importHistory['createBrowserHistory']
import "antd/dist/antd.less";
import '@ant-design/compatible/assets/index.css';
import configureStore from 'src/store/configure-store'
import configureRoutes from 'src/editor'
import { Button, notification, Divider } from 'antd';

const store = configureStore({})
window['store'] = store
const createdHistory = createHistory()

const unlisten = createdHistory.listen((location, action) => {
  // location is an object like window.location
  // console.log('createdHistory', action, location)
})

const history = syncHistoryWithStore(hashHistory, store)
const routes: PlainRoute = configureRoutes(store)
const errorKey = 'App -> componentDidCatch: '
export default class App extends React.Component {

  constructor(props) {
    super(props)

  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("App -> componentDidCatch -> error", error)
    // if (Envirenments.DEV) {
    //   // console.log(errorKey, error, errorInfo)
    // } else {
    localStorage.setItem(errorKey, JSON.stringify({
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack
      }, info: errorInfo
    }))
    location.href = location.pathname;
    // }
  }

  showError(error: Error, info: React.ErrorInfo) {
    console.error(errorKey, error, info)
    const key = `open${Date.now()}`;
    notification.open({
      message: '遇到错误',
      duration: 30,
      description: <div>
        <p>{error.message}</p>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
      </div>,
      btn: <span>
        <Divider type='vertical' />
        <Button type="primary" size="small" onClick={() => {
          notification.close(key)
        }}>确定</Button>
      </span>,
      key,
    });
  }

  componentDidMount() {
    const json = localStorage.getItem(errorKey)
    if (json) {
      localStorage.removeItem(errorKey);
      try {
        const info = JSON.parse(json)
        info && info.error && this.showError(info.error, info.info);
      } catch (error) {
        // -
      }
    }
  }

  render() {

    return (
      <Provider store={store}>
        <Router history={history} >
          {routes}
        </Router>
      </Provider>
    )
  }
}
