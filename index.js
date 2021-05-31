const cors = require('cors');
const express = require('express');
const app = express();
// Add STRIPE KEY
const stripe = require('stripe')("sk_test_51IfHEWFlKHG9mzhPiPudc85WdnxJFDkcMZ0SJWxHXapDp3rIUM95lZsCg5kjJbDBvcXZoTKqemb1cyeU5KiBvI6I00dkq1M0W0");
const uuid = require('uuid').v4;

app.use(express.json())
app.use(cors());

// Routes
app.get("/", (req, res) => {
    res.send("hello")
})

app.post("/payment", (req, res) => {
    const { product, token } = req.body;
    const idempotencyKey = uuid();
    console.log(product)
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: product.name,
        }, { idempotencyKey })
    }).then(result => {
        console.log(result)
        res.status(200).json(result)
    }).catch(err => console.log(err))
})


// Listening to server
app.listen(5000, () => {
    console.log("Server Started on port 5000")
})