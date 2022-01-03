/**
 * Inicializa el state de workshift.
 * @param {*} state
 */
export const setDefaultState = (state) => {
  state.contract = ""
  state.editDialog = false
  state.period = ""
  state.service = ""
  state.workshiftList = []
  state.week = ""
}

/**
 * Setea el estado en el campo workshiftList.
 * @param {*} state
 * @param {*} workshiftList
 */
export const setWorkshiftList = (state, workshiftList) => {
  state.workshiftList = workshiftList
}

/**
 * Setea el estado del campo editDialog.
 * @param {*} state
 * @param {*} payload
 */
export const setEditDialog = (state, payload) => {
  state.contract = payload.contract
  state.editDialog = payload.editDialog
  state.period = payload.period
  state.service = payload.service
  state.workshiftList = payload.workshiftList
  state.week = payload.week
}
