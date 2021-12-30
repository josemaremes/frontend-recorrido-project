/**
 * Devuelve el estado de todos los campos almacenados en el store de auth.
 * @returns 
 */
export default function () {
  return {
    isAuthenticated: false,
    user: {},
    token: ''
  }
}
