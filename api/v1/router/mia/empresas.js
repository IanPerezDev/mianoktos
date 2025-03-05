const router = require("express").Router()
const controller = require("../../controller/empresas")
const middleware = require("../../middleware/validateParams")

router.post("/", middleware.validateParams([]), controller.create)
router.get("/", middleware.validateParams([]), controller.read)

module.exports = router