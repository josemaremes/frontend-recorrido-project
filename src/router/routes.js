
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
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/available-hours', component: () => import('pages/AvailableHours'), meta: {
          requiresAuth: true,
        }
      },
      {
        path: '/contracts', component: () => import('pages/Contracts'), meta: {
          requiresAuth: true,
        }
      },
      {
        path: '/services', component: () => import('pages/Services'), meta: {
          requiresAuth: true,
        }
      },
      {
        path: '/users', component: () => import('pages/Users'), meta: {
          requiresAuth: true,
        }
      },
      {
        path: '/work-shifts', component: () => import('pages/WorkShifts'), meta: {
          requiresAuth: true,
        }
      },
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
