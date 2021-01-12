import * as envs from '../../webpack/defines';
export const formatHost = (host: string ) => {
  if ( location.host.startsWith('qa-') ) {
    return host.replace("https://", "https://qa-");
  }
  return host || location.origin
}
const _Envs: any = {}
// console.log('apiHostParser>>envs', envs)
Object.keys(envs).forEach( key => _Envs[key] = ('' + envs[key]).startsWith('http') ? formatHost(envs[key]) : envs[key])
console.log('apiHostParser>>_Envs', _Envs)
interface EnvirenmentsDefine {
  NONE_HOST_ENV: string,
  NODE_ENV: string,
  DYNAMIC_HOST_ENV: string,
  KZ_HOST_ENV: string,
  QDORACTL_HOST_ENV: string,
  CONTROL_HOST_ENV: string,
  BB_HOST_ENV: string,
  SYS_CONF_M_HOST_ENV: string,
  GOODS_HOST_ENV: string,
  BILLING_HOST_ENV: string,
  WF_HOST_ENV: string, // workflow
  DEV: boolean,
  LIVE: boolean,
  WEBUI_VERSION: string,
}
export const Envirenments: EnvirenmentsDefine = _Envs
