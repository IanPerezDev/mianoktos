const router = require("express").Router()
const middleware = require("../../middleware/validateParams")
const controller = require("../../controller/viajeros")

router.post("/", middleware.validateParams(["id_empresas", "primer_nombre", "apellido_paterno", "correo"]), controller.create)
router.get("/", controller.read)

module.exports = router