const model = require("../model/facturas")

const create = async (req, res) => {
  try {
    const response = await model.createFactura(req.body)
    res.status(201).json({ message: "Factura creado correctamente", data: response })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

module.exports = {
  create,
}