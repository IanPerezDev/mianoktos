const model = require("../model/reservas");

const create = async (req, res) => {
  try {
    let response = await model.insertarReserva(req.body);
    res
      .status(201)
      .json({ message: "Solicitud created successfully", data: response });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const createFromOperaciones = async (req, res) => {
  try {
    let response = await model.createReservaFromOperaciones(req.body);
    res
      .status(201)
      .json({ message: "Solicitud created successfully", data: response });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const read = async (req, res) => {
  try {
    let response = await model.getReserva();
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
const readById = async (req, res) => {
  try {
    let response = await model.getReservaById(req.query.id);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
const readAll = async (req, res) => {
  try {
    let response = await model.getReservaAll(req.query.id);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {
  create,
  read,
  readById,
  readAll,
  createFromOperaciones,
};
