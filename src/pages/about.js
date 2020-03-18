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