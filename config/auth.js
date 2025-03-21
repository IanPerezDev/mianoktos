require("dotenv").config()

const API_KEY = process.env.APIKEY
const API_STRIPE = process.env.API_STRIPE
const valuesFacturama = {
  token: process.env.TOKEN_FACTURAMA,
  useragent: process.env.USERAGENT_FACTURAMA,
  url: process.env.URL_FACTURAMA
};

const API_STRIPE_TEST = process.env.API_STRIPE_TEST
const API_SENDGRID = process.env.API_SENDGRID

module.exports = {
  API_KEY,
  API_STRIPE,
  API_STRIPE_TEST,
  API_SENDGRID,
  valuesFacturama
}