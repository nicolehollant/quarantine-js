const notFound = () => new Elem({
  classes: ['min-h-screen', 'bg-gray-200'],
  children: [
    navbar,
    card({ content: '404 page not found 😢' }),
  ]
})