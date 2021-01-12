/* 本文件的注释会在上线打包过程中被sed移除, 请不要使用//作为注释!! */
import editorRoute from 'src/editor/Editor'
import { PlainRoute } from 'react-router';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store): PlainRoute => {
  /* 只能在此添加[系统级]路由 */
  return {
  path: '/',
  childRoutes: [
    ... editorRoute(store),
  ]}
}

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
