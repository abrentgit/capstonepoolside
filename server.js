'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { Order, Menu, Beverage, Dish, Guest, Staff } = require('./models');

app.use(morgan('common'));
app.use(express.json());


// GUESTS CAN:

// get all orders

app.get('/orders', (req, res) => {
  Order.find()
      .limit(2)
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

// get orders by id

app.get('/orders/:id', (req, res) => {
    Order
      .findById(req.params.id)
      .then(order => res.json(order.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went horribly awry' });
      });
  });

  //  POST  order 

app.post("/orders", (req, res) => {
    const requiredFields = ['guests','dishes','beverages','deliveryTime','location', 'notes'];
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
      guests: req.body.guests,
      dishes: req.body.dishes,
      beverages: req.body.beverages,
      deliveryTime: req.body.deliveryTime,
      location: req.body.location,
      notes: req.body.notes
    })
    .then(order => res.status(201).json(order.serialize()))
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
    const updateableFields = ['dishes','beverages','deliveryTime','location', 'notes'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
  
    Order
      .findByIdAndUpdate(req.params.id, updated)// add 
      .then(updatedOrder => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });

// DELETE ORDER BY ID

 app.delete("/orders/:id", (req, res) => {
    Order.findByIdAndRemove(req.params.id)
      .then(order => res.status(204).end())
      .catch(err => res.status(500).json({ message: "Internal server error" }));
  });

// DELETE DISH ORDER BY ID
 app.delete("/orders/:id/dishes/:dishid", (req, res) => {
    Dish.findByIdAndRemove(req.params.id)
    .then(order => res.status(204).end()) // no content
    .catch(err => res.status(500).json({ message: "Internal server error" }));
 });

// DELETE BEVERAGE ORDER BY ID

 app.delete("/orders/:id/beverages/:beverageid", (req, res) => {  ///beverage
    Beverage.findByIdAndRemove(req.params.id)
    .then(order => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
 });

// PUT ORDER - BEVERAGE

app.put('/orders/:id/beverages/:beverage_id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  if(!(req.params.beverage_id && req.body.beverage_id && req.params.beverage_id === req.body.beverage_id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  Order.findById(req.params.id, function(errOrder, order) {
    if(!errOrder) {
      Beverage.findById(req.params.beverage_id, function(errBeverage, beverage) {
        if(!errBeverage) {
          order.beverages.push(beverage);
          order.update();
          res.status(200).json(order); 
        } else {
          res.status(404).json({ message: 'Could not find beverage' });
        }
      }) 
    } else {
      res.status(404).json({ message: 'Could not find order' });
    } 
  });
});

/// make sure you check for dishid match

app.put('/orders/:id/dishes/:dish_id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  if (!(req.params.dish_id && req.body.dish_id && req.params.dish_id === req.body.dish_id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  Order.findById(req.params.id, function(errOrder, order) {
    if(!errOrder) {
      Dish.findById(req.params.dish_id, function(errDish, dish) {
        if(!errDish) {
          order.dishes.push(dish);
          order.update();
          res.status(200).json(order); 
        } else {
          res.status(404).json({ message: 'Could not find dish' });
        }
      }) 
    } else {
      res.status(404).json({ message: 'Could not find order' });
    } 
  });
});


// get menus 

app.get('/menus', (req, res) => {
  Menu.find()
    .limit(3)
    .then(orders => {
      res.json({
        menus: menus.map(menu => menu.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// get menus by ID 

app.get('/menus/:id', (req, res) => {
  Menu
    .findById(req.params.id)
    .then(menu => res.json(menu.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

// get all menu dishes

app.get("/menus/dishes", (req, res) => {
  Dish.find()
    .limit(10)
    .then(dishes => {
      res.json({
        dishes: dishes.map(dish => dish.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// get all menu beverages

app.get("/menus/beverages", (req, res) => {
  Beverage.find()
    .limit(10)
    .then(beverages => {
      res.json({
        beverages: beverages.map(beverage => beverage.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// get all menu dishes by id

app.get('/menus/id:/dishes/:dishid', (req, res) => {
  Dish
    .findById(req.params.id)
    .then(menu => res.json(menu.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

// get all menu beverages by id

app.get('/menus/beverages/:id', (req, res) => {
  Beverage
    .findById(req.params.id)
    .then(beverages => res.json(beverages.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

// put menus by ID 

app.put('/menus/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name','dishes', 'beverages'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Menu
    .findByIdAndUpdate(req.params.id, updated)
    .then(updatedMenu => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

// update a MENU DISH BY ID

app.put('/menus/:id/dishes/:dish_id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  if (!(req.params.dish_id && req.body.dish_id && req.params.dish_id === req.body.dish.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  Menu.findById(req.params.id, function(errMenu, menu) {
    if(!errMenu) {
      Dish.findById(req.params.dish_id, function(errDish, dish) {
        if(!errDish) {
          menu.dishes.push(dish);
          menu.update();
          res.status(200).json(menu); 
        } else {
          res.status(404).json({ message: 'Could not find dish' });
        }
      }) 
    } else {
      res.status(404).json({ message: 'Could not find menu' });
    } 
  });
});

// PUT update MENU BEVERAGES BY ID

app.put('/menus/:id/beverages/:beverage_id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  if (!(req.params.beverage_id && req.body.beverage_id && req.params.beverage_id === req.body.beverage_id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  Menu.findById(req.params.id, function(errMenu, menu) {
    if(!errMenu) {
      Beverage.findById(req.params.beverage_id, function(errBeverage, beverage) {
        if(!errBeverage) {
          menu.beverages.push(beverage);
          menu.update();
          res.status(200).json(menu); 
        } else {
          res.status(404).json({ message: 'Could not find beverage' });
        }
      }) 
    } else {
      res.status(404).json({ message: 'Could not find menu' });
    } 
  });
});

// DELETE MENU BY ID

app.delete("/menus/:id", (req, res) => {
  Menu.findByIdAndRemove(req.params.id)
    .then(menu => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE MENU DISH BY ID
app.delete("/menus/:id/dishes/:dishid", (req, res) => {
  Dish.findByIdAndRemove(req.params.dish.id) //refer to dish id 
  .then(dish => res.status(204).end())
  .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE MENU BEVERAGE BY ID

app.delete("/menus/:id/beverages/:beverage_id", (req, res) => {
  Beverage.findByIdAndRemove(req.params.beverages.id) //refer to beverage.id
  .then(beverage => res.status(204).end())
  .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// POST MENU 

app.post('/menus', (req, res) => {
  const requiredFields = ['name','dishes','beverages'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Menu
  .create({
    name: req.body.name,
    dishes: req.body.dishes,
    beverages: req.body.beverages,
  })
  .then(menu => res.status(201).json(menu.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });

});

// POST MENU BEVERAGE

app.post("/menus/:id/beverages", (req, res) => {
  const requiredFields = ['name', 'description', 'price'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Beverage
  .create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  })
  .then(beverage => res.status(201).json(beverage.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });

});

// POST MENU DISH

app.post("/menus/:id/dishes", (req, res) => {
  const requiredFields = ['name', 'description', 'price'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Dish
  .create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  })
  .then(dish => res.status(201).json(dish.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });

});

app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}


if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
