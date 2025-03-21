const router = require("express").Router()
const middleware = require("../../middleware/validateParams")
const controller = require("../../controller/pagos")

router.post("/", controller.create)
router.get("/", controller.read)

module.exports = router