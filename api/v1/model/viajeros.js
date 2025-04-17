const { executeQuery, executeTransaction } = require("../../../config/db")
const { v4: uuidv4 } = require("uuid")

const createViajero = async (viajero) => {
  try {
    const id_viajero = `via-${uuidv4()}`;

    // Insertar el viajero en la tabla "viajeros"
    const query = "INSERT INTO viajeros (id_viajero, primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, fecha_nacimiento, genero, telefono, nacionalidad, numero_pasaporte, numero_empleado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    const params = [
      id_viajero,
      viajero.primer_nombre,
      viajero.segundo_nombre,
      viajero.apellido_paterno,
      viajero.apellido_materno,
      viajero.correo,
      viajero.fecha_nacimiento,
      viajero.genero,
      viajero.telefono,
      viajero.nacionalidad,
      viajero.numero_pasaporte,
      viajero.numero_empleado,
    ];

    await executeTransaction(query, params, async (result, connection) => {
      console.log("Viajero creado correctamente");

      if (viajero.id_empresas && viajero.id_empresas.length > 0) {
        const query2 = "INSERT INTO viajero_empresa (id_viajero, id_empresa) VALUES (?, ?);";

        for (const id_empresa of viajero.id_empresas) {
          const params2 = [id_viajero, id_empresa];
          await connection.execute(query2, params2);
        }
        console.log("Relaciones viajero-empresa creadas");
      }
    });

    return {
      success: true,
      id_viajero: id_viajero,
    };
  } catch (error) {
    throw error;
  }
};


const readViajero = async () => {
  try {
    const query = "SELECT * FROM viajeros"
    const response = executeQuery(query)
    return response
  } catch (error) {
    throw error;
  }
}
const readViajeroById = async (id) => {
  try {
    const query = `select viajeros.* from viajero_empresa 
join viajeros on viajero_empresa.id_viajero = viajeros.id_viajero
join empresas on viajero_empresa.id_empresa = empresas.id_empresa
where empresas.id_empresa = ?; `
    const response = executeQuery(query, [id])
    return response
  } catch (error) {
    throw error;
  }
}

module.exports = {
  readViajero,
  createViajero,
  readViajeroById
}