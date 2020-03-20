var router = {}

window.onload = () => {
  const root = document.getElementById('app')
  
  const routes = [
    { route: '/', redirect: '/home' },
    { route: '/home', component: home },
    { route: '/about', component: about },
    { route: '/sketch', component: sketch },
    { route: '*', component: notFound },
  ]
  
  router = new HashRouter(root, routes)
  
  console.log({router})
}