// paymentModel.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    payment_id: {
        type: String,
        required: true
    },
    cash: String,
    bank: String,
    date: String,
    image: String

    
});

const PaymentModel = mongoose.model('Pays', paymentSchema);

module.exports = PaymentModel;
