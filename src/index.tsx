import * as React from 'react'
import * as ReactDOM from 'react-dom'

import "./index.css";
import App from './views/app.tsx';
// import { Resizer } from './views/Resizer';
const targetRef = document.getElementById('root')

function initApp() {
  ReactDOM.render(<App />, targetRef, () => {
    window['reactDomRenderReady'] && window['reactDomRenderReady']()
    // window.addEventListener('resize', new Resizer(targetRef).resizeHandler)
  })
}
initApp();

// if (module['hot']) {
//   module['hot'].accept(['./views/app'], () => {
//     initApp();
//   })
// }
