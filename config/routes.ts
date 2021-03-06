export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: '@/pages/smc/user/login',
      },
      {
        name: 'signup',
        path: '/user/signup',
        component: '@/pages/smc/user/signup',
      },
    ],
  },
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    component: '@/pages/index',
  },
  {
    path: '/smc/formmeta',
    component: '@/pages/smc/formmeta/index',
  },
  {
    path: '/smc/formmeta/:id',
    component: '@/pages/smc/formmeta/[id]',
  },
  {
    path: '/:module',
    routes: [
      {
        path: '/:module/:model',
        component: '@/pages/[module]/[model]/index',
      },
      {
        path: '/:module/:model/:id',
        component: '@/pages/[module]/[model]/[id]',
      },
    ],
  },
  {
    component: './404',
  }
];
