const card = (props = {}) => {
  if(!props.classes) {
    console.log("AHHHHHH", ['rounded-lg bg-white shadow-md p-4 m-4', props.classes].join(' '))
    props.classes = ''
  }
  if(typeof props.classes === 'array') props.classes = props.classes.join(' ')
  return new Elem({
    classes: ['rounded-lg bg-white shadow-md p-4 m-4', props.classes].join(' '),
    content: props.content,
    children: props.children || []
  })
}