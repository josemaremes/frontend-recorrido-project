/**
 * Devuelve el estado de todos los campos almacenados en el store de services.
 * @returns
 */
export default function () {
  return {
    deleteDialog: false,
    serviceId: null,
    serviceList: [],
    showDialog: false
  }
}
