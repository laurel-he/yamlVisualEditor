import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { nprogress } from 'redux-nprogress';

export const makeRootReducer = (asyncReducers) => {
  // use assign instead of ...asyncReducers
  const reducers = Object.assign({ routing: routerReducer, nprogress }, asyncReducers)
  return combineReducers(reducers)
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
