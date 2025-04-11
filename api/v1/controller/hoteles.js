const model = require("../model/hoteles")

const readGroupByHotel = async (req, res) => {
  try {
    const agentes = await model.getHotelesWithCuartos()
    res.status(200).json(agentes)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

module.exports = {
  readGroupByHotel
}