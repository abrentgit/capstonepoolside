'use strict';

const express = require('express');
const router = express.Router();
const config = require('./config');


const { User, Order } = require('./models');

const jwt = require('jsonwebtoken');

const verifyUser = function (req, res, next) {
    if (!req.headers.authorization) {
      res.status(401).json({ message: 'Invalid credentials'});
      return;
    }
  
    const tokenSplit = req.headers.authorization.split(' '); 
    const token = tokenSplit[1]; 
  
    if (token) {
      jwt.verify(token, config.JWT_SECRET, function(error, decoded) {
        if (!error) {
          req.decoded = decoded;
          if (req.decoded.aud === 'Guest') {
          next();
          }
        } else {
          res.status(401).json({ message: 'Invalid credentials'});
        }
      }
    );
  }
  }

const verifyAdminUser = function (req, res, next) {
    if (!req.headers.authorization) {
      res.status(401).json({ message: 'Invalid credentials'});
      return;
    }
  
    const tokenSplit = req.headers.authorization.split(' '); 
    const token = tokenSplit[1]; 
  
    if (token) {
      jwt.verify(token, config.JWT_SECRET, function(error, decoded) {
        if (!error) {
          req.decoded = decoded;
          if (req.decoded.aud === 'admin') {
            next();
            console.log(req.decoded);
          }
        } else {
          res.status(401).json({ message: 'Invalid credentials'});
        }
      }
    );
  }
}  

// POST ORDER
router.post("/", verifyUser, (req, res) => {
    const requiredFields = ["guests", "deliveryDate", "location", "notes"];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    const firstGuestId = req.body.guests.split(',')[0]; //guests is a string, split to an array
  
    User.findById(firstGuestId, (err, guest) => {
      if (err) {
        res.status(404).send({ message: 'Can not find user' }); // if menu not found
      } else { // if no error
      
      Order.create({
        guests: [guest._id],
        deliveryDate: req.body.deliveryDate,
        location: req.body.location,
        notes: req.body.notes
      })
    
      .then(order => res.status(201).json(order.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
    }
  });
  });

  router.get("/", verifyAdminUser, (req, res) => {
    const perPage = 3;
    const currentPage = req.query.page || 1;
  
    Order.find()
      .skip(perPage * currentPage - perPage) //skipping the previous pages dependent on page number
      .limit(perPage) // limit it to per page number, then take orders
      .then(orders => {
        res.json({
          orders: orders.map(order => order.serialize())
        });
      })
      .catch(err => {
        res.status(500).json({ message: "Internal server error" });
      });
  });

  router.get("/:id", verifyUser, (req, res) => {
    Order.findById(req.params.id)
      .then(order => res.json(order.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: "something went horribly wrong" });
      });
  });
  
  // GET AN ORDER'S BEVS
  // WORKS!!!*
  
  router.get("/:id/beverages", verifyUser, (req, res) => {
    Order.findById(req.params.id, function(errOrder, order) {
      if (errOrder) {
        res.status(404).json({ message: "can not find order" });
      } else {
        res.json({
          beverages: order.beverages.map(beverage => beverage.serialize())
        });
      }
    });
  });
  
  // GET ALL DISHES IN AN ORDER
  // WORKS!!*
  
  router.get("/:id/dishes", verifyUser, (req, res) => {
    Order.findById(req.params.id, function(errOrder, order) {
      if (errOrder) {
        res.status(404).json({ message: "can not find order" });
      } else {
        res.json({
          dishes: order.dishes.map(dish => dish.serialize())
        });
      }
    });
  });
  
  // GET DISH BY ID IN ORDER
  // STAFF
  // WORKS!!!!*
  
  router.get("/:id/dishes/:dish_id", verifyUser, (req, res) => {
    Order.findById(req.params.id, function(errOrder, order) {
      if (errOrder) {
        res.status(404).json({ message: "can not find order" });
      } else {
        let found = order.dishes.find(dish => dish.id === req.params.dish_id);
  
        if (found === false) {
          res.status(404).json({ message: "can not find dish" });
        } else {
          const filtered = order.dishes.filter(
            dish => dish.id === req.params.dish_id
          );
          order.dishes = filtered;
          res.status(200).json(filtered);
        }
      }
    });
  });
  
  // get a beverage in a order
  // WORKS!!!!*
  
  router.get("/:id/beverages/:beverage_id", verifyUser, (req, res) => {
    Order.findById(req.params.id, function(errOrder, order) {
      if (errOrder) {
        res.status(404).json({ message: "can not find order" });
      } else {
        let found = order.beverages.find(
          beverage => beverage.id === req.params.beverage_id
        );
  
        if (found === false) {
          res.status(404).json({ message: "can not find dish" });
        } else {
          const filtered = order.beverages.filter(
            beverage => beverage.id === req.params.beverage_id
          );
          order.beverages = filtered;
          res.status(200).json(filtered);
        }
      }
    });
  });


