
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



  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Index.vue'), meta: { requiresAuth: true, admin: false } },
  //   ]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
