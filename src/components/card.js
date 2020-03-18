const card = (props = {}) => new Elem({
  classes: ['rounded-lg', 'bg-gray-200', 'border', 'border-gray-300', 'p-4', 'm-4'].concat(props.classes || []),
  content: props.content,
  children: props.children || []
})