/**
 * Devuelve el estado de todos los campos almacenados en el store de users.
 * @returns
 */
export default function () {
  return {
    deleteDialog: false,
    showDialog: false,
    userId: null,
    userList: []
  }
}
