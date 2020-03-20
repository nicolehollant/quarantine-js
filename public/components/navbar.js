const navlink = (content, name) => ({ 
  tag: 'button',
  content: content, 
  classes: 'font-semibold rounded px-2 hover:text-green-900 hover:underline focus:outline-none focus:bg-green-800 focus:text-white',
  events: { click: () => router.push(name) } 
})

const navbar = new Elem({
  classes: 'w-full bg-green-400 text-gray-900 z-10 relative border-t-4 border-green-700 shadow',
  children: [
    {
      classes: 'max-w-sm flex justify-around items-center m-auto p-4',
      children: [
        navlink('Home', '/home'),
        navlink('About', '/about'),
      ]
    }
  ]
})