const facturama = require("../../Facturama/Facturama/facturama.api")

const listaClientes = () => facturama.Clients.List()
const listaCfdis = (rfc) => facturama.Cfdi.List(rfc)
const descargaCfdi = (idCfdi) => facturama.Cfdi.Download("pdf", "issued", idCfdi)
const mandarCorreo = (idCfdi, email, type = "issued") => facturama.Cfdi.Send(`cfdiId=${idCfdi}&email=${email}&cfdiType=${type}`)
/*
TODO
Extraer lista de facturas (necesitamos RFC)

Mandar correo (ID-cfdi, correo, type_cfdi)

Descargar (idCfdi)

Crear cfdi 

Crear Cliente

Obtener cliente

Obtener producto

*/

module.exports = {
  listaClientes,
  listaCfdis,
  descargaCfdi,
  mandarCorreo
}