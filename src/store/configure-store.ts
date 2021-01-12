///<reference path="./dev-types.d.ts"/>

import { createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
const thunk = require('redux-thunk').default
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
// import promiseMiddleware from 'redux-payload-promise';
import promiseMiddleware from 'src/middleware/promise-middleware'
import logger from 'src/store/logger'
import { nprogressMiddleware } from 'redux-nprogress';

// import persistState, {mergePersistedState} from 'redux-localstorage';
// import adapter from 'redux-localstorage/lib/adapters/localStorage';
// import filter from 'redux-localstorage-filter';

import makeRootReducer, { injectReducer } from 'src/store/reducers'
import { Envirenments } from './Envirenments';
const rooterReducer = makeRootReducer({})

function configureStore (initialState) {
  const store = compose(
    _getMiddleware()
  )(createStore)(rooterReducer, initialState)

  configReducer(store)

  _enableHotLoader(store)

  return store
}

function _getMiddleware () {
  let middleware = [
    routerMiddleware(browserHistory),
    promiseMiddleware,
    thunk,
    nprogressMiddleware()
  ]

  if (Envirenments.DEV) {
    middleware = [...middleware, logger]
  }

  return applyMiddleware(...middleware)
}

/**
 * store Store
 */
function configReducer (store) {

  // split reducer
  store.asyncReducers = {}
  // add injectReducer to store,so we no need to import from sub routes anymore
  store.injectReducer = ({ key, reducer }) => {
    injectReducer(store, { key, reducer })
  }
}

function _enableHotLoader (store) {

  if (Envirenments.DEV && module.hot) {
    module.hot.accept('../systems', () => {
      const nextRootReducer = require('../systems').default
      store.replaceReducer(nextRootReducer)
    })
  }
}

// function _getStorageConfig() {
//   return {
//     key: 'react-redux-seed',
//     serialize: (store) => {
//       return store && store.session ?
//         JSON.stringify(store.session.toJS()) : store;
//     },
//     deserialize: (state) => ({
//       session: state ? fromJS(JSON.parse(state)) : fromJS({}),
//     }),
//   };
// }

export default configureStore
