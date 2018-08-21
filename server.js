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

// WORKS!!

app.get('/orders', (req, res) => {
  Order.find()
      .limit(2)
      .then(orders => {
        res.json({
          orders: orders.map(Order => Order.serialize())
        });
      })
      .catch(err => {
        res.status(500).json({ message: "Internal server error" });
      });
  });

// get orders by id
// WORKS!!

app.get('/orders/:id', (req, res) => {
    Order.findById(req.params.id)
      .then(order => res.json(order.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went horribly awry' });
    });
  });

// SHOWING a MENUS' beverages instead of ORDER BEVERAGES
// get an order's beverages

// NOT WORKING PROPERLY
// NEEDS TEST!

app.get('/orders/:id/beverages', (req, res) => {
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

// NO WORK -  showing a MENUS dishes instead of an order
// NEEDS TEST!

// GET ALL DISHES IN AN ORDER 

app.get('/orders/:id/dishes', (req, res) => {
  Order.findById(req.params.id, function(errOrder, order) {
    if(errOrder) {
      res.status(404).json({ message: 'can not find order' }); 
    } else { 
      order.dishes
      .then(dishes => {
        res.json({
          dishes: dishes.map(dish => dish.serialize())
        });
        })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      });  
    });
  }
});

// GET DISH BY ID IN ORDER

// WORKS!!!!!

app.get('/orders/:id/dishes/:dish_id', (req, res) => {
  Order.findById(req.params.id, function(errOrder, order) {
    if(errOrder) {
      res.status(404).json({ message: 'can not find order' }); 
    } else { 
      let found = false;
      order.dishes.find(function(dish) {
        dish.id === req.params.dish_id;
        found = true; 
      }); //confirm block 
    
      if (found === false) { 
        res.status(422).json({ message: 'can not find dish' });
      } else { 
      const filtered = order.dishes.filter(dish => dish.id === req.params.dish_id); 
      order.dishes = filtered;
      res.status(200).json(filtered);      
      }
    } 
  });
});

// get a beverage in a order

// WORKS!!!!

app.get('/orders/:id/beverages/:beverage_id', (req, res) => {
  Order.findById(req.params.id, function(errOrder, order) {
    if(errOrder) {
      res.status(404).json({ message: 'can not find order' }); 
    } else { 
      let found = false;
      order.beverages.find(function(beverage) {
        beverage.id === req.params.beverage_id;
        found = true; 
      }); //confirm block 
    
      if (found === false) {  // if can't find the dish in the mneu
        res.status(422).json({ message: 'can not find dish' });
      } else { 
      const filtered = order.beverages.filter(beverage => beverage.id === req.params.beverage_id); // filter out dishes that aren't the req. dish id
      order.beverages = filtered;
      res.status(200).json(filtered);       // its giving me all the DISHES BESIDES THE ONE I WANT 
      }
    } 
  });
});

  //  POST  ORDER
  // WORKING

app.post("/orders", (req, res) => {
    const requiredFields = ['guests','dishes','beverages','deliveryDate','location', 'notes'];
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
      deliveryDate: req.body.deliveryDate,
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

// WORKS !

app.put('/orders/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }

    const updated = {};
    const updateableFields = ['dishes','beverages','deliveryDate','location', 'notes'];
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

/// WORKS!!

 app.delete('/orders/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id)
      .then(order => res.status(204).end())
      .catch(err => res.status(500).json({ message: "Internal server error" }));
  });

// DELETE DISH ORDER BY ID

// WORKING!!!!!!

app.delete('/orders/:id/dishes/:dish_id', (req, res) => {
  Order.findById(req.params.id, function(errOrder, order) {
    if(errOrder) {
        res.status(404).json({message: 'can not find order'});
      } else { // if no error try to see if dilet found = false; // found is false
          let found = false;    
          order.dishes.find(function(dish) {
            dish.id === req.params.dish_id; //check if dish is in order
            found = true;
          }); 
  
         if (found === false) { 
            res.status(422).json({ message: 'can not find dish' });
        } else {
          // now that we found it, we filter what is not the dish id from the array
          const filtered = order.dishes.filter(dish => dish.id !== req.params.dish_id);
          order.dishes = filtered; // new value of order.dishes is filtered array
        }
        // now we want to save the order
          order.save(function(errSave, updatedOrder) {
            if (errSave) {
              res.status(422).json({ message: 'can not save order' }); // if err, can't save
            } else {
              res.status(200).json(updatedOrder); // if no error, we can send an updated order
            }
        });
      }
   });
});

// DELETE BEVERAGE ORDER BY ID

// WORKS !!!! 

app.delete('/orders/:id/beverages/:beverage_id', (req, res) => {
  Order.findById(req.params.id, function(errOrder, order) {
    if(errOrder) {
      res.status(404).json({ message: 'can not find order' });
    } else {
      let found = false;  
      for (let i = 0; i < order.beverages.length; i++) {
        if (order.beverages[i].id === req.params.beverage_id) {
          found = true; 
          break;
        } 
      }
        if (found === false) {
          res.status(422).json({ message: 'can not find beverage' });
        } else {
          const filtered = order.beverages.filter(beverage => beverage.id !== req.params.beverage_id); 
          order.beverages = filtered; //filters the beverages that are not the id
        }
          
        order.save(function(errSave, updatedOrder) { // related to order save 
            if (errSave) {
              res.status(422).json({ message: 'Could not save order' });
          } else {
              res.status(200).json(updatedOrder); // new order is saved and updated
          }
      });
    } 
  });  
});

// UPDATE ORDER - BEVERAGE

//  WORKS!!!

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
          order.save(function(errSave, updatedOrder) {
            if (errSave) {
              res.status(422).json({ message: 'Could not add beverage'});
            } else {
              res.status(200).json(updatedOrder);
            }
            });
        } else {
          res.status(404).json({ message: 'Could not find beverage' });
        }
      })
    } else {
      res.status(404).json({ message: 'Could not find order' });
    }
  });
});

