'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { order } = require('./models');

app.use(morgan('common'));
app.use(express.json());


// GUESTS CAN:

app.get("/orders", (req, res) => {
    orders.find()
      .limit(10)
      .then(orders => {
        res.json({
          orders: orders.map(Order => Order.serialize())
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
  });

  // user POST  order request - CREATE new order

app.post("/orders", (req, res) => {
    const requiredFields = ['guest','dish','beverage','delivery','location'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }

    Order
    .create({
      guest: req.body.guest,
      dish: req.body.dish,
      beverage: req.body.beverage,
      delivery: req.body.delivery,
      location: req.body.location
    })
    .then(order => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});

// UPDATE AN ORDER BY ID

app.put('/orders/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }
  
    const updated = {};
    const updateableFields = ['dish','beverage','delivery','location'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
  
    Order
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedOrder => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });
  
  app.delete("/orders/:id", (req, res) => {
    Restaurant.findByIdAndRemove(req.params.id)
      .then(restaurant => res.status(204).end())
      .catch(err => res.status(500).json({ message: "Internal server error" }));
  });
  
  app.use("*", function(req, res) {
    res.status(404).json({ message: "Not Found" });
  });


// user PUT request update order - fields = delivery time, dish, drink, location

// DELETE order request


// MANAGERS CAN:

// get a menu

// delete a menu

// delete a menu by id

// delete menu dish

// delete menu beverage

// post menu dish

// post menu beverage

// put menu dish id

// put menu beverage id