// UPDATE AN ORDER BY ID
// GUEST 
// WORKS !!!*

router.put("/:id", verifyUser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  const updated = {};
  const updateableFields = ["deliveryDate", "location", "notes"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Order.findByIdAndUpdate(req.params.id, updated)
    .then(updatedOrder => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Something went wrong" }));
});

// DELETE ORDER BY ID
/// WORKS!!*

router.delete("/:id", verifyUser, (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(order => res.status(200).send())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE DISH ORDER BY ID
// WORKING!!!!!!*

router.delete("/:id/dishes/:dish_id", verifyUser, (req, res) => {
  Order.findById(req.params.id, function(errOrder, order) {
    if (errOrder) {
      res.status(404).json({ message: "can not find order" });
    } else {
      let found = order.dishes.find(dish => dish.id === req.params.dish_id);

      if (found === false) {
        res.status(422).json({ message: "can not find dish" });
      } else {
        const filtered = order.dishes.filter(
          dish => dish.id !== req.params.dish_id
        );
        order.dishes = filtered;
      }
      order.save(function(errSave, updatedOrder) {
        if (errSave) {
          res.status(422).json({ message: "can not save order" }); //
        } else {
          res.status(200).json(updatedOrder);
        }
      });
    }
  });
});

// DELETE BEVERAGE ORDER BY ID
// WORKS !!!!*

router.delete("/:id/beverages/:beverage_id", verifyUser, (req, res) => {
  Order.findById(req.params.id, function(errOrder, order) {
    if (errOrder) {
      res.status(404).json({ message: "can not find order" });
    } else {
      let found = order.beverages.find(
        beverage => beverage.id === req.params.beverage_id
      );

      if (found === false) {
        res.status(422).json({ message: "Can not find beverage" });
      } else {
        const filtered = order.beverages.filter(
          beverage => beverage.id !== req.params.beverage_id
        );
        order.beverages = filtered; //filters the beverages that are not the id
      }

      order.save(function(errSave, updatedOrder) {
        // related to order save
        if (errSave) {
          res.status(422).json({ message: "Could not save order" });
        } else {
          res.status(200).json(updatedOrder); // new order is saved and updated
        }
      });
    }
  });
});

// UPDATE ORDER WITH A BEVERAGE
//  WORKS!!!***

router.put("/:id/beverages/:beverage_id", verifyUser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  if (!(req.params.beverage_id && req.body.beverage_id && req.params.beverage_id === req.body.beverage_id)) {
    res.status(400).json({error: "Request path beverage id and request beverage body id values must match"});
  }

  Order.findById(req.params.id, function(errOrder, order) {
    if (!errOrder) {
      Beverage.findById(req.params.beverage_id, function(errBeverage,beverage) {
        if (!errBeverage) {
          order.beverages.push(beverage);
          order.save(function(errSave, updatedOrder) {
            if (errSave) {
              res.status(422).json({ message: "Could not add beverage" });
            } else {
              res.status(200).json(updatedOrder);
            }
          });
        } else {
          res.status(404).json({ message: "Could not find beverage" });
        }
      });
    } else {
      res.status(404).json({ message: "Could not find order" });
    }
  });
});

/// update a order with a dish
// THIS WORKS!***

router.put("/:id/dishes/:dish_id", verifyUser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  if (!(req.params.dish_id && req.body.dish_id && req.params.dish_id === req.body.dish_id)) {
    res.status(400).json({ error: "Request path dish id and request body dish id values must match" });
  }

  Order.findById(req.params.id, function(errOrder, order) {
    if (!errOrder) {
      Dish.findById(req.params.dish_id, function(errDish, dish) {
        if (!errDish) {
          order.dishes.push(dish);
          order.save(function(errSave, updatedOrder) {
            if (errSave) {
              res.status(422).json({ message: "Could not add dish" });
            } else {
              res.status(200).json(updatedOrder);
            }
          });
        } else {
          res.status(404).json({ message: "Could not find dish" });
        }
      });
    } else {
      res.status(404).json({ message: "Could not find order" });
    }
  });
});
  
module.exports = router;

