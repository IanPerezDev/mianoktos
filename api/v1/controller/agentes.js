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

    const agentes = await model.getAgentes()

    res.status(200).json(agentes)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor', details: error })
  }
}

module.exports = {
  create,
  read
}