const { API_STRIPE } = require("../../../../config/auth")
const stripe = require('stripe')(API_STRIPE);
const router = require("express").Router()

router.post('/create-checkout-session', async (req, res) => {
  try {

    const { payment_data } = req.body
    const session = await stripe.checkout.sessions.create(payment_data);
    res.json(session)

  } catch (error) {
    console.log(error)
    res.json(error)
  }
});

router.get("/get-checkout-session", async (req, res) => {
  try {

    const { id_checkout } = req.query
    const checkout = await stripe.checkout.sessions.retrieve(id_checkout)
    console.log(checkout)
    res.json(checkout)

  } catch (error) {
    console.log(error)
  }
})

module.exports = router