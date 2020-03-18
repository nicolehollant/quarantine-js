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