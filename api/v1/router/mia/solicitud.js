const controller = require("../../controller/solicitud")
const router = require("express").Router()
const middleware = require("../../middleware/validateParams")

const requiredParamsToCreate = ["solicitudes"]
router.post("/", middleware.validateParams(requiredParamsToCreate), controller.create)
router.get("/", controller.read)

module.exports = router