"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose'); 
const faker = require('faker');

const expect = chai.expect;

const { TEST_DATABASE_URL } = require('../config');
const { app, runServer, closeServer, createAuthToken } = require('../server');
const { Order, Menu, User, Dish, Beverage } = require('../models');

chai.use(chaiHttp);

function generateUser() {
	return {
		name: faker.name.findName(),
		email: faker.internet.email(),
		password: faker.internet.password()
	}
}

function seedDishData() {
	console.log('seeding dish data');
	const seedData = [];

	for (let i = 0; i <= 10; i++) {
		seedData.push(generateDishData());
	}
	return Dish.insertMany(seedData);
}

function generateDishData() {
	return {
		name: faker.commerce.productName(),
		description: faker.commerce.productMaterial(),
		price: faker.commerce.price()
	}
}

// function generateDishName() {
// 	const dishNames = ['Hamburger', 'Fish Tacos', 'Pizza'];
// 	return dishNames[Math.floor(Math.random() * dishNames.length)]
// }

// function generateDishDescript() {
// 	const dishDescripts = ['Served with side salad', 'Served with plantains', 'Served with house empanadas'];
// 	return dishDescripts[Math.floor(Math.random() * dishDescripts.length)]
// }

// function generatePrice() {
// 	const prices = ['18.00', '24.00', '17.00', '9.00'];
// 	return prices[Math.floor(Math.random() * dishDescripts.length)]
// }


	// GENERATE FAKE ORDER
// function generateOrderData() {
// 	console.log('hello generate order data')
// 	console.log(Promise);
// 	return User.create({
// 		name: faker.name.findName(),
// 		email: faker.internet.email(),
// 		password: faker.internet.password()
// 	}).then(user => {
// 		console.log('hello order number 2')
// 		return Dish.create(generateDishData()).then(dish => {
// 			return Beverage.create(generateBeverageData()).then(beverage => {
// 				console.log('hello order number 3')
// 				return {
// 					guests: `${user._id}`, 
// 					deliveryDate: faker.date.recent(),
// 					location: faker.lorem.word(),
// 					notes: faker.lorem.words(),
// 					dishes: [dish],
// 					beverages: [beverage]
// 			 }
// 			})
// 		})
// 	}).catch(error => {
// 		console.log(error, 'error here')
// 	});
// }

// function generateOrderDataWithPersistence() {

//   return User.create({
//     name: faker.name.findName(),
//     email: faker.internet.email(),
//     password: faker.internet.password()
//   }).then(user => {
//     return Dish.create(generateDishData()).then(dish => {
//       return Beverage.create(generateBeverageData()).then(beverage => {
//         return Order.create({
//           guests: [user], 
//           deliveryDate: faker.date.recent(),
//           location: faker.lorem.word(),
//           notes: faker.lorem.words(),
//           dishes: [dish],
//           beverages: [beverage]
//        })
//       })
//     })
//   });  
// }
// function generateMenuData() {
//   return {
//     name: faker.lorem.word(),
//     dishes: [generateDishData()],
//     beverages: [generateBeverageData()]
//   }
// }


function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Order Inn API', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closeServer();
	});

	describe('/POST Register', function() {
		it('should Register a guest user', function(done){
			chai.request(app)
				.post('/guests')
				.send(generateUser())
				.then(function(err, res) {
					res.should.have.status(201);
					chai.request(app)
				})
			done();
		})
	})

	describe('/POST Login', function() {
		it('should login a guest user', function(done) {
			chai.request(app)
				.post('/login')
				.send(generateUser())
				.then(function(err, res) {
					console.log(res, 'this is the response in post login');
					res.should.have.status(200);
					chai.request(app)
				})
			done();
		})
	})

	describe('test endpoints', function() {
		beforeEach(function() {
			console.log('dishes seeding')
			return seedDishData();
		});

		afterEach(function() {
			return tearDownDb();
		});

		it('GET/ should return all existing dishes', function(done) {
			let res;
			chai.request(app)
				.get('/dishes')
				// this is undefined
				.set('Authorization', `Bearer ${authToken}`)
				.then(function(_res) {
					res = _res; 
					res.should.have.status(200);
					res.body.should.have.length.of.at.least(1);
					return dishes.count();
				})
				.then(function(count) {
					res.body.should.have.length.of(count);
				});
			done();
		});
	});
})

