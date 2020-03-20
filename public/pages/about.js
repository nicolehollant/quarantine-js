const about = () => new Elem({
  classes: ['min-h-screen', 'bg-gray-200'],
  children: [
    navbar,
    card({ 
      classes: 'flex flex-col justify-between items-center text-center',
      children: [
        { content: 'About', classes: 'font-semibold text-xl' },
        {
          classes: 'mt-4 text-center',
          children: [
            {content: 'routes defined in main.js'},
            {content: 'components defined in /components'},
            {content: 'pages defined in /pages'},
          ]
        },
        clicker({content: 'Also click me!', count: -10})
      ]
    })
  ]
})