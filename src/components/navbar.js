const navlink = (content, name) => ({ 
  tag: 'button',
  content: content, 
  classes: ['rounded', 'px-2', 'hover:text-indigo-700', 'hover:underline', 'focus:outline-none', 'focus:bg-indigo-700', 'focus:text-indigo-100'],
  events: { 
    click: () => router.push(name) 
  } 
})

const navbar = new Elem({
  tag: 'div',
  classes: ['w-full', 'bg-gray-400', 'text-gray-900', 'font-medium', 'z-10', 'relative'],
  children: [
    {
      classes: ['max-w-3xl', 'flex', 'justify-around', 'items-center', 'm-auto', 'p-4'],
      children: [
        navlink('Home', '/home'),
        navlink('About', '/about'),
        navlink('Contact', '/contact'),
        navlink('Sketch', '/sketch'),
      ]
    }
  ]
})