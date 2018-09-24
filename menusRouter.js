// 'use strict';

// const express = require('express');
// const router = express.Router();
// const config = require('./config');

// const { Menu } = require('./models');

// const jwt = require('jsonwebtoken');


// // MIDDLEWARE GUEST USER

// const verifyUser = function (req, res, next) {
//   if (!req.headers.authorization) {
//     res.status(401).json({ message: 'Invalid credentials'});
//     return;
//   }

//   const tokenSplit = req.headers.authorization.split(' '); 
//   const token = tokenSplit[1]; 

//   if (token) {
//     jwt.verify(token, config.JWT_SECRET, function(error, decoded) {
//       if (!error) {
//         req.decoded = decoded;
//         if (req.decoded.aud === 'Guest') {
//         next();
//         }
//       } else {
//         res.status(401).json({ message: 'Invalid credentials'});
//       }
//     }
//   );
// }
// }

// // MIDDLEWARE VERIFY ADMIN USER
// const verifyAdminUser = function (req, res, next) {
//   if (!req.headers.authorization) {
//     res.status(401).json({ message: 'Invalid credentials'});
//     return;
//   }

//   const tokenSplit = req.headers.authorization.split(' '); 
//   const token = tokenSplit[1]; 

//   if (token) {
//     jwt.verify(token, config.JWT_SECRET, function(error, decoded) {
//       if (!error) {
//         req.decoded = decoded;
//         if (req.decoded.aud === 'admin') {
//           next();
//           console.log(req.decoded);
//         }
//       } else {
//         res.status(401).json({ message: 'Invalid credentials'});
//       }
//     }
//   );
// }
// }

// router.get("/", verifyAdminUser, (req, res) => {
//     const perPage = 2;
//     const currentPage = req.query.page || 1;
  
//     Menu.find()
//       .skip(perPage * currentPage - perPage)
//       .limit(perPage)
//       .then(menus => {
//         res.json({
//           menus: menus.map(menu => menu.serialize())
//         });
//       })
//       .catch(err => {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//       });
//   });
  
//   // get menus by ID
//   // WORKS*
  
//   router.get("/menu_id/:id", verifyUser, (req, res) => {
//     Menu.findById(req.params.id)
//       .then(menu => res.json(menu.serialize()))
//       .catch(err => {
//         console.error(err);
//         res.status(500).json({ error: "something went horribly awry" });
//       });
//   });
    
//   // GET ALL DISHES IN A MENU
//   // WORKS ****
  
//   router.get("/:id/dishes", verifyUser, (req, res) => {
//     Menu.findById(req.params.id, function(errMenu, menu) {
//       if (!errMenu) {
//         const perPage = 2;
//         const currentPage = req.query.page || 1;
//         const skip = perPage * currentPage - perPage;
  
//         const dishes = menu.dishes.slice(skip, skip + perPage);
  
//         res.json({
//           dishes: dishes.map(dish => dish.serialize())
//         });
//       } else {
//         res.status(404).json({ message: "can not find menu" });
//       }
//     });
//   });
  
//   // get all beverages that exist in menu
//   // BOTH?
  
//   // WORKING***
  
//   router.get("/:id/beverages", verifyUser, (req, res) => {
//     Menu.findById(req.params.id, function(errMenu, menu) {
//       if (!errMenu) {
//         const perPage = 2;
//         const currentPage = req.query.page || 1;
//         const skip = perPage * currentPage - perPage;
  
//         const beverages = menu.beverages.slice(skip, skip + perPage);
  
//         res.json({
//           beverages: beverages.map(beverage => beverage.serialize())
//         });
//       } else {
//         res.json(404).json({ message: "can not find menu" });
//       }
//     });
//   });
  
//   // GET A MENU DISH BY ID
//   // BOTH?
  
//   // WORKING !!!!!***
  
