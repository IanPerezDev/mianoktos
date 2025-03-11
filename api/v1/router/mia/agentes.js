const middleware = require("../../middleware/validateParams")
const controller = require("../../controller/agentes")
const router = require("express").Router()

router.post("/", middleware.validateParams([]), controller.create)
router.get("/", middleware.validateParams([]), controller.read)

module.exports = router