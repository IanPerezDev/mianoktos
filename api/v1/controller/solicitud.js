let model = require("../model/solicitud")

const create = async (req, res) => {
  try {
    let response = await model.createSolicitudes(req.body)
    res.status(201).json({ message: "Solicitud created successfully", data: response })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error', details: error.message })
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
const readClient = async (req, res) => {
  try {
    let solicitudes = await model.getSolicitudesClient()
    res.status(200).json(solicitudes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error', details: error })
  }
}
const readSolicitudById = async (req, res) => {
  try {
    const {id} = req.query
    let solicitudes = await model.getSolicitudById(id)
    res.status(200).json(solicitudes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error', details: error })
  }
}

module.exports = {
  create,
  read,
  readClient,
  readSolicitudById
}
