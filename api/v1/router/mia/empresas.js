const router = require("express").Router()
const controller = require("../../controller/empresas")

router.post("/", controller.create)
router.get("/", controller.read)

module.exports = router