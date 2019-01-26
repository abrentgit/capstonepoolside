'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { Order, Menu, Beverage, Dish, User } = require('./models');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

app.use(morgan('common'));
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.get('/', (req, res) => {
	if (!req) {
		res.status(404).message('Content not found');
	} else {
		res.status(200).sendFile(__dirname + '/public/index.html');
	};
});

app.get('/login', (req, res) => {
	if (!req) {
		res.status(404).message('Content not found');
	} else {
		res.status(200).render('/login');
	};
});

app.get('/orderinn/about', (req, res) => {
	if (!req) {
		res.status(404).message('Content not found');
	} else {
		res.status(200).sendFile(__dirname + '/views/about.html');
	};
});

app.get('/orderinn/neworder', (req, res) => {
	if (!req) {
		res.status(404).message('Content not found');
	} else {
		res.status(200).sendFile(__dirname + '/views/make-order.html');
	};
});

app.get('/orderinn/login', (req, res) => {
	if (!req) {
		res.status(404).message('Content not found');
	} else {
		res.status(200).sendFile(__dirname + '/views/login.html');
	};
});

app.get('/orderinn/register', (req, res) => {
	if (!req) {
		res.status(404).message('Content not found');
	} else {
		res.status(200).sendFile(__dirname + '/views/register.html');
	};
});

const createAuthToken = function (user) {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.email,
		audience: user.role,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

// VERIFY GUEST USER MIDDLEWARE

const verifyUser = function (req, res, next) {
	if (!req.headers.authorization) {
		res.status(401).json({
			message: 'Invalid credentials'
		});
		return;
	}

	const tokenSplit = req.headers.authorization.split(' ');
	const token = tokenSplit[1];

	if (token) {
		jwt.verify(token, config.JWT_SECRET, function (error, decoded) {
			if (!error) {
				req.decoded = decoded;

				if (req.decoded.aud === 'Guest') {
					next();
				} else {
					res.status(401).json({
						message: 'Invalid credentials'
					});
				}
			} else {
				res.status(401).json({
					message: 'Invalid credentials'
				});
			};
		});
	};
};

// VERIFY ADMIN USER MIDDLEWARE

const verifyAdminUser = function (req, res, next) {
	if (!req.headers.authorization) {
		res.status(401).json({
			message: 'Invalid credentials'
		});
		return;
	}

	const tokenSplit = req.headers.authorization.split(' ');
	const token = tokenSplit[1];

	if (token) {
		jwt.verify(token, config.JWT_SECRET, function (error, decoded) {
			if (!error) {
				req.decoded = decoded;
				if (req.decoded.aud === 'admin') {
					next();
					console.log(req.decoded);
				}
			} else {
				res.status(401).json({
					message: 'Invalid credentials'
				});
			}
		});
	}
}

app.post('/admin', (req, res) => {
	const requiredFields = ['name', 'email', 'password'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	let hashed = bcrypt.hashSync(req.body.password, saltRounds);

	User.create({
			name: req.body.name,
			email: req.body.email,
			role: 'admin',
			password: hashed
		})
		.then(user => {
			const authToken = createAuthToken(user.serialize());
			res.status(201).json({
				authToken
			});
		}).catch(err => {
			console.log(err);
			res.status(422).json({
				message: 'Something went wrong'
			});
		});
});

app.post('/guests', (req, res) => {
	const requiredFields = ['name', 'password', 'email'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	let hashed = bcrypt.hashSync(req.body.password, saltRounds);

	User.create({
			name: req.body.name,
			email: req.body.email,
			password: hashed
		})
		.then(guest => {
			const authToken = createAuthToken(guest.serialize());
			res.status(201).json({
				authToken
			});
		})
		.catch(err => {
			console.log(err);
			res.status(422).json({
				message: 'Something went wrong'
			});
		});
});

app.post('/login', (req, res) => {
	User.findOne({
		email: req.body.email
	}, function (err, user) {
		console.log('error', err);
		console.log('user', user);
		console.log(req.body.email);
		if (err) {
			res.status(401).json({
				error: 'Invalid credentials'
			});
		}

		if (!user) {
			res.status(404).json({
				error: 'Invalid credentials'
			});
		} else {
			let validPassword = bcrypt.compareSync(req.body.password, user.password);

			if (!validPassword) {
				res.status(401).json({
					error: 'Invalid credentials'
				});
			} else {
				const authToken = createAuthToken(user.serialize());
				res.status(200).json({
					authToken,
					user_id: user._id
				});
			};
		};
	});
});

app.post('/login/admin', (req, res) => {
	User.findOne({
		email: req.body.email
	}, function (err, user) {
		if (err) { //if error finding email
			res.status(401).json({
				error: 'Invalid credentials'
			});
		}

		if (!user) { // if no guest found
			res.status(404).json({
				error: 'Invalid credentials'
			});
		} else {
			let validPassword = bcrypt.compareSync(req.body.password, user.password);

			if (!validPassword) { //if pass doesn't match
				res.status(401).json({
					error: 'Invalid credentials'
				});
			} else {
				const authToken = createAuthToken(user.serialize());
				res.status(201).json({
					authToken,
					user_id: user._id
				});
			};
		};
	});
});

app.get('/orders', verifyAdminUser, (req, res) => {
	const perPage = 3;
	const currentPage = req.query.page || 1;

	Order.find()
		.skip(perPage * currentPage - perPage)
		.limit(perPage) // limit it to per page number, then take orders
		.then(orders => {
			res.json({
				orders: orders.map(order => order.serialize())
			});
		})
		.catch(err => {
			res.status(500).json({
				message: 'Internal server error'
			});
		});
});

app.get('/orders/:id', verifyUser, (req, res) => {
	Order.findById(req.params.id)
		.then(order => res.json(order.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'Something went horribly wrong'
			});
		});
});

app.get('/dishes/:id', verifyUser, (req, res) => {
	Dish.findById(req.params.id)
		.then(dish => res.json(dish.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'Something went horribly wrong'
			});
		});
});

