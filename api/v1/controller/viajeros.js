
const create = async (req, res) => {
  const requiredParamsToCreate = []

  try {

    const missingParams = validateParams(req.body, requiredParamsToCreate)
    if (missingParams.length > 0) {
      return res.status(400).json({ error: 'Faltan parametros requeridos', missingParams })
    }

    const response = await model.createViajero(req.body)

    res.status(201).json({ message: "Viajero creado correctamente", data: response })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

const read = async (req, res) => {
  const requiredParamsToRead = []

  try {

    const missingParams = validateParams(req.body, requiredParamsToRead)
    if (missingParams.length > 0) {
      return res.status(400).json({ error: 'Faltan parametros requeridos', missingParams })
    }

    const response = await model.readViajero(req.body)

    res.status(201).json({ message: "Viajero creado correctamente", data: response })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}