// describe('test endpoints', function() {
// 	beforeEach(function() {
// 		return seedDishData
// 	})
// })

	// beforeEach(function(){
	// 	// return seedOrderData();
	// });

	// beforeEach(function(){
	//   return seedMenuData();
	// })

	// afterEach(function() {
	//   return tearDownDb();
	// })

	// describe('GET dishes'), function() {
	// 	it('should return all existing orders on GET', () => {
	// 		let res;
	// 		let user = User.create({
	// 			name: faker.name.findName(),
	// 			email: faker.internet.email(),
	// 			password: faker.internet.password()
	// 		}).then(user => {
	// 			const token = createAuthToken(user.serialize());
	// 			return chai.request(app)
	// 				.get('/dishes') // endpoint for GET dishes
	// 				.set ('Authorization', 'Bearer' + token)
	// 				.then(function(_res) {
	// 					res = _res;
	// 					expect(res.body.dishes).to.have.lengthOf.at.least(1);
	// 					expect(res).to.have.status(200);
	// 					done();
	// 				});
	// 			});
	// 	});

	// }

// 	describe('GET orders', function() {

// 		it('should return all existing orders on GET', (done) => {
// 			let res;
// 			let user = User.create({
// 				name: faker.name.findName(),
// 				email: faker.internet.email(),
// 				password: faker.internet.password()
// 			}).then(user => {
// 				const token = createAuthToken(user.serialize());
// 				return chai.request(app)
// 					.get('/orders') // endpoint for GET ORDERS
// 					.set ('Authorization', 'Bearer ' + token)
// 					.then(function(_res) {
// 						res = _res;
// 						expect(res.body.orders).to.have.lengthOf.at.least(1);
// 						expect(res).to.have.status(200);
// 						done();
// 					});
// 				});
// 		});
// 		// // RIGHT FIELDS TEST 
// 		it('should return orders with right fields', function() {
// 			let resOrder;
// 			let user = User.create({
// 				name: faker.name.findName(),
// 				email: faker.internet.email(),
// 				password: faker.internet.password()
// 			}).then(user => {
// 			const token = createAuthToken(user.serialize());
// 			return chai.request(app)
// 				.get('/orders')
// 				.set ('Authorization', 'Bearer ' + token)
// 				.then(function(res) {
// 					expect(res).to.have.status(200);
// 					expect(res).to.be.json;
// 					expect(res.body.orders).to.be.a('array');
// 					expect(res.body.orders).to.have.lengthOf.at.least(1);

// 				res.body.orders.forEach(function(order) {
// 					expect(order).to.be.a('object');
// 					expect(order).to.include.keys(
// 					'_id', 'deliveryDate', 'location', 'notes', 'beverages', 'dishes');
// 				});
// 				resOrder = res.body.orders[0]; // one single order 
// 				return Order.findById(resOrder._id); //return's first order's ID
// 		})
// 			.then(function(order) {
// 				// console.log(order.beverages, 'order bevs');
// 				// console.log(resOrder.beverages, 'response bevs');
// 				expect(resOrder._id).to.equal(order.id); // comparing order in database to the response order requested
// 				expect(new Date(resOrder.deliveryDate)).to.own.include(order.deliveryDate); // own include, non-primitives with same information
// 				expect(resOrder.location).to.equal(order.location);
// 				expect(resOrder.notes).to.equal(order.notes);
// 				expect(resOrder.beverages).to.have.deep.members(order.beverages);
// 				expect(resOrder.dishes).to.have.deep.members(order.dishes);
// 			});
// 		});
// 	});
// });

		// POST NEW ORDER 

// 	describe('POST endpoint', function() {      
// 			it('should add a new order', function() {
// 				return generateOrderData().then(order => {
// 				const guestId = order.guests;
// 				User.findById(guestId,function(err, guest) {
// 					const token = createAuthToken(guest.serialize());
// 				return chai.request(app)
// 					.post('/orders')
// 					.set ('Authorization', 'Bearer ' + token)
// 					.send(order)
// 					.then(function(res) {
// 						expect(res).to.have.status(201);
// 						expect(res).to.be.json;
// 						expect(res.body).to.be.a('object');
// 						expect(res.body).to.include.keys(
// 							'guests', 'deliveryDate', 'location', 'notes');
// 						expect(res.body.guests).to.equal(newOrder.guests);
// 						expect(res.body.id).to.not.be.null;
// 						expect(res.body.deliveryDate).to.equal(newOrder.deliveryDate);
// 						expect(res.body.location).to.equal(newOrder.location);
// 						expect(res.body.notes).to.equal(newOrder.notes);
	
