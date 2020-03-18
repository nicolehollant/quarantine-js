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
  constructor({tag, classes, id, events, children, content, state}) {
    this.tag = tag || 'div';
    this.classes = classes || [];
    this.id = id || '';
    this.events = events || {};
    this.children = children || [];
    this.content = content || '';
    this.state = state || {};
  }
  injectAttrs(el) {
    addClasses(this.classes, el)
    if(this.id) el.id = this.id
    if(this.content) addText(this.content, el)
    if(this.events) {
      for(const [eventName, handler] of Object.entries(this.events)) {
        el.addEventListener(eventName, handler)
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
    mount(this.root, this.getRoute()?.component?.render() || errorComponent.render())

    this.root.addEventListener('routechange', (e) => {
      const newRoute = this.getRoute(e.detail)
      window.location.hash = e.detail
      if (newRoute) {
        this.root.innerHTML = ''
        mount(this.root, newRoute.component.render())
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