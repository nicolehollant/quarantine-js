# My SPA

Cole Hollant

3/18/2020

Messing around with routing / DOM-manipulation while I'm in quarantine

____________________

I'd say I'm mostly a Vue and Python developer these days. I love JS, but I'm relatively new to it, and I wouldn't consider myself an expert by any means. I can often get the job done, and I have my theories as to what is going on under the hood—some might even think they're coherent. Regardless, the web is so far along that it's rare to jump right in to JS without one of the big-league frameworks (React, Vue, Angular, even Svelte). I had *first* tried Angular, and I did without ever having written a `div`. I was stuck in academic computer science mode, which doesn't lend itself to much in terms of products; I had some concepts of programming—hell, I thought I was pretty good at it—but, there was something about all those angle-brackets, the jungle of files, and the back and forth with the CLI that I found completely unapproachable. I ended up dropping it and focusing on Flutter (cross-platform mobile apps), which I think was the perfect platform to transition between my Java-heavy education and the new world of UI development.

I came back to web dev a few months later for some freshman-orientation program that I was helping teach. We had all the incoming first years make text-based adventure games using [Twine](https://twinery.org/2). The demands were pretty low, but it gave me a good excuse to get used to HTML/CSS/JS. It mostly sparked my interest in CSS, as it grew tiresome looking at 100 nearly identical pages a day; I started to go around and show people some little tricks they could do, and things got a little more interesting. When I went home each day I wanted to learn more, so I picked up Vue, which one of my close friends fancies. It was super approachable, and I felt like I was able to do pretty much anything I wanted to do.

I've kept with the web—almost exclusively Vue and "Vanilla JS"—for around 2 years at this point. I'm still not a master, but I feel competent enough so long as I have access to MDN; I haven't felt that early learning frustration in a long time, and many problems have shifted from fundamental misunderstandings to areas for improvement. That being said, I very recently got to messing around with React (for the first time) for a small thing at work. It was more or less using some existing component and dealing with routing, cookies, and a touch of redux, but it seemed unreasobably complicated. It seemed like every person online had a drastically different idea of things in the framework that I thought should be pretty simple (i.e. redirecting a page, etc). Things ended up working out just fine, and I spent the next while trying to pick up some React skills; ultimately, I think it's approachable, and react-hooks mesh well with my understanding of vue-composition-api, everything in React is just a lot more JS-heavy. I ended up with some relative comfort, where I should be able to bring some React project from start to finish if need be.

My brief stint with React ended up with me dreaming about SPAs. Surely it can't be that hard to throw together a proof-of-concept spa. I figured I could make some silly little thing with render functions and DIY-routing so I can play with some DOM manipulation without a framework. So, I got to work.

## Server Setup

I figure there's no better way to start than with a little cheating! I don't know much about making servers with node on its own, so we'll make two moves: one will just use express, and the other will be a [stack overflow inspired](https://stackoverflow.com/questions/28061080/node-itself-can-serve-static-files-without-express-or-any-other-module) server. This isn't really necessary if we want to inject all of the script tags in ourselves, or if we want to make a separate build process, but might as well! I'll include the express server here as it's quite easy to swallow:

```js
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(_, res){
  const html = require('fs').readFileSync(__dirname + '/src/index.html', 'utf8');
  require('glob')(__dirname + "/src/**/*.js", function (er, files) {
    const inject = files.map(f => {
      if (f.includes('utils.js')) return
      return `<script src="${f.replace(path.join(__dirname, 'src'), '')}"></script>`
    }).join('\n')      
    res.send(html.replace('~~inject~~', inject));
  })
});

app.use('/', router);
app.use(express.static(path.join(__dirname, "src")));
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');
```

We are just making one route that returns the contents of `index.html` after all the `.js` files under `src` have been injected as script tags, and we are serving all the files within `src`. Nothing too terrible here, just a little bit of pattern matchin with `glob` to save some effort. I must admit though, this is the very last piece I threw together, the following should match more of my actual process.

## Gathering Ideas

As I said, I came into JS relatively recently, so I've never had to do much DOM manipulation by hand. I'm a bit familiar as per the nature of frontend work, but I'm never really appending children or creating nodes in my free time. I figured that would be a nice place to start. So, income a couple of helper methods.

```js
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
```

`mount` will take either a document element or a string corresponding to an id, and it will add the passed element to it's children. `addText` just writes innerText, and `addClasses` adds to the elements classlist. They're very simple functions, hardly abstracting any actual behavior, just moreso a means of saving keystrokes and to get me thinking about the DOM.

I had been using React recently, so I thought some functional components could be nice. And this spawned a little card function:

```js
function card2(content) {
  const el = document.createElement('div')
  addClasses(['rounded-lg', 'bg-gray-200', 'border', 'border-gray-300', 'p-4', 'm-4'], el)
  addText(content, el)
  return el
}
mount('app', card2('oh whoah!'))
```

This was nice, although, I wasn't sure how I wanted to go beyond simple text elements, and it all came back to Vue. I figure, render functions have got to be pretty reasonable for nested elements, I can just traverse objects, and that'll do! I figured I'd use classes since I think they have a nice syntax, and the parameters are pretty straightforward: we'll need tags, classes, ids, events, and some notion of children and text-content. We can fall back on divs for the tag, classes can be an array, although a string should suffice, id and text-content are strings, children will be an array of objects, and events will be an object mapping event-name to handler. Then we just have to inject all of these attributes—so long as they exist--and call it a day! We'll give one extra property for `state` should we want data-bindings for components, and this will be an object. We will then support functions for children to be able to encapsulate state. And here is our element class, pretty short and sweet:

```js
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
```

## Using what we have

Now that we have our little element class / render function, it should be nice and easy to make components! So I got to playing around with it. I figure we'll make a little ficticious navbar, and we'll get back to it when we have routing ideas. And this ends up being pretty verbose at first:

```js
const navbar = new Elem({
  tag: 'div',
  classes: ['w-full', 'bg-gray-400', 'text-gray-900', 'font-medium'],
  children: [
    {
      classes: ['max-w-3xl', 'flex', 'justify-around', 'items-center', 'm-auto', 'p-4'],
      children: [
        { 
          tag: 'button',
          content: 'Home', 
          classes: ['rounded', 'px-2', 'hover:text-indigo-700', 'hover:underline', 'focus:outline-none', 'focus:bg-indigo-700', 'focus:text-indigo-100'],
        },
        { 
          tag: 'button',
          content: 'About', 
          classes: ['rounded', 'px-2', 'hover:text-indigo-700', 'hover:underline', 'focus:outline-none', 'focus:bg-indigo-700', 'focus:text-indigo-100'],
        },
        { 
          tag: 'button',
          content: 'Content', 
          classes: ['rounded', 'px-2', 'hover:text-indigo-700', 'hover:underline', 'focus:outline-none', 'focus:bg-indigo-700', 'focus:text-indigo-100'],
        },
      ]
    }
  ]
})
```

But, there's no reason to use JS to simplify things for us! We can abstract the children to a functional component as such:

```js
const navlink = (content, name) => ({ 
  tag: 'button',
  content: content, 
  classes: ['rounded', 'px-2', 'hover:text-indigo-700', 'hover:underline', 'focus:outline-none', 'focus:bg-indigo-700', 'focus:text-indigo-100'],
  events: { 
    // router is foreshadowing c;
    click: () => router.push(name) 
  }
})

... //navbar children becomes
children: [
  navlink('Home', '/home'),
  navlink('About', '/about'),
  navlink('Contact', '/contact'),
]
```

And we are back to writing short and sweet components! From here, I figure I should mess with something stateful, and I'm not sure about you, but I think that [cookie clicker](https://orteil.dashnet.org/cookieclicker/) is one of the most brilliant games ever made, so we'll make a little button clicker in their honor. 

```js
const clicker = (props = {}) => new Elem({
  classes: ['flex', 'flex-col', 'border', 'border-gray-400', 'rounded-lg', 'w-48', 'mx-auto', 'my-4', 'p-4', 'justify-around', 'items-center'],
  state: {
    count: props.count || 0,
  },
  children: (state) => [
    {
      id: 'count',
      classes: ['text-green-700', 'font-semibold'],
      content: `Count: ${state.count}`,
    },
    {
      tag: 'button',
      content: props.content || "click me!",
      events: {
        click: () => {
          state.count++
          document.getElementById('count').innerText = `Count: ${state.count}`
        }
      }
    }
  ]
})
```

This is a little bit more complex: we've introduced state, events, and props. This is a component factory rather than just a component, and thus we can inject values into it like the button's text and the initial count. Then, we display that count in the content, and we update it on click. It's not the most reactive system, hence the grabbing elements by id, but it'll do for this proof of concept. It would be fun to watch state to inform rerendering, but that's nothing I can do in an afternoon.

Now that we have some components, I figure we should compose them into a page or two, so here we are:

```js
const home = new Elem({
  classes: ['min-h-screen', 'bg-blue-900'],
  children: [
    navbar,
    clicker({content: 'Please click me', count: -12}),
    card({content: 'does this work?'})
  ]
})

const about = new Elem({
  classes: ['min-h-screen', 'bg-teal-900'],
  children: [
    navbar,
    clicker({content: 'different text for this?', count: 2000}),
    card({
      classes: ['max-w-md', 'm-auto'],
      children: [
        { bg: 'bg-blue-700', content: 'Oh hi' },
        { bg: 'bg-indigo-700', content: 'Hello there!' },
        { bg: 'bg-purple-700', content: 'And howdy 👩‍🌾' },
      ].map(e => ({
        classes: ['p-2', 'my-2', 'rounded-full', 'text-white', 'flex', 'justify-center', 'items-center'].concat([e.bg]),
        content: e.content
      }))
    })
  ]
})

const notFound = new Elem({
  classes: ['rounded-lg', 'bg-gray-200', 'border', 'border-gray-300', 'p-4', 'm-4', 'text-xl'],
  content: '404 page not found 😢',
  children: [
    { 
      classes: ['underline', 'text-lg', 'font-semibold', 'text-indigo-700'],
      content: 'Home', 
      events: { 
        click: () => router.push('/home') 
      } 
    },
  ]
})
```

This should do for pages! We can switch them around, and see that everything works, but we don't have a way to switch things yet. There's been some hinting at it in the codesnippets, but we are going to be implementing our router now!

## The Router!!

We're gonna make a hash router since we're in the SPA business, and that's gonna be the most straightforward thing. We'll try and take inspiration from Vue again, and have an array of route objects (each having a path and a component or a redirect path). We'll have a fallback/error component just to be nice about things. But we'll have to be able to get the route associated with a path and associated with the current hash. This is just a little search function with some control flow branching to default to the current hash, and to redirect the way we want to. 

Then, we get into some events! We're going to make a custom event called 'routechange' that has the new route object attached to it. We'll update the hash and unmount whatever is on the router's root element and attach the new route component, and that's it! For changing a route, we'll just dispatch this new event. And here it is:

```js
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
```

## Putting it all together

To wrap it up, we will get a little disappointed. We'll do a little jank where we'll declare `router` to be an empty object before we actually create it so that none of our components yell about it being undefined. Then, we'll wait for the window to load, and mount everything as such:

```js
var router = {}

window.onload = () => {
  const root = document.getElementById('app')
  
  const routes = [
    { route: '/', redirect: '/home' },
    { route: '/home', component: home },
    { route: '/about', component: about },
    { route: '*', component: notFound },
  ]
  
  router = new HashRouter(root, routes)
  
  console.log({router})
}
```

And we are all done!

Of course, this is a silly little project, and it's far from ready for full applications, but it was a fun little thing to make, and I'm pretty pleased with how things turned out.