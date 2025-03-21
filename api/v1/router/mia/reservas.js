const router = require("express").Router()
const controller = require("../../controller/reservas")
const middleware = require("../../middleware/validateParams")

const requiredParamsToCreate = ["id_servicio", "estado", "check_in", "check_out", "id_viajero", "nombre_hotel", "total", "subtotal", "impuestos", "tipo_cuarto", "noches", "costo_subtotal", "costo_total", "costo_impuestos", "codigo_reservacion_hotel", "items"]
router.post("/", middleware.validateParams(requiredParamsToCreate), controller.create)
router.get("/", controller.read)

module.exports = router