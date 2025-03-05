
const create = async (req, res) => {
  const requireParams = []
  try {

    const missingParams = validateParams(req.body, requireParams)
    if (missingParams.length > 0) {
      return res.status(400).json({ error: 'Faltan parametros requeridos', missingParams })
    }

  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}
const read = async (req, res) => {
  const requireParams = []
  try {

    const missingParams = validateParams(req.body, requireParams)
    if (missingParams.length > 0) {
      return res.status(400).json({ error: 'Faltan parametros requeridos', missingParams })
    }

  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}
const update = async (req, res) => {
  const requireParams = []
  try {

    const missingParams = validateParams(req.body, requireParams)
    if (missingParams.length > 0) {
      return res.status(400).json({ error: 'Faltan parametros requeridos', missingParams })
    }

  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}
const cancel = async (req, res) => {
  const requireParams = []
  try {

    const missingParams = validateParams(req.body, requireParams)
    if (missingParams.length > 0) {
      return res.status(400).json({ error: 'Faltan parametros requeridos', missingParams })
    }

  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}