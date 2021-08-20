const Router = require("express").Router();
const PaymentController = require("../controllers/payment");

Router.post("/create-checkout-session",PaymentController.CREATE_SESSION)
Router.post("/payment-success",PaymentController.PAYMENT_ACCEPTED);

module.exports = Router;