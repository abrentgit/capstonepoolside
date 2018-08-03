'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { Order } = require('./models');
const { Menu } = require('./models');

app.use(morgan('common'));
app.use(express.json());


// GUESTS CAN:

// get all orders

app.get("/orders", (req, res) => {
    Order.find()
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
      created_at: req.body.created_at,
      deliveryTime: req.body.deliveryTime,
      location: req.body.location,
      notes: req.body.notes
    })
    .then(order => res.status(201).json(Order.serialize()))
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
      .findByIdAndUpdate(req.params.id, {upsert: true})
      .then(updatedOrder => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });

// DELETE ORDER BY ID

 app.delete("/orders/:id", (req, res) => {
    Orders.findByIdAndRemove(req.params.id, { upsert : true, new : true })
      .then(order => res.status(204).end())
      .catch(err => res.status(500).json({ message: "Internal server error" }));
  });

// DELETE DISH ORDER BY ID
 app.delete("/orders/:id/dishes/:id", (req, res) => {
    dishes.findByIdAndRemove(req.params.id)
    .then(order => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
 });

// DELETE BEVERAGE ORDER BY ID

 app.delete("/orders/:id/beverages/:id", (req, res) => {
    beverages.findByIdAndRemove(req.params.id)
    .then(order => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
 });

// PUT ORDER - BEVERAGE

app.put('/orders/:id/beverages/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['beverages'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  beverages
    .findByIdAndUpdate(req.params.id, {upsert: true})
    .then(updatedOrder => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

// PUT ORDER DISHES

app.put('/orders/:id/dishes/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['dishes'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  dishes
    .findByIdAndUpdate(req.params.id, {upsert: true})
    .then(updatedOrder => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


// get menus 

app.get("/menus", (req, res) => {
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
  dishes.find()
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
  beverages.find()
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

app.get('/menus/dishes/:id', (req, res) => {
  dishes
    .findById(req.params.id)
    .then(menu => res.json(menu.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

// get all menu beverages by id

app.get('/menus/beverages/:id', (req, res) => {
  beverages
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
    .findByIdAndUpdate(req.params.id, {upsert: true})
    .then(updatedMenu => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

// PUT MENU DISHES BY ID

app.put('/menus/dishes/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'description', 'price'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  dishes
    .findByIdAndUpdate(req.params.id, {upsert: true})
    .then(updatedDish => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

// PUT MENU BEVERAGES BY ID

app.put('/menus/beverages/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'descripton', 'price'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  beverages
    .findByIdAndUpdate(req.params.id, {upsert: true})
    .then(updatedBeverage => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


// DELETE MENU BY ID

app.delete("/menus/:id", (req, res) => {
  Menus.findByIdAndRemove(req.params.id, { upsert : true, new : true })
    .then(menu => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE MENU DISH BY ID
app.delete("/menus/:id/dishes/:id", (req, res) => {
  dishes.findByIdAndRemove(req.params.id)
  .then(dish => res.status(204).end())
  .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE MENU BEVERAGE BY ID

app.delete("/menus/:id/beverages/:id", (req, res) => {
  beverages.findByIdAndRemove(req.params.id)
  .then(beverage => res.status(204).end())
  .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// POST MENU 

app.post("/menus", (req, res) => {
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
  .then(menu => res.status(201).json(Menu.serialize()))
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
  .then(beverage => res.status(201).json(Beverage.serialize()))
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
  .then(dish => res.status(201).json(Dish.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });

});

app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});