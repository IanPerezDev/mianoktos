const router = require("express").Router()
const middleware = require("../../middleware/validateParams")
const controller = require("../../controller/pagos")

router.post("/", controller.create)
router.get("/", controller.read)
router.get("/empresa", middleware.validateParamsQuery(["id_empresa"]), controller.getEmpresaCredito)
router.get("/agente", middleware.validateParamsQuery(["id_agente"]), controller.getAgenteCredito)
router.get("/todos", controller.getAgenteAgentesYEmpresas)
router.post("/agente", controller.updateCreditAgent)
router.post("/empresa", controller.updateCreditEmpresa)

module.exports = router