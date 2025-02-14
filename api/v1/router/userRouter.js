const facturama = require("../../Facturama/Facturama/facturama.api")
const controller = require("../controller/facturamaController")
const router = require("express").Router()

router.get("/", async (req, res) => {
  try {
    let response = await controller.mandarCorreoController(cfdi, email)
    console.log(response)
    res.json(response)
  } catch (error) {
    res.send(error)
  }
})

let cfdi = "do1N7k-xebPXaL6mYBAJSA2"
let email = "luis.castaneda@noktos.com"

router.get("/send-email", async (req, res) => {
})

module.exports = router