const createEmpresa = () => {
  try {
    //Aqui se escribe el codigo
    return { message: "Estoy en creando empresa" }
  } catch (error) {
    throw error
  }
}
const getEmpresas = () => {
  try {
    //Aqui se escribe el codigo
    return { message: "Estoy en obteniendo empresa" }
  } catch (error) {
    throw error
  }
}

module.exports = {
  createEmpresa,
  getEmpresas
}