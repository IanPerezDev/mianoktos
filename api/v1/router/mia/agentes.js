const middleware = require("../../middleware/validateParams")
const controller = require("../../controller/agentes")
const router = require("express").Router()

router.post("/", middleware.validateParams([]), controller.create)
router.get("/viajeros-con-empresas", middleware.validateParams([]), controller.read);
router.get("/empresas-con-agentes", middleware.validateParams([]), controller.readAgentesCompanies);
router.get("/empresas-con-datos-fiscales", middleware.validateParams([]), controller.readEmpresasDatosFiscales);

module.exports = router