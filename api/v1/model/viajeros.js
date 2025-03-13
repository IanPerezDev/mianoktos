const { executeQuery } = require("../../../config/db")
const { v4: uuidv4 } = require("uuid")

const createViajero = async (viajero) => {
  try {
    const id_viajero = `via-${uuidv4()}`
    const query = "INSERT INTO viajeros (id_viajero, id_empresa, primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, fecha_nacimiento, genero, telefono) VALUES (?,?,?,?,?,?,?,?,?,?)"
    const params = [id_viajero, viajero.id_empresa, viajero.primer_nombre, viajero.segundo_nombre, viajero.apellido_paterno, viajero.apellido_materno, viajero.correo, viajero.fecha_nacimiento, viajero.genero, viajero.telefono]

    const response = executeQuery(query, params)
    return response
  } catch (error) {
    throw error;
  }
}
const readViajero = async () => {
  try {
    const query = "SELECT * FROM viajeros"
    const response = executeQuery(query)
    return response
  } catch (error) {
    throw error;
  }
}

module.exports = {
  readViajero,
  createViajero
}