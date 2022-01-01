/**
 * Inicializa el state de services.
 * @param {*} state
 */
export const setDefaultState = (state) => {
    state.serviceList = []
}

/**
 * Setea la información de los servicios en el state de services.
 * @param {*} state
 * @param {*} serviceList
 */
export const setServiceList = (state, serviceList) => {
    state.serviceList = serviceList
}