//   router.get("/:id/dishes/:dish_id", verifyUser, (req, res) => {
//     Menu.findById(req.params.id, function(errMenu, menu) {
//       if (errMenu) {
//         res.status(404).json({ message: "can not find menu" }); // no menu found
//       } else {
//         // if no error and menu exists, find the dish id in the menu
//         let found = menu.dishes.find(dish => dish.id === req.params.dish_id);
  
//         if (found === false) {
//           // if can't find the dish in the mneu
//           res.status(404).json({ message: "can not find dish" });
//         } else {
//           // if you do find the dish in the menu
//           // we want to get the dish_id so filter it out
//           const filtered = menu.dishes.filter(
//             dish => dish.id === req.params.dish_id
//           ); // filter out dishes that aren't the req. dish id
//           menu.dishes = filtered;
//           res.status(200).json(filtered); // its giving me all the DISHES BESIDES THE ONE I WANT
//         }
//       }
//     });
//   });
  
//   // get menu beverage by id
  
//   // WORKS!!!!***
  
//   router.get("/:id/beverages/:beverage_id", verifyUser, (req, res) => {
//     Menu.findById(req.params.id, function(errMenu, menu) {
//       if (errMenu) {
//         res.status(404).json({ message: "can not find menu" }); // no menu found
//       } else {
//         // if no error and menu exists, find the bev id in the menu
//         let found = menu.beverages.find(
//           beverage => beverage.id === req.params.beverage_id
//         );
  
//         if (found === false) {
//           // if can't find the dish in the mneu
//           res.status(404).json({ message: "can not find beverage" });
//         } else {
//           const filtered = menu.beverages.filter(
//             beverage => beverage.id === req.params.beverage_id
//           ); // filter out dishes that aren't the req. dish id
//           menu.beverages = filtered;
//           res.status(200).json(filtered);
//         }
//       }
//     });
//   });
  
//   // WORKS!!***
//   // STAFF ONLY++
//   // put menus by ID , can use to update individual items to menu
  
//   router.put("/:id", verifyAdminUser, (req, res) => {
//     if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//       res.status(400).json({
//         error: "Request path id and request body id values must match"
//       });
//     }
  
//     const updated = {};
//     const updateableFields = ["name"];
//     updateableFields.forEach(field => {
//       if (field in req.body) {
//         updated[field] = req.body[field];
//       }
//     });
  
//     Menu.findByIdAndUpdate(req.params.id, updated)
//       .then(updatedMenu => res.status(204).end())
//       .catch(err => res.status(500).json({ message: "Something went wrong" }));
//   });
  
//   // UPDATE AND ADD A DISH BY ID TO MENU
  
//   // STAFF ONLY++
//   // WORKS!!
  
  
//   router.put("/:id/dishes/:dish_id", verifyAdminUser, (req, res) => {
//     if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//       res.status(400).json({
//         error: "Request path id and request body id values must match"
//       });
//     }
  
//     if (!(req.params.dish_id && req.body.dish_id && req.params.dish_id === req.body.dish_id)) {
//       res.status(400).json({
//         error: "Request dish path id and request body dish id values must match"
//       });
//     }
  
//     Menu.findById(req.params.id, function(errMenu, menu) {
//       if (!errMenu) {
//         Dish.findById(req.params.dish_id, function(errDish, dish) {
//           if (!errDish) {
//             menu.dishes.push(dish);
//             menu.save(function(errSave, updatedMenu) {
//               if (errSave) {
//                 res.status(422).json({ message: "Could not add dish" });
//               } else {
//                 res.status(200).json(updatedMenu);
//               }
//             });
//           } else {
//             res.status(404).json({ message: "Could not find dish" });
//           }
//         });
//       } else {
//         res.status(404).json({ message: "Could not find menu" });
//       }
//     });
//   });
  
//   // PUT update MENU BEVERAGES BY ID
//   // STAFF ONLY++
//   // WORKS!!**
  
//   router.put("/:id/beverages/:beverage_id", verifyAdminUser, (req, res) => {
//     if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//       res.status(400).json({ error: "Request path id and request body id values must match" });
//     }
  
