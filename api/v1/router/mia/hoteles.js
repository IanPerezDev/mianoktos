const router = require("express").Router()
const controller = require("../../controller/hoteles")

router.get("/", controller.readGroupByHotel)

module.exports = router