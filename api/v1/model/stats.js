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
const getStatsPerMonth = async (year, id_user) => {
  try {
    let query = `SELECT 
    DATE_FORMAT(check_in, '%Y-%m') AS mes,
    hotel,
    COUNT(*) AS visitas,
    SUM(total) AS total_gastado
FROM 
    solicitudes
WHERE 
    id_usuario_generador = ?
    AND YEAR(check_in) = ?
GROUP BY 
    mes, hotel
ORDER BY 
    mes DESC, total_gastado DESC;
;
`
    let params = [id_user, year]
    let response = await executeQuery(query, params)
    return response;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  getStats,
  getStatsPerMonth
}