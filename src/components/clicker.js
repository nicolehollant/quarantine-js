const clicker = (props = {}) => new Elem({
  classes: ['bg-gray-100', 'flex', 'flex-col', 'border', 'border-gray-400', 'rounded-lg', 'w-48', 'mx-auto', 'my-4', 'p-4', 'justify-around', 'items-center'],
  state: {
    count: props.count || 0,
  },
  children: (state) => [
    {
      id: 'count',
      classes: ['text-green-700', 'font-semibold'],
      content: `Count: ${state.count}`,
    },
    {
      tag: 'button',
      content: props.content || "click me!",
      events: {
        click: () => {
          state.count++
          document.getElementById('count').innerText = `Count: ${state.count}`
        }
      }
    }
  ]
})