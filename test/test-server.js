"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose'); 
const faker = require('faker');
const expect = require('chai').expect;

const { TEST_DATABASE_URL } = require('../config');
const { app, runServer, closeServer } = require('../server');
const { Order, Menu, User, Dish, Beverage } = require('../models');

chai.use(chaiHttp);

let userId, newToken, orderId;

let newUser = new User({
	name: 'fake',
	email: 'fake@test.com',
	password: 'password'
})

function generateDishData() {
	return {
		name: faker.commerce.product(),
		description: faker.commerce.productAdjective(),
		price: faker.commerce.price()
	}
}

function seedDishData() {
	console.log('seeding dish data');
	const seedData = [];

	for (let i = 0; i <= 1; i++) {
		seedData.push(generateDishData());
	}
	return Dish.insertMany(seedData);
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Order Inn API', () => {

	before(function () {
		runServer(TEST_DATABASE_URL);
	});

	before(function () {
		seedDishData();
	});

	before(function (done) {

		chai.request(app)
			.post('/guests')
			.send(newUser)
			.end(function (err, res) {
				newToken = res.body.authToken;
				done();
			});
	});

	after(function () {
		return tearDownDb();
	});

	after(function () {
		return closeServer();
	});

	it('should login', function (done) {
		chai.request(app)
			.post('/login')
			.send({
				email: newUser.email,
				password: newUser.password
			})
			.end(function (err, res) {
				userId = res.body.user_id;
				expect(res).to.have.status(200);
				done();
			});
	});

	let dishIds = '';

	it('should /GET dishes', function (done) {

		chai.request(app)
			.get('/dishes')
			.set('Authorization', 'Bearer ' + newToken)
			.end(function (err, res) {				
				
				res.body.dishes.forEach(dish => {
					dishIds = dish._id;
				})

				expect(res).to.have.status(200);
				expect(res).to.be.json;
				done();
			});
	});

	it('should /POST orders', function (done) {

		let newOrder = {
			guests: userId,
			dishes: dishIds,
			deliveryDate: Date.now(),
			location: 'Rooftop',
			time: '11:00am'
		}

		chai.request(app)
			.post('/orders')
			.send(newOrder)
			.set('Authorization', 'Bearer ' + newToken)
			.end(function (err, res) {
				expect(res).to.have.status(201);
				orderId = res.body._id;
				done();
			});
	});

	it('should /DELETE order', function (done) {

		chai.request(app)
			.delete('/orders/' + orderId)
			.set('Authorization', 'Bearer ' + newToken)
			.end(function (err, res) {
				expect(res).to.have.status(204);
				done();
			})
	});

});

describe('index page', function () {
	it('should exist', function () {
		return chai.request(app)
			.get('/')
			.then(function (res) {
				expect(res).to.have.status(200);
			});
	});
});
