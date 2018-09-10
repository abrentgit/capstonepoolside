'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bcrypt = require('bcryptjs'); // added b-crypt

const dishSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
});

const beverageSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
});

const guestSchema = mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, trim: true, required: true },
    phone: { type: String },
    email: { type: String, required: true, trim: true, unique: true },
    room: { type: String }
});

const staffSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
});

// dishes and beverages are arrays of objects


const menuSchema = mongoose.Schema({
    name: { type: String },
    dishes: [dishSchema],
    beverages: [beverageSchema]
});


// dishes guests and beverages are an array of objects
// NEED TO ADD REQUIRED TRUES

const orderSchema = new mongoose.Schema({
    guests: [guestSchema],
    dishes: [dishSchema],
    beverages: [beverageSchema],
    created_at: { type: Date },
    deliveryDate: { type: Date, required: true},
    location: { type: String, required: true},
    notes: { type: String }
});

orderSchema.methods.serialize = function() {
    return {
      _id: this._id,
      guests: this.guest,
      dishes: this.dishes,
      beverages: this.beverages,
      location: this.location,
      created_at: this.created_at,
      deliveryDate: this.deliveryDate,
      notes: this.notes
    };
};

menuSchema.methods.serialize = function() {
    return {
        _id: this._id,
        name: this.name,
        dishes: this.dishes,
        beverages: this.beverages,
    }
};

beverageSchema.methods.serialize = function() {
    return {
        _id: this._id,
        name: this.name,
        description: this.description,
        price: this.price
    }
};

dishSchema.methods.serialize = function() {
    return {
        _id: this._id,
        name: this.name,
        description: this.description,
        price: this.price
    }
}

guestSchema.methods.serialize = function() {
    return {
        _id: this._id,
        name: this.name,
        password: this.password,
        phone: this.phone,
        email: this.email,
        room: this.room
    }
}

staffSchema.methods.serialize = function() {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role
    }
}

const Order = mongoose.model('Order', orderSchema);
const Menu = mongoose.model('Menu', menuSchema);
const Beverage = mongoose.model('Beverage', beverageSchema);
const Dish = mongoose.model('Dish', dishSchema);
const Guest = mongoose.model('Guest', guestSchema);
const Staff = mongoose.model('StaffUser', staffSchema);


module.exports = { Order, Menu, Beverage, Dish, Guest, Staff };
