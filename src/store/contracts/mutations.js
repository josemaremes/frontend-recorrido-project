/**
 * Inicializa el state de contracts.
 * @param {*} state
 */
export const setDefaultState = (state) => {
  state.contractList = []
  state.deleteDialog = false
  state.showDialog = false
}

/**
 * Setea el estado del campo contractList.
 * @param {*} state
 * @param {*} contractList
 */
export const setContractList = (state, contractList) => {
  state.contractList = contractList
}

/**
 * Agrega un item al campo contractList.
 * @param {*} state
 * @param {*} contractItem
 */
export const setContractItem = (state, contractItem) => {
  state.contractList.push(contractItem)
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
 * Setea el estado de los campos contractId y deleteDialog.
 * @param {*} state
 * @param {*} payload
 */
export const setDeleteDialog = (state, payload) => {
  state.contractId = payload.contractId
  state.deleteDialog = payload.deleteDialog
}

/**
 * Elimina un item del campo contractList.
 * @param {*} state
 * @param {*} contractItem
 */
export const setDeleteContractId = (state, contractId) => {
  state.contractList = state.contractList.filter(contract => contract.id !== contractId)
}