app.get('/beverages/:id', verifyUser, (req, res) => {
	Beverage.findById(req.params.id)
		.then(beverage => res.json(beverage.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'Something went horribly wrong'
			});
		});
});

app.get('/orders/:id/beverages', verifyUser, (req, res) => {
	Order.findById(req.params.id, function (errOrder, order) {
		if (errOrder) {
			res.status(404).json({
				message: 'Can not find order'
			});
		} else {
			res.json({
				beverages: order.beverages.map(beverage => beverage.serialize())
			});
		};
	});
});

app.get('/orders/:id/dishes', verifyUser, (req, res) => {
	Order.findById(req.params.id, function (errOrder, order) {
		if (errOrder) {
			res.status(404).json({
				message: 'Can not find order'
			});
		} else {
			res.json({
				dishes: order.dishes.map(dish => dish.serialize())
			});
		}
	});
});

app.get('/orders/:id/dishes/:dish_id', verifyUser, (req, res) => {
	Order.findById(req.params.id, function (errOrder, order) {
		if (errOrder) {
			res.status(404).json({
				message: 'can not find order'
			});
		} else {
			let found = order.dishes.find(dish => dish.id === req.params.dish_id);

			if (found === false) {
				res.status(404).json({
					message: 'Can not find dish'
				});
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

app.get('/orders/:id/beverages/:beverage_id', verifyUser, (req, res) => {
	Order.findById(req.params.id, function (errOrder, order) {
		if (errOrder) {
			res.status(404).json({
				message: 'Can not find order'
			});
		} else {
			let found = order.beverages.find(
				beverage => beverage.id === req.params.beverage_id
			);

			if (found === false) {
				res.status(404).json({
					message: 'Can not find dish'
				});
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

app.post('/orders', verifyUser, (req, res) => {
	const requiredFields = ['guests', 'dishes', 'deliveryDate', 'location', 'notes'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	const firstGuestId = req.body.guests.split(',')[0]; 

	let dishIds = req.body.dishes; 

	User.findById(firstGuestId, (err, guest) => {
		if (err) {
			res.status(422).send({
				message: 'Can not find user'
			});
		} else {
			Dish.find({
				'_id': {
					$in: dishIds
				}
			}, function (err, dishData) {
				if (err) {
					console.log(dishData, 'failing dishes');
					res.status(422).send({
						message: 'Can not find dishes'
					});
				} else {

					Order.create({
							guests: [guest._id],
							dishes: dishData,
							deliveryDate: req.body.deliveryDate,
							location: req.body.location,
							notes: req.body.notes,
						})

						.then(order => res.status(201).json(order.serialize()))
						.catch(err => {
							console.error(err);
							res.status(500).json({
								error: 'Something went wrong'
							});
						});
				};
			});
		};
	});
});

app.put('/orders/:id', verifyUser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	};

	const updated = {};
	const updateableFields = ['deliveryDate', 'location', 'notes'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});

	Order.findByIdAndUpdate(req.params.id, updated)
		.then(updatedOrder => res.status(204).end())
		.catch(err => res.status(500).json({
			message: 'Something went wrong'
		}));
});

app.delete('/orders/:id', verifyUser, (req, res) => {
	Order.findByIdAndRemove(req.params.id)
		.then(order => res.status(200).send())
		.catch(err => res.status(500).json({
			message: 'Internal server error'
		}));
});

app.delete('/orders/:id/dishes/:dish_id', verifyUser, (req, res) => {
	Order.findById(req.params.id, function (errOrder, order) {
		if (errOrder) {
			res.status(404).json({
				message: 'Can not find order'
			});
		} else {
			let found = order.dishes.find(dish => dish.id === req.params.dish_id);

			if (found === false) {
				res.status(422).json({
					message: 'Can not find dish'
				});
			} else {
				const filtered = order.dishes.filter(
					dish => dish.id !== req.params.dish_id
				);
				order.dishes = filtered;
			}
			order.save(function (errSave, updatedOrder) {
				if (errSave) {
					res.status(422).json({
						message: 'Can not save order'
					}); //
				} else {
					res.status(200).json(updatedOrder);
				}
			});
		}
	});
});

app.delete('/orders/:id/beverages/:beverage_id', verifyUser, (req, res) => {
	Order.findById(req.params.id, function (errOrder, order) {
		if (errOrder) {
			res.status(404).json({
				message: 'Can not find order'
			});
		} else {
			let found = order.beverages.find(
				beverage => beverage.id === req.params.beverage_id
			);

			if (found === false) {
				res.status(422).json({
					message: 'Can not find beverage'
				});
			} else {
				const filtered = order.beverages.filter(
					beverage => beverage.id !== req.params.beverage_id
				);
				order.beverages = filtered; //filters the beverages that are not the id
			}

			order.save(function (errSave, updatedOrder) {
				// related to order save
				if (errSave) {
					res.status(422).json({
						message: 'Could not save order'
					});
				} else {
					res.status(200).json(updatedOrder); // new order is saved and updated
				}
			});
		}
	});
});

app.put('/orders/:id/beverages/:beverage_id', verifyUser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	if (!(req.params.beverage_id && req.body.beverage_id && req.params.beverage_id === req.body.beverage_id)) {
		res.status(400).json({
			error: 'Request path beverage id and request beverage body id values must match'
		});
	}

	Order.findById(req.params.id, function (errOrder, order) {
		if (!errOrder) {
			Beverage.findById(req.params.beverage_id, function (errBeverage, beverage) {
				if (!errBeverage) {
					order.beverages.push(beverage);
					order.save(function (errSave, updatedOrder) {
						if (errSave) {
							res.status(422).json({
								message: 'Could not add beverage'
							});
						} else {
							res.status(200).json(updatedOrder);
						}
					});
				} else {
					res.status(404).json({
						message: 'Could not find beverage'
					});
				}
			});
		} else {
			res.status(404).json({
				message: 'Could not find order'
			});
		}
	});
});

app.put('/orders/:id/dishes/:dish_id', verifyUser, (req, res) => {
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

	Order.findById(req.params.id, function (errOrder, order) {
		if (!errOrder) {
			Dish.findById(req.params.dish_id, function (errDish, dish) {
				if (!errDish) {
					order.dishes.push(dish);
					order.save(function (errSave, updatedOrder) {
						if (errSave) {
							res.status(422).json({
								message: 'Could not add dish'
							});
						} else {
							res.status(200).json(updatedOrder);
						}
					});
				} else {
					res.status(404).json({
						message: 'Could not find dish'
					});
				}
			});
		} else {
			res.status(404).json({
				message: 'Could not find order'
			});
		}
	});
});

app.get('/dishes', verifyUser, (req, res) => {
	const perPage = 10;
	const currentPage = req.query.page || 1;

	Dish.find()
		.skip(perPage * currentPage - perPage)
		.limit(perPage)
		.then(dishes => {
			res.json({
				dishes: dishes.map(dish => dish.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				message: 'Internal server error'
			});
		});
});

app.get('/beverages', verifyUser, (req, res) => {
	const perPage = 5;
	const currentPage = req.query.page || 1;

	Beverage.find()
		.skip(perPage * currentPage - perPage)
		.limit(perPage)
		.then(beverages => {
			res.json({
				beverages: beverages.map(beverage => beverage.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				message: 'Internal server error'
			});
		});
});

app.get('/menus', verifyUser, (req, res) => {
	const perPage = 2;
	const currentPage = req.query.page || 1;

	Menu.find()
		.skip(perPage * currentPage - perPage)
		.limit(perPage)
		.then(menus => {
			res.json({
				menus: menus.map(menu => menu.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				message: 'Internal server error'
			});
		});
});

app.get('/menus/menu_id/:id', verifyUser, (req, res) => {
	Menu.findById(req.params.id)
		.then(menu => res.json(menu.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'Something went horribly awry'
			});
		});
});

app.get('/menus/:id/dishes', verifyUser, (req, res) => {
	Menu.findById(req.params.id, function (errMenu, menu) {
		if (!errMenu) {
			const perPage = 2;
			const currentPage = req.query.page || 1;
			const skip = perPage * currentPage - perPage;

			const dishes = menu.dishes.slice(skip, skip + perPage);

			res.json({
				dishes: dishes.map(dish => dish.serialize())
			});
		} else {
			res.status(404).json({
				message: 'Can not find menu'
			});
		}
	});
});

app.get('/menus/:id/beverages', verifyUser, (req, res) => {
	Menu.findById(req.params.id, function (errMenu, menu) {
		if (!errMenu) {
			const perPage = 2;
			const currentPage = req.query.page || 1;
			const skip = perPage * currentPage - perPage;

			const beverages = menu.beverages.slice(skip, skip + perPage);

			res.json({
				beverages: beverages.map(beverage => beverage.serialize())
			});
		} else {
			res.json(404).json({
				message: 'Can not find menu'
			});
		}
	});
});

app.get('/menus/:id/dishes/:dish_id', verifyUser, (req, res) => {
	Menu.findById(req.params.id, function (errMenu, menu) {
		if (errMenu) {
			res.status(404).json({
				message: 'Can not find menu'
			}); 
		} else {
			let found = menu.dishes.find(dish => dish.id === req.params.dish_id);

			if (found === false) {
				res.status(404).json({
					message: 'Can not find dish'
				});
			} else {
				const filtered = menu.dishes.filter(
					dish => dish.id === req.params.dish_id
				); 
				menu.dishes = filtered;
				res.status(200).json(filtered); 
			}
		}
	});
});

app.get('/menus/:id/beverages/:beverage_id', verifyUser, (req, res) => {
	Menu.findById(req.params.id, function (errMenu, menu) {
		if (errMenu) {
			res.status(404).json({
				message: 'Can not find menu'
			}); 
		} else {
			let found = menu.beverages.find(
				beverage => beverage.id === req.params.beverage_id
			);

			if (found === false) {
				res.status(404).json({
					message: 'Can not find beverage'
				});
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

app.put('/menus/:id', verifyAdminUser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	const updated = {};
	const updateableFields = ['name'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});

	Menu.findByIdAndUpdate(req.params.id, updated)
		.then(updatedMenu => res.status(204).end())
		.catch(err => res.status(500).json({
			message: 'Something went wrong'
		}));
});

app.put('/menus/:id/dishes/:dish_id', verifyAdminUser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	if (!(req.params.dish_id && req.body.dish_id && req.params.dish_id === req.body.dish_id)) {
		res.status(400).json({
			error: 'Request dish path id and request body dish id values must match'
		});
	}

	Menu.findById(req.params.id, function (errMenu, menu) {
		if (!errMenu) {
			Dish.findById(req.params.dish_id, function (errDish, dish) {
				if (!errDish) {
					menu.dishes.push(dish);
					menu.save(function (errSave, updatedMenu) {
						if (errSave) {
							res.status(422).json({
								message: 'Could not add dish'
							});
						} else {
							res.status(200).json(updatedMenu);
						}
					});
				} else {
					res.status(404).json({
						message: 'Could not find dish'
					});
				}
			});
		} else {
			res.status(404).json({
				message: 'Could not find menu'
			});
		}
	});
});

app.put('/menus/:id/beverages/:beverage_id', verifyAdminUser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	if (!(req.params.beverage_id && req.body.beverage_id && req.params.beverage_id === req.body.beverage_id)) {
		res.status(400).json({
			error: 'Request path beverage id and request body beverage id values must match'
		});
	}

	Menu.findById(req.params.id, function (errMenu, menu) {
		if (!errMenu) {
			Beverage.findById(req.params.beverage_id, function (errBeverage, beverage) {
				if (!errBeverage) {
					menu.beverages.push(beverage);
					menu.save(function (errSave, updatedMenu) {
						if (errSave) {
							res.status(422).json({
								message: 'Could not add beverage'
							});
						} else {
							res.status(200).json(updatedMenu);
						}
					});
				} else {
					res.status(404).json({
						message: 'Could not find beverage'
					});
				}
			});
		} else {
			res.status(404).json({
				message: 'Could not find menu'
			});
		}
	});
});

app.delete('/menus/:id', verifyAdminUser, (req, res) => {
	Menu.findByIdAndRemove(req.params.id)
		.then(menu => res.status(204).end())
		.catch(err => res.status(500).json({
			message: 'Internal server error'
		}));
});

app.delete('/menus/:id/dishes/:dish_id', verifyAdminUser, (req, res) => {
	Menu.findById(req.params.id, function (errMenu, menu) {
		if (errMenu) {
			res.status(404).json({
				message: 'Can not find menu'
			});
		} else {
			let found = menu.dishes.find(dish => dish.id === req.params.dish_id);

			if (found === false) {
				res.status(422).json({
					message: 'Can not find dish'
				});
			} else {
				const filtered = menu.dishes.filter(dish => dish.id !== req.params.dish_id);
				menu.dishes = filtered;
			}
			menu.save(function (errSave, updatedOrder) {
				if (errSave) {
					res.status(422).json({
						message: 'Can not save order'
					});
				} else {}
				res.status(200).json(updatedOrder);
			});
		}
	});
});

app.delete('/menus/:id/beverages/:beverage_id', verifyAdminUser, (req, res) => {
	Menu.findById(req.params.id, function (errMenu, menu) {
		if (errMenu) {
			res.status(404).json({
				message: 'can not find menu'
			});
		} else {
			let found = menu.beverages.find(
				beverage => beverage.id === req.params.beverage_id);

			if (found === false) {
				res.status(422).json({
					message: 'Beverage not found'
				});
			} else {
				const filtered = menu.beverages.filter(beverage => beverage.id !== req.params.beverage_id);
				menu.beverages = filtered;
			}
			menu.save(function (errSave, updatedOrder) { // save the new menu with non req bev items
				if (errSave) {
					res.status(422).json({
						message: 'Can not update order'
					});
				} else {
					res.status(200).json(updatedOrder);
				}
			});
		}
	});
});

app.post('/menus', verifyAdminUser, (req, res) => {
	const requiredFields = ['name'];
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
			res.status(500).json({
				error: 'Something went wrong'
			});
		});
});

app.post('/beverages', verifyAdminUser, (req, res) => {
	const requiredFields = ['name', 'description', 'price'];
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
			res.status(500).json({
				error: 'Something went wrong'
			});
		});
});

app.post('/dishes', verifyAdminUser, (req, res) => {
	const requiredFields = ['name', 'description', 'price'];
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
			res.status(500).json({
				error: 'Something went wrong'
			});
		});
});

app.use('*', function (req, res) {
	res.status(404).json({
		message: 'Not Found'
	});
});

let server;

function runServer(database_url, port = PORT) {
	console.log('server is running on', database_url);
	return new Promise((resolve, reject) => {
		mongoose.connect(database_url, {
			useNewUrlParser: true
		}, err => {
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

module.exports = { runServer, app, closeServer, createAuthToken, verifyUser };