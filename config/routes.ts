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
    ],
  },
  {
    component: './404',
  }
];
