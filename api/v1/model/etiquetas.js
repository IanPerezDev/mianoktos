const { executeTransaction, executeQuery } = require("../../../config/db");
const { v4: uuidv4 } = require("uuid");

const createTag = async (data) => {
  try {
    const id_etiqueta = `tag-${uuidv4()}`;
    console.log(data);
    let query = `INSERT INTO etiquetas (id_etiqueta, name, color, description, tipo_tag, id_agente) VALUES (?,?,?,?,?,?)`;
    let params = [id_etiqueta, data.nombre, data.color, data.description, data.tipo_tag, data.id_agente];
    let response = await executeQuery(query, params);
    return response;
  } catch (error) {
    throw error;
  }
};

const getTags = async () => {
  try {
    
  } catch (error) {
    console.error("Error in getSolicitudes:", error);
    throw error;
  }
};

const getTagsClient = async (id_agente) => {
  try {
    const query = "SELECT * FROM vw_tags_client WHERE id_agente = ?";
    const params = [id_agente];
    const response = await executeQuery(query, params);
    return response;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createTag,
  getTags,
  getTagsClient,
};
