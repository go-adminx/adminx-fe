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
    path: '/:module',
    routes: [
      {
        path: '/:model',
        component: '@/pages/[module]/[model]/index',
      },
      {
        path: '/:model/:id',
        component: '@/pages/[module]/[model]/[id]',
      }
    ],
  },
  {
    component: './404',
  }
];
