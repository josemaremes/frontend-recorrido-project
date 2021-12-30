/**
 * Permite a un usario hacer login dentro de la applicación y de esa forma poder almacenar
 * la información del token y del usuario autenticado.
 * @param {*} param0
 * @param {*} payload
 */
export const signIn = async ({ commit }, payload) => {
  console.log(payload)
}

/**
 * Desloguea a un usuario de la applicación y actualiza las variables del store.
 * @param {*} param0
 * @param {*} payload
 */
export const signOut = async ({ commit }, payload) => {

}