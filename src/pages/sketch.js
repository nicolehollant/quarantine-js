const randomPoints = (n, min=0, max=100) => {
  return Array.from({length: n}).map(() => {
    return [randInt(max, min), randInt(max, min)]
  })
}

const s2 = () => new Sketch({
  root: 'sketch',
  classes: ['fixed', 'w-screen', 'h-screen', 'z-0', 'top-0', 'left-0', 'pointer-events-none'],
  state: {
    width: 100,
    height: 100,
    frame: 0,
    colors: Array.from({length: 10}).map(randomColor),
    points: Array.from({length: 10}).map(() => randomPoints(randInt(15))),
    particles: Array.from({length: 20}).map(() => {
      return {
        x: randInt(100), 
        y: randInt(100), 
        r: randInt(10), 
        fill: randomColor(),
        dx: rand() * 0.5,
        dy: rand() * 0.5
      }
    })
  },
  children: (state) => {
    state.particles.forEach(p => {
      p.x += p.dx
      p.y += p.dy
      if(p.x > state.width) p.x = 0
      if(p.x < 0) p.x = state.width
      if(p.y > state.height) p.y = 0
      if(p.y < 0) p.y = state.height
    })
    return state.particles.map(p => circle(p.x, p.y, p.r, {fill: p.fill})).concat([
      polygon([[10, 10], [10, 40], [30, 50], [80, 40]], {fill: state.colors[1]}),
      ellipse(80, 20, 20, 14, {fill: state.colors[2]}),
      polyline([[30, 30], [20, 90], [30, 70], [84, 78]], {fill: 'none', stroke: state.colors[3]}),
      polyline(state.points[0], {fill: 'none', stroke: state.colors[4]}),
      polygon(state.points[1], {fill: state.colors[5]}),
      rect(30, 70, 20, 10, {fill: state.colors[0]}),
      text('Rectangle', 31, 76, {classes: ['text-gray-100'], fontSize: 4})
    ])
  },
})

const sketch = new Elem({
  classes: ['min-h-screen', 'bg-teal-900', 'relative'],
  mounted() {
    s2()
  },
  children: [
    navbar,
    clicker({content: 'different text for this?', count: 2000}),
    card({
      classes: ['max-w-md', 'm-auto', 'z-10', 'relative', 'opacity-75'],
      children: [
        { bg: 'bg-blue-700', content: 'Oh hi' },
        { bg: 'bg-indigo-700', content: 'Hello there!' },
        { bg: 'bg-purple-700', content: 'And howdy 👩‍🌾' },
      ].map(e => ({
        classes: ['p-2', 'my-2', 'rounded-full', 'text-white', 'flex', 'justify-center', 'items-center'].concat([e.bg]),
        content: e.content
      }))
    }),
    { id: 'sketch' }
  ]
})