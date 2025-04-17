const router = require("express").Router()
const middleware = require("../../middleware/validateParams")
const controller = require("../../controller/facturas")

router.post("/", middleware.validateParams(["info_user", "cfdi"]), controller.create)

module.exports = router