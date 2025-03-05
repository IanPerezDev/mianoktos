const validateParams = (requiredParams) => {

  return (req, res, next) => {

    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
      return res.status(400).json({ error: 'Faltan parametros requeridos', details: { missingParams } })
    }

    next()
  }
}

module.exports = {
  validateParams
}