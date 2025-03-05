const controller = require("../../controller/solicitud")
const router = require("express").Router()
const middleware = require("../../middleware/validateParams")

const requiredParamsToCreate = ['confirmation_code', 'id_viajero', 'hotel_name', 'check_in', 'check_out', 'room_type', 'total_price', 'status']
router.post("/", middleware.validateParams(requiredParamsToCreate), controller.create)
router.get("/", controller.read)

module.exports = router