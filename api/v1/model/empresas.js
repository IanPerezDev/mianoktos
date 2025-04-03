const { executeQuery, executeTransaction } = require("../../../config/db");
const { v4: uuidv4 } = require("uuid");

const createEmpresa = async (empresa) => {
  try {
    const id_empresa = `emp-${uuidv4()}`;

    const query = `
      INSERT INTO empresas (
        id_empresa, razon_social, nombre_comercial, tipo_persona, 
        calle, colonia, estado, municipio, codigo_postal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    let params = [
      id_empresa,
      empresa.razon_social,
      empresa.nombre_comercial,
      empresa.tipo_persona,
      empresa.calle || null,
      empresa.colonia || null,
      empresa.estado || null,
      empresa.municipio || null,
      empresa.codigo_postal || null,
    ];

    const response = await executeTransaction(query, params, async (result, connection) => {
      console.log("Se crea empresa");

      const query2 = "INSERT INTO empresas_agentes (id_empresa, id_agente) VALUES (?, ?);";
      const params2 = [id_empresa, empresa.agente_id];

      try {
        const result = await connection.execute(query2, params2);
        console.log("Se crea agente empresa");
        return result;
      } catch (error) {
        throw error;
      }
    });

    return {
      success: true,
      id_empresa: id_empresa,
    };
  } catch (error) {
    throw error;
  }
};



const getEmpresas = async () => {
  try {
    const query = "SELECT * FROM empresas"
    const response = await executeQuery(query)
    return response
  } catch (error) {
    throw error
  }
}

module.exports = {
  createEmpresa,
  getEmpresas
}