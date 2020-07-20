import homeRouter from './home-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/login',
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/view/home/home'),
    children: [...homeRouter],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/login/login'),
    meta: {
      title: '登录',
    },
  },
  {
    redirect: '/404',
    path: '*',
  },
]

export default routes
