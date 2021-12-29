
const routes = [
  { path: "/", redirect: "/auth/login" },
  {
    path: "/auth/",
    component: () => import("layouts/OutLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("pages/Auth/Login.vue"),
      },
      {
        path: "register",
        component: () => import("pages/Auth/Register.vue"),
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/available-hours', component: () => import('pages/AvailableHours') },
      { path: '/contracts', component: () => import('pages/Contracts') },
      { path: '/services', component: () => import('pages/Services') },
      { path: '/users', component: () => import('pages/Users') },
      { path: '/work-shifts', component: () => import('pages/WorkShifts') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
