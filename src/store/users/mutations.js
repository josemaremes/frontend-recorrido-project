/**
 * Inicializa el state de users.
 * @param {*} state
 */
export const setDefaultState = (state) => {
  state.deleteDialog = false
  state.userId = null
  state.userList = []
}

/**
 * Setea el estado en el campo userList.
 * @param {*} state
 * @param {*} userList
 */
export const setUserList = (state, userList) => {
  state.userList = userList
}

/**
 * Setea el estado de los campos userId y deleteDialog.
 * @param {*} state
 * @param {*} payload
 */
export const setDeleteDialog = (state, payload) => {
  state.userId = payload.userId
  state.deleteDialog = payload.deleteDialog
}

/**
 * Elimina un item del campo userList.
 * @param {*} state
 * @param {*} userId
 */
export const setDeleteUserId = (state, userId) => {
  state.userList = state.userList.filter(user => user.id !== userId)
}
