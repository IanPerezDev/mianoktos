const controller = require("../../controller/etiquetas")
const router = require("express").Router()
const middleware = require("../../middleware/validateParams")

const requiredParamsToCreate = ["nombre","color","tipo_tag"]
router.post("/", middleware.validateParams(requiredParamsToCreate), controller.create)
router.get("/", controller.read)
router.get("/get-tags-agente", controller.readTagsClient)

module.exports = router