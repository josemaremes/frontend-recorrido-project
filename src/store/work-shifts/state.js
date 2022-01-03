/**
 * Devuelve el estado de todos los campos almacenados en el store de workshifts.
 * @returns
 */
export default function () {
  return {
    contract: "",
    editDialog: false,
    period: "",
    service: "",
    workshiftList: [],
    week: "",
  }
}
