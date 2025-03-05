const factura = require("./general/factura")
const stripe = require("./general/stripe")
const mia = require("./general/mia")
const router = require("express").Router()

router.use("/factura", factura)
router.use("/stripe", stripe)
router.use("/mia", mia)

module.exports = router