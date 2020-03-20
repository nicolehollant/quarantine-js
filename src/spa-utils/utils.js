var svgNS = "http://www.w3.org/2000/svg";

function doNothing() {
  return null
}

function mount(root, el) {
  if(typeof root === 'string')
    document.getElementById(root).appendChild(el)
  else root.appendChild(el)
}

function addText(text, el) {
  el.appendChild(document.createTextNode(text))
}

function addClasses(classList, el) {
  el.classList.add(...classList)
}

/**
 * [`Elem`]
 * Little DOM Element object
 * [`tag`]: tag of element
 * [`id`]: id of element
 * [`classes`]: list of classes for element
 * [`children`]: list of children
 * - can be [`HTMLElement`] (some other node)
 * - can be [`object`] (will be made into [`Elem`])
 * - can be [`function`] (will be made into [`Elem`] while passing state)
 * [`events`]: object for event mapping (keys=eventName, values=handlers)
 * [`state`]: object holding state for element
 */
class Elem {
  constructor({tag, classes, id, events, children, properties, content, state, mounted}) {
    this.tag = tag || 'div';
    this.classes = classes || [];
    this.id = id || '';
    this.events = events || {};
    this.properties = properties || {};
    this.children = children || [];
    this.content = content || '';
    this.state = state || {};
    this.mounted = mounted || doNothing
  }
  injectAttrs(el) {
    if(this.classes.length > 0) addClasses(this.classes, el)
    if(this.id) el.id = this.id
    if(this.content) addText(this.content, el)
    if(this.events) {
      for(const [eventName, handler] of Object.entries(this.events)) {
        el.addEventListener(eventName, handler)
      }
    }
    if(this.properties) {
      for(const [propertyName, propertyValue] of Object.entries(this.properties)) {
        el.setAttribute(propertyName, propertyValue)
      }
    }
    if(typeof this.children === 'function') {
      this.children = this.children(this.state)
    }
    for(const child of this.children) {
      if(child instanceof Element || child instanceof HTMLDocument) 
        el.appendChild(child)
      else el.appendChild(new Elem(child).render())
    }
    return el
  }
  render() {
    return this.injectAttrs(document.createElement(this.tag))
  }
}

/**
 * HashRouter
 * - [`root`]: document node that the router attaches to
 * - [`routes`]: list of routes ([`path`] and [`component`])
 * - [`push`]: function that emits a [`routechange`] event
 */
class HashRouter {
  constructor(root, routes) {
    this.root = root
    this.routes = routes || []

    const errorComponent = new Elem({ 
      classes: ['text-xl', 'text-orange-700', 'font-semibold', 'm-8'],
      content: 'No component for the current route'
    })
    let component = this.getRoute()
    component = component ? component.component : errorComponent
    mount(this.root, component.render())
    component.mounted()

    this.root.addEventListener('routechange', (e) => {
      const newRoute = this.getRoute(e.detail)
      window.location.hash = e.detail
      if (newRoute) {
        this.root.innerHTML = ''
        mount(this.root, newRoute.component.render())
        newRoute.component.mounted()
        console.log('updating hash to', e.detail)
      } else {
        mount(this.root, errorComponent.render())
        console.error(`route '${e.detail}' does not exist`)
      }
    }, false);
  }
  getRoute(path) {
    if(path === undefined) path = window.location.hash.replace('#', '')
    if(path === '') path = '/'
    const res = this.routes.find(r => r.route === path) || this.routes.find(r => r.route === '*')
    if(res.redirect) {
      window.location.hash = res.redirect
      return this.routes.find(r => r.route === res.redirect) || this.routes.find(r => r.route === '*')
    }
    return res
  }
  addRoutes(routes) {
    this.routes.push(...routes)
  }
  push(route) {
    this.root.dispatchEvent(new CustomEvent('routechange', { detail: route }))
  }
}

class SvgElem extends Elem {
  render() {
    return this.injectAttrs(document.createElementNS(svgNS, this.tag))
  }
}

