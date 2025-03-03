const controller = require("../controller/solicitudMia")
const router = require("express").Router()

router.post("/create", controller.create)
router.get("/read", controller.read)

module.exports = router
