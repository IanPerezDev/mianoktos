const router = require("express").Router()
const controller = require("../../controller/reservas")
const middleware = require("../../middleware/validateParams")

const requiredParamsToCreate = ["estado", "check_in", "check_out", "id_viajero", "nombre_hotel", "total", "subtotal", "impuestos", "tipo_cuarto", "noches", "costo_subtotal", "costo_total", "costo_impuestos", "codigo_reservacion_hotel", "items"]

router.post("/operaciones", middleware.validateParams(requiredParamsToCreate), controller.createFromOperaciones)
router.post("/", middleware.validateParams(requiredParamsToCreate), controller.create)
router.get("/", controller.read)
router.get("/agente", controller.readById)

module.exports = router