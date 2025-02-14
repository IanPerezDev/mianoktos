let { mandarCorreo } = require("../model/facturamaModel")

const mandarCorreoController = (idCfdi, email, type) => {
  return mandarCorreo(idCfdi, email, type)
}

module.exports = {
  mandarCorreoController
}