const model = require("../model/pagos");

const create = async (req, res) => {
  try {
    const response = await model.createPagos(req.body);
    res.status(201).json({ message: "Pago creados correctamente", data: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en el servidor", details: error });
  }
};

const read = async (req, res) => {
  try {
    const datosFiscales = await model.readPagos();
    res.status(200).json(datosFiscales);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en el servidor", details: error });
  }
};

module.exports = {
  create,
  read,
};
