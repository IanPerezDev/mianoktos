const router = require("express").Router()
const middleware = require("../../middleware/validateParams")
const controller = require("../../controller/viajeros")

router.post("/", middleware.validateParams(["id_empresas", "primer_nombre", "apellido_paterno"]), controller.create)
router.get("/", controller.read)
router.get("/id", controller.readById)

module.exports = router