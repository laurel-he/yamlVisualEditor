
export class Resizer {
  static scale: number = 1
  private resizeTaskId = null
  private delay: number = 300
  private miniWith: number = 1280
  private latestWidth: number = 0
  private parentRef: HTMLElement
  private targetRef: HTMLElement

  constructor(targetRef: HTMLElement) {
    this.targetRef = targetRef
    const html = document.getElementsByTagName('html')
    this.parentRef = html.length ? html[0] : null
    this.resizeHandler(null)
  }

  resizeHandler = (evt: Event): void => {
    if ( ! this.parentRef ) return
    if (this.resizeTaskId !== null) {
      clearTimeout(this.resizeTaskId);
    }

    this.resizeTaskId = setTimeout(() => {
      this.resizeTaskId = null;
      this.originalResize();
    }, this.delay);
  }
  originalResize(): void {
    const w = window.innerWidth
    if ( this.latestWidth === w ) {
      return
    }
    this.latestWidth = w
    let scale = w / this.miniWith
    scale = Math.round((scale >= 1 ? 1 : scale) * 100) / 100
    Resizer.scale = scale
    // console.log('originalResize window size:', w, h, scale)
    this.doScale(scale)
    this.updateCssStyle(scale)
  }

  updateCssStyle(scale: number): any {
    const styleId = 'resizer'
    this.removeStyleElement(styleId)
    if ( scale < 1 ) {
      this.createStyleElement(styleId, scale)
    }
  }
  removeStyleElement(styleId: string): any {
    const elements = document.getElementsByTagName('style')
    for ( let i = elements.length - 1 ; i >= 0; --i) {
      const elem = elements[i]
      elem.id === styleId && elem.parentElement.removeChild(elem)
    }

    const element = document.getElementById(`#${styleId}}`)
    element && element.parentElement.removeChild(element)

  }

  createStyleElement(styleId: string, scale: number): any {
    // ant-modal-mask
    // ant-modal-wrap
    const h = window.innerHeight
    const miniHeight = Math.round ( h / scale)
    const elem = document.createElement('style')
    elem.id = styleId
    elem.innerHTML = `
      div.ant-modal-mask, div.ant-modal-wrap {
        width: ${this.miniWith}px;
        height: ${miniHeight}px;
      }
    `
    document.body.appendChild(elem)
  }

  doScale(scale: number): void {
    if ( scale < 1 ) {
      this.parentRef.style.transformOrigin = 'left top'
      this.parentRef.style.transform = `scale(${scale})`
      this.targetRef.style.width = `${this.miniWith}px`
    } else {
      this.parentRef.style.transformOrigin = null
      this.parentRef.style.transform = null
      this.targetRef.style.width = null
    }
  }
}
