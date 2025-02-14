const { API_STRIPE } = require("../../../config/auth")
const stripe = require('stripe')(API_STRIPE);
const router = require("express").Router()

router.post('/create-checkout-session', async (req, res) => {
  const { payment_data } = req.body
  const session = await stripe.checkout.sessions.create(payment_data);
  res.json(session)
});

router.get("/get-checkout-session", async (req, res) => {
  const { id_checkout } = req.query
  const checkout = await stripe.checkout.sessions.retrieve(id_checkout)
  console.log(checkout)
  res.json(checkout)

})

module.exports = router