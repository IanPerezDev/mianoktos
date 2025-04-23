const router = require("express").Router()
const controller = require("../../controller/hoteles")

router.get("/", controller.readGroupByHotel)
router.get("/hotelesWithTarifa", controller.readHotelesWithTarifa)

module.exports = router