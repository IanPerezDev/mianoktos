const { API_STRIPE } = require("../../../../config/auth")
const { API_STRIPE_TEST } = require("../../../../config/auth");
const stripe = require('stripe')(API_STRIPE);
const stripeTest = require('stripe')(API_STRIPE_TEST);
const router = require("express").Router()
const { executeTransaction, executeQuery } = require("../../../../config/db");

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

router.post("/create-payment-intent-card", async (req, res) => {
  try {
    const { amount, currency, id_viajero } = req.body;
    console.log(amount);
    console.log(currency);
    const paymentIntent = await stripeTest.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"], // Tarjetas de crédito/débito
    });
    const query = "INSERT INTO stripe_logs (request, response, precio, id_viajero, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW());";
    const params = [JSON.stringify(req.body), JSON.stringify(paymentIntent), amount / 100, id_viajero];
    const { error } = await executeQuery(query, params);
    if (error) {
      throw new Error('Error al almacenar el Log de payment intent');
    }

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.post("/payment-log-storage", async (req, res) => {
  try {
    const { amount, id_viajero, response_payment } = req.body;
    console.log(amount);
    console.log(response_payment);

    const query = "INSERT INTO stripe_logs (request, response, precio, id_viajero, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW());";
    const params = [JSON.stringify(req.body), JSON.stringify(response_payment), amount / 100, id_viajero];
    const { error } = await executeQuery(query, params);
    if (error) {
      throw new Error('Error al almacenar el Log del payment');
    }

    res.json({ success: true, message: 'Log almacenado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router