/// update a dish order by ID

// THIS WORKS!

app.put('/orders/:id/dishes/:dish_id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  if (!(req.params.dish_id && req.body.dish_id && req.params.dish_id === req.body.dish_id)) {
    res.status(400).json({
      error: 'Request path dish id and request body dish id values must match'
    });
  }

  Order.findById(req.params.id, function(errOrder, order) {
    if(!errOrder) {
      Dish.findById(req.params.dish_id, function(errDish, dish) {
        if(!errDish) {
          order.dishes.push(dish);
          order.save(function(errSave, updatedOrder) {
            if (errSave) {
              res.status(422).json({ message: 'Could not add dish' });
            } else {
              res.status(200).json(updatedOrder);
            }
          });
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

// WORKS

app.get('/menus', (req, res) => {
  Menu.find()
    .limit(3)
    .then(menus => {
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

// WORKS

app.get('/menus/:id', (req, res) => {
  Menu
    .findById(req.params.id)
    .then(menu => res.json(menu.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

// for a staff member

// GET ALL DISHES IN A MENU

// WORKS !!

app.get("/menus/:id/dishes", (req, res) => {
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

// get all beverages that exist
// for a staff member

// WORKS!!

app.get("/menus/:id/beverages", (req, res) => {
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

// WORKING !!!!!

app.get('/menus/:id/dishes/:dish_id', (req, res) => {
  Menu.findById(req.params.id, function(errMenu, menu) {
    if(errMenu) {
      res.status(404).json({ message: 'can not find menu' }); // no menu found
    } else { // if no error and menu exists, find the dish id in the menu
      let found = false;
      menu.dishes.find(function(dish) {
        dish.id === req.params.dish_id;
        found = true; 
      }); //confirm block 
    
      if (found === false) {  // if can't find the dish in the mneu
        res.status(422).json({ message: 'can not find dish' });
      } else { // if you do find the dish in the menu
        // we want to get the dish_id so filter it out 
      const filtered = menu.dishes.filter(dish => dish.id === req.params.dish_id); // filter out dishes that aren't the req. dish id
      menu.dishes = filtered;
      res.status(200).json(filtered);       // its giving me all the DISHES BESIDES THE ONE I WANT 
      }
    } 
  });
});

// get menu beverage by id

// WORKS!!!!

app.get('/menus/:id/beverages/:beverage_id', (req, res) => {
  Menu.findById(req.params.id, function(errMenu, menu) {
    if(errMenu) {
      res.status(404).json({ message: 'can not find menu' }); // no menu found
    } else { // if no error and menu exists, find the bev id in the menu
      let found = false;
      menu.beverages.find(function(beverage) { //find the bev in the menu bev array
        beverage.id === req.params.beverage_id;
        found = true; 
      }); //confirm block 
    
      if (found === false) {  // if can't find the dish in the mneu
        res.status(422).json({ message: 'can not find beverage' });
      } else { 
      const filtered = menu.beverages.filter(beverage => beverage.id === req.params.beverage_id); // filter out dishes that aren't the req. dish id
      menu.beverages = filtered;
      res.status(200).json(filtered);       // its giving me all the DISHES BESIDES THE ONE I WANT 
      }
    } 
  });
});



// WORKS!

// put menus by ID , can use to update individual items to menu


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

// UPDATE AND ADD A DISH BY ID TO MENU

// WORKS!!

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
          menu.save(function(errSave, updatedMenu) {
            if (errSave) {
              res.status(422).json({ message: 'Could not add dish'});
          } else {
            res.status(200).json(updatedMenu);
          }
        });
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

// WORKS!!

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
          menu.save(function(errSave, updatedMenu) {
            if (errSave) {
              res.status(422).json({ message: 'Could not add beverage'});
          } else {
            res.status(200).json(updatedMenu);
          }
        });
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

// WORKS!

app.delete("/menus/:id", (req, res) => {
  Menu.findByIdAndRemove(req.params.id)
    .then(menu => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE DISH BY ID IN A MENU

// WORKS!

app.delete("/menus/:id/dishes/:dishid", (req, res) => {
  Dish.findByIdAndRemove(req.params.dish.id) //refer to dish id
  .then(dish => res.status(204).end())
  .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE MENU BEVERAGE BY ID

// WORKS!!

app.delete("/menus/:id/beverages/:beverage_id", (req, res) => {
  Beverage.findByIdAndRemove(req.params.beverages.id) //refer to beverage.id
  .then(beverage => res.status(204).end())
  .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// POST MENU

// WORKS!

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


// WORKS!

// POST A NEW BEVERAGE, but when it works, it doesnt go into a specified menu - must post after...

// NEEDS TESTING

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

// WORKS!!  // NEEDS TESTING

// BUT JUST POSTS A NEW DISH NOT INTO MENU COLLECTION

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
  console.log('server is running on', databaseUrl);
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
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
