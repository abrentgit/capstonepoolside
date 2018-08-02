'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const menuSchema = mongoose.Schema({
    dish: [dishSchema],
    beverage: [beverageSchema],
});

const orderSchema = mongoose.Schema({
    guestName: [guestSchema],required: true,
    dish: [dishSchema], required: true,
    beverage: [beverageSchema], required: true,
    date: Date,
    delivery: Date, required: true,
    location: String, required: true,
    notes: String
});

const dishSchema = mongoose.Schema({
    name: String, required: true,
    description: String, required: true,
    price: Number, required: true
});

const beverageSchema = mongoose.Schema({
    name: String, required: true,
    description: String, required: true,
    price: Number, required: true
});

const guestSchema = mongoose.Schema({
    name: String, required: true,
    password: String, required: true,
    phone: String, required: true,
    email: String, reqired: true,
    room: String, required: true
});

const staffSchema = mongoose.Schema({
    name: String, required: true,
    password: String, required: true,
    role: String
});

orderSchema.methods.serialize = function() {
    return {
      id: this._id,
      guest: this.guest,
      dish: this.dish,
      beverage: this.beverage,
      location: this.location,
      delivery: this.delivery
    };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };


