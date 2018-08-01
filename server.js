"use strict";

const express = require("express");

const app = express();

app.use(express.static("public"));

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function() {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = app;

// const morgan = require('morgan');
// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// const { DATABASE_URL, PORT } = require('./config');
// const { order } = require('./models');

// app.use(morgan('common'));
// app.use(express.json());


// // GUESTS CAN GET:

// app.get("/orders", (req, res) => {
//     orders.find()
//       .limit(10)
//       .then(orders => {
//         res.json({
//           orders: orders.map(Order => Order.serialize())
//         });
//       })
//       .catch(err => {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//       });
//   });

//   // user POST  order request - CREATE new order

// app.post("/orders", (req, res) => {
//     const requiredFields = ['guest','dish','beverage','delivery','location'];
//     for (let i = 0; i < requiredFields.length; i++) {
//       const field = requiredFields[i];
//       if (!(field in req.body)) {
//         const message = `Missing \`${field}\` in request body`;
//         console.error(message);
//         return res.status(400).send(message);
//       }
//     }

//     Order
//     .create({
//       guest: req.body.guest,
//       dish: req.body.dish,
//       beverage: req.body.beverage,
//       delivery: req.body.delivery,
//       location: req.body.location
//     })
//     .then(order => res.status(201).json(blogPost.serialize()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'Something went wrong' });
//     });

// });


// // UPDATE AN ORDER BY ID

// app.put('/orders/:id', (req, res) => {
//     if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//       res.status(400).json({
//         error: 'Request path id and request body id values must match'
//       });
//     }
  
//     const updated = {};
//     const updateableFields = ['dish','beverage','delivery','location'];
//     updateableFields.forEach(field => {
//       if (field in req.body) {
//         updated[field] = req.body[field];
//       }
//     });
  
//     Order
//       .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
//       .then(updatedOrder => res.status(204).end())
//       .catch(err => res.status(500).json({ message: 'Something went wrong' }));
//   });
  
//   app.delete("/orders/:id", (req, res) => {
//     Restaurant.findByIdAndRemove(req.params.id)
//       .then(restaurant => res.status(204).end())
//       .catch(err => res.status(500).json({ message: "Internal server error" }));
//   });

//   // STAFF MEMBER POST CREATE NEW DISH, CREATE NEW BEVERAGE

// app.post("/orders", (req, res) => {
//     const requiredFields = ['guest','dish','beverage','delivery','location'];
//     for (let i = 0; i < requiredFields.length; i++) {
//       const field = requiredFields[i];
//       if (!(field in req.body)) {
//         const message = `Missing \`${field}\` in request body`;
//         console.error(message);
//         return res.status(400).send(message);
//       }
//     }

//     Order
//     .create({
//       guest: req.body.guest,
//       dish: req.body.dish,
//       beverage: req.body.beverage,
//       delivery: req.body.delivery,
//       location: req.body.location
//     })
//     .then(order => res.status(201).json(Order.serialize()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'Something went wrong' });
//     });

// });

  
// app.use("*", function(req, res) {
//     res.status(404).json({ message: "Not Found" });
// });


// // STAFF MEMEBER PUT REQUEST, UPDATE DISH, UPDATE BEVERAGE

// app.post("/beverage", (req, res) => {
// 	const requiredFields = ['name', 'description', 'price'];
// 	for (let i = 0; i < requiredFields.length; i++) {
//       const field = requiredFields[i];
//       if (!(field in req.body)) {
//         const message = `Missing \`${field}\` in request body`;
//         console.error(message);
//         return res.status(400).send(message);
//       }
//     }

//     beverage
//      .create({

//      })
// }


// STAFF MEMBER DELETE DISH, DELETE BEVERAGE


// NEED BEVERAGE SCHEMA SERIALIZE?
// NEED DISH SCHEMA SERIALIZE?


// MANAGERS CAN:

// POST CREATE NEW DISH, CREATE NEW BEVERAGE

// PUT REQUEST  - UPDATE DISH, UPDATE BEVERAGE

// DELETE DISH, DELETE BEVERAGE
