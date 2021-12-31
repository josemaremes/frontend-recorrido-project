/**
 * Inicializa el state de users.
 * @param {*} state
 */
export const setDefaultState = (state) => {
    state.employeeList = []
}

/**
 * Setea la información del token en el state de users.
 * @param {*} state
 * @param {*} employeeList
 */
export const setEmployeeList = (state, employeeList) => {
    state.employeeList = employeeList
}
