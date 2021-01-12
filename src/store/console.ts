import { Envirenments } from './Envirenments'
const log = Envirenments.DEV ? {
  log: console.log,
  error: console.error,
  info: console.info,
  warn: console.warn,
  debug: console.debug,
} : {
    log: () => null,
    error: () => null,
    info: () => null,
    warn: () => null,
    debug: () => null,
  }
export default log
