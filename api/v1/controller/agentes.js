const model = require("../model/agentes")

const create = async (req, res) => {
  try {

    const response = await model.createAgente(req.body);

    res.status(201).json({ message: "Agente creado correctamente", data: response })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

const read = async (req, res) => {

  try {
    const { id_agente } = req.query;
    const agentes = await model.getAgente(id_agente);

    res.status(200).json({ data: agentes })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

const readAgentesCompanies = async (req, res) => {
  try {
    const { id_agente } = req.query;
    const agentes = await model.getAgenteEmpresa(id_agente);

    res.status(200).json({ data: agentes })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

const readEmpresasDatosFiscales = async (req, res) => {
  try {
    const { id_agente } = req.query;
    const agentes = await model.getEmpresasDatosFiscales(id_agente);

    res.status(200).json({ data: agentes })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

const readAgentes = async (req, res) => {
  try {
    const agentes = await model.getAllAgentes();

    res.status(200).json({ data: agentes })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}


module.exports = {
  create,
  read,
  readAgentesCompanies,
  readEmpresasDatosFiscales,
  readAgentes,
}