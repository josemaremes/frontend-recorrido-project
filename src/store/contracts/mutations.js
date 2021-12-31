/**
 * Inicializa el state de contracts.
 * @param {*} state
 */
export const setDefaultState = (state) => {
  state.contractList = []
}

/**
 * Setea la información del token en el state de contracts.
 * @param {*} state
 * @param {*} contractList
 */
export const setContractList = (state, contractList) => {
  state.contractList = contractList
}
