"use strict";

const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require("./config");
const { Order, Menu, Beverage, Dish, Guest, Staff } = require("./models");

app.use(morgan("common"));
app.use(express.json());

// GUESTS CAN:

// get all orders

// WORKS!!

app.get("/orders/:page", (req, res) => {
  let perPage = 3;
  let page = req.params.page || 1;

  Order.find()
    .skip(perPage * page - perPage) //skipping the previous pages dependent on page number
    .limit(perPage) // limit it to per page number, then take orders and
    .then(orders => {
      res.json({
        orders: orders.map(order => order.serialize())
      });
    })
    .catch(err => {
      res.status(500).json({ message: "Internal server error" });
    });
});

// get orders by id
// WORKS!!

app.get("/orders/order_id/:id", (req, res) => {
  Order.findById(req.params.id)
    .then(order => res.json(order.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went horribly awry" });
    });
});

// GET AN ORDER'S BEVS
// WORKS!!!!

app.get("/orders/:id/beverages", (req, res) => {
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

// WORKS!!!

app.get("/orders/:id/dishes", (req, res) => {
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

// WORKS!!!!!

app.get("/orders/:id/dishes/:dish_id", (req, res) => {
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

// WORKS!!!!

app.get("/orders/:id/beverages/:beverage_id", (req, res) => {
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

//  POST  ORDER
// WORKS!!

app.post("/orders", (req, res) => {
  const requiredFields = ["guests", "deliveryDate", "location", "notes"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Order.create({
    guests: req.body.guests,
    deliveryDate: req.body.deliveryDate,
    location: req.body.location,
    notes: req.body.notes
  })
    .then(order => res.status(201).json(order.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

// UPDATE AN ORDER BY ID

// WORKS !

app.put("/orders/:id", (req, res) => {
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

/// WORKS!!

app.delete("/orders/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(order => res.status(200).send())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE DISH ORDER BY ID

// WORKING!!!!!!

app.delete("/orders/:id/dishes/:dish_id", (req, res) => {
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

// WORKS !!!!

app.delete("/orders/:id/beverages/:beverage_id", (req, res) => {
  Order.findById(req.params.id, function(errOrder, order) {
    if (errOrder) {
      res.status(404).json({ message: "can not find order" });
    } else {
      let found = order.beverages.find(
        beverage => beverage.id === req.params.beverage_id
      );

      if (found === false) {
        res.status(422).json({ message: "can not find beverage" });
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

// UPDATE ORDER - BEVERAGE

//  WORKS!!!

app.put("/orders/:id/beverages/:beverage_id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  if (!(req.params.beverage_id && req.body.beverage_id && req.params.beverage_id === req.body.beverage_id)) {
    res.status(400).json({
      error:
        "Request path beverage id and request beverage body id values must match"
    });
  }

  Order.findById(req.params.id, function(errOrder, order) {
    if (!errOrder) {
      Beverage.findById(req.params.beverage_id, function(
        errBeverage,
        beverage
      ) {
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

/// update a dish order by ID

// THIS WORKS!

app.put("/orders/:id/dishes/:dish_id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  if (!(req.params.dish_id &&req.body.dish_id && req.params.dish_id === req.body.dish_id)) {
    res.status(400).json({
      error: "Request path dish id and request body dish id values must match"
    });
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

// get menus

// WORKS

app.get("/menus/:page", (req, res) => {
  let perPage = 2;
  let page = req.params.page || 1;

  Menu.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
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

app.get("/menus/menu_id/:id", (req, res) => {
  Menu.findById(req.params.id)
    .then(menu => res.json(menu.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went horribly awry" });
    });
});

// for a staff member

// GET ALL DISHES IN A MENU

//  NOT WORKING !

app.get("/menus/:id/dishes/:page", (req, res, next) => {
  Menu.findById(req.params.id, function(errMenu, menu) {
    if (!errMenu) {
      
      //   let perPage = 2;
      //   let page = req.params.page || 1;

      //   Dish.find()
      //   .skip(perPage * page - perPage)
      //   .limit(perPage)
      //   .then(dishes => {
      // 	res.json({
      // 		dishes:dishes.map(dish => dish.serialize())
      // 	  });
      //   })
      // .catch(err => {
      // 	console.error(err);
      // 	res.status(500).json({ message: 'Internal server error' });
      // });
    } else {
      res.status(404).json({ message: "can not find menu" });
    }
  });
});

// get all beverages that exist
// for a staff member

// NOT WORKING!!

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

// GET A MENU DISH BY ID

// WORKING !!!!!

app.get("/menus/:id/dishes/:dish_id", (req, res) => {
  Menu.findById(req.params.id, function(errMenu, menu) {
    if (errMenu) {
      res.status(404).json({ message: "can not find menu" }); // no menu found
    } else {
      // if no error and menu exists, find the dish id in the menu
      let found = menu.dishes.find(dish => dish.id === req.params.dish_id);

      if (found === false) {
        // if can't find the dish in the mneu
        res.status(404).json({ message: "can not find dish" });
      } else {
        // if you do find the dish in the menu
        // we want to get the dish_id so filter it out
        const filtered = menu.dishes.filter(
          dish => dish.id === req.params.dish_id
        ); // filter out dishes that aren't the req. dish id
        menu.dishes = filtered;
        res.status(200).json(filtered); // its giving me all the DISHES BESIDES THE ONE I WANT
      }
    }
  });
});

// get menu beverage by id

// WORKS!!!!

app.get("/menus/:id/beverages/:beverage_id", (req, res) => {
  Menu.findById(req.params.id, function(errMenu, menu) {
    if (errMenu) {
      res.status(404).json({ message: "can not find menu" }); // no menu found
    } else {
      // if no error and menu exists, find the bev id in the menu
      let found = menu.beverages.find(
        beverage => beverage.id === req.params.beverage_id
      );

      if (found === false) {
        // if can't find the dish in the mneu
        res.status(404).json({ message: "can not find beverage" });
      } else {
        const filtered = menu.beverages.filter(
          beverage => beverage.id === req.params.beverage_id
        ); // filter out dishes that aren't the req. dish id
        menu.beverages = filtered;
        res.status(200).json(filtered);
      }
    }
  });
});

// WORKS!!
// put menus by ID , can use to update individual items to menu

app.put("/menus/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  const updated = {};
  const updateableFields = ["name"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Menu.findByIdAndUpdate(req.params.id, updated)
    .then(updatedMenu => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Something went wrong" }));
});

// UPDATE AND ADD A DISH BY ID TO MENU

// WORKS!!

app.put("/menus/:id/dishes/:dish_id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  if (!(req.params.dish_id &&req.body.dish_id && req.params.dish_id === req.body.dish.id)) {
    res.status(400).json({
      error: "Request dish path id and request body dish id values must match"
    });
  }

  Menu.findById(req.params.id, function(errMenu, menu) {
    if (!errMenu) {
      Dish.findById(req.params.dish_id, function(errDish, dish) {
        if (!errDish) {
          menu.dishes.push(dish);
          menu.save(function(errSave, updatedMenu) {
            if (errSave) {
              res.status(422).json({ message: "Could not add dish" });
            } else {
              res.status(200).json(updatedMenu);
            }
          });
        } else {
          res.status(404).json({ message: "Could not find dish" });
        }
      });
    } else {
      res.status(404).json({ message: "Could not find menu" });
    }
  });
});

// PUT update MENU BEVERAGES BY ID

// WORKS!!

app.put("/menus/:id/beverages/:beverage_id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  if (!(req.params.beverage_id && req.body.beverage_id && req.params.beverage_id === req.body.beverage_id)) {
    res.status(400).json({
      error:
        "Request path beverage id and request body beverage id values must match"
    });
  }

  Menu.findById(req.params.id, function(errMenu, menu) {
    if (!errMenu) {
      Beverage.findById(req.params.beverage_id, function(
        errBeverage,
        beverage
      ) {
        if (!errBeverage) {
          menu.beverages.push(beverage);
          menu.save(function(errSave, updatedMenu) {
            if (errSave) {
              res.status(422).json({ message: "Could not add beverage" });
            } else {
              res.status(200).json(updatedMenu);
            }
          });
        } else {
          res.status(404).json({ message: "Could not find beverage" });
        }
      });
    } else {
      res.status(404).json({ message: "Could not find menu" });
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

app.delete("/menus/:id/dishes/:dish_id", (req, res) => {
  Dish.findByIdAndRemove(req.params.dish_id) //refer to dish id
    .then(dish => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE MENU BEVERAGE BY ID
// WORKS!!

app.delete("/menus/:id/beverages/:beverage_id", (req, res) => {
  Beverage.findByIdAndRemove(req.params.beverage_id)
    .then(beverage => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// POST MENU
// WORKS!!

app.post("/menus", (req, res) => {
  const requiredFields = ["name"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Menu.create({
    name: req.body.name
  })
    .then(menu => res.status(201).json(menu.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

// POST A NEW BEVERAGE
// WORKS!!

app.post("/beverages", (req, res) => {
  const requiredFields = ["name", "description", "price"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Beverage.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  })
    .then(beverage => res.status(201).json(beverage.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

// POST A NEW DISH

// WORKS!!

app.post("/dishes", (req, res) => {
  const requiredFields = ["name", "description", "price"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Dish.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  })
    .then(dish => res.status(201).json(dish.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

let server;

function runServer(databaseUrl, port = PORT) {
  console.log("server is running on", databaseUrl);
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true },
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
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
