const { executeQuery } = require("../../../config/db");

const getStats = async (month, year, id_user) => {
  try {
    let query = `SELECT *
FROM solicitudes
WHERE id_usuario_generador = ?
  AND YEAR(check_in) = ?
  AND MONTH(check_in) = ?;
`
    let params = [id_user, year, month]
    let response = await executeQuery(query, params)
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getStats,
}