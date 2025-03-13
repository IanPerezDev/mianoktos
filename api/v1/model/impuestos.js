const { executeTransaction, executeQuery } = require("../../../config/db");


const getImpuestos = async () => {
  try {
    let query = `SELECT * FROM impuestos`;
    let response = await executeQuery(query);
    return response;

  } catch (error) {
    throw error;
  }
}

module.exports = {
  getImpuestos
}