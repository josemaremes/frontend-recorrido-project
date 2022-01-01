/**
 * Inicializa el state de auth.
 * @param {*} state
 */
export const setDefaultState = (state) => {
  state.isAuthenticated = false
  state.token = ''
  state.user = {}
}

/**
 * Setea la información del token en el state de auth.
 * @param {*} state
 * @param {*} token
 */
export const setToken = (state, token) => {
  state.token = token
  state.isAuthenticated = true
}

/**
 * Setea la información del usuario autenticado en el state de auth.
 * @param {*} state
 * @param {*} token
 */
export const setUser = (state, user) => {
  state.user = user
}