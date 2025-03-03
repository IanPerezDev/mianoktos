const validateParams = (params, requiredParams) => {
  const missingParams = requiredParams.filter(param => !params[param]);
  return missingParams
}

module.exports = {
  validateParams
}