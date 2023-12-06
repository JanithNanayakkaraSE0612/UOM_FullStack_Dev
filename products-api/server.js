var express = require("express")
var app = express()
var db = require("./database.js")
var cron = require('node-cron');
var bodyParser = require("body-parser");
const { request, response } = require("express");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let HTTP_PORT = 8000
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.post("/api/customer/register/", (req, res, next) => {

    try {
        var errors = []

        if (!req.body) {
            errors.push("An invalid input");
        }

        const {
            name,
            address,
            email,
            dateOfBirth,
            gender,
            age,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            timeStamp
        } = req.body;

        const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const creditCardRegEx = /^4[0-9]{12}(?:[0-9]{3})?$/;
        ;

        if(emailRegEx.test(email)!=true){
            res.status(400).send("Invalid Email Address");
            return;
        }
        if(creditCardRegEx.test(cardNumber)!=true){
            res.status(400).send("Invalid Card Number");
            return;
        }
        var sql = 'INSERT INTO customer (name, address, email, dateOfBirth, gender,age , cardHolderName,cardNumber , expiryDate, cvv,timeStamp) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
        var params = [name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv,timeStamp]
        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                res.status(201).json({
                    "message": "customer "+name+" has registered",
                    "customerid": this.lastID
                })
            } 

        });
    } catch (E) {
        res.status(400).send(E);
    }
});

// Root path
app.get("/", (req, res, next) => {
    res.json({ "message": "University of Moratuwa" })
});