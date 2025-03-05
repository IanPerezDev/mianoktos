const { API_KEY } = require("../config/auth")

function checkApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'No autorizado: API Key incorrecta o faltante' });
  }

  next();
}

function validandoParametros(req, res, next) {
  const requireParams = []
  try {

    const missingParams = validateParams(req.body, requireParams)
    if (missingParams.length > 0) {
      return res.status(400).json({ error: 'Faltan parametros requeridos', missingParams })
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

module.exports = {
  checkApiKey
}