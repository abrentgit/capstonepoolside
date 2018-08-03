'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const menuSchema = mongoose.Schema({
    name: String, 
    dishes: [dishSchema],
    beverages: [beverageSchema],
});

const orderSchema = mongoose.Schema({
    guestNames: [guestSchema],required: true,
    dishes: [dishSchema], required: true,
    beverages: [beverageSchema], required: true,
    created_at: Date,
    deliveryTime: Date, required: true,
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
    email: String, required: true, unique: true,
    room: String, required: true
});

const staffSchema = mongoose.Schema({
    name: String, required: true,
    email: String, required: true, unique: true, 
    password: String, required: true,
    role: String,
});

orderSchema.methods.serialize = function() {
    return {
      id: this._id,
      guests: this.guest,
      dishes: this.dishes,
      beverages: this.beverages,
      location: this.location,
      created_at: this.created_at,
      deliveryTime: this.deliveryTime,
      notes: this.notes
    };
};

menuSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        dishes: this.dishes,
        beverages: this.beverages,
    }
}

const Order = mongoose.model('Order', orderSchema);
const Menu = mongoose.model('Menu', menuSchema);

module.exports = { Order };
module.exports = { Menu };

