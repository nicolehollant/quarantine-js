const home = new Elem({
  classes: ['min-h-screen', 'bg-blue-900'],
  children: [
    navbar,
    clicker({content: 'Please click me', count: -12}),
    card({content: 'does this work?'})
  ]
})