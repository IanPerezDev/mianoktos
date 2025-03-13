const router = require("express").Router()
const solicitud = require("../mia/solicitud")
const agentes = require("../mia/agentes")
const empresas = require("../mia/empresas")
const viajeros = require("../mia/viajeros")
const hospedaje = require("../mia/hospedaje")
const impuestos = require("../mia/impuestos")

router.use("/solicitud", solicitud)
router.use("/agentes", agentes)
router.use("/empresas", empresas)
router.use("/viajeros", viajeros)
router.use("/hospedaje", hospedaje)
router.use("/impuestos", impuestos)

module.exports = router