// 						return Order.findById(res.body.id);
// 					})
// 					.then(function(order) { // compare new order we wanted to create to order in db that was saved
// 						expect(order.guests).to.equal(newOrder.guests);
// 						expect(order.deliveryDate).to.equal(newOrder.deliveryDate);
// 						expect(order.location).to.equal(newOrder.location);
// 						expect(order.notes).to.equal(newOrder.notes);
// 					});
// 				})
// 			});
// 		});
// 	});
// });

// 	describe('PUT endpoint', function() {
		
// 		it('should update fields you send over', (done) => {
// 			console.log(done);
// 			return generateOrderData().then(order => {
// 				const guestId = order.guests;
// 				console.log(order.guests, 'this is order guests');
// 				return User.findById(guestId,function(err, guest) {
// 					const token = createAuthToken(guest.serialize());

// 					const updateData = {
// 						deliveryDate: faker.date.recent(),
// 						location: faker.lorem.words(),
// 						notes: faker.lorem.words()
// 					};
// 					console.log('hello');
// 					done();
				

// 				// return Order.findOne().then(function(order) {
// 				//   updateData.id = order.id; // set update data id to order id found 
// 				//   return chai.request(app)
// 				//     .put(`/orders/${order.id}`)
// 				//     .set ('Authorization', 'Bearer ' + token)
// 				//     .send(updateData);
// 				// })
// 				// .then(function(res) {
// 				//   expect(res).to.have.status(204);
// 				//   return Order.findById(updateData.id);
// 				// })
// 				// .then(function(order) {
// 				//   expect(order.location).to.equal(updateData.location);
// 				//   expect(order.notes).to.equal(updateData.notes);
// 				//   expect(order.deliveryDate).to.equal(updateData.deliveryDate);
// 				//   done();
// 				// });
// 			});
// 		}).catch(err => {
// 			console.log('error happened');
	
// 		});
// 	});
// });

// how to get it to read the endpoint? 

	// describe('DELETE endpoint', function() {
			
	// 		it('delete a order by id', function() {

	// 			return generateOrderData().then(order => {
	// 				const guestId = order.guests;
	// 				User.findById(guestId,function(err, guest) {
	// 				const token = createAuthToken(guest.serialize());
	
	// 			let order;

	// 			// let user = User.create({
	// 			//   name: faker.name.findName(),
	// 			//   email: faker.internet.email(),
	// 			//   password: faker.internet.password()
	// 			// }).then(user => {
	// 			// const token = createAuthToken(user.serialize()); 
	
	// 			return Order.findOne()
	// 				.then(function(foundOrder) {
	// 					order = foundOrder;
	// 					return chai.request(app).delete(`/orders/${order.id}`)
	// 					.set('Authorization', 'Bearer ' + token);
	// 				})
	// 				.then(function(res) {
	// 					expect(res).to.have.status(204);
	// 					return Order.findById(order.id);
	// 				})
	// 				.then(function(foundOrder) {
	// 					expect(foundOrder).to.be.null;
	// 				});
	// 			});
	// 		});
	// 	});
	// });


	// describe('DELETE beverage order endpoint', function() {
		
	//   it('delete a beverage order by id', function() {

	//     let beverage;

	//     let user = User.create({
	//       name: faker.name.findName(),
	//       email: faker.internet.email(),
	//       password: faker.internet.password()
	//     }).then(user => {
	//     const token = createAuthToken(user.serialize()); 

	//     return Order.findOne()
	//       .then(function(order) {
	//         console.log(order, 'this is the order');
	//         beverage = order.beverages;
	//         return chai.request(app).delete(`/orders/${order.id}/beverages/${beverage.id}`)
	//         .set ('Authorization', 'Bearer ' + token);
	//       })
	//       .then(function(res) {
	//         expect(res).to.have.status(204);
	//         return Beverage.findById(beverage.id);
	//       })
	//       .then(function(_beverage) {
	//         expect(_beverage).to.be.null;
	//       });
	//     });
	//   });
	// });

//   describe('DELETE dish order endpoint', function() {
		
//   it('delete a dish order by id', function() {

//     let dish;

//     let user = User.create({
//       name: faker.name.findName(),
//       email: faker.internet.email(),
//       password: faker.internet.password()
//     }).then(user => {
//     const token = createAuthToken(user.serialize()); 

//     return Dish.findOne()
//       .then(function(_dish) {
//         dish = _dish;
//         return chai.request(app).delete(`/orders/${dish.id}`)
//         .set ('Authorization', 'Bearer ' + token);
//       })
//       .then(function(res) {
//         expect(res).to.have.status(204);
//         return Dish.findById(dish.id);
//       })
//       .then(function(_dish) {
//         expect(_dish).to.be.null;
//       });
//   });
// });
// });