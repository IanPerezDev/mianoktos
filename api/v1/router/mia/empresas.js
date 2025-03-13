const router = require("express").Router()
const controller = require("../../controller/empresas")
const middleware = require("../../middleware/validateParams")

router.post("/", middleware.validateParams(["razon_social", "rfc", "nombre_comercial", "direccion", "direccion_fiscal", "codigo_postal_fiscal", "regimen_fiscal"]), controller.create)

router.get("/", controller.read)

module.exports = router