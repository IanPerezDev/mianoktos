let model = require("../model/solicitud")
const { validateParams } = require("../helpers/params")

const requiredParamsToCreate = ['confirmation_code', 'id_viajero', 'hotel_name', 'check_in', 'check_out', 'room_type', 'total_price', 'status']

const create = async (req, res) => {
  try {
    const missingParams = validateParams(req.body, requiredParamsToCreate)
    if (missingParams.length > 0) {
      return res.status(400).json({ error: 'Missing required parameters', missingParams })
    }

    let response = await model.createSolicitudYTicket(req.body)

    res.status(201).json({ message: "Solicitud created successfully" })
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

module.exports = {
  create,
  read
}
