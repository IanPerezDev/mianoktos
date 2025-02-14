require("dotenv").config()

const API_KEY = process.env.APIKEY
const API_STRIPE = process.env.API_STRIPE

module.exports = {
  API_KEY,
  API_STRIPE
}