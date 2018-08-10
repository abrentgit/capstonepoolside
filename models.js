'use strict'

const mongoose = require('Mongoose');
mongoose.Promise = global.Promise;

const dishSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

const beverageSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

const guestSchema = mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    room: {type: String, required: true}
});

const staffSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    role: String,
});

// dishes and beverages are arrays of objects

const menuSchema = mongoose.Schema({
    name: String, 
    dishes: [dishSchema], // fix nested
    beverages: [beverageSchema], //fix nested
});

// dishes guests and beverages are an array of objects
// NEEED TO ADD REQUIRED TRUE soon

const orderSchema = mongoose.Schema({
    guests: {type: mongoose.Schema.ObjectId, ref: "Guest"},
    dishes: {type: mongoose.Schema.ObjectId, ref: "Dish"},
    beverages: {type: mongoose.Schema.ObjectId, ref: "Beverage"}, // FIX NESTED 
    created_at: Date,
    deliveryTime: Date, required: true,
    location: String, required: true,
    notes: String
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
};

beverageSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        price: this.price
    }
};

dishSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        price: this.price
    }
}

guestSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        password: this.password,
        email: this.email,
        phone: this.phone,
    }
}

staffSchema.methods.serialize = function() {
    return {
        id: this._id,
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
const StaffUser = mongoose.model('StaffUser', staffSchema);


module.exports = {Order, Menu, Beverage, Dish, Guest, StaffUser};



