/**
 * Inicializa el state de services.
 * @param {*} state
 */
export const setDefaultState = (state) => {
  state.deleteDialog = false
  state.serviceId = null
  state.serviceList = []
}

/**
 * Agrega un item al campo serviceList.
 * @param {*} state
 * @param {*} serviceItem
 */
export const setServiceItem = (state, serviceItem) => {
  state.serviceList.push(serviceItem)
}

/**
 * Setea el estado para el campo serviceList.
 * @param {*} state
 * @param {*} serviceList
 */
export const setServiceList = (state, serviceList) => {
  state.serviceList = serviceList
}

/**
 * Setea el estado del campo showDialog.
 * @param {*} state
 * @param {*} showDialog
 */
export const setShowDialog = (state, showDialog) => {
  state.showDialog = showDialog
}

/**
 * Setea el estado de los campos serviceId y deleteDialog.
 * @param {*} state
 * @param {*} payload
 */
export const setDeleteDialog = (state, payload) => {
  state.serviceId = payload.serviceId
  state.deleteDialog = payload.deleteDialog
}

/**
 * Elimina un item del campo userList.
 * @param {*} state
 * @param {*} serviceId
 */
export const setDeleteServiceId = (state, serviceId) => {
  state.serviceList = state.userList.filter(user => user.id !== serviceId)
}

