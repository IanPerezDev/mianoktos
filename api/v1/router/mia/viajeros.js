const router = require("express").Router()
const middleware = require("../../middleware/validateParams")
const controller = require("../../controller/viajeros")

router.post("/", middleware.validateParams(["id_empresa", "primer_nombre", "segundo_nombre", "apellido_paterno", "apellido_materno", "correo", "fecha_nacimiento", "genero", "telefono"]), controller.create)
router.get("/", controller.read)

module.exports = router