var router = {}

window.onload = () => {
  const root = document.getElementById('app')
  
  const routes = [
    { route: '/', redirect: '/home' },
    { route: '/home', component: home },
    { route: '/about', component: about },
    { route: '*', component: notFound },
  ]
  
  router = new HashRouter(root, routes)
  
  console.log({router})
}