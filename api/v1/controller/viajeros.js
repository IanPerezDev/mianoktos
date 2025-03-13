const model = require("../model/viajeros");

const create = async (req, res) => {
  try {
    const response = await model.createViajero(req.body)
    res.status(201).json({ message: "Viajero creado correctamente", data: response })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

const read = async (req, res) => {
  try {
    const viajeros = await model.readViajero(req.body)
    res.status(200).json(viajeros)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

module.exports = {
  create,
  read
}