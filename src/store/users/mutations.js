/**
 * Inicializa el state de users.
 * @param {*} state
 */
export const setDefaultState = (state) => {
    state.userList = []
}

/**
 * Setea la información de los usuarios en el state de users.
 * @param {*} state
 * @param {*} userList
 */
export const setUserList = (state, userList) => {
    state.userList = userList
}
