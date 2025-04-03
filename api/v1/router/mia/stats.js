const controller = require("../../controller/stats")
const router = require("express").Router()

router.get("/monthly", controller.getCardStats)

module.exports = router