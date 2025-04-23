const router = require("express").Router()
const middleware = require("../../middleware/validateParams")
const controller = require("../../controller/viajeros")

router.post("/", middleware.validateParams(["id_empresas", "primer_nombre", "apellido_paterno"]), controller.create)
router.get("/", controller.read)
router.get("/get-viajeros-by-agente/:id_agente",controller.get_viajeros_by_id_agente)
router.get("/get-primer-viajero-empresa/:id_agente",controller.primeros_empresa_viajero)
router.get("/id", controller.readById)
router.put("/", controller.update)

module.exports = router