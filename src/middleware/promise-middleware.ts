const isPromise = val =>
val && typeof val.then === 'function';

const dispatchPayloadPromise = (dispatch, action) =>
(action.payload.then(
  output => dispatch({
    ...action,
    payload: action.payload.toString(),
    result: output,
    success: true,
  }),
  error => {
    const result = {
      ...action,
      payload: action.payload.toString(),
      result: error,
      success: false,
    };
    dispatch(result);
    return Promise.reject(result);
  }
));

export default ({ dispatch }) =>
(next => action =>
 (isPromise(action.payload)
   ? dispatchPayloadPromise(dispatch, action)
   : next(action)))