class Sketch {
  constructor({root, children, classes, state}) {
    this.root = root
    this.children = children || []
    this.classes = classes || []
    this.state = state || {}
    if(!this.state.width) this.state.width = 10
    if(!this.state.height) this.state.height = 10
    let rootEl = this.root
    if(typeof this.root === 'string')
      rootEl = document.getElementById(this.root)
    const svgNS = "http://www.w3.org/2000/svg";
    this.svgRoot = document.createElementNS(svgNS, "svg");
    this.svgRoot.setAttribute('xmlns', svgNS)
    this.svgRoot.setAttribute('viewBox', `0 0 ${this.state.width} ${this.state.height}`)
    if(this.classes.length > 0) addClasses(this.classes, this.svgRoot)
    rootEl.appendChild(this.svgRoot)
    if (typeof this.children !== 'function') this.children = () => this.children
    this.animate = () => {
      this.render()
      requestAnimationFrame(this.animate)
    }
    this.animate()
  }
  render() {
    this.svgRoot.innerHTML = ''
    for(const child of this.children(this.state)) {
      this.svgRoot.appendChild(child.render())
    }
  }
}

function circle(x, y, r, {fill, stroke, weight, classes}={}) {
  if(!fill) fill = 'currentColor'
  if(!stroke) stroke = 'none'
  if(!weight) weight = 'none'
  if(!classes) classes = []
  return new SvgElem({
    tag: 'circle',
    classes,
    properties: {
      fill,
      stroke,
      'stroke-width': weight,
      'cx': x,
      'cy': y,
      'r': r,
    }
  })
}

function ellipse(x, y, rx, ry, {fill, stroke, weight, classes}={}) {
  if(!fill) fill = 'currentColor'
  if(!stroke) stroke = 'none'
  if(!weight) weight = 'none'
  if(!classes) classes = []
  return new SvgElem({
    tag: 'ellipse',
    classes,
    properties: {
      fill,
      stroke,
      'stroke-width': weight,
      'cx': x,
      'cy': y,
      rx,
      ry
    }
  })
}

function line(x1, y1, x2, y2, {fill, stroke, weight, classes}={}) {
  if(!fill) fill = 'currentColor'
  if(!stroke) stroke = 'none'
  if(!weight) weight = 'none'
  if(!classes) classes = []
  return new SvgElem({
    tag: 'line',
    classes,
    properties: {
      fill,
      stroke,
      'stroke-width': weight,
      x1,
      x2,
      y1,
      y2
    }
  })
}

function rect(x, y, w, h, {rx, ry, fill, stroke, weight, classes}={}) {
  if(!rx) rx = 0
  if(!ry) ry = 0
  if(!fill) fill = 'currentColor'
  if(!stroke) stroke = 'none'
  if(!weight) weight = 'none'
  if(!classes) classes = []
  return new SvgElem({
    tag: 'rect',
    classes,
    properties: {
      fill,
      stroke,
      'stroke-width': weight,
      x,
      y,
      rx,
      ry,
      'width': w,
      'height': h,
    }
  })
}

function polygon(points, {fill, stroke, weight, classes}={}) {
  // [[0, 0], [1, 1], [2, 2]] points like this
  if(!fill) fill = 'currentColor'
  if(!stroke) stroke = 'none'
  if(!weight) weight = 'none'
  if(!classes) classes = []
  if(typeof points === 'object') points = points.reduce((a,e) => (a+=`${e[0]}, ${e[1]} `), '').trimRight()
  return new SvgElem({
    tag: 'polygon',
    classes,
    properties: {
      fill,
      stroke,
      'stroke-width': weight,
      'points': points
    }
  })
}

function polyline(points, {fill, stroke, weight, classes}={}) {
  // [[0, 0], [1, 1], [2, 2]] points like this
  if(!fill) fill = 'currentColor'
  if(!stroke) stroke = 'none'
  if(!weight) weight = 'none'
  if(!classes) classes = []
  if(typeof points === 'object') points = points.reduce((a,e) => (a+=`${e[0]}, ${e[1]} `), '').trimRight()
  return new SvgElem({
    tag: 'polyline',
    classes,
    properties: {
      fill,
      stroke,
      'stroke-width': weight,
      'points': points
    }
  })
}

function text(text, x, y, {fill, fontSize, fontWeight, classes}={}) {
  if(!classes) classes = []
  if(!fill) fill = 'currentColor'
  if(!fontSize) fontSize = null
  if(!fontWeight) fontWeight = null
  return new SvgElem({
    tag: 'text',
    classes,
    content: text,
    properties: {
      'font-size': fontSize,
      'font-weight': fontWeight,
      fill,
      x,
      y
    }
  })
}

const rand = (max=1, min=0) => (Math.random() * max) + min
const randInt = (max=1, min=0) => Math.floor(Math.random() * max) + min

const randVal = () => Math.floor(Math.random() * 255)
const randomColor = () => `rgb(${randVal()}, ${randVal()}, ${randVal()})`