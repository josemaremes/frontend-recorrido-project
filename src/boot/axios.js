import { boot } from 'quasar/wrappers'
import Swal from 'sweetalert2'
import { QSpinnerGears } from 'quasar'
import axios from 'axios'


const api = axios.create({
  baseURL: 'http://localhost:3000', headers: {
    'Content-Type': 'application/json'
  }
})

export default boot(({ app }) => {
  // app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  app.config.globalProperties.$Swal = Swal
  app.config.globalProperties.$QSpinnerGears = QSpinnerGears
})

export { axios, api }