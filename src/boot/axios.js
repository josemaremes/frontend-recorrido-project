import { boot } from 'quasar/wrappers'
import { QSpinnerGears } from 'quasar'
import Swal from 'sweetalert2'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', headers: {
    'Content-Type': 'application/json'
  }
})

export default boot(({ app, router, store }) => {
  // Establecer variables globales
  app.config.globalProperties.$api = api
  app.config.globalProperties.$Swal = Swal
  app.config.globalProperties.$QSpinnerGears = QSpinnerGears

  // Proteger rutas
  router.beforeResolve((to, _, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!store.state.auth.isAuthenticated || !store.state.auth.token) {
        router.push({ path: '/auth/login' })
      }
    }
    next()
  })
})

export { axios, api }