//     if (!(req.params.beverage_id && req.body.beverage_id && req.params.beverage_id === req.body.beverage_id)) {
//       res.status(400).json({ error: "Request path beverage id and request body beverage id values must match" });
//     }
  
//     Menu.findById(req.params.id, function(errMenu, menu) {
//       if (!errMenu) {
//         Beverage.findById(req.params.beverage_id, function(
//           errBeverage,
//           beverage
//         ) {
//           if (!errBeverage) {
//             menu.beverages.push(beverage);
//             menu.save(function(errSave, updatedMenu) {
//               if (errSave) {
//                 res.status(422).json({ message: "Could not add beverage" });
//               } else {
//                 res.status(200).json(updatedMenu);
//               }
//             });
//           } else {
//             res.status(404).json({ message: "Could not find beverage" });
//           }
//         });
//       } else {
//         res.status(404).json({ message: "Could not find menu" });
//       }
//     });
//   });
  
//   // DELETE MENU BY ID
//   // STAFF ONLY++
//   // WORKS!****
  
//   router.delete("/:id", verifyAdminUser, (req, res) => {
//     Menu.findByIdAndRemove(req.params.id)
//       .then(menu => res.status(204).end())
//       .catch(err => res.status(500).json({ message: "Internal server error" }));
//   });
  
//   // DELETE DISH BY ID IN A MENU
//   // STAFF ONLY++
//   // WORKING**
  
//   router.delete("/:id/dishes/:dish_id", verifyAdminUser, (req, res) => {
//     Menu.findById(req.params.id, function(errMenu, menu) {
//       if (errMenu) {
//         res.status(404).json({ message: "can not find menu" });
//       } else {
//         let found = menu.dishes.find(dish => dish.id === req.params.dish_id);
  
//         if (found === false) {
//           res.status(422).json({ message: "can not find dish" });
//         } else {
//           const filtered = menu.dishes.filter(dish => dish.id !== req.params.dish_id);
//           menu.dishes = filtered;
//         }
//       menu.save(function(errSave, updatedOrder) {
//         if (errSave) {
//           res.status(422).json({ message: 'can not save order' });
//         } else {
//         } res.status(200).json(updatedOrder);
//       });
//     }
//   });
//   });
    
  
//   // DELETE MENU BEVERAGE BY ID
//   // STAFF ONLY++
//   // WORKING**

//   router.delete("/:id/beverages/:beverage_id", verifyAdminUser, (req, res) => {
//     Menu.findById(req.params.id, function(errMenu, menu) {
//       if (errMenu) {
//         res.status(404).json({ message: "can not find menu" });
//       } else {
//         let found = menu.beverages.find(
//           beverage => beverage.id === req.params.beverage_id);
  
//         if (found === false) {
//           // if no beverage found
//           res.status(422).json({ message: "beverage not found" });
//         } else {
//           // if bev is found then I filter , if its not the bev id im trying to delete, put in new arr
//           const filtered = menu.beverages.filter(beverage => beverage.id !== req.params.beverage_id);
//           menu.beverages = filtered;
//         }
//       menu.save(function(errSave, updatedOrder) { // save the new menu with non req bev items
//         if (errSave) {
//           res.status(422).json({ message: 'can not update order' }); 
//         } else {
//           res.status(200).json(updatedOrder); 
//         }
//       });
//     }
//   });
//   });
  
//   // POST MENU
//   // STAFF ONLY++
//   // WORKS!!**
  
//   router.post("/", verifyAdminUser, (req, res) => {
//     const requiredFields = ["name"];
//     for (let i = 0; i < requiredFields.length; i++) {
//       const field = requiredFields[i];
//       if (!(field in req.body)) {
//         const message = `Missing \`${field}\` in request body`;
//         console.error(message);
//         return res.status(400).send(message);
//       }
//     }
  
//     Menu.create({
//       name: req.body.name
//     })
//       .then(menu => res.status(201).json(menu.serialize()))
//       .catch(err => {
//         console.error(err);
//         res.status(500).json({ error: "Something went wrong" });
//       });
//   });

// module.exports = router;
