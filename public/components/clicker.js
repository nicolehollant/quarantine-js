const clicker = (props = {}) => new Elem({
  classes: 'my-4 mx-auto',
  state: {
    count: props.count || 0,
  },
  children: (state) => [
    {
      id: 'count',
      classes: 'text-green-800 font-semibold',
      content: `Count: ${state.count}`,
    },
    {
      tag: 'button',
      classes: 'mt-2 px-2 py-1 rounded-lg font-semibold bg-green-300 focus:outline-none focus:shadow-outline',
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