<img src="./public/assets/logo.png" width="120">

# quarantine-js

A little proof of concept SPA framework I put together in quarantine during the corona pandemic

## Running ⛹️‍♀️

should be able to

```sh
yarn # or npm i
yarn serve
```

or just open `index.html` in your browser so long as all scripts are attached 😊

## Building 👷‍♀️

```sh
yarn build # or npm run build
```

all this really does is attach the scripts in `public/**/*.js` to `public/index.html`

# Documentation 📖

All referring to stuff in `public/utils/utils.js`

## Class: `Elem`

**params**:
- `tag <string>`: html tag
- `id <string>`: element id
- `classes <[]string | string>`: element classes
  - array of class names or string of whitespace delimited class names
- `children <[]object | function(object): []>`: list of children
  - each child can be an instance of `Element | HTMLDocument` or a generic object
    - if the child is a generic object, it will be passed through the `Elem` constructor and rendered
  - if `children` is a function, it will be called with `this.state`
- `events <object<string, function>>`: object with {key: val} representing {eventName: handler}
- `properties <object>`: object with {key: val} representing {attributeName: attributeValue}
- `content <string>`: html innerText
- `state <object>`: object for element state to be passed to functional children
- `mounted <function>`: function called upon mounting from `HashRouter`

**methods**:
- `injectAttrs <function(Element): Element>`: adds classes, id, content, event listeners, attributes, and children
- `render <function(): Element>`: creates the element and passes through `this.injectAttrs`


## Class: `SvgElem` extends `Elem`
**methods**:
- `render <function(): Element>`: creates the element and passes through `this.injectAttrs`
  - uses `createElementNS` rather than `createElement`

## Class: `HashRouter`
**params**:
- `root <Element>`: document node that the router attaches to
- `routes <[]object>`: list of routes 
  - each route has is an object with the following properties: 
    - `path <string>`: path that `window.location.hash` is set to
    - `component <Elem>`: element that is attached to `this.root`
    - `redirect <string>`: path to redirect to (takes precedence over `component`)

**methods**
- `push <function(string): void>`: emits a `routechange` event with passed route string
- `addRoutes <function([]object): void>`: registers additional routes
- `getRoute <function(string): object>`: finds `route` object in `this.routes` corresponding to the passed `path`

## Class `Sketch`
**params**:
- `root <Element>`: document node that `sketch` attaches to
- `children <[]object | function(object): []>`: list of children
  - each child can be an instance of `Element | HTMLDocument` or a generic object
    - if the child is a generic object, it will be passed through the `Elem` constructor and rendered
  - if `children` is a function, it will be called with `this.state`
- `classes <[]string>`: element classes
  - array of class names
- `state <object>`: object for element state to be passed to functional children

**methods**:
- `render <function(): Element>`: updates state and redraws
- `animate <function(): void>`: animation loop called at end of constructor

## `SvgElem` factories

### `circle`
**params**:
- `x <float>`: x position of circle's center
- `y <float>`: y position of circle's center
- `r <float>`: radius of circle
- `options`: object containing:
  - `fill <string>`: shape fill color (default: `currentColor`)
  - `stroke <string>`: shape stroke color (default: `none`)
  - `weight <string>`: shape stroke weight (default: `none`)
  - `classes <[]string>`: svg elem class list

### `ellipse`
**params**:
- `x <float>`: x position of circle's center
- `y <float>`: y position of circle's center
- `rx <float>`: x radius of circle
- `ry <float>`: y radius of circle
- `options`: object containing:
  - `fill <string>`: shape fill color (default: `currentColor`)
  - `stroke <string>`: shape stroke color (default: `none`)
  - `weight <string>`: shape stroke weight (default: `none`)
  - `classes <[]string>`: svg elem class list

### `rect`
**params**:
- `x <float>`: x position of rectangle's center
- `y <float>`: y position of rectangle's center
- `w <float>`: width of rectangle
- `h <float>`: height of rectangle
- `options`: object containing:
  - `rx <float>`: x radius of rectangle
  - `ry <float>`: y radius of rectangle
  - `fill <string>`: shape fill color (default: `currentColor`)
  - `stroke <string>`: shape stroke color (default: `none`)
  - `weight <string>`: shape stroke weight (default: `none`)
  - `classes <[]string>`: svg elem class list

### `line`
**params**:
- `x1 <float>`: x position of first point
- `y1 <float>`: y position of first point
- `x2 <float>`: x position of second point
- `y2 <float>`: y position of second point
- `options`: object containing:
  - `fill <string>`: shape fill color (default: `currentColor`)
  - `stroke <string>`: shape stroke color (default: `none`)
  - `weight <string>`: shape stroke weight (default: `none`)
  - `classes <[]string>`: svg elem class list

### `polygon`
**params**:
- `points <[]string | string>`: list of points
  - array ex: `[[0, 0], [1, 1], [2, 2]]`
  - string ex: `0, 0 1, 1 2, 2`
- `options`: object containing:
  - `fill <string>`: shape fill color (default: `currentColor`)
  - `stroke <string>`: shape stroke color (default: `none`)
  - `weight <string>`: shape stroke weight (default: `none`)
  - `classes <[]string>`: svg elem class list

### `polyline`
**params**:
- `points <[]string | string>`: list of points
  - array ex: `[[0, 0], [1, 1], [2, 2]]`
  - string ex: `0, 0 1, 1 2, 2`
- `options`: object containing:
  - `fill <string>`: shape fill color (default: `currentColor`)
  - `stroke <string>`: shape stroke color (default: `none`)
  - `weight <string>`: shape stroke weight (default: `none`)
  - `classes <[]string>`: svg elem class list

### `text`
**params**:
- `text <string>`: inner text of node
- `x <float>`: x position of text
- `y <float>`: y position of text
- `options`: object containing:
  - `fill <string>`: text fill color (default: `currentColor`)
  - `fontSize <string>`: text font size (default: `null`)
  - `fontWeight <string>`: text font weight (default: `null`)
  - `classes <[]string>`: svg elem class list

### `image`
**params**:
- `href <string>`: path to image
- `options`: object containing:
  - `x <float>`: x position of image (default: `null`)
  - `y <float>`: y position of image (default: `null`)
  - `width <string | num>`: width of image (default: `null`)
  - `height <string | num>`: height of image (default: `null`)
  - `classes <[]string>`: svg elem class list