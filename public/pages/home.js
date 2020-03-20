const home = () => new Elem({
  classes: ['min-h-screen', 'bg-gray-200'],
  children: [
    navbar,
    {
      classes: 'max-w-2xl m-auto',
      children: [
        card({
          classes: 'text-lg font-semibold text-center',
          children: [
            { classes: 'text-2xl text-green-800', content: 'QuarantineJS Default App!' },
            { classes: 'text-base font-medium text-gray-800', content: 'Check out the repo at ' },
            { 
              tag: 'a', 
              classes: 'text-indigo-700',
              content: 'https://github.com/colehollant/svg-processing',
              properties: { href: 'https://github.com/colehollant/svg-processing' }
            },
            { id: 'sketch', classes: 'w-64 h-64 mx-auto mt-4 border border-green-800' },
            clicker({content: 'Click me!', count: 0}),
          ]
        }),
      ]
    }
  ],
  mounted() {
    new Sketch({
      root: 'sketch',
      state: {
        tracking: 0,
        width: 100,
        height: 100,
        particles: Array.from({length: 20}).map(() => ({
            x: randInt(100), 
            y: randInt(100), 
            r: randInt(10), 
            fill: randomColor(0.6),
            dx: rand() * 0.5,
            dy: rand() * 0.5,
          })
        )
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
        return [
          image('/assets/logo.png', {
            width: '100%',
            height: '100%',
          }),
          rect(state.particles[0].x - 16, state.particles[0].y - 6, 32,  10, {
            classes: ['text-gray-900'],
            rx: 4,
            ry: 4
          }),
          text('QuarantineJS', state.particles[0].x - 12, state.particles[0].y, {classes: ['text-gray-100'], fontSize: 4})
        ].concat(state.particles.slice(1).map(p => circle(p.x, p.y, p.r, {fill: p.fill})))
      }
    })
  }
})