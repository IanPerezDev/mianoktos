const router = require("express").Router()
const controller = require("../../controller/empresas")
const middleware = require("../../middleware/validateParams")

router.post("/", middleware.validateParams(["agente_id", "razon_social", "nombre_comercial", "tipo_persona"]), controller.create)

router.get("/id", controller.readbyId)
router.get("/", controller.read)
router.put("/", controller.update);

module.exports = router