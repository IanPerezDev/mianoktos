let model = require("../model/solicitud")

const create = async (req, res) => {
  try {
    let response = await model.createSolicitudYTicket(req.body)
    res.status(201).json({ message: "Solicitud created successfully", data: response })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error', details: error })
  }
}

const read = async (req, res) => {
  try {
    let solicitudes = await model.getSolicitudes()
    res.status(200).json(solicitudes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error', details: error })
  }
}

module.exports = {
  create,
  read
}
